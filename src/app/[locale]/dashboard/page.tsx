import { setRequestLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import ListingCard from "@/components/listing-card";
import WelcomeBanner from "./_components/welcome-banner";
import KpiStatCard from "./_components/kpi-stat-card";
import ActionItemsCard from "./_components/action-items-card";
import RecentActivityFeed from "./_components/recent-activity-feed";
import DashboardQuickActions from "./_components/dashboard-quick-actions";
import { getOverviewData } from "./_data/overview";

// ─── Interpolation helper ─────────────────────────────────────────────────────

function interpolate(
  template: string,
  vars: Record<string, string | number> = {},
): string {
  return Object.entries(vars).reduce(
    (str, [k, v]) => str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v)),
    template,
  );
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const td = await getTranslations("dashboardOverview");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const data = await getOverviewData(user?.id ?? "anonymous");

  // ── Resolve action item display strings ───────────────────────────────────
  const titleStrings = data.actionItems.map((item) =>
    interpolate(td(item.titleKey as Parameters<typeof td>[0]), item.titleVars ?? {}),
  );
  const bodyStrings = data.actionItems.map((item) =>
    item.bodyKey
      ? interpolate(td(item.bodyKey as Parameters<typeof td>[0]), item.bodyVars ?? {})
      : undefined,
  );
  const ctaLabels: Record<string, string> = {};
  const ctaKeySet = new Set(data.actionItems.map((i) => i.ctaKey));
  for (const key of ctaKeySet) {
    try {
      ctaLabels[key] = td(key as Parameters<typeof td>[0]);
    } catch {
      ctaLabels[key] = "→";
    }
  }

  // ── Activity feed display strings ─────────────────────────────────────────
  const activityTextStrings = data.activityFeed.map((row) =>
    interpolate(td(row.textKey as Parameters<typeof td>[0]), row.textVars),
  );

  const isAr = locale === "ar";

  return (
    <div className="px-5 sm:px-8 py-10 max-w-6xl mx-auto flex flex-col gap-8">

      {/* ── 1. Welcome banner ─────────────────────────────────────────────── */}
      <WelcomeBanner
        data={data}
        locale={locale}
        labels={{
          greeting: isAr ? "أهلاً بعودتك يا {firstName}" : td("greeting"),
          sinceLastVisit: td("sinceLastVisit"),
          weekAtGlance: td("weekAtGlance"),
          newInquiries: td("newInquiriesPill"),
          verified: td("verified"),
          pendingVerification: td("pendingVerification"),
          verifyNow: td("verifyNow"),
        }}
      />

      {/* ── 2. Stat row ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiStatCard
          label={td("statViews")}
          value={data.stats.viewsThisWeek}
          delta={data.stats.viewsDelta}
          deltaUpLabel={t("dashboard.stats.deltaUp")}
          deltaDownLabel={t("dashboard.stats.deltaDown")}
        />
        <KpiStatCard
          label={td("statInquiries")}
          value={data.stats.inquiriesThisWeek}
          delta={data.stats.inquiriesDelta}
          deltaUpLabel={t("dashboard.stats.deltaUp")}
          deltaDownLabel={t("dashboard.stats.deltaDown")}
        />
        <KpiStatCard
          label={td("statViewings")}
          value={data.stats.viewingRequestsThisWeek}
          delta={data.stats.viewingsDelta}
          deltaUpLabel={t("dashboard.stats.deltaUp")}
          deltaDownLabel={t("dashboard.stats.deltaDown")}
        />
        <KpiStatCard
          label={td("statSaves")}
          value={data.stats.savesThisWeek}
          delta={data.stats.savesDelta}
          deltaUpLabel={t("dashboard.stats.deltaUp")}
          deltaDownLabel={t("dashboard.stats.deltaDown")}
        />
      </div>

      {/* ── 3. Action items ───────────────────────────────────────────────── */}
      <ActionItemsCard
        items={data.actionItems}
        titleLabel={td("actionItemsTitle")}
        allClearLabel={td("allClearTitle")}
        allClearBodyLabel={td("allClearBody")}
        ctaLabels={ctaLabels}
        titleStrings={titleStrings}
        bodyStrings={bodyStrings}
      />

      {/* ── 4. Top-performing listings ────────────────────────────────────── */}
      <section>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-dk mb-4">
          {td("topListingsTitle")}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.topListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      {/* ── 5. Recent activity + quick actions row ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Activity feed takes 3 of 5 cols on wide screens */}
        <div className="lg:col-span-3">
          <RecentActivityFeed
            rows={data.activityFeed}
            titleLabel={td("activityTitle")}
            textStrings={activityTextStrings}
          />
        </div>

        {/* Quick-links panel: 2 of 5 cols */}
        <div className="lg:col-span-2">
          <DashboardQuickActions
            labels={{
              postProperty: td("quickPostProperty"),
              viewInquiries: td("quickViewInquiries"),
              browseListings: td("quickBrowseListings"),
              viewAnalytics: td("quickViewAnalytics"),
            }}
          />
        </div>
      </div>

    </div>
  );
}
