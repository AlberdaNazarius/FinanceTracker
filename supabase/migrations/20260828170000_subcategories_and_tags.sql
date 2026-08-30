-- Subcategories (Food -> Groceries) and free-form tags (#coffee).
--
-- A subcategory is a category with a parent rather than its own table, so it
-- inherits the type, colour, icon and RLS that categories already have. Depth is
-- capped at two: a child cannot itself become a parent.

-- ---------------------------------------------------------------------------
-- Subcategories
-- ---------------------------------------------------------------------------

alter table "public"."category" add column if not exists "parent_id" uuid;

alter table "public"."category"
  add constraint "category_parent_id_fkey" foreign key (parent_id)
  references public.category(id) on update cascade on delete cascade;

create index if not exists idx_category_parent on public.category using btree (parent_id);

create or replace function public.check_category_parent()
  returns trigger
  language plpgsql
as $function$
declare
  parent_of_parent uuid;
  parent_type text;
begin
  if new.parent_id is null then
    return new;
  end if;

  if new.parent_id = new.id then
    raise exception 'A category cannot be its own parent';
  end if;

  select parent_id, type into parent_of_parent, parent_type
  from public.category where id = new.parent_id;

  if parent_of_parent is not null then
    raise exception 'Subcategories cannot be nested further';
  end if;

  if parent_type is distinct from new.type then
    raise exception 'A subcategory must have the same type as its parent';
  end if;

  -- A parent with children cannot become a child itself.
  if exists (select 1 from public.category where parent_id = new.id) then
    raise exception 'A category with subcategories cannot become a subcategory';
  end if;

  return new;
end;
$function$;

drop trigger if exists category_parent_check on public.category;

create trigger category_parent_check
  before insert or update on public.category
  for each row
  execute function public.check_category_parent();

-- ---------------------------------------------------------------------------
-- Tags
-- ---------------------------------------------------------------------------

create table if not exists "public"."tag" (
  "id" uuid not null default gen_random_uuid(),
  "created_at" timestamptz not null default now(),
  "user_id" uuid not null,
  "name" text not null,
  constraint "tag_pkey" primary key (id)
);

alter table "public"."tag" enable row level security;

alter table "public"."tag"
  add constraint "tag_user_id_fkey" foreign key (user_id)
  references public."user"(id) on update cascade on delete cascade;

-- Tags are matched case-insensitively so #Coffee and #coffee are one tag.
create unique index if not exists tag_user_name_unique
  on public.tag using btree (user_id, lower(name));

create policy "Enable delete for users based on user_id" on "public"."tag"
  for delete to PUBLIC using (((select auth.uid() as uid) = user_id));
create policy "Enable insert for authenticated users only" on "public"."tag"
  for insert to "authenticated" with check (true);
create policy "Enable users to view their own data only" on "public"."tag"
  for select to "authenticated" using (((select auth.uid() as uid) = user_id));
create policy "Policy with table joins" on "public"."tag"
  for update to PUBLIC using ((auth.uid() = user_id)) with check ((auth.uid() = user_id));

grant delete, insert, maintain, references, select, trigger, truncate, update
  on table "public"."tag" to "anon", "authenticated", "postgres", "service_role";

create table if not exists "public"."transaction_tag" (
  "transaction_id" uuid not null,
  "tag_id" uuid not null,
  constraint "transaction_tag_pkey" primary key (transaction_id, tag_id)
);

alter table "public"."transaction_tag" enable row level security;

alter table "public"."transaction_tag"
  add constraint "transaction_tag_transaction_id_fkey" foreign key (transaction_id)
  references public.transaction(id) on update cascade on delete cascade;

alter table "public"."transaction_tag"
  add constraint "transaction_tag_tag_id_fkey" foreign key (tag_id)
  references public.tag(id) on update cascade on delete cascade;

create index if not exists idx_transaction_tag_tag on public.transaction_tag using btree (tag_id);

-- The link table carries no user_id; ownership is whoever owns the transaction.
create policy "Enable delete for users based on user_id" on "public"."transaction_tag"
  for delete to PUBLIC using (exists (
    select 1 from public.transaction t
    where t.id = transaction_id and t.user_id = (select auth.uid())
  ));
create policy "Enable insert for authenticated users only" on "public"."transaction_tag"
  for insert to "authenticated" with check (exists (
    select 1 from public.transaction t
    where t.id = transaction_id and t.user_id = (select auth.uid())
  ));
create policy "Enable users to view their own data only" on "public"."transaction_tag"
  for select to "authenticated" using (exists (
    select 1 from public.transaction t
    where t.id = transaction_id and t.user_id = (select auth.uid())
  ));

grant delete, insert, maintain, references, select, trigger, truncate, update
  on table "public"."transaction_tag" to "anon", "authenticated", "postgres", "service_role";

-- ---------------------------------------------------------------------------
-- Budgets roll subcategories up into their parent
-- ---------------------------------------------------------------------------

drop view if exists public.budget_summary;

create view public.budget_summary with (security_invoker = on) as
select
  b.id as budget_id,
  b.user_id,
  c.name as category,
  c.color as category_color,
  c.icon as category_icon,
  b.amount as budget,
  coalesce(s.spent, 0)::numeric(14, 2) as spent,
  coalesce(s.unconverted, 0) as unconverted
from public.budget b
join public.category c on c.id = b.category_id
join public."user" u on u.id = b.user_id
left join public.currency pref on pref.id = u.preferred_currency_id
left join lateral (
  select
    sum(t.amount_base * r.rate)
      filter (where t.amount_base is not null and r.rate is not null) as spent,
    count(*)
      filter (where t.amount_base is null or r.rate is null) as unconverted
  from public.transaction t
  join public.category tc on tc.id = t.category_id
  left join public.exchange_rate_daily r
    on r.rate_date = (t.transaction_date at time zone 'UTC')::date
   and r.code = lower(pref.code)
  -- A budget on a parent catches its subcategories; one set directly on a
  -- subcategory catches only that subcategory.
  where (tc.id = b.category_id or tc.parent_id = b.category_id)
    and t.user_id = b.user_id
    and t.transaction_date >= b.period_start
    and t.transaction_date < (b.period_end + interval '1 day')
) s on true;

grant delete, insert, maintain, references, select, trigger, truncate, update
  on table "public"."budget_summary" to "anon", "authenticated", "postgres", "service_role";
