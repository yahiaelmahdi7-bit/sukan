import { setRequestLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { sampleListings, SUDAN_STATES } from "@/lib/sample-listings";
import { getMockStats } from "../_data/mock-stats";
import { getMockInquiries } from "../_data/mock-inquiries";

// ── Inline CSS bar chart (no chart lib) ────────────────────────────────────

function BarChart({
  values,
  height = 120,
  barColor = "#C8873A",
  label,
}: {
  values: number[];
  height?: number;
  barColor?: string;
  label: string;
}) {
  const max = Math.max(...values, 1);
  const width = 700;
  const barWidth = Math.floor(width / values.length) - 2;

  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-gold-dk font-semibold mb-4">
        {label}
      </p>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height + 20}`}
          width="100%"
          height={height + 20}
          aria-label={label}
          role="img"
          className="block"
          style={{ minWidth: 320 }}
        >
          {values.map((v, i) => {
            const barH = Math.max(2, (v / max) * height);
            const x = i * (barWidth + 2);
            const y = height - barH;
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                rx="3"
                fill={barColor}
                opacity={0.65 + 0.35 * (v / max)}
              >
                <title>
                  Day {i + 1}: {v} views
                </title>
              </rect>
            );
          })}
        </svg>
      </div>
      <div className="flex justify-between text-xs text-ink-mid mt-1 px-1">
        <span>Day 1</span>
        <span>Day 15</span>
        <span>Day 30</span>
      </div>
    </div>
  );
}

// ── Pure-CSS horizontal bar ─────────────────────────────────────────────────

function HorizontalBar({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-ink w-28 shrink-0 truncate text-end ltr:text-end rtl:text-start">
        {label}
      </span>
      <div className="flex-1 h-2 rounded-full bg-sand/50 overflow-hidden border border-white/40">
        <div
          className="h-full rounded-full bg-gold transition-all"
          style={{ width: `${pct.toFixed(1)}%` }}
        />
      </div>
      <span className="text-xs text-ink-mid w-8 text-end">{value}</span>
    </div>
  );
}

// ── Pure-CSS listing bar (views per listing) ────────────────────────────────

function ListingBar({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-ink min-w-0 flex-1 truncate">{label}</span>
      <div className="w-32 h-2 rounded-full bg-sand/50 overflow-hidden border border-white/40 shrink-0">
        <div
          className="h-full rounded-full bg-terracotta transition-all"
          style={{ width: `${pct.toFixed(1)}%` }}
        />
      </div>
      <span className="text-xs text-ink-mid w-8 text-end shrink-0">{value}</span>
    </div>
  );
}

// ── Data helpers ────────────────────────────────────────────────────────────

type ListingViewRow = {
  listing_id: string;
  title_en: string;
  view_count: number;
};

type DailyBucket = { day: string; count: number };

async function getViewsPerListing(userId: string): Promise<ListingViewRow[]> {
  try {
    const supabase = await createClient();
    // Aggregate listing_views grouped by listing_id, joined to listing titles
    const { data, error } = await supabase
      .from("listing_views")
      .select(
        `
        listing_id,
        listings!inner(title_en, owner_id)
      `,
      )
      .eq("listings.owner_id", userId);

    if (error || !data) return [];

    // Group by listing_id in JS
    const counts = new Map<string, { title_en: string; count: number }>();
    for (const row of data as unknown as Array<{
      listing_id: string;
      listings: { title_en: string; owner_id: string } | null;
    }>) {
      const titleEn = row.listings?.title_en ?? row.listing_id;
      const existing = counts.get(row.listing_id);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(row.listing_id, { title_en: titleEn, count: 1 });
      }
    }

    return Array.from(counts.entries())
      .map(([listing_id, { title_en, count }]) => ({
        listing_id,
        title_en,
        view_count: count,
      }))
      .sort((a, b) => b.view_count - a.view_count);
  } catch {
    return [];
  }
}

async function getInquiriesLast30Days(userId: string): Promise<DailyBucket[]> {
  try {
    const supabase = await createClient();
    const since = new Date();
    since.setDate(since.getDate() - 29);
    const sinceIso = since.toISOString().slice(0, 10);

    const { data, error } = await supabase
      .from("inquiries")
      .select("created_at, listings!inner(owner_id)")
      .eq("listings.owner_id", userId)
      .gte("created_at", sinceIso);

    if (error || !data) return [];

    // Build 30-day buckets
    const bucketMap = new Map<string, number>();
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      bucketMap.set(d.toISOString().slice(0, 10), 0);
    }
    for (const row of data as Array<{ created_at: string }>) {
      const day = row.created_at.slice(0, 10);
      if (bucketMap.has(day)) {
        bucketMap.set(day, (bucketMap.get(day) ?? 0) + 1);
      }
    }

    return Array.from(bucketMap.entries()).map(([day, count]) => ({
      day,
      count,
    }));
  } catch {
    return [];
  }
}

// ── Page ────────────────────────────────────────────────────────────────────

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const td = await getTranslations("dashboard");

  // Auth: layout guards, but we need userId for queries
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Real data — falls back gracefully to empty arrays / mock
  const [realViewsPerListing, realInquiryBuckets] = await Promise.all([
    user ? getViewsPerListing(user.id) : Promise.resolve([]),
    user ? getInquiriesLast30Days(user.id) : Promise.resolve([]),
  ]);

  // Fallback mock data
  const mockStats = getMockStats();
  const mockInquiries = getMockInquiries();

  // ── Views per listing — real or mock ───────────────────────────────────
  const viewsPerListing: ListingViewRow[] =
    realViewsPerListing.length > 0
      ? realViewsPerListing
      : sampleListings.slice(0, 4).map((l, i) => ({
          listing_id: l.id,
          title_en: locale === "ar" ? l.titleAr : l.titleEn,
          view_count: [72, 41, 18, 11][i] ?? 0,
        }));

  // ── Top 5 by views ──────────────────────────────────────────────────────
  const top5 = [...viewsPerListing]
    .sort((a, b) => b.view_count - a.view_count)
    .slice(0, 5);
  const maxViewsPerListing = Math.max(...viewsPerListing.map((r) => r.view_count), 1);

  // ── Inquiries last 30 days ─────────────────────────────────────────────
  const inquiryValues: number[] =
    realInquiryBuckets.length > 0
      ? realInquiryBuckets.map((b) => b.count)
      : mockStats.viewsLast30Days.map((v) => Math.round(v / 20)); // rough proxy

  const totalInquiriesLast30 = inquiryValues.reduce((a, b) => a + b, 0);

  // ── Total views / conversion ───────────────────────────────────────────
  const totalViews = viewsPerListing.reduce((a, b) => a + b.view_count, 0);
  const totalInquiries =
    realInquiryBuckets.length > 0
      ? totalInquiriesLast30
      : mockInquiries.length;
  const conversionRate =
    totalViews > 0 ? ((totalInquiries / totalViews) * 100).toFixed(1) : "0.0";

  // ── Views by state (mock — listing_views doesn't store state directly) ─
  const maxStateViews = Math.max(...Object.values(mockStats.viewsByState), 1);

  return (
    <div className="px-6 py-10 max-w-5xl mx-auto">
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-dk mb-2">
          {td("title")}
        </p>
        <h1 className="font-display text-4xl text-ink">{td("analytics")}</h1>
      </div>

      {/* ── Views per listing — bar chart ─────────────────────────────────── */}
      <section
        className="mb-8 glass-warm glass-highlight rounded-[var(--radius-card)] border border-white/55 p-7"
        style={{ boxShadow: "var(--shadow-glass)" }}
      >
        <h2 className="font-display text-2xl text-ink mb-6">
          {td("analytics.viewsPerListing")}
        </h2>
        <div className="flex flex-col gap-4">
          {viewsPerListing.map((row) => (
            <ListingBar
              key={row.listing_id}
              label={row.title_en}
              value={row.view_count}
              max={maxViewsPerListing}
            />
          ))}
        </div>
      </section>

      {/* ── Inquiries last 30 days — bar chart ────────────────────────────── */}
      <section
        className="mb-8 glass-warm glass-highlight rounded-[var(--radius-card)] border border-white/55 p-7"
        style={{ boxShadow: "var(--shadow-glass)" }}
      >
        <h2 className="font-display text-2xl text-ink mb-6">
          {td("analytics.inquiriesLast30")}
        </h2>
        <BarChart
          values={inquiryValues}
          height={100}
          barColor="#C8401A"
          label={td("analytics.inquiriesLast30")}
        />
        <p className="text-sm text-ink-mid mt-4">
          {totalInquiriesLast30}{" "}
          {td("analytics.inquiriesTotal")}
        </p>
      </section>

      {/* ── Conversion rate + top 5 performers ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Conversion rate */}
        <section
          className="glass-warm glass-highlight rounded-[var(--radius-card)] border border-white/55 p-7"
          style={{ boxShadow: "var(--shadow-glass)" }}
        >
          <h2 className="font-display text-xl text-ink mb-5">
            {td("analytics.conversionRate")}
          </h2>
          <p className="font-display text-6xl text-gold mb-2">{conversionRate}%</p>
          <p className="text-sm text-ink-mid">
            {totalInquiries} {td("analytics.inquiriesLabel")} / {totalViews}{" "}
            {td("analytics.viewsLabel")}
          </p>
        </section>

        {/* Top 5 by views */}
        <section
          className="glass-warm glass-highlight rounded-[var(--radius-card)] border border-white/55 p-7"
          style={{ boxShadow: "var(--shadow-glass)" }}
        >
          <h2 className="font-display text-xl text-ink mb-5">
            {td("analytics.topPerformers")}
          </h2>
          <ol className="flex flex-col gap-4">
            {top5.map((row, i) => (
              <li key={row.listing_id} className="flex items-start gap-4">
                <span className="font-display text-3xl text-gold shrink-0 leading-none mt-0.5 opacity-60">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink line-clamp-2">
                    {row.title_en}
                  </p>
                  <p className="text-xs text-ink-mid mt-0.5">
                    {row.view_count} {td("analytics.viewsLabel")}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* ── Views by state (mock-sourced; state not stored on listing_views yet) */}
      <section
        className="glass-warm glass-highlight rounded-[var(--radius-card)] border border-white/55 p-7"
        style={{ boxShadow: "var(--shadow-glass)" }}
      >
        <h2 className="font-display text-2xl text-ink mb-8">
          {td("analytics.viewsByState")}
        </h2>
        <div className="flex flex-col gap-4">
          {SUDAN_STATES.map((state) => (
            <HorizontalBar
              key={state}
              label={t(`states.${state}`)}
              value={mockStats.viewsByState[state] ?? 0}
              max={maxStateViews}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
