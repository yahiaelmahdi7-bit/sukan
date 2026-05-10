-- Feature 3: price_alerts table + RLS
-- Apply via: supabase db push

create table if not exists public.price_alerts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  state         text,
  property_type text,
  purpose       text not null default 'rent',
  max_price     integer,
  currency      text not null default 'USD',
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

alter table public.price_alerts enable row level security;

create policy "Users manage own alerts"
  on public.price_alerts
  for all
  to authenticated
  using  ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );
