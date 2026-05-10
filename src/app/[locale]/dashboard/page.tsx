// Default dashboard page — renders "My Listings" view.
import { setRequestLocale, getTranslations } from "next-intl/server";
import { sampleListings } from "@/lib/sample-listings";
import { getMyListings } from "@/lib/listings";
import { createClient } from "@/lib/supabase/server";
import StatCard from "./_components/stat-card";
import DashboardTable from "./_components/dashboard-table";
import { getMockStats } from "./_data/mock-stats";
import { getMockInquiries } from "./_data/mock-inquiries";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");

  const stats = getMockStats();
  const inquiries = getMockInquiries();

  // Layout has already auth-guarded; safe to read the user here.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const real = user ? await getMyListings(user.id) : [];
  // Show real listings when present; fall back to demo data so pre-launch
  // the dashboard still demonstrates the layout.
  const myListings = real.length > 0 ? real : sampleListings.slice(0, 4);

  // Build per-listing view / inquiry counts from mock data
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
      {/* ── Section title ───────────────────────────────────────────────────── */}
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-dk mb-2">
          {t("title")}
        </p>
        <h1 className="font-display text-4xl text-ink">{t("myListings")}</h1>
      </div>

      {/* ── Stats row ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-12">
        <StatCard
          label={t("stats.totalListings")}
          value={stats.totalListings}
          delta={t("stats.deltaUp", { n: 1 })}
        />
        <StatCard
          label={t("stats.activeListings")}
          value={stats.activeListings}
        />
        <StatCard
          label={t("stats.viewsThisWeek")}
          value={stats.viewsThisWeek}
          delta={t("stats.deltaUp", { n: 12 })}
        />
        <StatCard
          label={t("stats.inquiriesCount")}
          value={stats.inquiriesCount}
          delta={t("stats.deltaUp", { n: 2 })}
        />
      </div>

      {/* ── Listings table ─────────────────────────────────────────────────── */}
      <div>
        <h2 className="font-display text-2xl text-ink mb-6">
          {t("myListings")}
        </h2>
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
    </div>
  );
}
