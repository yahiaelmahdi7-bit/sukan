-- ─────────────────────────────────────────────────────────────────────────────
-- Waitlist table — captures email signups for features that aren't live yet.
-- Currently used for the WhatsApp listing bot (announced as coming-soon
-- on the homepage landlord CTA card).
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.waitlist (
  id          uuid          primary key default gen_random_uuid(),
  email       text          not null,
  source      text          not null default 'whatsapp_bot',
  locale      text          not null default 'en',
  created_at  timestamptz   not null default now(),
  unique (email, source)
);

create index if not exists idx_waitlist_source on public.waitlist (source);
create index if not exists idx_waitlist_created_at on public.waitlist (created_at desc);

-- RLS: anonymous users can insert into the waitlist (signup form). They
-- cannot read or update. Only the service role (admin scripts) can read.
alter table public.waitlist enable row level security;

drop policy if exists waitlist_insert_anon on public.waitlist;
create policy waitlist_insert_anon
  on public.waitlist
  for insert
  to anon, authenticated
  with check (true);

comment on table public.waitlist is
  'Email signups for unreleased features (currently WhatsApp listing bot). Inserts only — admin reads via service role.';
