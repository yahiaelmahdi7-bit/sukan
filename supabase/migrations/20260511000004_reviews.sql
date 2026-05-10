-- Feature 5: reviews table + RLS
-- Apply via: supabase db push

create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  reviewer_id uuid not null references auth.users(id) on delete cascade,
  landlord_id uuid not null references auth.users(id) on delete cascade,
  listing_id  uuid references public.listings(id) on delete set null,
  rating      integer not null check (rating >= 1 and rating <= 5),
  comment     text,
  comment_ar  text,
  created_at  timestamptz not null default now(),

  -- One review per (reviewer, landlord, listing) triplet
  unique (reviewer_id, landlord_id, listing_id)
);

alter table public.reviews enable row level security;

create policy "Anyone can read reviews"
  on public.reviews for select
  using ( true );

create policy "Authenticated insert reviews"
  on public.reviews for insert
  to authenticated
  with check ( auth.uid() = reviewer_id );
