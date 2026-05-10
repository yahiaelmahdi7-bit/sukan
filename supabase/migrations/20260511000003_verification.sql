-- Feature 4: Profile verification columns + trigger to sync listings
-- Apply via: supabase db push

-- Add columns to profiles
alter table public.profiles
  add column if not exists is_verified   boolean      not null default false,
  add column if not exists verified_at   timestamptz;

-- Add column to listings
alter table public.listings
  add column if not exists owner_verified boolean not null default false;

-- Trigger function: when a profile's is_verified changes, update all their listings
create or replace function public.sync_listing_owner_verified()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.listings
  set    owner_verified = NEW.is_verified
  where  owner_id = NEW.id;
  return NEW;
end;
$$;

-- Drop existing trigger if it exists (idempotent re-runs)
drop trigger if exists trg_sync_listing_owner_verified on public.profiles;

create trigger trg_sync_listing_owner_verified
  after update of is_verified
  on public.profiles
  for each row
  execute function public.sync_listing_owner_verified();
