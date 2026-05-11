import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import GlassPanel from "@/components/glass-panel";
import SectionHeader from "@/components/section-header";
import WaveDivider from "@/components/wave-divider";
import Pill from "@/components/pill";
import ListingCard from "@/components/listing-card";
import CurrencySnapshot from "@/components/currency-snapshot";
import DiasporaTrustStrip from "@/components/diaspora-trust-strip";
import { Camera, Lock, FileCheck, Video } from "lucide-react";
import { sampleListings } from "@/lib/sample-listings";
import { guides } from "@/lib/guides";

// ── Data helpers ─────────────────────────────────────────────────────────────

/** States that have at least one diaspora-favored guide */
const DIASPORA_STATES = new Set(
  guides
    .filter((g) => g.vitals.diasporaFavored)
    .map((g) => g.state),
);

/** Up to 3 listings whose state is diaspora-favored */
const diasporaListings = sampleListings
  .filter((l) => DIASPORA_STATES.has(l.state as string))
  .slice(0, 3);

// ── Constants ────────────────────────────────────────────────────────────────

const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sukansd.com").replace(/\/$/, "");

// ── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  const title = isAr
    ? "عقارات السودان للمغتربين · سُكَن"
    : "Sudan Property for the Diaspora · Sukan";
  const description = isAr
    ? "اشتر أو استأجر عقاراً في السودان من الخارج — خدمة موثوقة للمغتربين السودانيين في جميع أنحاء العالم"
    : "Buy or rent property in Sudan from abroad — trusted service for the Sudanese diaspora worldwide";
  const canonicalUrl = `${SITE_URL}/${locale}/diaspora`;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/diaspora`,
        ar: `${SITE_URL}/ar/diaspora`,
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonicalUrl,
      siteName: "Sukan — سُكَن",
      locale: isAr ? "ar_SD" : "en_US",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function DiasporaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("diasporaPage2");

  return (
    <>
      {/* ─── Section 1: Hero ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-cream py-24 lg:py-32">
        {/* Gold halo — start side */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 end-0 h-[640px] w-[640px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at 70% 30%, rgba(200,135,58,0.16) 0%, transparent 70%)",
          }}
        />
        {/* Terracotta halo — start side */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 start-0 h-[400px] w-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at 30% 80%, rgba(200,64,26,0.07) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Eyebrow */}
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold-dk">
            {t("eyebrowHero")}
          </p>

          {/* Headline */}
          <h1 className="font-display mb-6 text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl lg:text-7xl">
            {t("heroTitle")}
          </h1>

          {/* Audience sub-line */}
          <p className="mb-8 max-w-2xl text-lg leading-[1.8] text-ink-mid">
            {t("heroSubtitle")}
          </p>

          {/* Currency accent inline */}
          <CurrencySnapshot size="sm" />
        </div>
      </section>

      <WaveDivider color="gold" intensity="subtle" />

      {/* ─── Section 2: Trust strip ─────────────────────────────────────── */}
      <section className="bg-cream-deep py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow={t("trustEyebrow")}
            title={t("trustTitle")}
            subtitle={t("trustSubtitle")}
            align="center"
          />
          <DiasporaTrustStrip locale={locale} />
        </div>
      </section>

      <WaveDivider color="gold" intensity="subtle" flip />

      {/* ─── Section 3: Currency awareness ──────────────────────────────── */}
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow={t("currencyEyebrow")}
            title={t("currencyTitle")}
          />

          {/* Large currency card */}
          <CurrencySnapshot size="lg" />

          {/* Explanation */}
          <GlassPanel
            variant="warm"
            radius="glass"
            shadow
            className="mt-6 p-7 md:p-9"
          >
            <p className="text-base leading-[1.9] text-ink-mid">
              {t("currencyExplanation")}
            </p>
          </GlassPanel>
        </div>
      </section>

      <WaveDivider color="gold" intensity="subtle" />

      {/* ─── Section 4: Diaspora-favored listings ───────────────────────── */}
      <section className="bg-cream-deep py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow={t("listingsEyebrow")}
            title={t("listingsTitle")}
            subtitle={t("listingsSubtitle")}
            align="start"
            viewAll={{
              href: "/listings",
              label: t("browseCta"),
            }}
          />

          {diasporaListings.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {diasporaListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-mid">
              {t("noListings")}
            </p>
          )}
        </div>
      </section>

      <WaveDivider color="gold" intensity="subtle" flip />

      {/* ─── Section 5: Honest "Coming Q3 2026" roadmap ──────────────────── */}
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow={t("roadmapEyebrow")}
            title={t("roadmapTitle")}
            subtitle={t("roadmapSubtitle")}
          />

          <GlassPanel
            variant="warm"
            radius="glass"
            shadow="lg"
            className="p-8 md:p-10"
          >
            <ul className="flex flex-col divide-y divide-sand-dk/60">
              {/* Item 1 */}
              <li className="flex items-start gap-5 py-7 first:pt-0 last:pb-0">
                <div
                  className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "rgba(200,135,58,0.10)" }}
                >
                  <Camera size={20} className="text-gold-dk" strokeWidth={1.5} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-lg font-semibold text-ink">
                      {t("roadmapVideoTitle")}
                    </h3>
                    <Pill variant="muted" size="sm">
                      {t("comingQ3")}
                    </Pill>
                  </div>
                  <p className="text-sm leading-relaxed text-ink-mid">
                    {t("roadmapVideoBody")}
                  </p>
                </div>
              </li>

              {/* Item 2 */}
              <li className="flex items-start gap-5 py-7 first:pt-0 last:pb-0">
                <div
                  className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "rgba(200,135,58,0.10)" }}
                >
                  <Lock size={20} className="text-gold-dk" strokeWidth={1.5} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-lg font-semibold text-ink">
                      {t("roadmapEscrowTitle")}
                    </h3>
                    <Pill variant="muted" size="sm">
                      {t("comingQ3")}
                    </Pill>
                  </div>
                  <p className="text-sm leading-relaxed text-ink-mid">
                    {t("roadmapEscrowBody")}
                  </p>
                </div>
              </li>

              {/* Item 3 */}
              <li className="flex items-start gap-5 py-7 first:pt-0 last:pb-0">
                <div
                  className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "rgba(200,135,58,0.10)" }}
                >
                  <FileCheck size={20} className="text-gold-dk" strokeWidth={1.5} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-lg font-semibold text-ink">
                      {t("roadmapDeedTitle")}
                    </h3>
                    <Pill variant="muted" size="sm">
                      {t("comingQ3")}
                    </Pill>
                  </div>
                  <p className="text-sm leading-relaxed text-ink-mid">
                    {t("roadmapDeedBody")}
                  </p>
                </div>
              </li>

              {/* Item 4 */}
              <li className="flex items-start gap-5 py-7 first:pt-0 last:pb-0">
                <div
                  className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "rgba(200,135,58,0.10)" }}
                >
                  <Video size={20} className="text-gold-dk" strokeWidth={1.5} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-lg font-semibold text-ink">
                      {t("roadmapLiveCallTitle")}
                    </h3>
                    <Pill variant="muted" size="sm">
                      {t("comingQ3")}
                    </Pill>
                  </div>
                  <p className="text-sm leading-relaxed text-ink-mid">
                    {t("roadmapLiveCallBody")}
                  </p>
                </div>
              </li>
            </ul>
          </GlassPanel>
        </div>
      </section>

      <WaveDivider color="gold" intensity="subtle" />

      {/* ─── Section 6: CTA row ──────────────────────────────────────────── */}
      <section className="bg-cream-deep py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="glass-warm glass-highlight relative mx-auto flex max-w-2xl flex-col items-center gap-6 overflow-hidden rounded-[var(--radius-glass-lg)] border border-white/60 px-6 py-16 text-center sm:px-12"
            style={{ boxShadow: "var(--shadow-warm-lg)" }}
          >
            {/* Gold halo */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[360px] w-[360px] -translate-x-1/2 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(224,168,87,0.28), transparent 70%)",
              }}
            />

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dk">
              {t("ctaEyebrow")}
            </p>

            <h2 className="font-display text-3xl leading-tight text-ink md:text-4xl">
              {t("ctaTitle")}
            </h2>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:gap-4">
              {/* Primary — gold gradient */}
              <Link
                href="/listings"
                className="smooth inline-flex items-center justify-center rounded-[var(--radius-pill)] px-8 py-3.5 text-sm font-semibold text-earth hover:brightness-[1.05]"
                style={{
                  background: "linear-gradient(135deg, #c8873a 0%, #e0a857 100%)",
                  boxShadow:
                    "0 8px 24px rgba(200,135,58,0.32), inset 0 1px 0 rgba(255,255,255,0.35)",
                }}
              >
                {t("browseCta")}
              </Link>

              {/* Secondary — glass outline */}
              <Link
                href="/agents"
                className="smooth inline-flex items-center justify-center rounded-[var(--radius-pill)] border border-gold/40 bg-white/45 px-8 py-3.5 text-sm font-semibold text-gold-dk backdrop-blur-md hover:border-gold/70 hover:bg-gold/10"
              >
                {t("talkToAgent")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
