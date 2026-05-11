import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Navbar from '@/components/navbar';
import { sampleListings } from '@/lib/sample-listings';
import MapWithPanel from './_components/map-with-panel';

const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sukansd.com").replace(/\/$/, "");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  const title = isAr ? "خريطة العقارات في السودان · سُكَن" : "Sudan Property Map · Sukan";
  const description = isAr
    ? "استعرض عقارات السودان على الخريطة — شقق وفيلات ومنازل في جميع الولايات"
    : "Explore Sudan properties on an interactive map — apartments, villas, and houses across all states";
  const canonicalUrl = `${SITE_URL}/${locale}/map`;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/map`,
        ar: `${SITE_URL}/ar/map`,
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonicalUrl,
      siteName: "Sukan — سُكَن",
      locale: isAr ? "ar_SD" : "en_US",
    },
    twitter: { card: "summary_large_image", title, description },
  };
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
  const sudanCenter: [number, number] = [15.5, 30.0];

  // Labels for the results panel
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

  // Labels for the filter bar / header row
  const filterLabels = {
    filterAnyPurpose: t('map.filterAnyPurpose'),
    filterRent: t('map.filterRent'),
    filterSale: t('map.filterSale'),
    filterAnyType: t('map.filterAnyType'),
    filterMaxPrice: t('map.filterMaxPrice'),
    filterMaxPricePlaceholder: t('map.filterMaxPricePlaceholder'),
    filterApply: t('map.filterApply'),
    filterClear: t('map.filterClear'),
    resultCount: t('map.resultCount', { count: 1 }),
    resultCountPlural: t('map.resultCountPlural'),
    listView: t('map.listView'),
    toggleAllListings: t('map.toggleAllListings'),
    toggleByState: t('map.toggleByState'),
  };

  // Labels for popup cards
  const popupLabels = {
    perMonth: t('listing.perMonth'),
    perYear: t('listing.perYear'),
    perTotal: t('listing.perTotal'),
    bedroomsShort: t('listing.bedroomsShort', { count: 0 }).replace('0', '{count}'),
    bathroomsShort: t('listing.bathroomsShort', { count: 0 }).replace('0', '{count}'),
    areaShort: t('listing.areaShort', { value: 0 }).replace('0', '{value}'),
    viewListing: t('map.viewListing'),
  };

  return (
    <>
      <Navbar />

      <main
        className="flex flex-col"
        style={{ height: "calc(100dvh - 64px)", marginTop: "64px" }}
      >
        {/* Floating glass pill with page title — desktop only */}
        <div className="pointer-events-none absolute start-4 top-[80px] z-[800] hidden lg:block">
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
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-dk">
              {t('map.eyebrow')}
            </p>
            <h1 className="font-display text-xl leading-tight text-ink">
              {t('map.title')}
            </h1>
          </div>
        </div>

        {/* Full-height map + controls */}
        <div className="relative flex-1 overflow-hidden">
          <MapWithPanel
            listings={listings}
            markers={[]}
            center={sudanCenter}
            zoom={5}
            locale={locale}
            labels={panelLabels}
            filterLabels={filterLabels}
            popupLabels={popupLabels}
          />
        </div>
      </main>
    </>
  );
}
