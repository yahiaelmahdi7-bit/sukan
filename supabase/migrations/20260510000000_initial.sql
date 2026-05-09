-- =============================================================================
-- Sukan (سكن) — Sudan's first AI-powered property listing platform
-- Initial schema migration
-- =============================================================================


-- ===== EXTENSIONS =====

create extension if not exists "pgcrypto";


-- ===== ENUMS =====

-- All 18 states of Sudan (post-2011, 18-state administrative division)
create type sudan_state as enum (
  'khartoum',
  'al_jazirah',
  'blue_nile',
  'sennar',
  'white_nile',
  'north_kordofan',
  'south_kordofan',
  'west_kordofan',
  'north_darfur',
  'south_darfur',
  'east_darfur',
  'central_darfur',
  'west_darfur',
  'kassala',
  'red_sea',
  'gedaref',
  'river_nile',
  'northern'
);

-- Lifecycle of a listing from creation to expiry
create type listing_status as enum (
  'draft',
  'pending_payment',
  'active',
  'expired',
  'archived'
);

-- Whether the property is available for rent or sale
create type listing_purpose as enum ('rent', 'sale');

-- Supported property categories
create type property_type as enum (
  'apartment',
  'house',
  'villa',
  'studio',
  'shop',
  'office',
  'land',
  'warehouse'
);

-- Listing promotion tier; featured listings receive boosted visibility
create type tier as enum ('standard', 'featured');

-- Supported price currencies (US Dollar and Sudanese Pound)
create type currency as enum ('USD', 'SDG');


-- ===== TABLES =====

-- profiles
-- One row per authenticated user. Extends auth.users with landlord / tenant details.
-- Created automatically via a trigger or manually on first sign-in.
create table profiles (
  id                uuid        primary key references auth.users(id) on delete cascade,
  full_name         text,
  phone             text,                         -- E.164 format, e.g. +249912345678
  whatsapp          text,                         -- May differ from phone (some use a secondary SIM)
  city              text,                         -- Free-form; landlords can list remotely
  is_agent          boolean     not null default false,
  agent_company     text,                         -- Nullable; only relevant when is_agent = true
  preferred_locale  text        not null default 'en' check (preferred_locale in ('en', 'ar')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table profiles is
  'User profile data extending auth.users. Covers both landlords/agents and tenants.';

comment on column profiles.phone     is 'Primary contact phone in E.164 format.';
comment on column profiles.whatsapp  is 'WhatsApp number if different from phone; E.164 format.';
comment on column profiles.is_agent  is 'True when the user operates as a licensed real-estate agent.';


-- listings
-- Core entity. One row per property listing. Supports both Arabic and English content.
create table listings (
  id                uuid            primary key default gen_random_uuid(),
  owner_id          uuid            not null references profiles(id) on delete cascade,

  -- Bilingual content
  title_en          text            not null,
  title_ar          text            not null,
  description_en    text,
  description_ar    text,

  -- Classification
  property_type     property_type   not null,
  purpose           listing_purpose not null,

  -- Location
  state             sudan_state     not null,
  city              text            not null,     -- e.g. "Khartoum 2", "Omdurman", "Al-Manshiya"
  neighborhood      text,
  address_line      text,
  latitude          double precision not null,
  longitude         double precision not null,

  -- Physical attributes
  bedrooms          smallint,                     -- NULL for non-residential (shops, land, etc.)
  bathrooms         smallint,                     -- NULL for land / warehouses
  area_sqm          numeric(8, 2),

  -- Pricing
  price             numeric(12, 2)  not null,
  currency          currency        not null default 'USD',
  price_period      text            check (price_period in ('month', 'year', 'total')),
  -- price_period: 'month'/'year' for rent; 'total' for sale. NULL only if purpose forces it.

  -- Amenities stored as a simple text array so values can evolve without enum migrations.
  -- Known values: parking, generator, water_tank, furnished, garden, security, ac, solar, elevator
  amenities         text[]          not null default '{}',

  -- Promotion and lifecycle
  tier              tier            not null default 'standard',
  status            listing_status  not null default 'draft',
  featured_until    timestamptz,                  -- NULL unless tier = 'featured'
  expires_at        timestamptz,                  -- Set when listing goes active; drives expiry job
  published_at      timestamptz,                  -- Set on first transition to 'active'

  -- Engagement
  view_count        integer         not null default 0,

  -- Contact override: landlord may prefer a different WA number for this specific listing
  whatsapp_contact  text,

  created_at        timestamptz     not null default now(),
  updated_at        timestamptz     not null default now()
);

comment on table listings is
  'Property listings. Supports bilingual content (EN + AR) and both rent and sale purposes.';

comment on column listings.city             is 'Sub-area within the state, e.g. "Khartoum 2" or "Bahri".';
comment on column listings.amenities        is 'Array of amenity slugs. Open-ended to avoid frequent enum migrations.';
comment on column listings.price_period     is 'Billing period for rent (month/year) or "total" for a one-off sale price.';
comment on column listings.whatsapp_contact is 'Per-listing WhatsApp override; falls back to profiles.whatsapp if NULL.';
comment on column listings.view_count       is 'Denormalised counter updated on each verified page view.';


-- listing_photos
-- Ordered photo set for a listing. Files are stored in Supabase Storage (listing-photos bucket).
create table listing_photos (
  id            uuid        primary key default gen_random_uuid(),
  listing_id    uuid        not null references listings(id) on delete cascade,
  storage_path  text        not null,   -- Supabase Storage key, e.g. "{listing_id}/001.webp"
  position      smallint    not null default 0,
  alt_en        text,
  alt_ar        text,
  created_at    timestamptz not null default now(),

  unique (listing_id, position)         -- Prevent duplicate position values per listing
);

comment on table listing_photos is
  'Ordered photos for a listing. storage_path is the Supabase Storage object key.';

comment on column listing_photos.position     is 'Display order; 0 = cover photo.';
comment on column listing_photos.storage_path is 'Key within the listing-photos storage bucket.';


-- listing_views
-- Lightweight analytics row written on every page view. Used to populate view_count
-- and to provide per-listing analytics to the owner.
create table listing_views (
  id              bigserial   primary key,
  listing_id      uuid        not null references listings(id) on delete cascade,
  viewer_ip       inet,                   -- Stored for deduplication; scrub after aggregation
  viewer_user_id  uuid        references profiles(id) on delete set null,
  locale          text,                   -- 'en' or 'ar'
  referrer        text,                   -- HTTP Referer header, truncated to 500 chars
  created_at      timestamptz not null default now()
);

comment on table listing_views is
  'Raw view events for analytics. Owners can see who viewed their listings; viewer_ip is '
  'used for deduplication and should be scrubbed after aggregation per a retention policy.';


-- saved_listings
-- User favourites. Composite PK prevents duplicate saves.
create table saved_listings (
  user_id     uuid        not null references profiles(id) on delete cascade,
  listing_id  uuid        not null references listings(id) on delete cascade,
  created_at  timestamptz not null default now(),

  primary key (user_id, listing_id)
);

comment on table saved_listings is
  'Saved / favourited listings per user. Composite PK prevents duplicates.';


-- inquiries
-- Contact events: WhatsApp click-throughs, phone reveals, and in-app messages.
-- inquirer_id is nullable so anonymous (unauthenticated) tenants can still reach landlords.
create table inquiries (
  id              uuid        primary key default gen_random_uuid(),
  listing_id      uuid        not null references listings(id) on delete cascade,
  inquirer_id     uuid        references profiles(id) on delete set null,  -- NULL for anonymous
  inquirer_name   text,
  inquirer_phone  text,
  message         text,
  channel         text        not null check (channel in ('whatsapp', 'phone', 'message')),
  created_at      timestamptz not null default now()
);

comment on table inquiries is
  'Contact events between prospective tenants/buyers and listing owners. '
  'inquirer_id is nullable so unauthenticated users can still initiate contact.';

comment on column inquiries.channel is
  'whatsapp = WA button click; phone = phone-number reveal; message = in-app message form.';


-- ===== INDEXES =====

-- listings: single-column indexes for common filter predicates
create index idx_listings_state         on listings (state);
create index idx_listings_status        on listings (status);
create index idx_listings_purpose       on listings (purpose);
create index idx_listings_property_type on listings (property_type);
create index idx_listings_owner_id      on listings (owner_id);

-- listings: composite index for the public listings grid
-- (status = 'active', ordered by tier prominence then recency)
create index idx_listings_grid
  on listings (status, tier, created_at desc);

-- listings: compound filter index (state + status is the most common combined predicate)
create index idx_listings_state_status
  on listings (state, status);

-- listings: spatial index for map queries (bounding-box lat/lon lookups)
create index idx_listings_latlon
  on listings (latitude, longitude);

-- listing_photos: fast photo lookup by listing
create index idx_listing_photos_listing_id
  on listing_photos (listing_id);

-- listing_views: analytics queries filter by listing_id
create index idx_listing_views_listing_id
  on listing_views (listing_id);

-- listing_views: time-series analytics
create index idx_listing_views_created_at
  on listing_views (created_at desc);

-- inquiries: owner reads inquiries for their listing
create index idx_inquiries_listing_id
  on inquiries (listing_id);

-- inquiries: logged-in tenant reads their own inquiry history
create index idx_inquiries_inquirer_id
  on inquiries (inquirer_id)
  where inquirer_id is not null;


-- ===== TRIGGERS =====

-- Generic function: stamp updated_at whenever a row is modified.
create or replace function set_updated_at()
  returns trigger
  language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

create trigger trg_listings_updated_at
  before update on listings
  for each row execute function set_updated_at();


-- ===== STORAGE BUCKETS =====

-- listing-photos: public read; authenticated write (enforced via Storage policies below)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listing-photos',
  'listing-photos',
  true,
  52428800,   -- 50 MiB per file
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- avatars: public read; authenticated write (enforced via Storage policies below)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880,    -- 5 MiB per file
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;


-- ===== RLS — ENABLE =====

alter table profiles        enable row level security;
alter table listings        enable row level security;
alter table listing_photos  enable row level security;
alter table listing_views   enable row level security;
alter table saved_listings  enable row level security;
alter table inquiries       enable row level security;


-- ===== RLS — POLICIES =====

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

-- Anyone can read public profile data (names are shown on listing cards)
create policy "profiles: public read"
  on profiles for select
  using (true);

-- A user may only insert their own profile row
create policy "profiles: insert own"
  on profiles for insert
  with check (auth.uid() = id);

-- A user may only update their own profile row
create policy "profiles: update own"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);


-- ---------------------------------------------------------------------------
-- listings
-- ---------------------------------------------------------------------------

-- Public marketplace: anyone can read active listings.
-- Owners can also read their own listings regardless of status.
create policy "listings: public read active"
  on listings for select
  using (
    status = 'active'
    or owner_id = auth.uid()
  );

-- Only authenticated users can create listings; they must own the row.
create policy "listings: insert own"
  on listings for insert
  with check (
    auth.uid() is not null
    and owner_id = auth.uid()
  );

-- Owners can update their own listings only.
create policy "listings: update own"
  on listings for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- Owners can delete (soft-delete via status='archived' is preferred, but hard-delete is allowed).
create policy "listings: delete own"
  on listings for delete
  using (owner_id = auth.uid());


-- ---------------------------------------------------------------------------
-- listing_photos
-- ---------------------------------------------------------------------------

-- Anyone can read photos whose listing is active, or the owner can read all their listing's photos.
create policy "listing_photos: public read active"
  on listing_photos for select
  using (
    exists (
      select 1 from listings l
      where l.id = listing_id
        and (l.status = 'active' or l.owner_id = auth.uid())
    )
  );

-- Only the parent listing's owner may insert photos.
create policy "listing_photos: insert own listing"
  on listing_photos for insert
  with check (
    exists (
      select 1 from listings l
      where l.id = listing_id
        and l.owner_id = auth.uid()
    )
  );

-- Only the parent listing's owner may update photo metadata.
create policy "listing_photos: update own listing"
  on listing_photos for update
  using (
    exists (
      select 1 from listings l
      where l.id = listing_id
        and l.owner_id = auth.uid()
    )
  );

-- Only the parent listing's owner may delete photos.
create policy "listing_photos: delete own listing"
  on listing_photos for delete
  using (
    exists (
      select 1 from listings l
      where l.id = listing_id
        and l.owner_id = auth.uid()
    )
  );


-- ---------------------------------------------------------------------------
-- listing_views
-- ---------------------------------------------------------------------------

-- Anyone (including anonymous) may insert a view event (enables unauthenticated tracking).
create policy "listing_views: public insert"
  on listing_views for insert
  with check (true);

-- Only the owner of the listing may read its view events.
create policy "listing_views: owner read"
  on listing_views for select
  using (
    exists (
      select 1 from listings l
      where l.id = listing_id
        and l.owner_id = auth.uid()
    )
  );


-- ---------------------------------------------------------------------------
-- saved_listings
-- ---------------------------------------------------------------------------

-- Users may only read their own saved listings.
create policy "saved_listings: own read"
  on saved_listings for select
  using (user_id = auth.uid());

-- Users may only insert rows for themselves.
create policy "saved_listings: own insert"
  on saved_listings for insert
  with check (user_id = auth.uid());

-- Users may only delete their own saved listings.
create policy "saved_listings: own delete"
  on saved_listings for delete
  using (user_id = auth.uid());


-- ---------------------------------------------------------------------------
-- inquiries
-- ---------------------------------------------------------------------------

-- Anyone (including unauthenticated) may submit an inquiry so anonymous tenants can contact landlords.
create policy "inquiries: public insert"
  on inquiries for insert
  with check (true);

-- The listing owner may read all inquiries for their listing.
-- The inquirer (if authenticated) may read their own inquiry.
create policy "inquiries: owner or inquirer read"
  on inquiries for select
  using (
    inquirer_id = auth.uid()
    or exists (
      select 1 from listings l
      where l.id = listing_id
        and l.owner_id = auth.uid()
    )
  );


-- ---------------------------------------------------------------------------
-- Storage policies — listing-photos bucket
-- ---------------------------------------------------------------------------

-- Public read (bucket is already public=true, but explicit policy for completeness)
create policy "listing-photos: public read"
  on storage.objects for select
  using (bucket_id = 'listing-photos');

-- Authenticated users may upload photos; path convention: {listing_id}/{filename}
-- The sub-select verifies the uploading user owns the listing referenced in the path prefix.
create policy "listing-photos: owner insert"
  on storage.objects for insert
  with check (
    bucket_id = 'listing-photos'
    and auth.uid() is not null
    and exists (
      select 1 from listings l
      where l.id = (string_to_array(name, '/'))[1]::uuid
        and l.owner_id = auth.uid()
    )
  );

create policy "listing-photos: owner update"
  on storage.objects for update
  using (
    bucket_id = 'listing-photos'
    and auth.uid() is not null
    and exists (
      select 1 from listings l
      where l.id = (string_to_array(name, '/'))[1]::uuid
        and l.owner_id = auth.uid()
    )
  );

create policy "listing-photos: owner delete"
  on storage.objects for delete
  using (
    bucket_id = 'listing-photos'
    and auth.uid() is not null
    and exists (
      select 1 from listings l
      where l.id = (string_to_array(name, '/'))[1]::uuid
        and l.owner_id = auth.uid()
    )
  );


-- ---------------------------------------------------------------------------
-- Storage policies — avatars bucket
-- ---------------------------------------------------------------------------

-- Public read
create policy "avatars: public read"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Path convention: {user_id}/{filename}
-- The uploading user must own the user_id prefix in the path.
create policy "avatars: owner insert"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid() is not null
    and (string_to_array(name, '/'))[1]::uuid = auth.uid()
  );

create policy "avatars: owner update"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid() is not null
    and (string_to_array(name, '/'))[1]::uuid = auth.uid()
  );

create policy "avatars: owner delete"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid() is not null
    and (string_to_array(name, '/'))[1]::uuid = auth.uid()
  );
