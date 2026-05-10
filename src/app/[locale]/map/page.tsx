import { setRequestLocale, getTranslations } from 'next-intl/server';
import Navbar from '@/components/navbar';
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
    /*
      Full-viewport map page.
      - Navbar floats on top (it uses position:fixed internally, which is fine).
      - <main> fills the full viewport height below the navbar.
      - No Footer — map pages conventionally omit it.
    */
    <>
      <Navbar />

      <main
        className="flex flex-col"
        style={{ height: "calc(100dvh - 64px)", marginTop: "64px" }}
      >
        {/* ── Compact page header — glass pill floating over the map top ──── */}
        <div className="pointer-events-none absolute start-4 top-[80px] z-[900] hidden lg:block">
          <div
            className="inline-flex flex-col gap-0.5 rounded-[var(--radius-glass)] px-5 py-3"
            style={{
              background: "rgba(255,252,246,0.82)",
              backdropFilter: "blur(22px) saturate(175%)",
              WebkitBackdropFilter: "blur(22px) saturate(175%)",
              border: "1px solid rgba(255,255,255,0.65)",
              boxShadow: "var(--shadow-glass)",
            }}
          >
            {/* Eyebrow */}
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-dk">
              {t('map.eyebrow')}
            </p>
            {/* Headline */}
            <h1 className="font-display text-xl leading-tight text-ink">
              {t('map.title')}
            </h1>
          </div>
        </div>

        {/* ── Map + panel container — fills remaining height ─────────────── */}
        <div className="relative flex-1 overflow-hidden">
          <MapWithPanel
            listings={listings}
            markers={listingMarkers}
            center={sudanCenter}
            zoom={5}
            locale={locale}
            labels={panelLabels}
          />

          {/* Result count — bottom-left watermark over the map */}
          <p
            className="pointer-events-none absolute bottom-3 start-4 z-[900] text-[11px] text-ink-mid"
            style={{
              textShadow:
                "0 1px 3px rgba(255,255,255,0.9), 0 0 8px rgba(255,255,255,0.7)",
            }}
          >
            {t('map.markersShown', { count: listings.length })}
          </p>
        </div>
      </main>
    </>
  );
}
