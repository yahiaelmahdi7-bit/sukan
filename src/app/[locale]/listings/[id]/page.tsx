import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { useTranslations, useFormatter } from "next-intl";
import { setRequestLocale, getTranslations, getFormatter } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import SukanMark from "@/components/sukan-mark";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ListingCard from "@/components/listing-card";
import { sampleListings, getListingById, type Listing } from "@/lib/sample-listings";
import ListingLocationMap from "./_components/listing-location-map";

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
}: {
  aspectClass: string;
  label: string;
}) {
  return (
    <div
      className={`card-watermark rounded-[var(--radius-card)] overflow-hidden relative ${aspectClass} w-full`}
      aria-label={label}
      role="img"
    >
      {/* Watermark centered */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <SukanMark monochrome="gold" size={120} className="opacity-[0.15]" />
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
  const specs: Array<{ label: string; value: string }> = [];
  if (listing.bedrooms != null) {
    specs.push({ label: t("listing.bedrooms"), value: String(listing.bedrooms) });
  }
  if (listing.bathrooms != null) {
    specs.push({ label: t("listing.bathrooms"), value: String(listing.bathrooms) });
  }
  if (listing.areaSqm != null) {
    specs.push({ label: t("listing.area"), value: `${listing.areaSqm} m²` });
  }
  specs.push({ label: t("listing.specType"), value: t(`propertyType.${listing.propertyType}`) });
  specs.push({
    label: t("listing.specPurpose"),
    value: listing.purpose === "rent" ? t("hero.rent") : t("hero.sale"),
  });

  // Photo slot array (at least 5 slots for the gallery layout)
  const photoCount = Math.max(listing.photoSlots ?? 5, 1);
  // Clamp: 1 large + up to 4 thumbs
  const thumbCount = Math.min(photoCount - 1, 4);

  return (
    <>
      <Navbar />

      <main className="bg-earth min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

          {/* ─────────────────────────────────────────────────────────
              1. BREADCRUMB
          ───────────────────────────────────────────────────────── */}
          <nav
            aria-label="breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-mute-soft"
          >
            <Link href="/" className="hover:text-parchment transition-colors">
              {t("listing.browseAll")}
            </Link>
            <span aria-hidden className="opacity-50">/</span>
            <Link
              href={`/listings?state=${listing.state}`}
              className="hover:text-parchment transition-colors"
            >
              {stateLabel}
            </Link>
            <span aria-hidden className="opacity-50">/</span>
            <span className="text-parchment/70 line-clamp-1 max-w-[200px]">{localTitle}</span>
          </nav>

          {/* ─────────────────────────────────────────────────────────
              2. PHOTO GALLERY HERO
          ───────────────────────────────────────────────────────── */}
          <section className="mb-8" aria-label="Photos">
            {/* Mobile: large slot + horizontal thumb scroll */}
            <div className="lg:hidden">
              <PhotoPlaceholder aspectClass="aspect-[16/10]" label={localTitle} />
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
              <div className="lg:col-span-2">
                <PhotoPlaceholder aspectClass="aspect-[16/10]" label={localTitle} />
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
                      className="card-watermark rounded-[var(--radius-card)] aspect-square opacity-30"
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
            <div className="lg:col-span-2 flex flex-col gap-4">

              {/* Title */}
              <h1 className="font-display text-4xl md:text-5xl text-parchment leading-tight">
                {localTitle}
              </h1>

              {/* Classification pills row */}
              <div className="flex flex-wrap gap-2 items-center">
                {/* State pill */}
                <span className="rounded-[var(--radius-pill)] border border-gold/40 px-4 py-1.5 text-xs text-gold">
                  {stateLabel}
                </span>

                {/* Property type pill */}
                <span className="rounded-[var(--radius-pill)] border border-gold/40 px-4 py-1.5 text-xs text-gold">
                  {t(`propertyType.${listing.propertyType}`)}
                </span>

                {/* Purpose pill — terracotta for rent, gold for sale */}
                {listing.purpose === "rent" ? (
                  <span className="rounded-[var(--radius-pill)] bg-terracotta/20 border border-terracotta/40 px-4 py-1.5 text-xs text-terracotta font-semibold">
                    {t("hero.rent")}
                  </span>
                ) : (
                  <span className="rounded-[var(--radius-pill)] bg-gold/10 border border-gold/40 px-4 py-1.5 text-xs text-gold-bright font-semibold">
                    {t("hero.sale")}
                  </span>
                )}

                {/* Featured badge */}
                {listing.tier === "featured" && (
                  <span className="rounded-[var(--radius-pill)] bg-gold/15 border border-gold/50 px-4 py-1.5 text-xs text-gold-bright font-semibold uppercase tracking-wide">
                    ★ {t("listing.featured")}
                  </span>
                )}
              </div>

              {/* Price block */}
              <div className="flex flex-col gap-1">
                <div className="flex items-end gap-2">
                  <span className="font-display text-4xl text-gold-bright">
                    {priceUsdFormatted}
                  </span>
                  <span className="text-mute-soft text-sm mb-1.5">{periodSuffix}</span>
                </div>

                {listing.priceSdg != null && (
                  <p className="text-mute-soft text-sm">
                    {t("listing.sdgAmount", {
                      amount: format.number(listing.priceSdg, { maximumFractionDigits: 0 }),
                    })}
                    <span className="opacity-70"> {periodSuffix}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Right: Contact CTA (desktop inline, mobile sticky) */}
            <div className="lg:col-span-1">
              <ContactCta
                waUrl={waUrl}
                telUrl={telUrl}
                t={t}
                sticky={false}
              />
            </div>
          </div>

          {/* Mobile sticky CTA */}
          <div
            className="lg:hidden fixed bottom-0 start-0 end-0 z-40 bg-earth border-t border-gold/10 px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.5)]"
          >
            <ContactCta waUrl={waUrl} telUrl={telUrl} t={t} sticky />
          </div>

          {/* Spacer so sticky bar doesn't overlap last section on mobile */}
          <div className="lg:hidden h-24" aria-hidden />

          {/* ─────────────────────────────────────────────────────────
              5. SPECS ROW
          ───────────────────────────────────────────────────────── */}
          <section className="mb-10" aria-labelledby="specs-heading">
            <div
              className="grid grid-cols-2 lg:grid-cols-5 gap-4 rounded-[var(--radius-card)] bg-earth-soft border border-gold/10 px-6 py-5"
            >
              {specs.map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="text-xs text-mute-soft uppercase tracking-wider">{label}</span>
                  <span className="text-parchment font-semibold text-base">{value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ─────────────────────────────────────────────────────────
              6. DESCRIPTION
          ───────────────────────────────────────────────────────── */}
          <section className="mb-10" aria-labelledby="desc-heading">
            <h2
              id="desc-heading"
              className="font-display text-3xl text-parchment mb-5"
            >
              {t("listing.description")}
            </h2>

            {/* Primary language — larger */}
            <p className="text-parchment text-base leading-relaxed whitespace-pre-line">
              {localDesc}
            </p>

            {/* Divider */}
            <hr className="border-gold/10 my-4" />

            {/* Secondary language — smaller, muted */}
            <p
              className="text-mute-soft text-sm leading-relaxed whitespace-pre-line"
              lang={isRtl ? "en" : "ar"}
              dir={isRtl ? "ltr" : "rtl"}
            >
              {altDesc}
            </p>
          </section>

          {/* ─────────────────────────────────────────────────────────
              7. AMENITIES PILLS
          ───────────────────────────────────────────────────────── */}
          {listing.amenities.length > 0 && (
            <section className="mb-10" aria-labelledby="amenities-heading">
              <h2
                id="amenities-heading"
                className="font-display text-3xl text-parchment mb-5"
              >
                {t("listing.amenities")}
              </h2>

              <div className="flex flex-wrap gap-2">
                {listing.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="flex items-center gap-2 bg-earth-soft border border-gold/20 rounded-[var(--radius-pill)] px-4 py-2 text-sm text-parchment"
                  >
                    <SukanMark monochrome="terracotta" size={14} />
                    {t(`amenity.${amenity}`)}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* ─────────────────────────────────────────────────────────
              8. LOCATION
          ───────────────────────────────────────────────────────── */}
          <section className="mb-10" aria-labelledby="location-heading">
            <h2
              id="location-heading"
              className="font-display text-3xl text-parchment mb-5"
            >
              {t("listing.location")}
            </h2>

            {/* Live Leaflet map */}
            <ListingLocationMap
              listing={listing}
              locale={locale as 'en' | 'ar'}
              labels={{
                directions: t("listing.directions"),
                openInOsm: t("listing.openInOsm"),
                copyCoords: t("listing.copyCoords"),
                coordsCopied: t("listing.coordsCopied"),
                mapTitle: t("listing.mapTitle"),
              }}
            />

            {/* Location text — below the map so the map is the visual anchor */}
            <p className="text-mute-soft text-sm mt-4">
              {listing.neighborhood ? `${listing.neighborhood}, ` : ""}
              {listing.city},{" "}
              <span className="text-parchment/80">{stateLabel}</span>,{" "}
              Sudan
              <span className="ms-3 text-xs opacity-50">
                {listing.latitude.toFixed(4)}° N, {listing.longitude.toFixed(4)}° E
              </span>
            </p>
          </section>

          {/* ─────────────────────────────────────────────────────────
              9. ABOUT THE OWNER
          ───────────────────────────────────────────────────────── */}
          <section className="mb-12" aria-labelledby="owner-heading">
            <h2
              id="owner-heading"
              className="font-display text-3xl text-parchment mb-5"
            >
              {t("listing.aboutOwner")}
            </h2>

            <div className="flex items-center gap-5 rounded-[var(--radius-card)] bg-earth-soft border border-gold/10 px-6 py-5">
              {/* Avatar circle */}
              <div className="flex-none w-14 h-14 rounded-full bg-sand border border-gold/20 flex items-center justify-center">
                <SukanMark monochrome="gold" size={56} className="opacity-60" />
              </div>

              {/* Name + joined */}
              <div className="flex-1 min-w-0">
                <p className="font-display text-xl text-parchment leading-tight truncate">
                  {listing.ownerName}
                </p>
                <p className="text-mute-soft text-sm mt-0.5">
                  {t("listing.onSukanSince", { year: listing.ownerJoinedYear })}
                </p>
              </div>

              {/* Contact link */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-none rounded-[var(--radius-pill)] border border-gold/40 text-gold text-xs px-4 py-2 hover:bg-gold/10 transition-colors"
              >
                {t("listing.contact")}
              </a>
            </div>
          </section>

          {/* ─────────────────────────────────────────────────────────
              10. SIMILAR LISTINGS
          ───────────────────────────────────────────────────────── */}
          {similarListings.length > 0 && (
            <section aria-labelledby="similar-heading">
              <h2
                id="similar-heading"
                className="font-display text-3xl text-parchment mb-6"
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
   Contact CTA — reusable, rendered inline and sticky
───────────────────────────────────────────────────────── */

type TranslationFn = ReturnType<typeof useTranslations>;

function ContactCta({
  waUrl,
  telUrl,
  t,
  sticky,
}: {
  waUrl: string;
  telUrl: string;
  t: TranslationFn;
  sticky: boolean;
}) {
  if (sticky) {
    // Compact horizontal row for the mobile sticky bar
    return (
      <div className="flex gap-3 items-center">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-terracotta hover:bg-terracotta-deep text-parchment font-semibold px-4 py-3 text-sm transition-colors"
        >
          {/* WhatsApp icon (inline SVG path, no external deps) */}
          <WhatsAppIcon />
          {t("listing.contactWhatsapp")}
        </a>
        <a
          href={telUrl}
          className="flex-none rounded-[var(--radius-pill)] border border-gold/40 text-gold px-4 py-3 text-sm hover:bg-gold/10 transition-colors"
        >
          {t("listing.callOwner")}
        </a>
      </div>
    );
  }

  // Full card for desktop right column
  return (
    <div className="rounded-[var(--radius-card)] bg-earth-soft border border-gold/15 p-6 flex flex-col gap-4 sticky top-6">
      {/* Primary: WhatsApp */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-terracotta hover:bg-terracotta-deep text-parchment font-semibold px-5 py-3.5 text-sm transition-colors"
      >
        <WhatsAppIcon />
        {t("listing.contactWhatsapp")}
      </a>

      {/* Secondary: call */}
      <a
        href={telUrl}
        className="flex items-center justify-center rounded-[var(--radius-pill)] border border-gold/40 text-gold px-5 py-3 text-sm hover:bg-gold/10 transition-colors"
      >
        {t("listing.callOwner")}
      </a>

      {/* Ghost action row: Save + Share */}
      <div className="flex gap-2 justify-center pt-1">
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-gold/15 px-4 py-2 text-xs text-mute-soft hover:text-parchment hover:border-gold/30 transition-colors"
          aria-label={t("listing.saveListing")}
        >
          <SaveIcon />
          {t("listing.saveListing")}
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-gold/15 px-4 py-2 text-xs text-mute-soft hover:text-parchment hover:border-gold/30 transition-colors"
          aria-label={t("listing.shareListing")}
        >
          <ShareIcon />
          {t("listing.shareListing")}
        </button>
      </div>
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
