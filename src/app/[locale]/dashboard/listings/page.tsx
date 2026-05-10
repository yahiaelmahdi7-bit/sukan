import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Plus, LayoutList } from "lucide-react";
import { sampleListings } from "@/lib/sample-listings";
import { getMyListings } from "@/lib/listings";
import { createClient } from "@/lib/supabase/server";
import { getMockInquiries } from "../_data/mock-inquiries";
import { getInquiriesForUser } from "../_data/inquiries";
import ListingsManager from "../_components/listings-manager";
import EmptyState from "@/components/empty-state";

export default async function ListingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");
  const td = await getTranslations("dashboardOverview");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const realListings = user ? await getMyListings(user.id) : [];
  const myListings =
    realListings.length > 0 ? realListings : sampleListings.slice(0, 4);

  const realInquiries = user ? await getInquiriesForUser(user.id) : [];
  const mockInquiries = getMockInquiries();
  const inquiries =
    realInquiries.length > 0 ? realInquiries : mockInquiries;

  // View count fallback (seeded per listing id)
  const viewsByListingId: Record<string, number> = {
    "khartoum-2-3br-apt": 72,
    "omdurman-villa-thawra": 41,
    "port-sudan-shop": 18,
    "river-nile-land-shendi": 11,
  };

  const inquiriesByListingId: Record<string, number> = {};
  for (const inq of inquiries) {
    inquiriesByListingId[inq.listing_id] =
      (inquiriesByListingId[inq.listing_id] ?? 0) + 1;
  }

  const activeCount = myListings.filter((l) => l.tier !== undefined).length;
  const isAr = locale === "ar";

  const subtitle =
    activeCount > 0
      ? isAr
        ? `${activeCount} ${td("listingsActiveCount")}`
        : `${activeCount} ${td("listingsActiveCount")}`
      : td("listingsNoListings");

  return (
    <div className="px-5 sm:px-8 py-10 max-w-6xl mx-auto flex flex-col gap-8">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-dk mb-2">
            {t("title")}
          </p>
          <h1 className="font-display text-4xl text-ink">
            {t("myListings")}
          </h1>
          <p className="text-sm text-ink-mid mt-1.5">{subtitle}</p>
        </div>

        <Link
          href="/post"
          className="smooth mt-2 shrink-0 inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] text-cream px-5 py-2.5 text-sm font-semibold"
          style={{
            background: "linear-gradient(135deg, #c8401a 0%, #9d2f0f 100%)",
            boxShadow:
              "0 8px 22px rgba(200,64,26,0.28), inset 0 1px 0 rgba(255,255,255,0.18)",
          }}
        >
          <Plus size={15} />
          {t("newListing")}
        </Link>
      </div>

      {/* ── Listings or empty state ──────────────────────────────────────── */}
      {myListings.length === 0 ? (
        <EmptyState
          icon={<LayoutList size={24} />}
          title={td("emptyListingsTitle")}
          body={td("emptyListingsBody")}
          primaryCta={{ label: t("newListing"), href: "/post" }}
          secondaryCta={{ label: td("quickBrowseListings"), href: "/listings" }}
        />
      ) : (
        <ListingsManager
          listings={myListings}
          locale={locale}
          viewsByListingId={viewsByListingId}
          inquiriesByListingId={inquiriesByListingId}
          labels={{
            filterAll: td("filterAll"),
            filterActive: td("filterActive"),
            filterDraft: td("filterDraft"),
            filterPending: td("filterPending"),
            sortNewest: td("sortNewest"),
            sortViews: td("sortViews"),
            sortInquiries: td("sortInquiries"),
            sortPriceLow: td("sortPriceLow"),
            sortPriceHigh: td("sortPriceHigh"),
            searchPlaceholder: td("searchPlaceholder"),
            active: td("statusActive"),
            draft: td("statusDraft"),
            pending: td("statusPending"),
            featured: td("statusFeatured"),
            edit: t("actions.edit"),
            pause: td("actionPause"),
            boost: td("actionBoost"),
            duplicate: td("actionDuplicate"),
            delete: td("actionDelete"),
            viewsLabel: t("table.views"),
            inquiriesLabel: t("table.inquiries"),
            savesLabel: td("statSaves"),
            lastActivity: td("lastActivity"),
            noResults: td("noResults"),
          }}
        />
      )}
    </div>
  );
}
