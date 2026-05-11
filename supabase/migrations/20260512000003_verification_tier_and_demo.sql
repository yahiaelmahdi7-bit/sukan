-- ─────────────────────────────────────────────────────────────────────────────
-- Add tiered verification + demo flag on listings.
--
-- Why tiered verification: a binary "verified" boolean isn't expressive enough
-- for the diaspora-trust use case. We need to distinguish "we called the
-- landlord" from "we checked the deed" from "a partner physically visited."
--
-- Why is_demo: early seed data and placeholder listings should be flagged so
-- the UI can clearly mark them and not mislead users.
-- ─────────────────────────────────────────────────────────────────────────────

-- Enum: verification tier (ordered weakest → strongest).
do $$
begin
  if not exists (select 1 from pg_type where typname = 'verification_tier') then
    create type public.verification_tier as enum (
      'landlord-verified',  -- we called the landlord and confirmed ownership
      'property-verified',  -- we checked the property deed
      'visited'             -- a local Sukan partner physically visited
    );
  end if;
end$$;

-- Listings get a tier column + a demo flag.
alter table public.listings
  add column if not exists verification_tier public.verification_tier,
  add column if not exists is_demo            boolean not null default false;

-- Index: filtering by verification_tier on the public listings page should
-- not require a sequential scan once the table grows.
create index if not exists idx_listings_verification_tier
  on public.listings (verification_tier)
  where verification_tier is not null;

-- Index: filtering out demo listings is the default for the public feed.
create index if not exists idx_listings_is_demo
  on public.listings (is_demo)
  where is_demo = true;

comment on column public.listings.verification_tier is
  'Tier of listing verification — landlord-verified → property-verified → visited. Null means unverified.';
comment on column public.listings.is_demo is
  'True for placeholder/sample listings. UI shows a Demo badge and they are excluded from production analytics.';
