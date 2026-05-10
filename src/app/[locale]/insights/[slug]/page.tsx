import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import GlassPanel from "@/components/glass-panel";
import WaveDivider from "@/components/wave-divider";
import { insights, getInsightBySlug } from "@/lib/insights";
import { Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export function generateStaticParams() {
  return insights.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const insight = getInsightBySlug(slug);
  if (!insight) return {};
  const isAr = locale === "ar";
  return {
    title: isAr ? insight.titleAr : insight.titleEn,
    description: isAr
      ? insight.excerptAr
      : insight.excerptEn,
    openGraph: {
      images: [{ url: insight.heroImage }],
    },
  };
}

const CATEGORY_STYLE: Record<string, string> = {
  Market: "border-terracotta/30 bg-terracotta/10 text-terracotta",
  Diaspora: "border-gold/40 bg-gold/10 text-gold-dk",
  Neighborhoods: "border-green-500/30 bg-green-50 text-green-700",
  Policy: "border-blue-400/30 bg-blue-50 text-blue-700",
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

/**
 * Render the article body: handle markdown-style **bold** and line breaks.
 * No dependency on @tailwindcss/typography — manual prose styling.
 */
function renderBody(text: string): React.ReactNode[] {
  return text.split("\n\n").map((para, i) => {
    const trimmed = para.trim();
    if (!trimmed) return null;

    // Heading: starts with **text** on its own line
    if (trimmed.startsWith("**") && trimmed.endsWith("**") && !trimmed.slice(2, -2).includes("\n")) {
      const heading = trimmed.slice(2, -2);
      return (
        <h3
          key={i}
          className="mt-10 mb-4 font-display text-2xl leading-tight tracking-tight text-ink"
        >
          {heading}
        </h3>
      );
    }

    // Paragraph with inline **bold** segments
    const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
    const content = parts.map((part, j) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={j} className="font-semibold text-ink">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    return (
      <p key={i} className="text-base leading-[1.9] text-ink-mid">
        {content}
      </p>
    );
  }).filter(Boolean) as React.ReactNode[];
}

export default async function InsightDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const insight = getInsightBySlug(slug);
  if (!insight) notFound();

  const isAr = locale === "ar";

  const title = isAr ? insight.titleAr : insight.titleEn;
  const author = isAr ? insight.authorAr : insight.authorEn;
  const body = isAr ? insight.bodyAr : insight.bodyEn;
  const catStyle =
    CATEGORY_STYLE[insight.category] || "border-sand-dk bg-sand text-ink-mid";
  const catLabel = isAr ? CATEGORY_AR[insight.category] : insight.category;

  // Related: other insights (up to 2)
  const related = insights.filter((i) => i.slug !== slug).slice(0, 2);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-cream">
        {/* ── Full-width hero ── */}
        <section className="relative h-[380px] w-full overflow-hidden md:h-[480px]">
          <img
            src={insight.heroImage}
            alt={title}
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(18,16,12,0.85) 0%, rgba(18,16,12,0.35) 60%, transparent 100%)",
            }}
          />

          {/* Back link */}
          <div className="absolute start-4 top-6 sm:start-8">
            <Link
              href="/insights"
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-ink/50 px-4 py-2 text-xs font-medium text-cream backdrop-blur-sm hover:bg-ink/70 transition-colors"
            >
              <ArrowLeft size={12} aria-hidden />
              {isAr ? "كل التحليلات" : "All insights"}
            </Link>
          </div>

          {/* Title block */}
          <div className="absolute bottom-0 start-0 end-0 px-4 pb-10 sm:px-8 lg:px-16">
            <div className="mx-auto max-w-3xl">
              <span
                className={`mb-4 inline-flex items-center rounded-[var(--radius-pill)] border px-3 py-1 text-[10px] font-semibold uppercase tracking-widest backdrop-blur-sm ${catStyle}`}
              >
                {catLabel}
              </span>
              <h1 className="font-display text-3xl leading-[1.1] tracking-tight text-cream md:text-4xl lg:text-5xl">
                {title}
              </h1>
            </div>
          </div>
        </section>

        {/* ── Byline ── */}
        <section className="bg-ink py-5">
          <div className="mx-auto max-w-3xl px-4 sm:px-8 lg:px-16">
            <div className="flex flex-wrap items-center gap-4 text-xs text-cream/60">
              <span className="flex items-center gap-1.5">
                <Calendar size={11} aria-hidden />
                {formatDate(insight.publishedAt, locale)}
              </span>
              <span>{isAr ? "بقلم" : "By"} {author}</span>
            </div>
          </div>
        </section>

        <WaveDivider intensity="subtle" color="mute" />

        {/* ── Article body ── */}
        <article className="bg-cream py-16">
          <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-8 lg:px-16">
            {renderBody(body)}
          </div>
        </article>

        <WaveDivider intensity="subtle" />

        {/* ── Related insights ── */}
        {related.length > 0 && (
          <section className="bg-cream-deep py-16">
            <div className="mx-auto max-w-3xl px-4 sm:px-8 lg:px-16">
              <h2 className="mb-8 font-display text-2xl tracking-tight text-ink">
                {isAr ? "تحليلات ذات صلة" : "Related insights"}
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {related.map((r) => {
                  const rTitle = isAr ? r.titleAr : r.titleEn;
                  const rExcerpt = isAr ? r.excerptAr : r.excerptEn;
                  return (
                    <Link
                      key={r.slug}
                      href={`/insights/${r.slug}`}
                      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 rounded-[var(--radius-glass)]"
                    >
                      <GlassPanel
                        variant="warm"
                        radius="glass"
                        shadow
                        className="smooth lift flex flex-col gap-3 p-5 h-full"
                      >
                        <span
                          className={`inline-flex w-fit items-center rounded-[var(--radius-pill)] border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${CATEGORY_STYLE[r.category]}`}
                        >
                          {isAr ? CATEGORY_AR[r.category] : r.category}
                        </span>
                        <h3 className="font-display text-lg leading-snug text-ink group-hover:text-terracotta transition-colors">
                          {rTitle}
                        </h3>
                        <p className="flex-1 text-sm leading-relaxed text-ink-mid line-clamp-2">
                          {rExcerpt}
                        </p>
                        <p className="inline-flex items-center gap-1 text-xs font-medium text-terracotta group-hover:gap-2 transition-all">
                          {isAr ? "اقرأ" : "Read"}
                          <ArrowRight size={12} aria-hidden />
                        </p>
                      </GlassPanel>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <WaveDivider flip intensity="subtle" />

        {/* ── CTA: guides ── */}
        <section className="bg-cream py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-dk">
              {isAr ? "الخطوة التالية" : "Next step"}
            </p>
            <h2 className="mb-4 font-display text-2xl tracking-tight text-ink md:text-3xl">
              {isAr
                ? "هل أنت مستعد لاستكشاف حي؟"
                : "Ready to explore a neighbourhood?"}
            </h2>
            <Link
              href="/guides"
              className="smooth inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-gold/40 bg-white/45 px-7 py-3 text-sm font-semibold text-gold-dk backdrop-blur-md hover:border-gold/70 hover:bg-gold/10 transition-colors"
            >
              {isAr ? "اقرأ أدلة الأحياء" : "Read neighbourhood guides"}
              <ArrowRight size={14} aria-hidden />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
