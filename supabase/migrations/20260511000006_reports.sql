-- Feature 10: listing_reports table + RLS
-- Apply via: supabase db push

create table if not exists public.listing_reports (
  id             uuid primary key default gen_random_uuid(),
  listing_id     uuid not null references public.listings(id) on delete cascade,
  reporter_id    uuid references auth.users(id) on delete set null,
  reporter_email text,
  reason         text not null check (reason in ('scam', 'wrong_info', 'duplicate', 'offensive', 'other')),
  details        text,
  created_at     timestamptz not null default now()
);

alter table public.listing_reports enable row level security;

-- Anyone (authenticated or anonymous) can insert a report
create policy "Anyone can report a listing"
  on public.listing_reports for insert
  with check ( true );
