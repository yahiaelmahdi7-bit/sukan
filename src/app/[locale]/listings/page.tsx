import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ListingCard from "@/components/listing-card";
import JsonLd from "@/components/json-ld";
import { buildBreadcrumbLD, buildCollectionPageLD } from "@/lib/json-ld";
import GlassPanel from "@/components/glass-panel";
import FilterSidebar from "./_components/filter-sidebar";
import ActiveFilters from "./_components/active-filters";
import SortSelect from "./_components/sort-select";
import EmptyState from "./_components/empty-state";
import ViewToggle from "./_components/view-toggle";
import MapView from "./_components/map-view";
import StickyBar from "./_components/sticky-bar";
import {
  type Listing,
  type SudanState,
  type PropertyType,
  type Purpose,
  type Amenity,
  SUDAN_STATES,
} from "@/lib/sample-listings";
import { getListingsWithSample } from "@/lib/listings";
import { findNeighborhoodSlug, getNeighborhood } from "@/lib/sudan-neighborhoods";
import { regions, getRegionByKey, type RegionKey } from "@/lib/regions";

// ─── Types ────────────────────────────────────────────────────────────────────

type SortKey = "recent" | "price_asc" | "price_desc" | "bedrooms_desc" | "area_desc";

interface ParsedParams {
  region?: RegionKey;
  state?: SudanState;
  neighborhood?: string;
  type?: PropertyType;
  purpose?: Purpose;
  maxPrice?: number;
  minBedrooms?: number;
  amenities: Amenity[];
  sort: SortKey;
  page: number;
  view: "list" | "map";
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 12;

const VALID_PROPERTY_TYPES: PropertyType[] = [
  "apartment", "house", "villa", "studio",
  "shop", "office", "land", "warehouse",
];

const VALID_AMENITIES: Amenity[] = [
  "parking", "generator", "water_tank", "furnished",
  "garden", "security", "ac", "solar", "wifi",
  "elevator", "balcony", "rooftop",
];

const VALID_REGIONS = regions.map((r) => r.key);

// ─── Parsing helpers ──────────────────────────────────────────────────────────

function parseSearchParams(raw: Record<string, string | string[] | undefined>): ParsedParams {
  // region
  const rawRegion = typeof raw.region === "string" ? raw.region : undefined;
  const region = rawRegion && (VALID_REGIONS as string[]).includes(rawRegion)
    ? (rawRegion as RegionKey)
    : undefined;

  // state
  const rawState = typeof raw.state === "string" ? raw.state : undefined;
  const state = rawState && (SUDAN_STATES as readonly string[]).includes(rawState)
    ? (rawState as SudanState)
    : undefined;

  // neighborhood — trim + lowercase for matching
  const rawNeighborhood = typeof raw.neighborhood === "string" ? raw.neighborhood.trim() : undefined;
  const neighborhood = rawNeighborhood || undefined;

  // type
  const rawType = typeof raw.type === "string" ? raw.type : undefined;
  const type = rawType && (VALID_PROPERTY_TYPES as string[]).includes(rawType)
    ? (rawType as PropertyType)
    : undefined;

  // purpose
  const rawPurpose = typeof raw.purpose === "string" ? raw.purpose : undefined;
  const purpose: Purpose | undefined =
    rawPurpose === "rent" || rawPurpose === "sale" ? rawPurpose : undefined;

  // maxPrice
  const rawMaxPrice = typeof raw.maxPrice === "string" ? raw.maxPrice : undefined;
  const maxPrice = rawMaxPrice ? Number(rawMaxPrice) : undefined;

  // minBedrooms
  const rawMinBedrooms = typeof raw.minBedrooms === "string" ? raw.minBedrooms : undefined;
  const minBedrooms = rawMinBedrooms ? Number(rawMinBedrooms) : undefined;

  // amenities — may be string | string[] | undefined
  const rawAmenity = raw.amenity;
  const amenityArr: string[] =
    rawAmenity === undefined
      ? []
      : Array.isArray(rawAmenity)
      ? rawAmenity
      : [rawAmenity];
  const amenities = amenityArr.filter((a): a is Amenity =>
    (VALID_AMENITIES as string[]).includes(a)
  );

  // sort
  const rawSort = typeof raw.sort === "string" ? raw.sort : undefined;
  const sort: SortKey =
    rawSort === "price_asc" ||
    rawSort === "price_desc" ||
    rawSort === "bedrooms_desc" ||
    rawSort === "area_desc"
      ? rawSort
      : "recent";

  // page
  const rawPage = typeof raw.page === "string" ? raw.page : undefined;
  const page = rawPage ? Math.max(1, parseInt(rawPage, 10)) : 1;

  // view
  const rawView = typeof raw.view === "string" ? raw.view : undefined;
  const view: "list" | "map" = rawView === "map" ? "map" : "list";

  return { region, state, neighborhood, type, purpose, maxPrice, minBedrooms, amenities, sort, page, view };
}

// ─── Filtering + sorting + pagination ────────────────────────────────────────

interface FilterResult {
  items: Listing[];
  allFiltered: Listing[];
  total: number;
  totalPages: number;
  from: number;
  to: number;
}

function filterListings(params: ParsedParams, source: Listing[]): FilterResult {
  let results = [...source];

  // Region filter: restrict to states in the region (state filter takes precedence if also set)
  if (params.region && !params.state) {
    const regionData = getRegionByKey(params.region);
    if (regionData) {
      results = results.filter((l) => regionData.states.includes(l.state));
    }
  }

  if (params.state) {
    results = results.filter((l) => l.state === params.state);
  }

  // Neighborhood filter — match by canonical slug from the Sudan-wide
  // neighborhood dictionary. The URL param is a slug (e.g. "al-thawra"); we
  // look up each listing's raw neighborhood text via findNeighborhoodSlug.
  if (params.neighborhood) {
    const wanted = params.neighborhood.trim().toLowerCase();
    results = results.filter((l) => {
      if (!l.neighborhood) return false;
      const slug = findNeighborhoodSlug(l.state, l.neighborhood);
      // Fall back to a tolerant text match so historical free-text
      // neighborhood strings still resolve if they don't map to a slug.
      return (
        slug === wanted ||
        l.neighborhood.toLowerCase().trim().replace(/\s+/g, "-") === wanted
      );
    });
  }

  if (params.type) {
    results = results.filter((l) => l.propertyType === params.type);
  }
  if (params.purpose) {
    results = results.filter((l) => l.purpose === params.purpose);
  }
  if (params.maxPrice !== undefined && !isNaN(params.maxPrice)) {
    results = results.filter((l) => l.priceUsd <= params.maxPrice!);
  }
  if (params.minBedrooms !== undefined && !isNaN(params.minBedrooms)) {
    results = results.filter(
      (l) => l.bedrooms !== undefined && l.bedrooms >= params.minBedrooms!
    );
  }
  if (params.amenities.length > 0) {
    results = results.filter((l) =>
      params.amenities.every((a) => l.amenities.includes(a))
    );
  }

  // ─── Sort ──────────────────────────────────────────────────────────────────
  switch (params.sort) {
    case "price_asc":
      results.sort((a, b) => a.priceUsd - b.priceUsd);
      break;
    case "price_desc":
      results.sort((a, b) => b.priceUsd - a.priceUsd);
      break;
    case "bedrooms_desc":
      results.sort((a, b) => (b.bedrooms ?? 0) - (a.bedrooms ?? 0));
      break;
    case "area_desc":
      results.sort((a, b) => (b.areaSqm ?? 0) - (a.areaSqm ?? 0));
      break;
    default:
      break;
  }

  const allFiltered = results;
  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(params.page, totalPages);
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  const items = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return { items, allFiltered, total, totalPages, from, to };
}

// ─── Pagination helper ────────────────────────────────────────────────────────

function buildPageHref(
  searchParams: Record<string, string | string[] | undefined>,
  targetPage: number,
): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (!v) continue;
    if (Array.isArray(v)) {
      v.forEach((item) => p.append(k, item));
    } else {
      p.set(k, v);
    }
  }
  p.set("page", String(targetPage));
  return `/listings?${p.toString()}`;
}

// ─── Result context summary ───────────────────────────────────────────────────

function buildResultSummary(params: ParsedParams, total: number, locale: string): string {
  const isAr = locale === "ar";
  const countLabel = isAr
    ? `${total} نتيجة`
    : `${total} result${total !== 1 ? "s" : ""}`;
  const parts: string[] = [countLabel];

  if (params.region && !params.state) {
    const regionData = getRegionByKey(params.region);
    if (regionData) {
      const name = isAr ? regionData.nameAr : regionData.nameEn;
      parts.push(isAr ? `في ${name}` : `in ${name}`);
    }
  }

  if (params.state) {
    // state label is handled by the t() below, but we need a server-side label here.
    // We'll rely on the inline approach — the region name is the main context.
    const regionData = regions.find((r) => r.states.includes(params.state!));
    if (regionData && !params.region) {
      const name = isAr ? regionData.nameAr : regionData.nameEn;
      parts.push(isAr ? `في ${name}` : `in ${name}`);
    }
  }

  if (params.neighborhood) {
    // Look up display name from the dictionary if the slug matches; otherwise
    // surface the raw param so legacy free-text values still show.
    const hood = params.state
      ? getNeighborhood(params.state, params.neighborhood)
      : null;
    const label = (isAr ? hood?.ar : hood?.en) ?? params.neighborhood;
    parts.push(isAr ? `· حي ${label}` : `· ${label} neighborhood`);
  }

  return parts.join(" ");
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sukan.app").replace(/\/$/, "");

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  const title = isAr
    ? "تصفح العقارات في السودان · سُكَن"
    : "Browse Properties in Sudan · Sukan";
  const description = isAr
    ? "شقق وفيلات ومنازل للإيجار والبيع في جميع ولايات السودان — قائمة محدّثة يومياً"
    : "Apartments, villas, and houses for rent and sale across all 18 Sudanese states — updated daily";
  const canonicalUrl = `${SITE_URL}/${locale}/listings`;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/listings`,
        ar: `${SITE_URL}/ar/listings`,
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
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ListingsPage({
  params,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  const rawSearchParams = await searchParamsPromise;
  const parsed = parseSearchParams(rawSearchParams);
  const allListings = await getListingsWithSample();
  const { items, allFiltered, total, totalPages, from, to } = filterListings(
    parsed,
    allListings,
  );

  // Page numbers to render (show at most 5 pages around current)
  const pageNums: number[] = [];
  const spread = 2;
  for (let n = 1; n <= totalPages; n++) {
    if (
      n === 1 ||
      n === totalPages ||
      (n >= parsed.page - spread && n <= parsed.page + spread)
    ) {
      pageNums.push(n);
    }
  }
  // Insert ellipsis markers (represented as -1)
  const pageNumsWithGaps: number[] = [];
  pageNums.forEach((n, i) => {
    if (i > 0 && n - pageNums[i - 1] > 1) pageNumsWithGaps.push(-1);
    pageNumsWithGaps.push(n);
  });

  const hasFilters =
    !!parsed.region ||
    !!parsed.state ||
    !!parsed.neighborhood ||
    !!parsed.type ||
    !!parsed.purpose ||
    parsed.maxPrice !== undefined ||
    parsed.minBedrooms !== undefined ||
    parsed.amenities.length > 0;

  const resultSummary = buildResultSummary(parsed, total, locale);

  // JSON-LD
  const ldLocale = locale as "en" | "ar";
  const isAr = locale === "ar";
  const browseUrl = `${SITE_URL}/${locale}/listings`;
  const breadcrumbLD = buildBreadcrumbLD({
    items: [
      { name: isAr ? "الرئيسية" : "Home", url: `${SITE_URL}/${locale}` },
      { name: isAr ? "العقارات" : "Listings", url: browseUrl },
    ],
  });
  const collectionLD = buildCollectionPageLD({
    url: browseUrl,
    name: isAr ? "عقارات السودان" : "Sudan Property Listings",
    description: isAr
      ? "شقق وفيلات ومنازل للإيجار والبيع في جميع ولايات السودان"
      : "Apartments, villas, and houses for rent and sale across all 18 Sudanese states",
    siteUrl: SITE_URL,
    listings: items,
    locale: ldLocale,
  });

  return (
    <>
      <JsonLd data={breadcrumbLD} />
      <JsonLd data={collectionLD} />
      <Navbar />

      <main className="flex-1">
        {/* ─── Sticky mobile bar (below navbar, <lg only) ─────────────────── */}
        <StickyBar total={total} />

        {/* ─── Header band ─────────────────────────────────────────────────── */}
        <div className="bg-cream py-14 border-b border-sand/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-dk">
              {t("browse.eyebrow")}
            </p>
            <h1 className="font-display text-5xl text-ink md:text-6xl">
              {t("browse.title")}
            </h1>
            <p className="mt-3 text-lg text-ink-mid">
              {t("browse.resultCount", { count: total })}
            </p>
          </div>
        </div>

        {/* ─── Body: sidebar + main ─────────────────────────────────────────── */}
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="lg:flex lg:gap-10">
            {/* ─── Desktop sidebar ─────────────────────────────────────────── */}
            <aside className="hidden lg:block lg:w-72 lg:shrink-0">
              <GlassPanel variant="warm" radius="glass" highlight shadow className="sticky top-20 h-fit overflow-y-auto p-6">
                <FilterSidebar />
              </GlassPanel>
            </aside>

            {/* ─── Main content ─────────────────────────────────────────────── */}
            <div className="min-w-0 flex-1">
              {/* Active filter chips */}
              {hasFilters && (
                <div className="mb-5">
                  <ActiveFilters />
                </div>
              )}

              {/* Result context summary — shows region/neighborhood context */}
              {hasFilters && (
                <p className="mb-4 text-sm font-medium text-terracotta/80">
                  {resultSummary}
                </p>
              )}

              {/* Results header row: count + view toggle + sort */}
              <div className="mb-7 flex items-center justify-between gap-4">
                <p className="text-sm text-ink-mid">
                  {total > 0
                    ? t("browse.showingRange", { from, to, total })
                    : ""}
                </p>
                <div className="flex items-center gap-3">
                  <ViewToggle />
                  <SortSelect />
                </div>
              </div>

              {/* Map view or list view */}
              {parsed.view === "map" ? (
                <MapView listings={allFiltered} />
              ) : items.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              )}

              {/* Pagination — only in list view */}
              {parsed.view === "list" && totalPages > 1 && (
                <nav
                  className="mt-12 flex items-center justify-center gap-1.5"
                  aria-label="Pagination"
                >
                  {/* Previous */}
                  {parsed.page > 1 ? (
                    <Link
                      href={buildPageHref(rawSearchParams, parsed.page - 1)}
                      className="smooth-fast inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-[var(--radius-pill)] border border-white/55 bg-white/45 px-4 py-2 text-sm text-ink-mid backdrop-blur-sm hover:border-gold/50 hover:text-ink"
                    >
                      {t("browse.prevPage")}
                    </Link>
                  ) : (
                    <span className="inline-flex min-h-[40px] min-w-[40px] cursor-default items-center justify-center rounded-[var(--radius-pill)] border border-sand/40 bg-sand/30 px-4 py-2 text-sm text-ink-mid opacity-40">
                      {t("browse.prevPage")}
                    </span>
                  )}

                  {/* Page numbers */}
                  {pageNumsWithGaps.map((n, idx) =>
                    n === -1 ? (
                      <span key={`gap-${idx}`} className="px-2 text-sm text-ink-mid">
                        …
                      </span>
                    ) : (
                      <Link
                        key={n}
                        href={buildPageHref(rawSearchParams, n)}
                        aria-label={t("browse.page", { n })}
                        aria-current={n === parsed.page ? "page" : undefined}
                        className={`smooth-fast flex min-h-[40px] min-w-[40px] items-center justify-center rounded-[var(--radius-pill)] border text-sm ${
                          n === parsed.page
                            ? "border-terracotta/60 bg-terracotta text-cream font-semibold shadow-[0_2px_10px_rgba(200,64,26,0.28)]"
                            : "border-white/55 bg-white/45 text-ink-mid backdrop-blur-sm hover:border-gold/50 hover:text-ink"
                        }`}
                      >
                        {n}
                      </Link>
                    )
                  )}

                  {/* Next */}
                  {parsed.page < totalPages ? (
                    <Link
                      href={buildPageHref(rawSearchParams, parsed.page + 1)}
                      className="smooth-fast inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-[var(--radius-pill)] border border-white/55 bg-white/45 px-4 py-2 text-sm text-ink-mid backdrop-blur-sm hover:border-gold/50 hover:text-ink"
                    >
                      {t("browse.nextPage")}
                    </Link>
                  ) : (
                    <span className="inline-flex min-h-[40px] min-w-[40px] cursor-default items-center justify-center rounded-[var(--radius-pill)] border border-sand/40 bg-sand/30 px-4 py-2 text-sm text-ink-mid opacity-40">
                      {t("browse.nextPage")}
                    </span>
                  )}
                </nav>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
