-- Spend is now summed from the normalised base amount, converted into the
-- user's preferred currency at the rate of each transaction's own date. Closed
-- periods therefore stop moving, and changing the preferred currency still
-- recomputes correctly because the base amount is currency-neutral.

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
  left join public.exchange_rate_daily r
    on r.rate_date = (t.transaction_date at time zone 'UTC')::date
   and r.code = lower(pref.code)
  where t.category_id = b.category_id
    and t.user_id = b.user_id
    and t.transaction_date >= b.period_start
    and t.transaction_date < (b.period_end + interval '1 day')
) s on true;

grant delete, insert, maintain, references, select, trigger, truncate, update
  on table "public"."budget_summary" to "anon", "authenticated", "postgres", "service_role";
