// Explicit "My Listings" page — same content as dashboard default, plus "+ New listing" CTA.
// TODO: replace sampleListings.slice(0,4) with real Supabase query when data agent lands.
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { sampleListings } from "@/lib/sample-listings";
import DashboardTable from "../_components/dashboard-table";
import { getMockInquiries } from "../_data/mock-inquiries";

export default async function ListingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");

  const inquiries = getMockInquiries();

  // MOCK: first 4 sampleListings treated as "my" listings until Supabase query lands
  const myListings = sampleListings.slice(0, 4);

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

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto">
      {/* Header row with CTA */}
      <div className="flex items-start justify-between gap-4 mb-10">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-dk mb-2">
            {t("title")}
          </p>
          <h1 className="font-display text-4xl text-ink">{t("myListings")}</h1>
        </div>
        <Link
          href="/post"
          className="smooth mt-2 shrink-0 rounded-[var(--radius-pill)] text-cream px-5 py-2.5 text-sm font-semibold"
          style={{
            background: "linear-gradient(135deg, #c8401a 0%, #9d2f0f 100%)",
            boxShadow: "0 8px 22px rgba(200, 64, 26, 0.28), inset 0 1px 0 rgba(255,255,255,0.18)",
          }}
        >
          {t("newListing")}
        </Link>
      </div>

      <DashboardTable
        listings={myListings}
        locale={locale}
        labels={{
          thumb: t("table.thumb"),
          title: t("table.title"),
          status: t("table.status"),
          views: t("table.views"),
          inquiries: t("table.inquiries"),
          actions: t("table.actions"),
          edit: t("actions.edit"),
          renew: t("actions.renew"),
          archive: t("actions.archive"),
        }}
        viewsByListingId={viewsByListingId}
        inquiriesByListingId={inquiriesByListingId}
      />
    </div>
  );
}
