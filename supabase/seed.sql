-- Reference data for local development.
-- Ids must match CURRENCIES in app/helpers/constants.ts, which is hardcoded
-- on the frontend and looked up by id.

insert into public.currency (id, code, unit_text) values
  (1, 'EUR', 'Euro'),
  (2, 'USD', 'US Dollar'),
  (3, 'UAH', 'Hryvnia')
on conflict (id) do update
  set code = excluded.code, unit_text = excluded.unit_text;

select setval(pg_get_serial_sequence('public.currency', 'id'), (select max(id) from public.currency));
