-- Feature 8: viewing_requests table + RLS
-- Apply via: supabase db push

create table if not exists public.viewing_requests (
  id               uuid primary key default gen_random_uuid(),
  listing_id       uuid not null references public.listings(id) on delete cascade,
  requester_id     uuid references auth.users(id) on delete set null,
  requester_name   text not null,
  requester_phone  text not null,
  preferred_date   date,
  preferred_time   text,
  status           text not null default 'pending'
                     check (status in ('pending', 'confirmed', 'cancelled')),
  created_at       timestamptz not null default now()
);

alter table public.viewing_requests enable row level security;

-- Requesters see their own requests
create policy "Requester sees own viewing requests"
  on public.viewing_requests for select
  to authenticated
  using ( auth.uid() = requester_id );

-- Anyone (including anonymous) can insert a viewing request
create policy "Anyone can insert viewing request"
  on public.viewing_requests for insert
  with check ( true );

-- Listing owner sees requests for their listings
create policy "Listing owner sees viewing requests"
  on public.viewing_requests for select
  to authenticated
  using (
    exists (
      select 1
      from   public.listings l
      where  l.id = listing_id
      and    l.owner_id = auth.uid()
    )
  );
