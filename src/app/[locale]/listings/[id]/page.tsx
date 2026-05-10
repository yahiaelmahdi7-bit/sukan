import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations, getFormatter } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import JsonLd from "@/components/json-ld";
import {
  buildResidenceLD,
  buildRealEstateListingLD,
  buildBreadcrumbLD,
} from "@/lib/json-ld";
import SukanMark from "@/components/sukan-mark";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ListingCard from "@/components/listing-card";
import { sampleListings, type Listing } from "@/lib/sample-listings";
import { getListingByIdAsync } from "@/lib/listings";
import ListingLocationMap from "./_components/listing-location-map";
import InquiryButton from "@/components/inquiry-button";
import StaySafeCard from "@/components/stay-safe-card";
import GlassPanel from "@/components/glass-panel";
import { GlassButton } from "@/components/ui/glass-button";
import { VerifiedBadge } from "@/components/verified-badge";
import { ShareButton } from "@/components/share-button";
import { ReportListingButton } from "@/components/report-listing-button";
import { ViewingRequestModal } from "@/components/viewing-request-modal";
import { StarRating } from "@/components/star-rating";
import { ReviewForm } from "./_components/review-form";
import { createClient } from "@/lib/supabase/server";
import { ViewingNow } from "@/components/viewing-now";
import { ListingActivityCounters } from "@/components/listing-activity-counters";
import { NeighborhoodBlurb } from "@/components/neighborhood-blurb";
import { SimilarListingsRail } from "@/components/similar-listings-rail";
import TrackRecentlyViewed from "@/components/track-recently-viewed";
import PropertyReality from "@/components/property-reality";
import { WhatsAppCta } from "@/components/whatsapp-cta";
import { ListingToc } from "@/components/listing-toc";

/* ─────────────────────────────────────────────────────────
   Inline DB row types (database.types.ts may be stale)
───────────────────────────────────────────────────────── */

type DbListingPhoto = {
  id: string;
  listing_id: string;
  url: string;
  position: number;
};

type DbReview = {
  id: string;
  listing_id: string;
  landlord_id: string;
  rating: number;
  comment: string | null;
  comment_ar: string | null;
  created_at: string;
  profiles: {
    full_name: string | null;
  } | null;
};

/* ─────────────────────────────────────────────────────────
   Metadata
───────────────────────────────────────────────────────── */

const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sukan.app").replace(/\/$/, "");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const listing = await getListingByIdAsync(id);

  if (!listing) {
    return { title: "Listing not found · Sukan" };
  }

  const isAr = locale === "ar";
  const title = isAr ? listing.titleAr : listing.titleEn;
  const cityLabel = isAr ? (listing.cityAr ?? listing.city) : listing.city;
  const stateLabel = listing.state.replace(/_/g, " ");

  // Locale-aware title: "<title> · <city>, <state> · Sukan"
  const metaTitle = isAr
    ? `${title} · ${cityLabel}، ${stateLabel} · سُكَن`
    : `${title} · ${cityLabel}, ${stateLabel} · Sukan`;

  // Truncate description to ≤160 chars
  const rawDesc = isAr ? listing.descriptionAr : listing.descriptionEn;
  const description = rawDesc.length > 160 ? rawDesc.slice(0, 157) + "…" : rawDesc;

  const canonicalUrl = `${SITE_URL}/${locale}/listings/${id}`;

  // First photo for OG/Twitter
  const ogImage = listing.imageUrl ?? listing.photos?.[0] ?? "";
  const absoluteOgImage = ogImage.startsWith("http")
    ? ogImage
    : `${SITE_URL}${ogImage || "/opengraph-image.png"}`;

  return {
    title: metaTitle,
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/listings/${id}`,
        ar: `${SITE_URL}/ar/listings/${id}`,
      },
    },
    openGraph: {
      type: "website",
      title: metaTitle,
      description,
      url: canonicalUrl,
      siteName: "Sukan — سُكَن",
      locale: isAr ? "ar_SD" : "en_US",
      images: absoluteOgImage
        ? [{ url: absoluteOgImage, alt: title, width: 1200, height: 630 }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description,
      images: absoluteOgImage ? [absoluteOgImage] : undefined,
    },
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

  const listing = await getListingByIdAsync(id);
  if (!listing) notFound();

  const t = await getTranslations();
  const format = await getFormatter();

  const isRtl = locale === "ar";
  const localTitle = isRtl ? listing.titleAr : listing.titleEn;
  const altTitle = isRtl ? listing.titleEn : listing.titleAr;
  const localDesc = isRtl ? listing.descriptionAr : listing.descriptionEn;
  const altDesc = isRtl ? listing.descriptionEn : listing.descriptionAr;
  const stateLabel = t(`states.${listing.state}`);

  // Period suffix — sale listings never show "/month" or "/year",
  // even if the DB row stored a rent period by mistake.
  const periodSuffix =
    listing.purpose === "sale"
      ? ""
      : listing.period === "month"
        ? t("listing.perMonth")
        : listing.period === "year"
          ? t("listing.perYear")
          : "";

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

  // Full share URL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sukan.app";
  const fullUrl = `${siteUrl}/${locale}/listings/${listing.id}`;

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

  // Suppress unused variable warning — altTitle is kept for potential future bilingual heading use
  void altTitle;

  /* ── F2: Fetch listing photos ── */
  let photos: DbListingPhoto[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("listing_photos")
      .select("id, listing_id, url, position")
      .eq("listing_id", listing.id)
      .order("position", { ascending: true });
    if (data) photos = data as DbListingPhoto[];
  } catch {
    // table may not exist yet — graceful fallback to placeholder
  }

  const heroPhoto = photos[0] ?? null;
  const thumbPhotos = photos.slice(1);

  /* ── F5: Fetch reviews for this listing ── */
  let reviews: DbReview[] = [];
  let avgRating = listing.averageRating ?? 0;
  let reviewCount = listing.reviewCount ?? 0;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("reviews")
      .select("id, listing_id, landlord_id, rating, comment, comment_ar, created_at, profiles(full_name)")
      .eq("listing_id", listing.id)
      .order("created_at", { ascending: false });
    if (data && data.length > 0) {
      reviews = data as unknown as DbReview[];
      reviewCount = reviews.length;
      avgRating =
        Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount) * 10) / 10;
    }
  } catch {
    // reviews table may not exist yet
  }

  /* ── F5: Auth user — for review CTA gating ── */
  let currentUserId: string | null = null;
  // landlordId is not exposed on Listing type, so we use listing.id as the landlord_id
  // (reviews are per-listing; landlord_id comes from the DB reviews table landlord column)
  // We just need to know if user is signed in to show the review CTA
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    currentUserId = user?.id ?? null;
  } catch {
    // silently ignore
  }

  // Use listing.id as the landlord context for the review form
  // (the API route writes landlord_id from the body; we pass listing.id as a proxy
  //  until ownerId is surfaced on the Listing type — the DB trigger links them)
  const landlordIdForReview = listing.id;

  // JSON-LD structured data
  const ldLocale = locale as "en" | "ar";
  const breadcrumbItems = [
    { name: locale === "ar" ? "الرئيسية" : "Home", url: `${siteUrl}/${locale}` },
    { name: locale === "ar" ? "العقارات" : "Listings", url: `${siteUrl}/${locale}/listings` },
    {
      name: locale === "ar" ? (listing.cityAr ?? listing.city) : listing.city,
      url: `${siteUrl}/${locale}/listings?state=${listing.state}`,
    },
    {
      name: locale === "ar" ? listing.titleAr : listing.titleEn,
      url: `${siteUrl}/${locale}/listings/${listing.id}`,
    },
  ];

  return (
    <>
      <JsonLd data={buildResidenceLD({ listing, locale: ldLocale, siteUrl })} />
      <JsonLd data={buildRealEstateListingLD({ listing, locale: ldLocale, siteUrl })} />
      <JsonLd data={buildBreadcrumbLD({ items: breadcrumbItems })} />
      <Navbar />

      <main className="bg-cream min-h-screen">
        {/* Sticky TOC — desktop only, fixed right-rail overlay */}
        <ListingToc locale={locale} />

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
              1b. LIVE VIEWING COUNTER — above the fold
          ───────────────────────────────────────────────────────── */}
          <div className="mb-5">
            <ViewingNow listingId={listing.id} />
          </div>

          <TrackRecentlyViewed
            listing={{
              id: listing.id,
              title: localTitle,
              image: heroPhoto?.url ?? "",
              priceUsd: listing.priceUsd,
            }}
          />

          {/* ─────────────────────────────────────────────────────────
              2. PHOTO GALLERY HERO (F2)
          ───────────────────────────────────────────────────────── */}
          <section id="photos" className="mb-8" aria-label={t("photos.gallery")}>
            {/* Mobile: large slot + horizontal thumb scroll */}
            <div className="lg:hidden">
              <div className="relative aspect-[16/10] w-full rounded-[var(--radius-glass-lg)] overflow-hidden"
                style={{ boxShadow: "var(--shadow-warm-lg)" }}>
                {heroPhoto ? (
                  <Image
                    src={heroPhoto.url}
                    alt={localTitle}
                    fill
                    sizes="(max-width: 1024px) 100vw"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <PhotoPlaceholder aspectClass="aspect-[16/10]" label={localTitle} large />
                )}

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

              {/* Thumbnail strip */}
              {(thumbPhotos.length > 0 || (photos.length === 0 && (listing.photoSlots ?? 5) > 1)) && (
                <div className="flex gap-2 mt-2 overflow-x-auto pb-1 snap-x snap-mandatory">
                  {thumbPhotos.length > 0
                    ? thumbPhotos.map((photo, i) => (
                        <div key={photo.id} className="flex-none w-24 snap-start relative aspect-square rounded-[var(--radius-glass)] overflow-hidden"
                          style={{ boxShadow: "var(--shadow-warm-sm)" }}>
                          <Image
                            src={photo.url}
                            alt={`${localTitle} ${i + 2}`}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        </div>
                      ))
                    : Array.from({ length: Math.min((listing.photoSlots ?? 5) - 1, 4) }, (_, i) => (
                        <div key={i} className="flex-none w-24 snap-start">
                          <PhotoPlaceholder aspectClass="aspect-square" label={`${localTitle} ${i + 2}`} />
                        </div>
                      ))}
                </div>
              )}
            </div>

            {/* Desktop: when no photos, render ONE clean wide placeholder
                (avoids a 5-tile empty grid). When photos exist, fall back
                to the 1-large + 2×2-thumbs gallery. */}
            <div className={`hidden lg:grid gap-2 ${photos.length === 0 ? "lg:grid-cols-1" : "lg:grid-cols-3"}`}>
              {/* Large slot — spans 2 cols when thumbs render, full width when no photos */}
              <div className={`relative aspect-[16/10] rounded-[var(--radius-glass-lg)] overflow-hidden ${photos.length === 0 ? "" : "lg:col-span-2"}`}
                style={{ boxShadow: "var(--shadow-warm-lg)" }}>
                {heroPhoto ? (
                  <Image
                    src={heroPhoto.url}
                    alt={localTitle}
                    fill
                    sizes="(min-width: 1024px) 66vw"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center card-watermark">
                    <SukanMark monochrome="gold" size={140} className="opacity-[0.13]" />
                  </div>
                )}

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

              {/* 2×2 thumb grid — only when at least one extra photo exists */}
              {thumbPhotos.length > 0 && (
                <div className="grid grid-cols-2 grid-rows-2 gap-2">
                  {thumbPhotos.slice(0, 4).map((photo, i) => (
                    <div key={photo.id} className="relative aspect-square rounded-[var(--radius-glass)] overflow-hidden"
                      style={{ boxShadow: "var(--shadow-warm-sm)" }}>
                      <Image
                        src={photo.url}
                        alt={`${localTitle} ${i + 2}`}
                        fill
                        sizes="(min-width: 1024px) 17vw"
                        className="object-cover"
                      />
                    </div>
                  ))}

                  {/* Fill empty thumb slots when photos exist but fewer than 4 */}
                  {thumbPhotos.length < 4 &&
                    Array.from({ length: 4 - thumbPhotos.length }, (_, i) => (
                      <div
                        key={`empty-${i}`}
                        className="card-watermark rounded-[var(--radius-glass)] aspect-square opacity-30"
                      />
                    ))}
                </div>
              )}
            </div>
          </section>

          {/* ─────────────────────────────────────────────────────────
              3 + 4. TITLE / PRICE ROW + CONTACT CTA
          ───────────────────────────────────────────────────────── */}
          <div id="overview" className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

            {/* Left: title, pills, price */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Gold eyebrow — state + property type */}
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-dk flex items-center gap-2">
                {stateLabel}
                <span className="h-px w-5 bg-gold/40" aria-hidden />
                {t(`propertyType.${listing.propertyType}`)}
              </p>

              {/* Title — large Cormorant display + F4 verified badge inline */}
              <div className="flex flex-wrap items-start gap-3">
                <h1 className="font-display text-4xl md:text-5xl lg:text-[3.25rem] text-ink tracking-tight leading-[1.08]">
                  {localTitle}
                </h1>
                {listing.ownerVerified && (
                  <span className="mt-2">
                    <VerifiedBadge size="sm" />
                  </span>
                )}
              </div>

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

              {/* Activity counters — trust signals near the price */}
              <ListingActivityCounters listingId={listing.id} />
            </div>

            {/* Right: Contact CTA card — glass-warm, sticky desktop */}
            <div className="lg:col-span-1">
              <GlassPanel
                variant="warm"
                radius="glass"
                shadow="lg"
                className="p-6 flex flex-col gap-4 lg:sticky lg:top-6"
              >
                {/* Primary: WhatsApp CTA — component handles deep-link + pre-filled message */}
                <WhatsAppCta
                  phone={listing.whatsappContact || undefined}
                  listingTitle={localTitle}
                  listingUrl={fullUrl}
                  locale={locale as "en" | "ar"}
                  className="py-3.5"
                />

                {/* Secondary: call */}
                <a
                  href={telUrl}
                  className="smooth flex items-center justify-center rounded-[var(--radius-pill)] border border-gold/35 bg-white/45 backdrop-blur-md text-gold-dk px-5 py-3 text-sm hover:border-gold/60 hover:bg-gold/10 transition-colors"
                >
                  {t("listing.callOwner")}
                </a>

                {/* F8: Request a viewing */}
                <ViewingRequestModal
                  listingId={listing.id}
                  ownerWhatsApp={listing.whatsappContact}
                >
                  <GlassButton variant="ghost-light" size="md" full>
                    {t("viewings.requestViewing")}
                  </GlassButton>
                </ViewingRequestModal>

                {/* Inquiry button — wired to existing InquiryButton, restyled */}
                <InquiryButton
                  listing={listing}
                  className="rounded-[var(--radius-pill)] border border-sand-dk bg-white/40 backdrop-blur-sm hover:bg-gold/10 text-ink font-medium px-5 py-3 text-sm smooth transition-colors"
                />

                {/* Divider */}
                <div className="border-t border-white/40 pt-1" />

                {/* Ghost action row: Save + Share (F9) */}
                <div className="flex gap-2 justify-center">
                  <GlassButton
                    variant="ghost-light"
                    size="sm"
                    leading={<SaveIcon />}
                    aria-label={t("listing.saveListing")}
                  >
                    {t("listing.saveListing")}
                  </GlassButton>
                  <ShareButton
                    url={fullUrl}
                    title={isRtl ? listing.titleAr : listing.titleEn}
                  />
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
            <section id="amenities" className="mb-10" aria-labelledby="amenities-heading">
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
              7b. PROPERTY REALITY — Sudan-specific infrastructure facts
              (power backup, water supply, cooling, parking, furnishing,
               distance to airport). The key differentiator vs Dubizzle.
          ───────────────────────────────────────────────────────── */}
          <section id="reality" className="mb-10" aria-label={locale === "ar" ? "حقائق العقار" : "Property reality"}>
            <PropertyReality
              amenities={listing.amenities}
              id={listing.id}
              state={listing.state}
              locale={locale as "en" | "ar"}
            />
          </section>

          {/* ─────────────────────────────────────────────────────────
              7c. NEIGHBORHOOD BLURB — editorial area context
          ───────────────────────────────────────────────────────── */}
          <section id="neighborhood" className="mb-10" aria-label={locale === "ar" ? "عن هذا الحي" : "About this area"}>
            <NeighborhoodBlurb city={listing.city} locale={locale as "en" | "ar"} />
          </section>

          {/* ─────────────────────────────────────────────────────────
              8. LOCATION — glass-warm frame around leaflet map
              (moved before owner for scannability: place → who → social proof)
          ───────────────────────────────────────────────────────── */}
          <section id="map" className="mb-10" aria-labelledby="location-heading">
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
              9. ABOUT THE OWNER — glass-warm card (F4: verified badge)
          ───────────────────────────────────────────────────────── */}
          <section id="owner" className="mb-10" aria-labelledby="owner-heading">
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

              {/* Name + joined + F4 verified badge */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-display text-xl text-ink leading-tight truncate">
                    {listing.ownerName}
                  </p>
                  {listing.ownerVerified && <VerifiedBadge size="sm" />}
                </div>
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
              F5: REVIEWS SECTION
          ───────────────────────────────────────────────────────── */}
          <section id="reviews" className="mb-10" aria-labelledby="reviews-heading">
            <div className="flex flex-wrap items-center gap-4 mb-5">
              <h2
                id="reviews-heading"
                className="font-display text-3xl md:text-4xl text-ink tracking-tight"
              >
                {t("reviews.reviewsTitle")}
              </h2>
              {reviewCount > 0 && (
                <div className="flex items-center gap-2">
                  <StarRating value={Math.round(avgRating)} size="md" interactive={false} />
                  <span className="font-sans text-ink-mid text-sm">
                    {t("reviews.basedOn", { count: reviewCount })}
                  </span>
                </div>
              )}
            </div>

            {/* Review CTA */}
            <div className="mb-6">
              {currentUserId ? (
                <ReviewForm
                  listingId={listing.id}
                  landlordId={landlordIdForReview}
                  trigger={
                    <GlassButton variant="terracotta" size="md">
                      {t("reviews.leaveReview")}
                    </GlassButton>
                  }
                />
              ) : (
                <GlassButton variant="ghost-light" size="md">
                  {t("reviews.leaveReview")}
                </GlassButton>
              )}
            </div>

            {/* Review list */}
            {reviews.length === 0 ? (
              <p className="font-sans text-ink-mid text-sm">{t("reviews.noReviews")}</p>
            ) : (
              <div className="flex flex-col gap-4">
                {reviews.map((review) => {
                  const reviewerName = review.profiles?.full_name ?? t("reviews.anonymous");
                  const reviewDate = new Date(review.created_at).toLocaleDateString(
                    locale === "ar" ? "ar-SD" : "en-GB",
                    { year: "numeric", month: "short", day: "numeric" }
                  );
                  const displayComment = isRtl && review.comment_ar
                    ? review.comment_ar
                    : review.comment;

                  return (
                    <GlassPanel key={review.id} variant="warm" radius="glass" className="px-5 py-4 flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-display text-base text-ink leading-tight">{reviewerName}</span>
                          <span className="font-sans text-xs text-ink-mid">{reviewDate}</span>
                        </div>
                        <StarRating value={review.rating} size="sm" interactive={false} />
                      </div>
                      {displayComment && (
                        <p className="font-sans text-ink text-sm leading-relaxed">{displayComment}</p>
                      )}
                    </GlassPanel>
                  );
                })}
              </div>
            )}
          </section>

          {/* ─────────────────────────────────────────────────────────
              9b. SIMILAR LISTINGS RAIL — horizontal scroll mini-cards
          ───────────────────────────────────────────────────────── */}
          <SimilarListingsRail
            currentListingId={listing.id}
            currentState={listing.state}
            currentPropertyType={listing.propertyType}
            locale={locale as "en" | "ar"}
          />

          {/* ─────────────────────────────────────────────────────────
              10. SIMILAR LISTINGS — uses existing ListingCard
          ───────────────────────────────────────────────────────── */}
          {similarListings.length > 0 && (
            <section id="similar" className="mb-10" aria-labelledby="similar-heading">
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

          {/* ─────────────────────────────────────────────────────────
              F10: REPORT BUTTON — discreet, above footer
          ───────────────────────────────────────────────────────── */}
          <div className="mt-4 mb-8 flex justify-center">
            <ReportListingButton listingId={listing.id} />
          </div>

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
