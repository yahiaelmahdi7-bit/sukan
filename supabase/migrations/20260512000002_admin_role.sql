-- Apply via: supabase db push
-- Adds the is_admin column to profiles and grants admin to the seed admin email.

-- 1. Add is_admin column (idempotent)
alter table public.profiles
  add column if not exists is_admin boolean not null default false;

comment on column public.profiles.is_admin is
  'True when the user has site-wide admin privileges (verification, moderation).';

-- 2. Seed admin: promote any profile whose auth.users email matches.
--    Runs idempotently — re-applying is a no-op once the row is already admin.
update public.profiles p
   set is_admin = true
  from auth.users u
 where p.id = u.id
   and lower(u.email) = lower('sahedsanhori@gmail.com');

-- 3. Trigger: auto-promote a freshly-created profile if its email matches the
--    seed admin list. Keeps the bootstrap admin alive across sign-up flows
--    without requiring a manual SQL step after the migration.
create or replace function public.sync_seed_admin()
returns trigger
language plpgsql
security definer
as $$
declare
  email text;
begin
  select lower(u.email) into email
    from auth.users u
   where u.id = new.id;

  if email in ('sahedsanhori@gmail.com') then
    new.is_admin := true;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_sync_seed_admin on public.profiles;

create trigger trg_sync_seed_admin
  before insert on public.profiles
  for each row
  execute function public.sync_seed_admin();
