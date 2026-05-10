import { setRequestLocale, getTranslations } from "next-intl/server";
import { sampleListings } from "@/lib/sample-listings";
import { getMockStats } from "../_data/mock-stats";
import { getMockInquiries } from "../_data/mock-inquiries";
import { SUDAN_STATES } from "@/lib/sample-listings";

// ── Inline SVG bar chart (no deps) ──────────────────────────────────────────

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
      <p className="text-[10px] uppercase tracking-widest text-gold-dk font-semibold mb-4">{label}</p>
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
                <title>Day {i + 1}: {v} views</title>
              </rect>
            );
          })}
        </svg>
      </div>
      {/* X-axis labels: Day 1 / Day 15 / Day 30 */}
      <div className="flex justify-between text-xs text-ink-mid mt-1 px-1">
        <span>Day 1</span>
        <span>Day 15</span>
        <span>Day 30</span>
      </div>
    </div>
  );
}

// ── Horizontal bar for state views ─────────────────────────────────────────

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

  const stats = getMockStats();
  const inquiries = getMockInquiries();

  // Top 3 by views
  const viewsByListingId: Record<string, number> = {
    "khartoum-2-3br-apt": 72,
    "omdurman-villa-thawra": 41,
    "port-sudan-shop": 18,
    "river-nile-land-shendi": 11,
  };
  const topThree = sampleListings
    .slice(0, 4)
    .sort((a, b) => (viewsByListingId[b.id] ?? 0) - (viewsByListingId[a.id] ?? 0))
    .slice(0, 3);

  const totalViews = Object.values(viewsByListingId).reduce((a, b) => a + b, 0);
  const conversionRate =
    totalViews > 0
      ? ((inquiries.length / totalViews) * 100).toFixed(1)
      : "0.0";

  const maxStateViews = Math.max(...Object.values(stats.viewsByState), 1);

  return (
    <div className="px-6 py-10 max-w-5xl mx-auto">
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-dk mb-2">
          {td("title")}
        </p>
        <h1 className="font-display text-4xl text-ink">{td("analytics")}</h1>
      </div>

      {/* ── Views last 30 days ──────────────────────────────────────────────── */}
      <section
        className="mb-12 glass-warm glass-highlight rounded-[var(--radius-card)] border border-white/55 p-7"
        style={{ boxShadow: "var(--shadow-glass)" }}
      >
        <h2 className="font-display text-2xl text-ink mb-6">
          {td("analytics.viewsLast30")}
        </h2>
        <BarChart
          values={stats.viewsLast30Days}
          height={120}
          barColor="#C8873A"
          label={td("analytics.viewsLast30")}
        />
      </section>

      {/* ── Conversion rate + top performers ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
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
            {inquiries.length} inquiries / {totalViews} views
          </p>
        </section>

        {/* Top performers */}
        <section
          className="glass-warm glass-highlight rounded-[var(--radius-card)] border border-white/55 p-7"
          style={{ boxShadow: "var(--shadow-glass)" }}
        >
          <h2 className="font-display text-xl text-ink mb-5">
            {td("analytics.topPerformers")}
          </h2>
          <ol className="flex flex-col gap-4">
            {topThree.map((listing, i) => (
              <li key={listing.id} className="flex items-start gap-4">
                <span className="font-display text-3xl text-gold shrink-0 leading-none mt-0.5 opacity-60">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink line-clamp-2">
                    {locale === "ar" ? listing.titleAr : listing.titleEn}
                  </p>
                  <p className="text-xs text-ink-mid mt-0.5">
                    {viewsByListingId[listing.id] ?? 0} views
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* ── Views by state ──────────────────────────────────────────────────── */}
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
              value={stats.viewsByState[state] ?? 0}
              max={maxStateViews}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
