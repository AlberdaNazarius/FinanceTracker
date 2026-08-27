-- Every transaction requires a location, so a brand new account needs one from
-- the start — otherwise the add-transaction dialog has nothing to select and the
-- user cannot record anything until they visit /accounts.
--
-- The money_locations migration backfilled a Main location for accounts that
-- existed at the time; this extends the same guarantee to future signups.

create or replace function public.handle_new_user()
  returns trigger
  language plpgsql
  security definer
  AS $function$
declare
  currency bigint;
begin
  insert into public.user (id, username)
  values (
    new.id,
    new.raw_user_meta_data->>'username'
  )
  returning preferred_currency_id into currency;

  insert into public.money_location (user_id, name, currency_id, is_default)
  values (new.id, 'Main', coalesce(currency, 1), true);

  return new;
end;
$function$;
