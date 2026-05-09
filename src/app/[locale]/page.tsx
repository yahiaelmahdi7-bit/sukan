import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Search, Home, Plane, ShieldCheck, Languages, Globe, MessageCircle } from "lucide-react";
import SukanMark from "@/components/sukan-mark";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ListingCard from "@/components/listing-card";
import SudanStateMap from "@/components/sudan-state-map";
import WaveDivider from "@/components/wave-divider";
import Pill from "@/components/pill";
import SectionHeader from "@/components/section-header";
import HeroStats from "@/components/hero-stats";
import NumberedStep from "@/components/numbered-step";
import TestimonialCard from "@/components/testimonial-card";
import DiasporaCallout from "@/components/diaspora-callout";
import AIMatchButton from "@/components/ai-match-button";
import { sampleListings } from "@/lib/sample-listings";
import HeroSearch from "@/components/hero-search";

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

  const heroStats = [
    { value: t("hero.statListingsValue"), label: t("hero.statListings") },
    { value: t("hero.statStatesValue"), label: t("hero.statStates") },
    { value: t("hero.statVerifiedValue"), label: t("hero.statVerified") },
  ];

  const whatsappText = encodeURIComponent(
    "Hi, I'd like to list my property on Sukan / مرحباً، أريد نشر عقاري على سُكَن"
  );

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

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
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
              <div className="lg:col-span-3 flex flex-col gap-3">
                <HeroSearch />

                {/* AI match — opens chat modal in-place */}
                <AIMatchButton className="inline-flex items-center gap-2 self-start rounded-pill border border-gold/40 px-5 py-2.5 text-sm font-medium text-gold transition hover:border-gold hover:bg-gold/10">
                  {t("hero.aiMatchTeaser")}
                </AIMatchButton>
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

                  {/* WhatsApp CTA — primary green */}
                  <a
                    href={`https://wa.me/249912345678?text=${whatsappText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] px-6 py-3 text-sm font-semibold text-white transition-colors w-full justify-center mb-3"
                    style={{ backgroundColor: "#25d366" }}
                  >
                    <MessageCircle size={16} aria-hidden />
                    {t("hero.whatsappCta")}
                  </a>

                  {/* Secondary web link */}
                  <div className="text-center">
                    <Link
                      href="/post"
                      className="text-xs text-mute hover:text-earth transition-colors"
                    >
                      {t("hero.orPostWeb")}
                    </Link>
                  </div>

                  {/* Stats */}
                  <HeroStats stats={heroStats} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────
            2. WAVE DIVIDER
        ───────────────────────────────────────────────────────── */}
        <WaveDivider intensity="subtle" />

        {/* ─────────────────────────────────────────────────────────
            3. FEATURED LISTINGS
        ───────────────────────────────────────────────────────── */}
        <section className="bg-earth py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow={t("listing.featured")}
              title={t("trust.stat1")}
              viewAll={{ href: "/listings", label: t("listing.browseAll") + " →" }}
            />

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
        <section className="bg-earth-soft py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title={t("nav.browse")}
              viewAll={{ href: "/listings", label: t("listing.browseAll") + " →" }}
            />

            {/* Filter chips — decorative */}
            <div className="flex flex-wrap gap-2 mb-8 -mt-4">
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
        <WaveDivider flip intensity="subtle" />
        <section className="bg-parchment-grain py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title={t("howItWorks.title")}
              align="center"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <NumberedStep
                index={1}
                icon={<Search size={40} strokeWidth={1.5} />}
                title={t("howItWorks.tenants")}
                body={t("howItWorks.tenantsBody")}
              />
              <NumberedStep
                index={2}
                icon={<Home size={40} strokeWidth={1.5} />}
                title={t("howItWorks.landlords")}
                body={t("howItWorks.landlordsBody")}
              />
              <NumberedStep
                index={3}
                icon={<Plane size={40} strokeWidth={1.5} />}
                title={t("howItWorks.diaspora")}
                body={t("howItWorks.diasporaBody")}
              />
            </div>
          </div>
        </section>
        <WaveDivider intensity="subtle" />

        {/* ─────────────────────────────────────────────────────────
            6. SUDAN STATES MAP BAND
        ───────────────────────────────────────────────────────── */}
        <section className="bg-earth py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow={t("map.eyebrow")}
              title={t("statesSection.title")}
              subtitle={t("statesSection.subtitle")}
              align="center"
              viewAll={{ href: "/map", label: t("map.openFull") }}
            />

            {/* Map */}
            <SudanStateMap listings={sampleListings} height="520px" />
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────
            7. TRUST BAND
        ───────────────────────────────────────────────────────── */}
        <WaveDivider flip intensity="subtle" />
        <section className="bg-earth-soft py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center mb-10">
              {(
                [
                  { key: "trust.verifiedListings", Icon: ShieldCheck },
                  { key: "trust.bilingualSupport", Icon: Languages },
                  { key: "trust.diasporaTrusted", Icon: Globe },
                ] as const
              ).map(({ key, Icon }) => (
                <div key={key} className="flex flex-col items-center gap-3">
                  <Icon size={36} className="text-gold" strokeWidth={1.5} />
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

        {/* ─────────────────────────────────────────────────────────
            8. TESTIMONIALS
        ───────────────────────────────────────────────────────── */}
        <WaveDivider intensity="subtle" />
        <section className="bg-earth py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow={t("testimonials.eyebrow")}
              title={t("testimonials.title")}
              align="center"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <TestimonialCard
                quote={t("testimonials.t1Quote")}
                author={t("testimonials.t1Author")}
                location={t("testimonials.t1Location")}
                accent="gold"
              />
              <TestimonialCard
                quote={t("testimonials.t2Quote")}
                author={t("testimonials.t2Author")}
                location={t("testimonials.t2Location")}
                accent="terracotta"
              />
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────
            9. DIASPORA CALLOUT
        ───────────────────────────────────────────────────────── */}
        <WaveDivider flip intensity="subtle" />
        <section className="bg-earth-soft">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <DiasporaCallout
              eyebrow={t("diaspora.eyebrow")}
              title={t("diaspora.title")}
              subtitle={t("diaspora.subtitle")}
              browseCta={t("diaspora.browseCta")}
              matchCta={t("diaspora.matchCta")}
            />
          </div>
        </section>
        <WaveDivider intensity="subtle" />
      </main>

      <Footer />
    </>
  );
}
