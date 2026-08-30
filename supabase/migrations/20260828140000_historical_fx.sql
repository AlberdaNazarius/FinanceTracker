-- Reports converted at today's rate drift: a March expense of 500 UAH was worth
-- EUR 9.87 in March and EUR 9.64 today, so closed months kept changing. Amounts
-- are now normalised into a fixed base (EUR) at the rate of the transaction's
-- own date, and daily rates are cached so the result is reproducible offline.

create table if not exists exchange_rate_daily (
  rate_date date not null,
  code text not null,
  -- Units of `code` per 1 EUR, matching the shape of the upstream API.
  rate numeric(18, 8) not null,
  fetched_at timestamptz not null default now(),
  constraint exchange_rate_daily_pkey primary key (rate_date, code)
);

alter table "public"."exchange_rate_daily" enable row level security;

-- Reference data shared by every user: readable by all, and any signed-in
-- session may fill a missing day.
create policy "Enable read access for all users" on "public"."exchange_rate_daily"
  for select to PUBLIC using (true);

create policy "Enable insert for authenticated users only" on "public"."exchange_rate_daily"
  for insert to "authenticated" with check (true);

grant delete, insert, maintain, references, select, trigger, truncate, update
  on table "public"."exchange_rate_daily" to "anon", "authenticated", "postgres", "service_role";

-- Six decimals, not two: a euro cent is worth roughly half a hryvnia, so
-- rounding the base amount to cents visibly distorts conversions back into
-- low-value currencies.
-- Nullable: existing rows are normalised by the backfill endpoint, and reports
-- fall back to live conversion until that has run.
alter table "public"."transaction" add column if not exists "amount_base" numeric(18, 6);

create index if not exists idx_transaction_amount_base
  on public.transaction using btree (user_id, transaction_date)
  where amount_base is null;
