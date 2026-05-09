import { setRequestLocale, getTranslations } from 'next-intl/server';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { sampleListings } from '@/lib/sample-listings';
import type { MapMarker } from '@/components/leaflet-map';
import { formatShortPrice } from '@/lib/format-price';
import MapWithPanel from './_components/map-with-panel';

export default async function MapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  const listings = sampleListings;

  // ── Build priceLabel markers ──────────────────────────────────────────────
  // Deterministic jitter so overlapping pins don't stack exactly
  const listingMarkers: MapMarker[] = listings.map((l) => {
    const jitterLat = (l.id.charCodeAt(0) % 17 - 8) * 0.012;
    const jitterLng = (l.id.charCodeAt(1) % 17 - 8) * 0.012;

    // Check if another listing shares the same base coords — only apply jitter
    // when there's a potential collision (same lat/lng after rounding to 4dp)
    const sameSpot = listings.filter(
      (other) =>
        other.id !== l.id &&
        Math.abs(other.latitude - l.latitude) < 0.001 &&
        Math.abs(other.longitude - l.longitude) < 0.001,
    );
    const lat = sameSpot.length > 0 ? l.latitude + jitterLat : l.latitude;
    const lng = sameSpot.length > 0 ? l.longitude + jitterLng : l.longitude;

    const tone =
      l.tier === 'featured'
        ? 'featured'
        : l.purpose === 'rent'
          ? 'rent'
          : 'sale';

    // Format as SDG if priceSdg is available, else USD
    const priceLabel = l.priceSdg
      ? formatShortPrice(l.priceSdg, 'SDG', locale === 'ar' ? 'ar' : 'en')
      : formatShortPrice(l.priceUsd, 'USD', locale === 'ar' ? 'ar' : 'en');

    return {
      id: l.id,
      position: [lat, lng] as [number, number],
      variant: 'priceLabel' as const,
      priceLabel,
      tone,
    };
  });

  const sudanCenter: [number, number] = [15.5, 30.0];

  // Labels passed to client component (no useTranslations in server components)
  const panelLabels = {
    panelTitle: t('map.legendTitle'),
    toggleList: t('map.toggleList'),
    hideList: t('map.hideList'),
    flyToListing: t('map.flyToListing'),
    legendRent: t('map.legendRent'),
    legendSale: t('map.legendSale'),
    legendFeatured: t('map.legendFeatured'),
    perMonth: t('listing.perMonth'),
    perYear: t('listing.perYear'),
    perTotal: t('listing.perTotal'),
    bedroomsShort: t('listing.bedroomsShort', { count: 0 }).replace('0', '{count}'),
    bathroomsShort: t('listing.bathroomsShort', { count: 0 }).replace('0', '{count}'),
    areaShort: t('listing.areaShort', { value: 0 }).replace('0', '{value}'),
  };

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
            MAP + SIDE PANEL
        ───────────────────────────────────────────────────────── */}
        <section className="bg-earth pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-[var(--radius-card)] overflow-hidden border border-gold/15">
              <MapWithPanel
                listings={listings}
                markers={listingMarkers}
                center={sudanCenter}
                zoom={5}
                locale={locale}
                labels={panelLabels}
              />
            </div>

            <p className="mt-4 text-xs text-mute-soft text-end">
              {t('map.markersShown', { count: listings.length })}
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
