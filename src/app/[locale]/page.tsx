import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import SukanMark from "@/components/sukan-mark";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ListingCard from "@/components/listing-card";
import { sampleListings } from "@/lib/sample-listings";
import HeroSearch from "@/components/hero-search";

const STATE_KEYS = [
  "khartoum",
  "al_jazirah",
  "blue_nile",
  "sennar",
  "white_nile",
  "north_kordofan",
  "south_kordofan",
  "west_kordofan",
  "north_darfur",
  "south_darfur",
  "east_darfur",
  "central_darfur",
  "west_darfur",
  "kassala",
  "red_sea",
  "gedaref",
  "river_nile",
  "northern",
] as const;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  const featuredListings = sampleListings
    .filter((l) => l.tier === "featured")
    .slice(0, 3);

  return (
    <>
      <Navbar />

      <main>
        {/* ─────────────────────────────────────────────────────────
            1. HERO
        ───────────────────────────────────────────────────────── */}
        <section className="relative bg-earth overflow-hidden">
          {/* Ambient gold haze — top-end corner */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 end-0 w-[600px] h-[600px] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at 70% 30%, rgba(200,135,58,0.18) 0%, transparent 70%)",
            }}
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            {/* Eyebrow */}
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              {t("brand.tagline")}
            </p>

            {/* Headline */}
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-tight text-parchment max-w-3xl mb-4">
              {t("hero.tenantTitle")}
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-mute-soft max-w-xl mb-12">
              {t("hero.tenantSubtitle")}
            </p>

            {/* Two-column panel row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
              {/* Left: tenant search (3/5) */}
              <div className="lg:col-span-3">
                <HeroSearch />
              </div>

              {/* Right: landlord CTA (2/5) */}
              <div className="lg:col-span-2 relative">
                <div className="bg-parchment text-earth rounded-[var(--radius-card)] p-6 overflow-hidden">
                  {/* Watermark logo */}
                  <SukanMark
                    monochrome="terracotta"
                    size={48}
                    className="absolute top-4 end-4 opacity-30"
                  />

                  <h2 className="font-display text-2xl md:text-3xl leading-snug text-earth mb-3 pe-12">
                    {t("hero.landlordTitle")}
                  </h2>

                  <p className="text-mute text-sm leading-relaxed mb-6">
                    {t("hero.landlordSubtitle")}
                  </p>

                  <Link
                    href="/post"
                    className="inline-block rounded-[var(--radius-pill)] bg-terracotta hover:bg-terracotta-deep text-parchment font-semibold px-6 py-3 text-sm transition-colors"
                  >
                    {t("hero.postProperty")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────
            2. WAVE DIVIDER
        ───────────────────────────────────────────────────────── */}
        <div className="wave-divider opacity-50 my-0" />

        {/* ─────────────────────────────────────────────────────────
            3. FEATURED LISTINGS
        ───────────────────────────────────────────────────────── */}
        <section className="bg-earth py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Eyebrow */}
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              {t("listing.featured")}
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-parchment mb-8">
              {t("trust.stat1")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────
            4. BROWSE ALL LISTINGS
        ───────────────────────────────────────────────────────── */}
        <section className="bg-earth-soft py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-4xl md:text-5xl text-parchment mb-4">
              {t("nav.browse")}
            </h2>

            {/* Filter chips — decorative */}
            <div className="flex flex-wrap gap-2 mb-8">
              {[
                t("hero.anyState"),
                t("propertyType.apartment"),
                t("hero.rent"),
              ].map((label) => (
                <span
                  key={label}
                  className="rounded-[var(--radius-pill)] border border-gold/20 px-4 py-1.5 text-xs text-mute-soft"
                >
                  {label}
                </span>
              ))}
              <span className="rounded-[var(--radius-pill)] border border-gold/20 px-4 py-1.5 text-xs text-mute-soft">
                &lt;$500/mo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────
            5. HOW SUKAN WORKS
        ───────────────────────────────────────────────────────── */}
        <section className="bg-parchment-grain py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-4xl md:text-5xl text-earth text-center mb-14">
              {t("howItWorks.title")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {(
                [
                  {
                    titleKey: "howItWorks.tenants",
                    bodyKey: "howItWorks.tenantsBody",
                  },
                  {
                    titleKey: "howItWorks.landlords",
                    bodyKey: "howItWorks.landlordsBody",
                  },
                  {
                    titleKey: "howItWorks.diaspora",
                    bodyKey: "howItWorks.diasporaBody",
                  },
                ] as const
              ).map(({ titleKey, bodyKey }) => (
                <div key={titleKey} className="flex flex-col items-center text-center gap-4">
                  <SukanMark monochrome="terracotta" size={40} />
                  <h3 className="font-display text-xl text-earth font-semibold">
                    {t(titleKey)}
                  </h3>
                  <p className="text-mute text-sm leading-relaxed">{t(bodyKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────
            6. SUDAN STATES MAP BAND
        ───────────────────────────────────────────────────────── */}
        <section className="bg-earth py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl md:text-4xl text-parchment mb-2 text-center">
              {t("statesSection.title")}
            </h2>
            <p className="text-mute-soft text-sm text-center mb-10">
              {t("statesSection.subtitle")}
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              {STATE_KEYS.map((key) => (
                <Link
                  key={key}
                  href={`/listings?state=${key}`}
                  className="rounded-[var(--radius-pill)] border border-gold/30 px-4 py-2 text-sm text-mute-soft hover:bg-gold/10 hover:text-parchment transition-colors"
                >
                  {t(`states.${key}`)}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────
            7. TRUST BAND
        ───────────────────────────────────────────────────────── */}
        <section className="bg-earth-soft py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center mb-10">
              {(
                [
                  "trust.verifiedListings",
                  "trust.bilingualSupport",
                  "trust.diasporaTrusted",
                ] as const
              ).map((key) => (
                <div key={key} className="flex flex-col items-center gap-3">
                  <SukanMark monochrome="terracotta" size={36} />
                  <p className="font-semibold text-parchment text-base">{t(key)}</p>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gold/10 pt-8 text-center">
              {(
                ["trust.stat1", "trust.stat2", "trust.stat3"] as const
              ).map((key) => (
                <p key={key} className="text-xs text-mute-soft uppercase tracking-wider">
                  {t(key)}
                </p>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
