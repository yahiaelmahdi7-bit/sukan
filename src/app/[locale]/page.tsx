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
import GlassPanel from "@/components/glass-panel";
import ActivityTicker from "@/components/activity-ticker";
import StaggeredListings from "@/components/staggered-listings";

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
            1. HERO — atmosphere visible through transparent section
        ───────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          {/* Local gold haze — layered on top of global atmosphere for depth */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 end-0 h-[640px] w-[640px] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at 70% 30%, rgba(200,135,58,0.16) 0%, transparent 70%)",
            }}
          />

          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            {/* Eyebrow */}
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-dk">
              {t("brand.tagline")}
            </p>

            {/* Headline — tighter leading, finer tracking on Cormorant */}
            <h1 className="mb-5 max-w-3xl font-display text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl lg:text-7xl">
              {t("hero.tenantTitle")}
            </h1>

            {/* Subtitle */}
            <p className="mb-12 max-w-xl text-lg leading-relaxed text-ink-mid">
              {t("hero.tenantSubtitle")}
            </p>

            {/* Two-column panel row */}
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
              {/* Left: tenant search (3/5) */}
              <div className="flex flex-col gap-4 lg:col-span-3">
                <HeroSearch />

                {/* AI match — glass pill, opens chat modal in-place */}
                <AIMatchButton className="smooth-fast inline-flex items-center gap-2 self-start rounded-[var(--radius-pill)] border border-gold/40 bg-white/45 px-5 py-2.5 text-sm font-medium text-gold-dk backdrop-blur-md hover:border-gold/70 hover:bg-gold/10 hover:text-terracotta">
                  {t("hero.aiMatchTeaser")}
                </AIMatchButton>
              </div>

              {/* Right: landlord CTA (2/5) — premium glass card */}
              <div className="relative lg:col-span-2">
                <GlassPanel
                  variant="warm"
                  radius="glass"
                  shadow="lg"
                  className="p-6 sm:p-7"
                >
                  {/* Watermark logo */}
                  <SukanMark
                    monochrome="terracotta"
                    size={48}
                    className="absolute top-4 end-4 opacity-20"
                  />

                  <h2 className="mb-3 pe-12 font-display text-2xl leading-[1.15] tracking-tight text-ink md:text-3xl">
                    {t("hero.landlordTitle")}
                  </h2>

                  <p className="mb-6 text-sm leading-relaxed text-ink-soft">
                    {t("hero.landlordSubtitle")}
                  </p>

                  {/* WhatsApp CTA — green gradient */}
                  <a
                    href={`https://wa.me/249912345678?text=${whatsappText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="smooth mb-3 inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] px-6 py-3 text-sm font-semibold text-white hover:brightness-[1.05]"
                    style={{
                      background:
                        "linear-gradient(135deg, #25d366 0%, #1eb558 100%)",
                      boxShadow:
                        "0 8px 22px rgba(37, 211, 102, 0.30), inset 0 1px 0 rgba(255,255,255,0.22)",
                    }}
                  >
                    <MessageCircle size={16} aria-hidden />
                    {t("hero.whatsappCta")}
                  </a>

                  {/* Secondary web link */}
                  <div className="text-center">
                    <Link
                      href="/post"
                      className="smooth-fast text-xs text-ink-mid hover:text-ink"
                    >
                      {t("hero.orPostWeb")}
                    </Link>
                  </div>

                  {/* Stats */}
                  <HeroStats stats={heroStats} />
                </GlassPanel>
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
        <section className="bg-cream py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow={t("listing.featured")}
              title={t("trust.stat1")}
              viewAll={{ href: "/listings", label: t("listing.browseAll") + " →" }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <StaggeredListings>
                {featuredListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </StaggeredListings>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────
            4. BROWSE ALL LISTINGS
        ───────────────────────────────────────────────────────── */}
        <section className="bg-cream-grain py-20">
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
                  className="rounded-[var(--radius-pill)] border border-sand-dk px-4 py-1.5 text-xs text-ink-mid bg-card"
                >
                  {label}
                </span>
              ))}
              <span className="rounded-[var(--radius-pill)] border border-sand-dk px-4 py-1.5 text-xs text-ink-mid bg-card">
                &lt;$500/mo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <StaggeredListings>
                {sampleListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </StaggeredListings>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────
            5. HOW SUKAN WORKS
        ───────────────────────────────────────────────────────── */}
        <WaveDivider flip intensity="subtle" />
        <section className="bg-card py-24">
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
        <section className="bg-cream py-24">
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
        <section className="bg-cream-grain py-24">
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
                  <Icon size={36} className="text-terracotta" strokeWidth={1.5} />
                  <p className="font-semibold text-ink text-base">{t(key)}</p>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-sand-dk pt-8 text-center">
              {(
                ["trust.stat1", "trust.stat2", "trust.stat3"] as const
              ).map((key) => (
                <p key={key} className="text-xs text-ink-mid uppercase tracking-wider">
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
        <section className="bg-sand py-24">
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
        <section className="bg-cream-deep">
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

        <ActivityTicker />
      </main>

      <Footer />
    </>
  );
}
