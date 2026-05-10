import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import GlassPanel from "@/components/glass-panel";
import WaveDivider from "@/components/wave-divider";
import { guides, getGuideBySlug } from "@/lib/guides";
import { MapPin, Zap, Droplets, Plane, ArrowLeft, Search } from "lucide-react";
import type { Metadata } from "next";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};
  const isAr = locale === "ar";
  return {
    title: isAr ? guide.nameAr : guide.nameEn,
    description: isAr
      ? guide.introAr.slice(0, 155)
      : guide.introEn.slice(0, 155),
  };
}

const RELIABILITY_BADGE: Record<
  string,
  { label: string; labelAr: string; color: string }
> = {
  Excellent: {
    label: "Excellent",
    labelAr: "ممتاز",
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  Good: {
    label: "Good",
    labelAr: "جيد",
    color: "text-green-700 bg-green-50 border-green-200",
  },
  Variable: {
    label: "Variable",
    labelAr: "متقلب",
    color: "text-amber-700 bg-amber-50 border-amber-200",
  },
  Limited: {
    label: "Limited",
    labelAr: "محدود",
    color: "text-red-700 bg-red-50 border-red-200",
  },
};

const SECTION_VARIANTS = ["cream", "warm", "sand"] as const;

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const isAr = locale === "ar";

  const name = isAr ? guide.nameAr : guide.nameEn;
  const altName = isAr ? guide.nameEn : guide.nameAr;
  const intro = isAr ? guide.introAr : guide.introEn;
  const typicalRent = isAr
    ? guide.vitals.typicalRentAr
    : guide.vitals.typicalRentEn;

  const power = RELIABILITY_BADGE[guide.vitals.powerReliability];
  const water = RELIABILITY_BADGE[guide.vitals.waterReliability];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-cream">
        {/* ── Full-width hero banner ── */}
        <section className="relative h-[420px] w-full overflow-hidden md:h-[520px]">
          <img
            src={guide.heroImage}
            alt={name}
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
          {/* Dark gradient overlay for legibility */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(18,16,12,0.80) 0%, rgba(18,16,12,0.30) 55%, transparent 100%)",
            }}
          />

          {/* Back link */}
          <div className="absolute start-4 top-6 sm:start-8">
            <Link
              href="/guides"
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-ink/50 px-4 py-2 text-xs font-medium text-cream backdrop-blur-sm hover:bg-ink/70 transition-colors"
            >
              <ArrowLeft size={12} aria-hidden />
              {isAr ? "كل الأدلة" : "All guides"}
            </Link>
          </div>

          {/* Title block */}
          <div className="absolute bottom-0 start-0 end-0 px-4 pb-10 sm:px-8 lg:px-16">
            <div className="mx-auto max-w-5xl">
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-gold/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-cream backdrop-blur-sm">
                <MapPin size={10} aria-hidden />
                {guide.state.replace(/_/g, " ")}
              </span>
              <h1 className="font-display text-4xl leading-[1.05] tracking-tight text-cream md:text-5xl lg:text-6xl">
                {name}
              </h1>
              <p className="mt-2 text-lg text-cream/70 font-light">{altName}</p>
            </div>
          </div>
        </section>

        {/* ── Vitals panel ── */}
        <section className="bg-ink py-10">
          <div className="mx-auto max-w-5xl px-4 sm:px-8 lg:px-16">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {/* Typical rent */}
              <GlassPanel
                variant="deep"
                radius="glass"
                shadow={false}
                className="flex flex-col gap-1.5 p-5"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cream/50">
                  {isAr ? "الإيجار النموذجي" : "Typical rent"}
                </p>
                <p className="font-display text-lg leading-tight text-cream">
                  {typicalRent}
                </p>
              </GlassPanel>

              {/* Power */}
              <GlassPanel
                variant="deep"
                radius="glass"
                shadow={false}
                className="flex flex-col gap-1.5 p-5"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cream/50">
                  {isAr ? "الكهرباء" : "Power"}
                </p>
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-gold" aria-hidden />
                  <span
                    className={`inline-flex items-center rounded-[var(--radius-pill)] border px-2 py-0.5 text-xs font-medium ${power.color}`}
                  >
                    {isAr ? power.labelAr : power.label}
                  </span>
                </div>
              </GlassPanel>

              {/* Water */}
              <GlassPanel
                variant="deep"
                radius="glass"
                shadow={false}
                className="flex flex-col gap-1.5 p-5"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cream/50">
                  {isAr ? "المياه" : "Water"}
                </p>
                <div className="flex items-center gap-2">
                  <Droplets size={14} className="text-gold" aria-hidden />
                  <span
                    className={`inline-flex items-center rounded-[var(--radius-pill)] border px-2 py-0.5 text-xs font-medium ${water.color}`}
                  >
                    {isAr ? water.labelAr : water.label}
                  </span>
                </div>
              </GlassPanel>

              {/* Diaspora */}
              <GlassPanel
                variant="deep"
                radius="glass"
                shadow={false}
                className="flex flex-col gap-1.5 p-5"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cream/50">
                  {isAr ? "المغتربون" : "Diaspora"}
                </p>
                <div className="flex items-center gap-2">
                  <Plane size={14} className="text-gold" aria-hidden />
                  <span className="text-sm text-cream">
                    {guide.vitals.diasporaFavored
                      ? isAr
                        ? "وجهة مفضّلة"
                        : "Favoured"
                      : isAr
                        ? "غير شائع"
                        : "Not typical"}
                  </span>
                </div>
              </GlassPanel>
            </div>

            {/* Airport distance line */}
            <p className="mt-4 text-center text-xs text-cream/40">
              {isAr
                ? `${guide.vitals.nearestAirportKm} كم من أقرب مطار`
                : `${guide.vitals.nearestAirportKm} km from nearest airport`}
            </p>
          </div>
        </section>

        <WaveDivider intensity="subtle" color="mute" />

        {/* ── Intro ── */}
        <section className="bg-cream py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-8">
            <p className="text-lg leading-[1.9] text-ink-mid">{intro}</p>
          </div>
        </section>

        <WaveDivider intensity="subtle" />

        {/* ── Sections — alternating glass panels ── */}
        <section className="bg-cream-deep py-16">
          <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-8">
            {guide.sections.map((section, i) => {
              const variant = SECTION_VARIANTS[i % SECTION_VARIANTS.length];
              const title = isAr ? section.titleAr : section.titleEn;
              const body = isAr ? section.bodyAr : section.bodyEn;

              return (
                <GlassPanel
                  key={i}
                  variant={variant}
                  radius="glass"
                  shadow
                  className="p-8 md:p-10"
                >
                  <h2 className="mb-5 font-display text-2xl leading-tight tracking-tight text-ink md:text-3xl">
                    {title}
                  </h2>
                  <p className="text-base leading-[1.9] text-ink-mid">{body}</p>
                </GlassPanel>
              );
            })}
          </div>
        </section>

        <WaveDivider flip intensity="subtle" />

        {/* ── CTA: browse listings ── */}
        <section className="bg-cream py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-8">
            <h2 className="mb-4 font-display text-3xl tracking-tight text-ink md:text-4xl">
              {isAr
                ? `تصفّح العقارات في ${name}`
                : `Browse listings in ${name}`}
            </h2>
            <p className="mb-8 text-base leading-relaxed text-ink-mid">
              {isAr
                ? "شاهد الشقق والمنازل والفيلات المتاحة الآن في هذا الحي"
                : "See the apartments, houses, and villas available right now in this area"}
            </p>
            <Link
              href={`/listings?state=${guide.state}`}
              className="smooth inline-flex items-center gap-2 rounded-[var(--radius-pill)] px-8 py-3.5 text-sm font-semibold text-cream hover:brightness-[1.08]"
              style={{
                background:
                  "linear-gradient(135deg, #C8401A 0%, #C8873A 100%)",
                boxShadow:
                  "0 8px 22px rgba(200,64,26,0.28), inset 0 1px 0 rgba(255,255,255,0.15)",
              }}
            >
              <Search size={16} aria-hidden />
              {isAr ? `عقارات في ${name}` : `Listings in ${name}`}
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
