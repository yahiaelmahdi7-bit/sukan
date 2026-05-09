import { setRequestLocale, getTranslations } from 'next-intl/server';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import ListingCard from '@/components/listing-card';
import { sampleListings, STATE_COORDS, type Listing, type SudanState } from '@/lib/sample-listings';
import type { MapMarker } from '@/components/leaflet-map';
import MapClient from './_components/map-client';

function buildListingPopupHtml(listing: Listing, locale: string, t: Awaited<ReturnType<typeof getTranslations>>): string {
  const title = locale === 'ar' ? listing.titleAr : listing.titleEn;
  const city = locale === 'ar' ? listing.cityAr : listing.city;
  const price = new Intl.NumberFormat(locale === 'ar' ? 'ar-SD' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(listing.priceUsd);
  const periodLabel =
    listing.period === 'month'
      ? t('listing.perMonth')
      : listing.period === 'year'
        ? t('listing.perYear')
        : t('listing.perTotal');

  return `<div style="padding:14px 16px;min-width:240px;">
    <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#8C7C69;margin:0 0 6px;">${city}</p>
    <p style="font-size:14px;font-weight:600;color:#FDF8F0;margin:0 0 8px;line-height:1.3;">${title}</p>
    <p style="font-size:18px;font-weight:700;color:#E0A857;margin:0 0 12px;">${price}<span style="font-size:11px;color:#8C7C69;font-weight:400;margin-left:4px;">${periodLabel}</span></p>
    <a href="/${locale}/listings/${listing.id}" style="
      display:inline-block;
      background:#C8401A;
      color:#FDF8F0;
      font-size:12px;
      font-weight:600;
      padding:6px 14px;
      border-radius:999px;
      text-decoration:none;
    ">${t('listing.viewDetails')}</a>
  </div>`;
}

export default async function MapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  const listings = sampleListings;

  // Build listing markers
  const listingMarkers: MapMarker[] = listings.map((l) => ({
    id: l.id,
    position: [l.latitude, l.longitude],
    variant: 'listing',
    popupHtml: buildListingPopupHtml(l, locale, t),
  }));

  const sudanCenter: [number, number] = [15.5, 30.0];

  return (
    <>
      <Navbar />

      <main>
        {/* ─────────────────────────────────────────────────────────
            PAGE HEADER — generous breathing room
        ───────────────────────────────────────────────────────── */}
        <section className="bg-earth pt-20 pb-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Eyebrow */}
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              {t('map.eyebrow')}
            </p>

            {/* Headline */}
            <h1 className="font-display text-5xl md:text-6xl leading-tight text-parchment max-w-3xl mb-4">
              {t('map.title')}
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-mute-soft max-w-xl">
              {t('map.subtitle')}
            </p>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────
            FULL-WIDTH MAP
        ───────────────────────────────────────────────────────── */}
        <section className="bg-earth pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="min-h-[480px] md:min-h-0 md:h-[640px] rounded-[var(--radius-card)] overflow-hidden border border-gold/15">
              <MapClient
                center={sudanCenter}
                zoom={5}
                markers={listingMarkers}
                height="100%"
                interactive
              />
            </div>

            <p className="mt-4 text-xs text-mute-soft text-end">
              {t('map.markersShown', { count: listings.length })}
            </p>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────
            LISTINGS GRID BELOW THE MAP
        ───────────────────────────────────────────────────────── */}
        <section className="bg-earth-soft py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              {t('map.statesActive')}
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-parchment mb-10">
              {t('map.markersShown', { count: listings.length })}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
