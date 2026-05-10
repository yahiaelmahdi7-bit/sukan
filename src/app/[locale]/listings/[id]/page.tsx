import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations, getFormatter } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import SukanMark from "@/components/sukan-mark";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ListingCard from "@/components/listing-card";
import { sampleListings, getListingById, type Listing } from "@/lib/sample-listings";
import ListingLocationMap from "./_components/listing-location-map";
import InquiryButton from "@/components/inquiry-button";
import StaySafeCard from "@/components/stay-safe-card";
import GlassPanel from "@/components/glass-panel";
import { GlassButton } from "@/components/ui/glass-button";

/* ─────────────────────────────────────────────────────────
   Metadata
───────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const listing = getListingById(id);

  if (!listing) {
    return { title: "Listing not found · Sukan" };
  }

  const title = locale === "ar" ? listing.titleAr : listing.titleEn;
  const stateKey = listing.state;

  // Truncate description to ~160 chars
  const rawDesc = locale === "ar" ? listing.descriptionAr : listing.descriptionEn;
  const description = rawDesc.length > 160 ? rawDesc.slice(0, 157) + "…" : rawDesc;

  return {
    title: `${title} · ${stateKey}`,
    description,
  };
}

/* ─────────────────────────────────────────────────────────
   Static params
───────────────────────────────────────────────────────── */

export async function generateStaticParams() {
  return sampleListings.map((l) => ({ id: l.id }));
}

/* ─────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────── */

/** Strip all non-digit characters from a phone string for wa.me links. */
function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, "");
}

/** Build the WhatsApp CTA URL. */
function buildWaUrl(phone: string, message: string): string {
  return `https://wa.me/${digitsOnly(phone)}?text=${encodeURIComponent(message)}`;
}

/* ─────────────────────────────────────────────────────────
   Photo Gallery Placeholder
───────────────────────────────────────────────────────── */

function PhotoPlaceholder({
  aspectClass,
  label,
  large,
}: {
  aspectClass: string;
  label: string;
  large?: boolean;
}) {
  return (
    <div
      className={`card-watermark overflow-hidden relative ${aspectClass} w-full ${large ? "rounded-[var(--radius-glass-lg)]" : "rounded-[var(--radius-glass)]"}`}
      aria-label={label}
      role="img"
      style={large ? { boxShadow: "var(--shadow-warm-lg)" } : { boxShadow: "var(--shadow-warm-sm)" }}
    >
      {/* Watermark centered */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <SukanMark monochrome="gold" size={large ? 140 : 80} className="opacity-[0.13]" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────── */

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const listing = getListingById(id);
  if (!listing) notFound();

  const t = await getTranslations();
  const format = await getFormatter();

  const isRtl = locale === "ar";
  const localTitle = isRtl ? listing.titleAr : listing.titleEn;
  const altTitle = isRtl ? listing.titleEn : listing.titleAr;
  const localDesc = isRtl ? listing.descriptionAr : listing.descriptionEn;
  const altDesc = isRtl ? listing.descriptionEn : listing.descriptionAr;
  const stateLabel = t(`states.${listing.state}`);

  // Period suffix
  const periodSuffix =
    listing.period === "month"
      ? t("listing.perMonth")
      : listing.period === "year"
        ? t("listing.perYear")
        : t("listing.perTotal");

  // Formatted prices
  const priceUsdFormatted = format.number(listing.priceUsd, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  // WhatsApp message + URL
  const waMessage = t("listing.waMessage", { title: localTitle });
  const waUrl = buildWaUrl(listing.whatsappContact, waMessage);
  const telUrl = `tel:${listing.whatsappContact}`;

  // Similar listings: same state, different id; fallback to first 3 others
  let similarListings: Listing[] = sampleListings
    .filter((l) => l.id !== listing.id && l.state === listing.state)
    .slice(0, 3);
  if (similarListings.length === 0) {
    similarListings = sampleListings.filter((l) => l.id !== listing.id).slice(0, 3);
  }

  // Specs — skip bedrooms/bathrooms if undefined (land/warehouse)
  const specs: Array<{ label: string; value: string; icon: string }> = [];
  if (listing.bedrooms != null) {
    specs.push({ label: t("listing.bedrooms"), value: String(listing.bedrooms), icon: "🛏" });
  }
  if (listing.bathrooms != null) {
    specs.push({ label: t("listing.bathrooms"), value: String(listing.bathrooms), icon: "🚿" });
  }
  if (listing.areaSqm != null) {
    specs.push({ label: t("listing.area"), value: `${listing.areaSqm} m²`, icon: "📐" });
  }
  specs.push({ label: t("listing.specType"), value: t(`propertyType.${listing.propertyType}`), icon: "🏠" });
  specs.push({
    label: t("listing.specPurpose"),
    value: listing.purpose === "rent" ? t("hero.rent") : t("hero.sale"),
    icon: listing.purpose === "rent" ? "🔑" : "📋",
  });

  // Photo slot array (at least 5 slots for the gallery layout)
  const photoCount = Math.max(listing.photoSlots ?? 5, 1);
  // Clamp: 1 large + up to 4 thumbs
  const thumbCount = Math.min(photoCount - 1, 4);

  // Suppress unused variable warning — altTitle is kept for potential future bilingual heading use
  void altTitle;

  return (
    <>
      <Navbar />

      <main className="bg-cream min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

          {/* ─────────────────────────────────────────────────────────
              1. BREADCRUMB
          ───────────────────────────────────────────────────────── */}
          <nav
            aria-label="breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-ink-mid"
          >
            <Link href="/" className="hover:text-gold-dk transition-colors">
              {t("listing.browseAll")}
            </Link>
            <span aria-hidden className="opacity-40">/</span>
            <Link
              href={`/listings?state=${listing.state}`}
              className="hover:text-gold-dk transition-colors"
            >
              {stateLabel}
            </Link>
            <span aria-hidden className="opacity-40">/</span>
            <span className="text-ink/60 line-clamp-1 max-w-[200px]">{localTitle}</span>
          </nav>

          {/* ─────────────────────────────────────────────────────────
              2. PHOTO GALLERY HERO
          ───────────────────────────────────────────────────────── */}
          <section className="mb-8" aria-label="Photos">
            {/* Mobile: large slot + horizontal thumb scroll */}
            <div className="lg:hidden">
              <div className="relative">
                <PhotoPlaceholder aspectClass="aspect-[16/10]" label={localTitle} large />

                {/* Featured pill overlaid on large image */}
                {listing.tier === "featured" && (
                  <span
                    className="absolute top-4 ltr:left-4 rtl:right-4 inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-earth"
                    style={{
                      background: "linear-gradient(135deg, #e0a857 0%, #c8873a 100%)",
                      boxShadow:
                        "0 4px 14px rgba(200, 135, 58, 0.35), inset 0 1px 0 rgba(255,255,255,0.35)",
                    }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-earth/70" aria-hidden />
                    ★ {t("listing.featured")}
                  </span>
                )}
              </div>
              {thumbCount > 0 && (
                <div className="flex gap-2 mt-2 overflow-x-auto pb-1 snap-x snap-mandatory">
                  {Array.from({ length: thumbCount }, (_, i) => (
                    <div key={i} className="flex-none w-24 snap-start">
                      <PhotoPlaceholder aspectClass="aspect-square" label={`${localTitle} ${i + 2}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop: 1 large (2 col) + 2x2 thumbs grid */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-2">
              {/* Large slot — spans 2 cols */}
              <div className="lg:col-span-2 relative">
                <PhotoPlaceholder aspectClass="aspect-[16/10]" label={localTitle} large />
                {listing.tier === "featured" && (
                  <span
                    className="absolute top-4 ltr:left-4 rtl:right-4 inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-earth"
                    style={{
                      background: "linear-gradient(135deg, #e0a857 0%, #c8873a 100%)",
                      boxShadow:
                        "0 4px 14px rgba(200, 135, 58, 0.35), inset 0 1px 0 rgba(255,255,255,0.35)",
                    }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-earth/70" aria-hidden />
                    ★ {t("listing.featured")}
                  </span>
                )}
              </div>

              {/* 2×2 thumb grid on the right */}
              <div className="grid grid-cols-2 grid-rows-2 gap-2">
                {Array.from({ length: Math.min(thumbCount, 4) }, (_, i) => (
                  <PhotoPlaceholder
                    key={i}
                    aspectClass="aspect-square"
                    label={`${localTitle} ${i + 2}`}
                  />
                ))}
                {/* Fill empty thumb slots if fewer photos */}
                {thumbCount < 4 &&
                  Array.from({ length: 4 - Math.max(thumbCount, 0) }, (_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="card-watermark rounded-[var(--radius-glass)] aspect-square opacity-30"
                    />
                  ))}
              </div>
            </div>
          </section>

          {/* ─────────────────────────────────────────────────────────
              3 + 4. TITLE / PRICE ROW + CONTACT CTA
          ───────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

            {/* Left: title, pills, price */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Gold eyebrow — state + property type */}
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-dk flex items-center gap-2">
                {stateLabel}
                <span className="h-px w-5 bg-gold/40" aria-hidden />
                {t(`propertyType.${listing.propertyType}`)}
              </p>

              {/* Title — large Cormorant display */}
              <h1 className="font-display text-4xl md:text-5xl lg:text-[3.25rem] text-ink tracking-tight leading-[1.08]">
                {localTitle}
              </h1>

              {/* Classification pills row */}
              <div className="flex flex-wrap gap-2 items-center">
                {/* Purpose pill — terracotta for rent, gold for sale */}
                {listing.purpose === "rent" ? (
                  <span className="rounded-[var(--radius-pill)] bg-terracotta/15 border border-terracotta/40 px-4 py-1.5 text-xs text-terracotta font-semibold">
                    {t("hero.rent")}
                  </span>
                ) : (
                  <span className="rounded-[var(--radius-pill)] bg-gold/15 border border-gold/40 px-4 py-1.5 text-xs text-gold-dk font-semibold">
                    {t("hero.sale")}
                  </span>
                )}

                {/* Featured badge */}
                {listing.tier === "featured" && (
                  <span
                    className="rounded-[var(--radius-pill)] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-earth"
                    style={{
                      background: "linear-gradient(135deg, #e0a857 0%, #c8873a 100%)",
                      boxShadow:
                        "0 4px 14px rgba(200, 135, 58, 0.30), inset 0 1px 0 rgba(255,255,255,0.30)",
                    }}
                  >
                    ★ {t("listing.featured")}
                  </span>
                )}
              </div>

              {/* Price block — terracotta display font */}
              <div className="flex flex-col gap-1">
                <div className="flex items-end gap-2">
                  <span className="font-display text-4xl md:text-5xl text-terracotta tracking-tight">
                    {priceUsdFormatted}
                  </span>
                  <span className="text-ink-mid text-sm mb-2">{periodSuffix}</span>
                </div>

                {listing.priceSdg != null && (
                  <p className="text-ink-mid text-sm">
                    {t("listing.sdgAmount", {
                      amount: format.number(listing.priceSdg, { maximumFractionDigits: 0 }),
                    })}
                    <span className="opacity-70"> {periodSuffix}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Right: Contact CTA card — glass-warm, sticky desktop */}
            <div className="lg:col-span-1">
              <GlassPanel
                variant="warm"
                radius="glass"
                shadow="lg"
                className="p-6 flex flex-col gap-4 lg:sticky lg:top-6"
              >
                {/* Primary: WhatsApp gradient CTA */}
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="smooth flex items-center justify-center gap-2 rounded-[var(--radius-pill)] text-cream font-semibold px-5 py-3.5 text-sm"
                  style={{
                    background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                    boxShadow: "0 8px 22px rgba(37, 211, 102, 0.28), inset 0 1px 0 rgba(255,255,255,0.18)",
                  }}
                >
                  <WhatsAppIcon />
                  {t("listing.contactWhatsapp")}
                </a>

                {/* Secondary: call */}
                <a
                  href={telUrl}
                  className="smooth flex items-center justify-center rounded-[var(--radius-pill)] border border-gold/35 bg-white/45 backdrop-blur-md text-gold-dk px-5 py-3 text-sm hover:border-gold/60 hover:bg-gold/10 transition-colors"
                >
                  {t("listing.callOwner")}
                </a>

                {/* Inquiry button — wired to existing InquiryButton, restyled */}
                <InquiryButton
                  listing={listing}
                  className="rounded-[var(--radius-pill)] border border-sand-dk bg-white/40 backdrop-blur-sm hover:bg-gold/10 text-ink font-medium px-5 py-3 text-sm smooth transition-colors"
                />

                {/* Divider */}
                <div className="border-t border-white/40 pt-1" />

                {/* Ghost action row: Save + Share */}
                <div className="flex gap-2 justify-center">
                  <GlassButton
                    variant="ghost-light"
                    size="sm"
                    leading={<SaveIcon />}
                    aria-label={t("listing.saveListing")}
                  >
                    {t("listing.saveListing")}
                  </GlassButton>
                  <GlassButton
                    variant="ghost-light"
                    size="sm"
                    leading={<ShareIcon />}
                    aria-label={t("listing.shareListing")}
                  >
                    {t("listing.shareListing")}
                  </GlassButton>
                </div>

                <StaySafeCard />
              </GlassPanel>
            </div>
          </div>

          {/* Mobile sticky CTA */}
          <div
            className="lg:hidden fixed bottom-0 start-0 end-0 z-40 px-4 py-3"
            style={{
              background: "linear-gradient(135deg, rgba(255,252,246,0.92), rgba(244,234,215,0.90))",
              backdropFilter: "blur(20px) saturate(160%)",
              WebkitBackdropFilter: "blur(20px) saturate(160%)",
              borderTop: "1px solid rgba(255,255,255,0.65)",
              boxShadow: "0 -4px 24px rgba(122,85,48,0.14)",
            }}
          >
            <div className="flex flex-col gap-2">
              <StickyContactCta waUrl={waUrl} telUrl={telUrl} t={t} />
              <InquiryButton
                listing={listing}
                className="w-full rounded-[var(--radius-pill)] border border-sand-dk text-ink text-xs py-2 hover:bg-gold/10 transition-colors"
              />
            </div>
          </div>

          {/* Spacer so sticky bar doesn't overlap last section on mobile */}
          <div className="lg:hidden h-24" aria-hidden />

          {/* ─────────────────────────────────────────────────────────
              5. SPECS ROW — glass-cream pills
          ───────────────────────────────────────────────────────── */}
          <section className="mb-10" aria-labelledby="specs-heading">
            <GlassPanel
              variant="warm"
              radius="glass"
              className="grid grid-cols-2 lg:grid-cols-5 gap-4 px-6 py-5"
            >
              {specs.map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="text-xs text-gold-dk uppercase tracking-wider font-medium">
                    {label}
                  </span>
                  <span className="text-ink font-semibold text-base font-display">{value}</span>
                </div>
              ))}
            </GlassPanel>
          </section>

          {/* ─────────────────────────────────────────────────────────
              6. DESCRIPTION — Lato prose, relaxed leading
          ───────────────────────────────────────────────────────── */}
          <section className="mb-10" aria-labelledby="desc-heading">
            <h2
              id="desc-heading"
              className="font-display text-3xl md:text-4xl text-ink mb-5 tracking-tight"
            >
              {t("listing.description")}
            </h2>

            {/* Primary language — larger */}
            <p className="font-sans text-ink text-base leading-[1.85] whitespace-pre-line">
              {localDesc}
            </p>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-sand-dk/60" />
              <SukanMark monochrome="gold" size={18} className="opacity-30" />
              <div className="flex-1 h-px bg-sand-dk/60" />
            </div>

            {/* Secondary language — smaller, muted */}
            <p
              className="font-sans text-ink-mid text-sm leading-[1.85] whitespace-pre-line"
              lang={isRtl ? "en" : "ar"}
              dir={isRtl ? "ltr" : "rtl"}
            >
              {altDesc}
            </p>
          </section>

          {/* ─────────────────────────────────────────────────────────
              7. AMENITIES — glass-warm chips with gold check
          ───────────────────────────────────────────────────────── */}
          {listing.amenities.length > 0 && (
            <section className="mb-10" aria-labelledby="amenities-heading">
              <h2
                id="amenities-heading"
                className="font-display text-3xl md:text-4xl text-ink mb-5 tracking-tight"
              >
                {t("listing.amenities")}
              </h2>

              <div className="flex flex-wrap gap-2">
                {listing.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="flex items-center gap-2 rounded-[var(--radius-pill)] px-4 py-2 text-sm text-ink font-medium"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,252,246,0.78), rgba(244,234,215,0.58))",
                      backdropFilter: "blur(16px) saturate(160%)",
                      WebkitBackdropFilter: "blur(16px) saturate(160%)",
                      border: "1px solid rgba(255,255,255,0.65)",
                      boxShadow: "var(--shadow-warm-sm)",
                    }}
                  >
                    {/* Gold check icon */}
                    <svg
                      aria-hidden
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gold-dk flex-none"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {t(`amenity.${amenity}`)}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* ─────────────────────────────────────────────────────────
              8. LOCATION — glass-warm frame around leaflet map
          ───────────────────────────────────────────────────────── */}
          <section className="mb-10" aria-labelledby="location-heading">
            <h2
              id="location-heading"
              className="font-display text-3xl md:text-4xl text-ink mb-5 tracking-tight"
            >
              {t("listing.location")}
            </h2>

            {/* Glass frame around the Leaflet map */}
            <GlassPanel
              variant="warm"
              radius="glass"
              shadow="lg"
              className="p-3 overflow-visible"
            >
              <div className="rounded-[var(--radius-glass)] overflow-hidden">
                <ListingLocationMap
                  listing={listing}
                  locale={locale as "en" | "ar"}
                  labels={{
                    directions: t("listing.directions"),
                    openInOsm: t("listing.openInOsm"),
                    copyCoords: t("listing.copyCoords"),
                    coordsCopied: t("listing.coordsCopied"),
                    mapTitle: t("listing.mapTitle"),
                  }}
                />
              </div>
            </GlassPanel>

            {/* Location text — below the map */}
            <p className="font-sans text-ink-mid text-sm mt-4">
              {listing.neighborhood ? `${listing.neighborhood}, ` : ""}
              {listing.city},{" "}
              <span className="text-ink/80">{stateLabel}</span>,{" "}
              Sudan
              <span className="ms-3 text-xs opacity-50">
                {listing.latitude.toFixed(4)}° N, {listing.longitude.toFixed(4)}° E
              </span>
            </p>
          </section>

          {/* ─────────────────────────────────────────────────────────
              9. ABOUT THE OWNER — glass-warm card
          ───────────────────────────────────────────────────────── */}
          <section className="mb-12" aria-labelledby="owner-heading">
            <h2
              id="owner-heading"
              className="font-display text-3xl md:text-4xl text-ink mb-5 tracking-tight"
            >
              {t("listing.aboutOwner")}
            </h2>

            <GlassPanel
              variant="warm"
              radius="glass"
              className="flex items-center gap-5 px-6 py-5"
            >
              {/* Avatar circle */}
              <div className="flex-none w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(200,135,58,0.18), rgba(200,135,58,0.08))",
                  border: "1px solid rgba(200,135,58,0.30)",
                }}
              >
                <SukanMark monochrome="gold" size={48} className="opacity-55" />
              </div>

              {/* Name + joined */}
              <div className="flex-1 min-w-0">
                <p className="font-display text-xl text-ink leading-tight truncate">
                  {listing.ownerName}
                </p>
                <p className="font-sans text-ink-mid text-sm mt-0.5">
                  {t("listing.onSukanSince", { year: listing.ownerJoinedYear })}
                </p>
              </div>

              {/* Contact link */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="smooth flex-none rounded-[var(--radius-pill)] border border-gold/40 bg-white/45 backdrop-blur-md text-gold-dk text-xs px-4 py-2 hover:border-gold/65 hover:bg-gold/10 transition-colors"
              >
                {t("listing.contact")}
              </a>
            </GlassPanel>
          </section>

          {/* ─────────────────────────────────────────────────────────
              10. SIMILAR LISTINGS — uses existing ListingCard (already redesigned)
          ───────────────────────────────────────────────────────── */}
          {similarListings.length > 0 && (
            <section aria-labelledby="similar-heading">
              <h2
                id="similar-heading"
                className="font-display text-3xl md:text-4xl text-ink mb-6 tracking-tight"
              >
                {t("listing.similar")}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarListings.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            </section>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   Sticky mobile CTA row — compact horizontal
───────────────────────────────────────────────────────── */

type TranslationFn = ReturnType<typeof useTranslations>;

function StickyContactCta({
  waUrl,
  telUrl,
  t,
}: {
  waUrl: string;
  telUrl: string;
  t: TranslationFn;
}) {
  return (
    <div className="flex gap-3 items-center">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="smooth flex-1 flex items-center justify-center gap-2 rounded-[var(--radius-pill)] text-cream font-semibold px-4 py-3 text-sm"
        style={{
          background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
          boxShadow: "0 8px 22px rgba(37, 211, 102, 0.25), inset 0 1px 0 rgba(255,255,255,0.18)",
        }}
      >
        <WhatsAppIcon />
        {t("listing.contactWhatsapp")}
      </a>
      <a
        href={telUrl}
        className="smooth flex-none rounded-[var(--radius-pill)] border border-gold/40 bg-white/45 backdrop-blur-md text-gold-dk px-4 py-3 text-sm hover:border-gold/65 hover:bg-gold/10 transition-colors"
      >
        {t("listing.callOwner")}
      </a>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Tiny inline icon SVGs — no external deps required
───────────────────────────────────────────────────────── */

function WhatsAppIcon() {
  return (
    <svg
      aria-hidden
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-none"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.112 1.522 5.843L.057 23.854a.5.5 0 00.613.614l6.008-1.466A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.823 9.823 0 01-5.006-1.374l-.359-.213-3.72.908.924-3.618-.234-.372A9.815 9.815 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg
      aria-hidden
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-none"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      aria-hidden
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-none"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}
