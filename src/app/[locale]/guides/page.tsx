import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SectionHeader from "@/components/section-header";
import GlassPanel from "@/components/glass-panel";
import WaveDivider from "@/components/wave-divider";
import { guides } from "@/lib/guides";
import { MapPin, ArrowRight, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sukansd.com").replace(/\/$/, "");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  const title = isAr ? "أدلة الأحياء · سوكان" : "Neighborhood guides · Sukan";
  const description = isAr
    ? "أدلة ميدانية صادقة عن أحياء السودان — الإيجارات والكهرباء والمياه والحياة اليومية في الأماكن الأكثر بحثاً"
    : "Honest, on-the-ground guides to Sudanese neighborhoods — rents, power, water, and daily life in the most searched areas";
  const ogImage = guides[0]?.heroImage;
  const canonicalUrl = `${SITE_URL}/${locale}/guides`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/guides`,
        ar: `${SITE_URL}/ar/guides`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      locale: isAr ? "ar_SA" : "en_US",
      ...(ogImage
        ? { images: [{ url: ogImage, width: 1600, alt: isAr ? "أدلة الأحياء" : "Neighborhood guides" }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

const RELIABILITY_COLOR: Record<string, string> = {
  Excellent: "text-emerald-700 bg-emerald-50 border-emerald-200",
  Good: "text-green-700 bg-green-50 border-green-200",
  Variable: "text-amber-700 bg-amber-50 border-amber-200",
  Limited: "text-red-700 bg-red-50 border-red-200",
};

export default async function GuidesIndexPage({
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
            className="pointer-events-none absolute -top-40 end-0 h-[560px] w-[560px] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at 70% 30%, rgba(200,135,58,0.13) 0%, transparent 70%)",
            }}
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow={isAr ? "أدلة الأحياء" : "Neighborhood Guides"}
              title={
                isAr
                  ? "تعرّف على كل حي قبل أن تنتقل إليه"
                  : "Know a neighbourhood before you move"
              }
              subtitle={
                isAr
                  ? "أدلة معمّقة تغطي الإيجارات والكهرباء والمياه والحياة اليومية في أهم الأحياء السودانية"
                  : "In-depth guides covering rents, power, water, and daily life in Sudan's most searched areas"
              }
              align="center"
            />
          </div>
        </section>

        <WaveDivider intensity="subtle" />

        {/* ── Guide grid ── */}
        <section className="bg-cream-deep py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {guides.map((guide) => {
                const name = isAr ? guide.nameAr : guide.nameEn;
                const intro = isAr ? guide.introAr : guide.introEn;
                // Two-line snippet: cap at ~160 chars
                const snippet =
                  intro.length > 160 ? intro.slice(0, 160).trimEnd() + "…" : intro;

                return (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 rounded-[var(--radius-glass)]"
                  >
                    <GlassPanel
                      variant="warm"
                      radius="glass"
                      shadow
                      className="smooth lift flex flex-col overflow-hidden h-full"
                    >
                      {/* Hero image */}
                      <div className="relative h-48 w-full overflow-hidden">
                        <img
                          src={guide.heroImage}
                          alt={name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* State badge */}
                        <span className="absolute bottom-3 start-3 inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-ink/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-cream backdrop-blur-sm">
                          <MapPin size={10} aria-hidden />
                          {guide.state.replace(/_/g, " ")}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col gap-3 p-5">
                        <h2 className="font-display text-xl leading-tight text-ink group-hover:text-terracotta transition-colors">
                          {name}
                        </h2>
                        {isAr && (
                          <p className="text-xs text-gold-dk font-semibold">
                            {guide.nameEn}
                          </p>
                        )}
                        <p className="flex-1 text-sm leading-relaxed text-ink-soft line-clamp-3">
                          {snippet}
                        </p>

                        {/* Vitals row */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <span
                            className={`inline-flex items-center rounded-[var(--radius-pill)] border px-2 py-0.5 text-[10px] font-medium ${RELIABILITY_COLOR[guide.vitals.powerReliability]}`}
                          >
                            ⚡ {isAr ? "كهرباء" : "Power"}{" "}
                            {guide.vitals.powerReliability}
                          </span>
                          <span
                            className={`inline-flex items-center rounded-[var(--radius-pill)] border px-2 py-0.5 text-[10px] font-medium ${RELIABILITY_COLOR[guide.vitals.waterReliability]}`}
                          >
                            💧 {isAr ? "مياه" : "Water"}{" "}
                            {guide.vitals.waterReliability}
                          </span>
                          {guide.vitals.diasporaFavored && (
                            <span className="inline-flex items-center rounded-[var(--radius-pill)] border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10px] font-medium text-gold-dk">
                              ✈ {isAr ? "مفضّل للمغتربين" : "Diaspora pick"}
                            </span>
                          )}
                        </div>

                        {/* CTA — arrow points forward in reading direction */}
                        <p className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-terracotta group-hover:gap-2 transition-all">
                          {isAr ? "اقرأ الدليل" : "Read guide"}
                          {isAr ? <ArrowLeft size={14} aria-hidden /> : <ArrowRight size={14} aria-hidden />}
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

        {/* ── Footer note ── */}
        <section className="bg-cream py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <p className="text-sm leading-relaxed text-ink-soft">
              {isAr
                ? "هذه الأدلة تعكس معرفة ميدانية بتاريخ الربع الأول من ٢٠٢٦. ظروف الكهرباء والمياه تتغير — نحدّث الأدلة فصلياً."
                : "These guides reflect on-the-ground knowledge as of Q1 2026. Power and water conditions change — we update guides quarterly."}
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
