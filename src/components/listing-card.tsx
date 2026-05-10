"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useLocale, useTranslations, useFormatter } from "next-intl";
import { Link } from "@/i18n/navigation";
import FavoriteButton from "@/components/favorite-button";
import { VerifiedBadge } from "@/components/verified-badge";
import { StarRating } from "@/components/star-rating";
import { Car, Sofa, Zap, Droplet, Snowflake } from "lucide-react";
import {
  getListingImage,
  getLocaleCity,
  getLocaleTitle,
  type Listing,
} from "@/lib/sample-listings";
import type { Locale } from "@/i18n/routing";
import CompareButton from "@/components/compare-button";

// ─── Extended fields (all optional, no Listing type mutation) ───────────────
type ListingExtras = {
  weeklyViews?: number;
  previousPriceUsd?: number;
  createdAt?: string;
  amenities?: string[];
  ownerAvatar?: string;
  ownerName?: string;
  ownerOnline?: boolean;
  ownerReplyTime?: number;
  photos?: string[];
};

// ─── Constants ───────────────────────────────────────────────────────────────
const SDG_PER_USD = 600;

// Deterministic view-count seed (no Math.random)
function seedViews(id: string): number {
  const raw = id.charCodeAt(0) * 7 + id.length * 11;
  return 30 + (raw % 151); // clamp 30–180
}

// Days-ago helper
function daysAgo(dateStr: string): number {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  return Math.floor((now - then) / 86_400_000);
}

// Amenity icon map
const AMENITY_ICONS: { key: string; icon: React.ReactNode; label: string }[] =
  [
    { key: "parking", icon: <Car size={13} />, label: "Parking" }, // TODO: i18n
    { key: "furnished", icon: <Sofa size={13} />, label: "Furnished" }, // TODO: i18n
    { key: "generator", icon: <Zap size={13} />, label: "Generator" }, // TODO: i18n
    { key: "water_tank", icon: <Droplet size={13} />, label: "Water tank" }, // TODO: i18n
    { key: "water", icon: <Droplet size={13} />, label: "Water" }, // TODO: i18n
    { key: "ac", icon: <Snowflake size={13} />, label: "AC" }, // TODO: i18n
  ];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Tiny dot-strip carousel for the photo area */
function PhotoCarousel({
  images,
  title,
  activeIdx,
  onDotHover,
  onDotClick,
}: {
  images: string[];
  title: string;
  activeIdx: number;
  onDotHover: (i: number) => void;
  onDotClick: (e: React.MouseEvent, i: number) => void;
}) {
  return (
    <>
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={i === 0 ? title : `${title} – photo ${i + 1}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="absolute inset-0 object-cover transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          style={{
            opacity: i === activeIdx ? 1 : 0,
            zIndex: i === activeIdx ? 1 : 0,
            transitionProperty: "opacity, transform",
            transitionDuration: "500ms, 700ms",
          }}
          priority={i === 0}
        />
      ))}
      {/* Dot strip */}
      {images.length > 1 && (
        <div
          className="absolute bottom-10 ltr:left-1/2 rtl:right-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full px-2 py-1"
          style={{ background: "rgba(18,16,12,0.45)", backdropFilter: "blur(6px)" }}
        >
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Photo ${i + 1}`}
              onMouseEnter={() => onDotHover(i)}
              onClick={(e) => onDotClick(e, i)}
              className="rounded-full transition-all duration-200"
              style={{
                width: i === activeIdx ? 14 : 6,
                height: 6,
                background:
                  i === activeIdx
                    ? "linear-gradient(90deg, #e0a857 0%, #c8873a 100%)"
                    : "rgba(255,255,255,0.55)",
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}

/** Circular agent avatar with optional online dot */
function AgentAvatar({
  avatar,
  name,
  online,
  replyTime,
}: {
  avatar?: string;
  name: string;
  online?: boolean;
  replyTime?: number;
}) {
  const initial = name.trim()[0]?.toUpperCase() ?? "S";

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="relative" style={{ width: 26, height: 26 }}>
        {avatar ? (
          <Image
            src={avatar}
            alt={name}
            fill
            sizes="26px"
            className="rounded-full object-cover"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center rounded-full text-[10px] font-semibold text-amber-900"
            style={{
              background:
                "linear-gradient(135deg, #e0a857 0%, #c8873a 100%)",
            }}
          >
            {initial}
          </div>
        )}
        {online === true && (
          <span
            className="absolute -bottom-0.5 -right-0.5 block rounded-full border-2 border-white"
            style={{ width: 9, height: 9, background: "#22c55e" }}
            aria-label="Online"
          />
        )}
      </div>
      {replyTime !== undefined && (
        <span
          className="whitespace-nowrap text-ink-mid"
          style={{ fontSize: 10, lineHeight: "14px" }}
        >
          ~{replyTime}h reply {/* TODO: i18n */}
        </span>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ListingCard({ listing }: { listing: Listing }) {
  const locale = useLocale() as Locale;
  const t = useTranslations();
  const format = useFormatter();
  const title = getLocaleTitle(listing, locale);
  const city = getLocaleCity(listing, locale);

  // Cast to extended type — all extras are optional
  const x = listing as Listing & ListingExtras;

  // ── Photo carousel state ───────────────────────────────────────────────────
  const photos: string[] = Array.isArray(x.photos) && x.photos.length > 0
    ? x.photos
    : [getListingImage(listing)];

  const [activePhoto, setActivePhoto] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const handleDotHover = useCallback((i: number) => setActivePhoto(i), []);
  const handleDotClick = useCallback(
    (e: React.MouseEvent, i: number) => {
      e.preventDefault();
      e.stopPropagation();
      setActivePhoto(i);
    },
    [],
  );

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 30) {
      setActivePhoto((prev) => {
        if (delta < 0) return Math.min(prev + 1, photos.length - 1);
        return Math.max(prev - 1, 0);
      });
    }
    touchStartX.current = null;
  };

  // ── Ribbons / dates ────────────────────────────────────────────────────────
  const createdDays =
    x.createdAt !== undefined ? daysAgo(x.createdAt) : undefined;
  const isNew = createdDays !== undefined && createdDays <= 7;
  const isPriceReduced =
    x.previousPriceUsd !== undefined && x.previousPriceUsd > listing.priceUsd;

  let listedLabel: string | null = null; // TODO: i18n
  if (createdDays !== undefined) {
    if (createdDays === 0) listedLabel = "Listed today";
    else if (createdDays === 1) listedLabel = "Listed yesterday";
    else listedLabel = `Listed ${createdDays}d ago`;
  }

  // ── View count ─────────────────────────────────────────────────────────────
  const views =
    typeof x.weeklyViews === "number" ? x.weeklyViews : seedViews(listing.id);

  // ── Amenity icons (max 5, no duplicate keys) ───────────────────────────────
  const amenityList: string[] = Array.isArray(x.amenities)
    ? x.amenities
    : Array.isArray(listing.amenities)
    ? listing.amenities
    : [];

  const visibleAmenities = AMENITY_ICONS.filter((a) =>
    amenityList.some((m) => m === a.key),
  ).slice(0, 5);

  // ── SDG price ─────────────────────────────────────────────────────────────
  const sdgPrice = listing.priceUsd * SDG_PER_USD;
  const periodSuffix =
    listing.period === "month"
      ? "/mo" // TODO: i18n
      : listing.period === "year"
      ? "/yr" // TODO: i18n
      : "";

  // ── Owner info ─────────────────────────────────────────────────────────────
  const ownerDisplayName =
    typeof x.ownerName === "string" ? x.ownerName : listing.ownerName;

  return (
    <>
      {/* Keyframe for dot pop – lives in component to avoid globals.css edit */}
      <style>{`
        @keyframes _sk_dot_pop {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.25); }
          100% { transform: scale(1); }
        }
      `}</style>

      <Link
        href={`/listings/${listing.id}`}
        className="smooth group block overflow-hidden rounded-[var(--radius-glass)] border border-sand-dk bg-card hover:-translate-y-1 hover:border-gold/45 hover:shadow-[var(--shadow-gold-glow)]"
        style={{ boxShadow: "var(--shadow-warm-sm)" }}
      >
        {/* ── Photo area ─────────────────────────────────────────────────── */}
        <div
          className="relative aspect-[4/3] w-full overflow-hidden bg-sand"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Images (carousel or single) */}
          {photos.length > 1 ? (
            <PhotoCarousel
              images={photos}
              title={title}
              activeIdx={activePhoto}
              onDotHover={handleDotHover}
              onDotClick={handleDotClick}
            />
          ) : (
            <Image
              src={photos[0]}
              alt={title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            />
          )}

          {/* Gradient overlay */}
          <div
            aria-hidden
            className="absolute inset-0 z-10 bg-gradient-to-t from-ink/35 via-ink/5 to-ink/0"
          />

          {/* ── Ribbons: top-left stacked ─────────────────────────────────── */}
          <div className="absolute top-3 ltr:left-3 rtl:right-3 z-20 flex flex-col gap-1.5">
            {listing.tier === "featured" && (
              <span
                className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-earth"
                style={{
                  background:
                    "linear-gradient(135deg, #e0a857 0%, #c8873a 100%)",
                  boxShadow:
                    "0 4px 14px rgba(200,135,58,0.35), inset 0 1px 0 rgba(255,255,255,0.35)",
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full bg-earth/70"
                  aria-hidden
                />
                {t("listing.featured")}
              </span>
            )}

            {isNew && (
              <span
                className="inline-flex items-center rounded-[var(--radius-pill)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white"
                style={{
                  background:
                    "linear-gradient(135deg, #C8401A 0%, #9D2F0F 100%)",
                  boxShadow: "0 3px 10px rgba(200,64,26,0.4)",
                }}
              >
                NEW {/* TODO: i18n */}
              </span>
            )}

            {isPriceReduced && (
              <span
                className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-900"
                style={{
                  background:
                    "linear-gradient(135deg, #e0a857 0%, #c8873a 100%)",
                  boxShadow: "0 3px 10px rgba(200,135,58,0.35)",
                }}
              >
                PRICE REDUCED {/* TODO: i18n */}
                <span className="font-normal normal-case tracking-normal line-through opacity-75">
                  $
                  {format.number(x.previousPriceUsd!, {
                    maximumFractionDigits: 0,
                  })}
                </span>
              </span>
            )}
          </div>

          {/* ── Property type pill: bottom-right ─────────────────────────── */}
          <span className="absolute bottom-3 ltr:right-3 rtl:left-3 z-20 rounded-[var(--radius-pill)] border border-white/15 bg-ink/55 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-cream backdrop-blur-md backdrop-saturate-150">
            {t(`propertyType.${listing.propertyType}`)}
          </span>

          {/* ── View count: bottom-left ───────────────────────────────────── */}
          <span className="absolute bottom-3 ltr:left-3 rtl:right-3 z-20 inline-flex items-center gap-1 rounded-[var(--radius-pill)] border border-white/15 bg-ink/55 px-2.5 py-0.5 text-[10px] text-cream/90 backdrop-blur-md">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: "#22c55e" }}
            />
            {views} views this week {/* TODO: i18n */}
          </span>

          {/* ── Favorite + Compare buttons ────────────────────────────────── */}
          <div className="pointer-events-auto absolute top-3 z-20 ltr:right-3 rtl:left-3 flex items-center gap-1.5">
            <CompareButton
              listing={{
                id: listing.id,
                title,
                image: photos[0],
                priceUsd: listing.priceUsd,
                state: listing.state,
                bedrooms: listing.bedrooms,
                bathrooms: listing.bathrooms,
                areaSqm: listing.areaSqm,
              }}
              size="sm"
            />
            <FavoriteButton listingId={listing.id} size="sm" />
          </div>
        </div>

        {/* ── Card body ──────────────────────────────────────────────────── */}
        <div className="p-5">
          {/* Title row */}
          <div className="flex items-baseline justify-between gap-3">
            <div className="flex min-w-0 items-center gap-1.5">
              <h3 className="line-clamp-1 font-display text-xl leading-tight text-ink">
                {title}
              </h3>
              {listing.ownerVerified === true && (
                <VerifiedBadge size="sm" tooltipKey="verified.tooltip" />
              )}
            </div>
            <span className="whitespace-nowrap rounded-[var(--radius-pill)] border border-sand-dk bg-white/60 px-3 py-0.5 text-[10px] uppercase tracking-[0.14em] text-ink-mid backdrop-blur-sm">
              {t(`states.${listing.state}`)}
            </span>
          </div>

          {/* City + listed-date pill row */}
          <div className="mt-1 flex items-center gap-2">
            <p className="min-w-0 flex-1 truncate text-sm text-ink-mid">
              {city}
            </p>
            {listedLabel && (
              <span
                className="shrink-0 rounded-[var(--radius-pill)] px-2 py-0.5 text-[10px] text-ink-mid"
                style={{ background: "rgba(240,230,208,0.7)" }}
              >
                {listedLabel}
              </span>
            )}
          </div>

          {/* Amenity icon strip */}
          {visibleAmenities.length > 0 && (
            <div className="mt-3 flex items-center gap-2">
              {visibleAmenities.map((a) => (
                <span
                  key={a.key}
                  title={a.label}
                  className="flex h-6 w-6 items-center justify-center rounded-full transition-colors duration-150"
                  style={{
                    color: "#C8873A",
                    background: "rgba(200,135,58,0.10)",
                  }}
                  aria-label={a.label}
                >
                  {a.icon}
                </span>
              ))}
            </div>
          )}

          {/* ── Price + agent row ─────────────────────────────────────────── */}
          <div className="mt-4 flex items-end justify-between gap-2">
            {/* Price block */}
            <div className="flex flex-col gap-0.5">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-2xl text-terracotta">
                  {format.number(listing.priceUsd, {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  })}
                </span>
                {periodSuffix && (
                  <span className="text-xs text-ink-mid">{periodSuffix}</span>
                )}
              </div>
              {/* SDG secondary price */}
              <span className="text-[11px] text-ink-mid">
                ≈{" "}
                {format.number(sdgPrice, { maximumFractionDigits: 0 })} SDG
                {periodSuffix && (
                  <span className="opacity-70">{periodSuffix}</span>
                )}
              </span>
            </div>

            {/* Agent avatar */}
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <AgentAvatar
                avatar={x.ownerAvatar}
                name={ownerDisplayName}
                online={x.ownerOnline}
                replyTime={x.ownerReplyTime}
              />
            </div>
          </div>

          {/* Beds / baths / area / rating row */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-ink-mid">
            {listing.bedrooms !== undefined && (
              <span>
                {t("listing.bedroomsShort", { count: listing.bedrooms })}
              </span>
            )}
            {listing.bathrooms !== undefined && (
              <>
                <span aria-hidden>·</span>
                <span>
                  {t("listing.bathroomsShort", { count: listing.bathrooms })}
                </span>
              </>
            )}
            {listing.areaSqm !== undefined && (
              <>
                <span aria-hidden>·</span>
                <span>
                  {t("listing.areaShort", {
                    value: format.number(listing.areaSqm, {
                      maximumFractionDigits: 0,
                    }),
                  })}
                </span>
              </>
            )}
            {listing.reviewCount !== undefined &&
              listing.reviewCount > 0 && (
                <>
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1">
                    <StarRating
                      value={listing.averageRating ?? 0}
                      max={5}
                      size="sm"
                      interactive={false}
                    />
                    <span>({listing.reviewCount})</span>
                  </span>
                </>
              )}
          </div>
        </div>
      </Link>
    </>
  );
}
