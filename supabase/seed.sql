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

-- Local-only test account: test@gmail.com / 12345678
-- Never reaches the hosted project: seed.sql runs on `supabase db reset`, not
-- on `db push`. The username in raw_user_meta_data is required because the
-- handle_new_user trigger copies it into public.user.username, which is NOT NULL.

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token, email_change_token_new, email_change
)
values (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000001',
  'authenticated', 'authenticated',
  'test@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"username":"test"}'::jsonb,
  '', '', '', ''
)
on conflict (id) do nothing;

insert into auth.identities (
  provider_id, user_id, identity_data, provider,
  last_sign_in_at, created_at, updated_at
)
values (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '{"sub":"00000000-0000-0000-0000-000000000001","email":"test@gmail.com","email_verified":true,"phone_verified":false}'::jsonb,
  'email',
  now(), now(), now()
)
on conflict (provider_id, provider) do nothing;
