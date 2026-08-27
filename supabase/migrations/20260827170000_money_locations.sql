-- Money locations, transfers between them, and dashboard settings.
--
-- Conventions follow the existing schema: user_id references public."user"(id)
-- (not auth.users), currency_id is bigint, and every new table needs explicit
-- grants because default privileges in public are revoked for postgres.

-- ---------------------------------------------------------------------------
-- money_location
-- ---------------------------------------------------------------------------

create table "public"."money_location" (
  "id" uuid not null default gen_random_uuid(),
  "created_at" timestamp with time zone not null default now(),
  "user_id" uuid not null,
  "name" text not null,
  "currency_id" bigint not null,
  "icon" text not null default '💳'::text,
  "color" text not null default '#3b82f6'::text,
  "is_default" boolean not null default false,
  "archived" boolean not null default false,
  "sort_order" integer not null default 0,
  constraint "money_location_pkey" primary key (id)
);

alter table "public"."money_location" enable row level security;

alter table "public"."money_location"
  add constraint "money_location_user_id_fkey" foreign key (user_id)
  references public."user"(id) on update cascade on delete cascade;

alter table "public"."money_location"
  add constraint "money_location_currency_id_fkey" foreign key (currency_id)
  references public.currency(id) on update cascade on delete restrict;

create index idx_money_location_user on public.money_location using btree (user_id);

-- At most one default location per user.
create unique index money_location_one_default_per_user
  on public.money_location using btree (user_id) where is_default;

create policy "Enable delete for users based on user_id" on "public"."money_location"
  for delete to PUBLIC using (((select auth.uid() as uid) = user_id));

create policy "Enable insert for authenticated users only" on "public"."money_location"
  for insert to "authenticated" with check (true);

create policy "Enable users to view their own data only" on "public"."money_location"
  for select to "authenticated" using (((select auth.uid() as uid) = user_id));

create policy "Policy with table joins" on "public"."money_location"
  for update to PUBLIC using ((auth.uid() = user_id)) with check ((auth.uid() = user_id));

grant delete, insert, maintain, references, select, trigger, truncate, update
  on table "public"."money_location" to "anon", "authenticated", "postgres", "service_role";

-- ---------------------------------------------------------------------------
-- Backfill: every user gets a default "Main" location in their preferred
-- currency, and every existing transaction is attached to it.
-- ---------------------------------------------------------------------------

insert into public.money_location (user_id, name, currency_id, is_default)
select u.id, 'Main', coalesce(u.preferred_currency_id, 1), true
from public."user" u
where not exists (
  select 1 from public.money_location ml where ml.user_id = u.id
);

alter table "public"."transaction" add column "location_id" uuid;

update public.transaction t
set location_id = ml.id
from public.money_location ml
where ml.user_id = t.user_id and ml.is_default and t.location_id is null;

-- A transaction's currency is now derived from its location.
update public.transaction t
set currency_id = ml.currency_id
from public.money_location ml
where ml.id = t.location_id and t.currency_id is distinct from ml.currency_id;

alter table "public"."transaction" alter column "location_id" set not null;

alter table "public"."transaction"
  add constraint "transaction_location_id_fkey" foreign key (location_id)
  references public.money_location(id) on update cascade on delete restrict;

create index idx_transaction_location on public.transaction using btree (location_id);

-- ---------------------------------------------------------------------------
-- transfer
--
-- Deliberately not a row in `transaction`: every existing aggregation
-- (budget_summary, the spending chart, TransactionType filters) stays correct
-- because a transfer physically cannot be counted as a categorised expense.
--
-- Semantics: the source loses (from_amount + fee_amount) in its own currency,
-- the destination gains to_amount in its own currency. Only the fee leaves the
-- system, so the overall balance drops by exactly the fee.
-- ---------------------------------------------------------------------------

create table "public"."transfer" (
  "id" uuid not null default gen_random_uuid(),
  "created_at" timestamp with time zone not null default now(),
  "user_id" uuid not null,
  "from_location_id" uuid not null,
  "to_location_id" uuid not null,
  "from_amount" numeric(14, 2) not null,
  "to_amount" numeric(14, 2) not null,
  "fee_amount" numeric(14, 2) not null default 0,
  "description" text,
  "transfer_date" timestamp with time zone not null default now(),
  constraint "transfer_pkey" primary key (id),
  constraint "transfer_from_amount_check" check ((from_amount > (0)::numeric)),
  constraint "transfer_to_amount_check" check ((to_amount > (0)::numeric)),
  constraint "transfer_fee_amount_check" check ((fee_amount >= (0)::numeric)),
  constraint "transfer_distinct_locations" check ((from_location_id <> to_location_id))
);

alter table "public"."transfer" enable row level security;

alter table "public"."transfer"
  add constraint "transfer_user_id_fkey" foreign key (user_id)
  references public."user"(id) on update cascade on delete cascade;

alter table "public"."transfer"
  add constraint "transfer_from_location_id_fkey" foreign key (from_location_id)
  references public.money_location(id) on update cascade on delete restrict;

alter table "public"."transfer"
  add constraint "transfer_to_location_id_fkey" foreign key (to_location_id)
  references public.money_location(id) on update cascade on delete restrict;

create index idx_transfer_user on public.transfer using btree (user_id);
create index idx_transfer_from_location on public.transfer using btree (from_location_id);
create index idx_transfer_to_location on public.transfer using btree (to_location_id);

create policy "Enable delete for users based on user_id" on "public"."transfer"
  for delete to PUBLIC using (((select auth.uid() as uid) = user_id));

create policy "Enable insert for authenticated users only" on "public"."transfer"
  for insert to "authenticated" with check (true);

create policy "Enable users to view their own data only" on "public"."transfer"
  for select to "authenticated" using (((select auth.uid() as uid) = user_id));

create policy "Policy with table joins" on "public"."transfer"
  for update to PUBLIC using ((auth.uid() = user_id)) with check ((auth.uid() = user_id));

grant delete, insert, maintain, references, select, trigger, truncate, update
  on table "public"."transfer" to "anon", "authenticated", "postgres", "service_role";

-- ---------------------------------------------------------------------------
-- location_balance
--
-- Native (unconverted) balance per location. No FX here on purpose: rates live
-- outside the database, so conversion happens in the API route.
-- ---------------------------------------------------------------------------

create view "public"."location_balance" with (security_invoker=on) as
select
  ml.id as location_id,
  ml.user_id,
  ml.name,
  ml.icon,
  ml.color,
  ml.archived,
  ml.sort_order,
  ml.is_default,
  ml.currency_id,
  c.code as currency_code,
  (coalesce(inc.total, 0)
    - coalesce(exp.total, 0)
    + coalesce(t_in.total, 0)
    - coalesce(t_out.total, 0))::numeric(14, 2) as balance
from public.money_location ml
join public.currency c on c.id = ml.currency_id
left join lateral (
  select sum(amount)::numeric as total from public.transaction
  where location_id = ml.id and type = 'income'
) inc on true
left join lateral (
  select sum(amount)::numeric as total from public.transaction
  where location_id = ml.id and type = 'expense'
) exp on true
left join lateral (
  select sum(to_amount) as total from public.transfer
  where to_location_id = ml.id
) t_in on true
left join lateral (
  select sum(from_amount + fee_amount) as total from public.transfer
  where from_location_id = ml.id
) t_out on true;

grant delete, insert, maintain, references, select, trigger, truncate, update
  on table "public"."location_balance" to "anon", "authenticated", "postgres", "service_role";

-- ---------------------------------------------------------------------------
-- Dashboard settings
-- ---------------------------------------------------------------------------

alter table "public"."user" add column "dashboard_settings" jsonb not null default
  '{"showBalance": true, "showSpendingChart": true, "showBudgetOverview": true, "showAccounts": true, "accountIds": null}'::jsonb;
