import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SectionHeader from "@/components/section-header";
import GlassPanel from "@/components/glass-panel";
import WaveDivider from "@/components/wave-divider";
import { insights } from "@/lib/insights";
import { Calendar, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Market Intelligence",
  description:
    "Property market analysis, diaspora guidance, and neighbourhood comparisons for Sudan — written for renters, buyers, and those planning to return.",
};

const CATEGORY_STYLE: Record<string, string> = {
  Market:
    "border-terracotta/30 bg-terracotta/10 text-terracotta",
  Diaspora:
    "border-gold/40 bg-gold/10 text-gold-dk",
  Neighborhoods:
    "border-green-500/30 bg-green-50 text-green-700",
  Policy:
    "border-blue-400/30 bg-blue-50 text-blue-700",
};

const CATEGORY_AR: Record<string, string> = {
  Market: "السوق",
  Diaspora: "المغتربون",
  Neighborhoods: "الأحياء",
  Policy: "السياسات",
};

function formatDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale === "ar" ? "ar-SD" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function InsightsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isAr = locale === "ar";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-cream">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-cream py-24 lg:py-32">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 start-0 h-[560px] w-[560px] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at 30% 30%, rgba(200,64,26,0.09) 0%, transparent 70%)",
            }}
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow={isAr ? "تحليل السوق" : "Market intelligence"}
              title={
                isAr
                  ? "تحليل ومعرفة لا تجدها في أي مكان آخر"
                  : "Analysis you won't find anywhere else"
              }
              subtitle={
                isAr
                  ? "تقارير السوق وإرشادات المغتربين ومقارنات الأحياء — مكتوبة بصدق لمن يخطط للعودة أو الاستئجار أو الاستثمار"
                  : "Market reports, diaspora guidance, and neighbourhood comparisons — written honestly for those planning to return, rent, or invest"
              }
              align="center"
            />
          </div>
        </section>

        <WaveDivider intensity="subtle" />

        {/* ── Insights grid ── */}
        <section className="bg-cream-deep py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {insights.map((insight, i) => {
                const title = isAr ? insight.titleAr : insight.titleEn;
                const excerpt = isAr ? insight.excerptAr : insight.excerptEn;
                const author = isAr ? insight.authorAr : insight.authorEn;
                const catStyle =
                  CATEGORY_STYLE[insight.category] ||
                  "border-sand-dk bg-sand text-ink-mid";
                const catLabel = isAr
                  ? CATEGORY_AR[insight.category]
                  : insight.category;

                // Featured: first card spans two columns on large screens
                const isFeatured = i === 0;

                return (
                  <Link
                    key={insight.slug}
                    href={`/insights/${insight.slug}`}
                    className={`group block focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 rounded-[var(--radius-glass)] ${isFeatured ? "md:col-span-2" : ""}`}
                  >
                    <GlassPanel
                      variant="warm"
                      radius="glass"
                      shadow
                      className="smooth lift flex flex-col overflow-hidden h-full"
                    >
                      {/* Hero image */}
                      <div
                        className={`relative w-full overflow-hidden ${isFeatured ? "h-60 md:h-72" : "h-44"}`}
                      >
                        <img
                          src={insight.heroImage}
                          alt={title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading={i === 0 ? "eager" : "lazy"}
                        />
                        <div
                          aria-hidden
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(to top, rgba(18,16,12,0.55) 0%, transparent 70%)",
                          }}
                        />
                        {/* Category badge over image */}
                        <span
                          className={`absolute bottom-3 start-3 inline-flex items-center rounded-[var(--radius-pill)] border px-3 py-1 text-[10px] font-semibold uppercase tracking-widest backdrop-blur-sm ${catStyle}`}
                        >
                          {catLabel}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col gap-3 p-6">
                        <h2
                          className={`font-display leading-snug tracking-tight text-ink group-hover:text-terracotta transition-colors ${isFeatured ? "text-2xl md:text-3xl" : "text-xl"}`}
                        >
                          {title}
                        </h2>
                        <p className="flex-1 text-sm leading-relaxed text-ink-mid line-clamp-3">
                          {excerpt}
                        </p>

                        {/* Meta row */}
                        <div className="flex items-center justify-between pt-2 border-t border-sand-dk">
                          <span className="flex items-center gap-1.5 text-xs text-ink-soft">
                            <Calendar size={11} aria-hidden />
                            {formatDate(insight.publishedAt, locale)}
                          </span>
                          <span className="text-xs text-ink-soft">{author}</span>
                        </div>

                        <p className="inline-flex items-center gap-1 text-sm font-medium text-terracotta group-hover:gap-2 transition-all">
                          {isAr ? "اقرأ التحليل" : "Read analysis"}
                          <ArrowRight size={14} aria-hidden />
                        </p>
                      </div>
                    </GlassPanel>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <WaveDivider flip intensity="subtle" />

        {/* ── Closing note ── */}
        <section className="bg-cream py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <p className="text-sm leading-relaxed text-ink-mid">
              {isAr
                ? "تصدر تقارير سُكَن بناءً على بيانات السوق وخبرة ميدانية. هذه آراء تحريرية لا استشارات مالية أو قانونية."
                : "Sukan insights are based on market data and on-the-ground experience. These are editorial opinions, not financial or legal advice."}
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
