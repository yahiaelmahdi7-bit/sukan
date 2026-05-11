-- ─────────────────────────────────────────────────────────────────────────────
-- Add video_tour_url + price_history to listings.
--
-- video_tour_url: a single URL pointing at a hosted video (YouTube, Vimeo, or
-- a direct mp4 in Supabase Storage). Plain text — validation done in app code.
--
-- price_history: an append-only JSONB array. Each entry is
--   { "price": number, "date": ISO-8601 string, "currency": "USD" | "SDG" }
-- with the newest entry FIRST. We use JSONB rather than a separate table
-- because price changes are infrequent and we always want the full series
-- when rendering the listing — no join needed.
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.listings
  add column if not exists video_tour_url text,
  add column if not exists price_history  jsonb not null default '[]'::jsonb;

-- Index: filtering for "has a video tour" should be cheap once we surface
-- a videoTour filter in the listings page UI.
create index if not exists idx_listings_has_video_tour
  on public.listings ((video_tour_url is not null))
  where video_tour_url is not null;

comment on column public.listings.video_tour_url is
  'Public URL of the listing video tour (YouTube/Vimeo/direct mp4). Null when not available.';
comment on column public.listings.price_history is
  'Append-only price changes, newest first: [{price, date, currency}]. Drives the price-history timeline on the listing detail page.';
