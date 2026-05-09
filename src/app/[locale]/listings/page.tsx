import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ListingCard from "@/components/listing-card";
import FilterSidebar from "./_components/filter-sidebar";
import ActiveFilters from "./_components/active-filters";
import SortSelect from "./_components/sort-select";
import EmptyState from "./_components/empty-state";
import ViewToggle from "./_components/view-toggle";
import MapView from "./_components/map-view";
import StickyBar from "./_components/sticky-bar";
import {
  sampleListings,
  type Listing,
  type SudanState,
  type PropertyType,
  type Purpose,
  type Amenity,
  SUDAN_STATES,
} from "@/lib/sample-listings";

// ─── Types ────────────────────────────────────────────────────────────────────

type SortKey = "recent" | "price_asc" | "price_desc" | "bedrooms_desc" | "area_desc";

interface ParsedParams {
  state?: SudanState;
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

// ─── Parsing helpers ──────────────────────────────────────────────────────────

function parseSearchParams(raw: Record<string, string | string[] | undefined>): ParsedParams {
  // state
  const rawState = typeof raw.state === "string" ? raw.state : undefined;
  const state = rawState && (SUDAN_STATES as readonly string[]).includes(rawState)
    ? (rawState as SudanState)
    : undefined;

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

  return { state, type, purpose, maxPrice, minBedrooms, amenities, sort, page, view };
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

function filterListings(params: ParsedParams): FilterResult {
  let results = [...sampleListings];

  if (params.state) {
    results = results.filter((l) => l.state === params.state);
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
  // "recent"        — preserve natural array order (newest first in real DB)
  // "price_asc"     — ascending priceUsd
  // "price_desc"    — descending priceUsd
  // "bedrooms_desc" — descending bedrooms (nulls treated as 0)
  // "area_desc"     — descending areaSqm (nulls treated as 0)
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
      // "recent" — natural array order (newest first in real app)
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
  const { items, allFiltered, total, totalPages, from, to } = filterListings(parsed);

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
    !!parsed.state ||
    !!parsed.type ||
    !!parsed.purpose ||
    parsed.maxPrice !== undefined ||
    parsed.minBedrooms !== undefined ||
    parsed.amenities.length > 0;

  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* ─── Sticky mobile bar (below navbar, <lg only) ─────────────────── */}
        <StickyBar total={total} />

        {/* ─── Header band ─────────────────────────────────────────────────── */}
        <div className="bg-cream py-14 border-b border-sand-dk">
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
              <div className="sticky top-20 h-fit overflow-y-auto rounded-xl border border-sand-dk bg-card shadow-sm p-6">
                <FilterSidebar />
              </div>
            </aside>

            {/* ─── Main content ─────────────────────────────────────────────── */}
            <div className="min-w-0 flex-1">
              {/* Active filter chips */}
              {hasFilters && (
                <div className="mb-5">
                  <ActiveFilters />
                </div>
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
                      className="min-h-[40px] min-w-[40px] rounded-md border border-sand-dk bg-card px-4 py-2 text-sm text-ink transition hover:border-gold/60 hover:bg-gold/10"
                    >
                      {t("browse.prevPage")}
                    </Link>
                  ) : (
                    <span className="min-h-[40px] min-w-[40px] cursor-default rounded-md border border-sand-dk bg-sand px-4 py-2 text-sm text-ink-mid opacity-40">
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
                        className={`flex min-h-[40px] min-w-[40px] items-center justify-center rounded-md border text-sm transition ${
                          n === parsed.page
                            ? "border-terracotta bg-terracotta text-cream font-semibold"
                            : "border-sand-dk bg-card text-ink-mid hover:border-gold/50 hover:text-ink"
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
                      className="min-h-[40px] min-w-[40px] rounded-md border border-sand-dk bg-card px-4 py-2 text-sm text-ink transition hover:border-gold/60 hover:bg-gold/10"
                    >
                      {t("browse.nextPage")}
                    </Link>
                  ) : (
                    <span className="min-h-[40px] min-w-[40px] cursor-default rounded-md border border-sand-dk bg-sand px-4 py-2 text-sm text-ink-mid opacity-40">
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
