// Server component — CSS-only horizontal scroll, no "use client" needed.
// TODO: i18n — replace hardcoded strings with translation keys

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  sampleListings,
  getListingImage,
  getLocaleTitle,
  getLocaleCity,
  type PropertyType,
} from "@/lib/sample-listings";
import type { Locale } from "@/i18n/routing";

const SDG_PER_USD = 600;

function formatUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

interface SimilarListingsRailProps {
  currentListingId: string;
  currentState: string;
  currentPropertyType: PropertyType;
  locale?: Locale;
}

export function SimilarListingsRail({
  currentListingId,
  currentState,
  currentPropertyType,
  locale = "en",
}: SimilarListingsRailProps) {
  // Primary: same state + same type, excluding self
  let picks = sampleListings.filter(
    (l) =>
      l.id !== currentListingId &&
      l.state === currentState &&
      l.propertyType === currentPropertyType,
  );

  // Broaden to same state only if fewer than 3 matches
  if (picks.length < 3) {
    picks = sampleListings.filter(
      (l) => l.id !== currentListingId && l.state === currentState,
    );
  }

  // Final fallback: anything else
  if (picks.length < 3) {
    picks = sampleListings.filter((l) => l.id !== currentListingId);
  }

  const listings = picks.slice(0, 6);
  if (listings.length === 0) return null;

  // City label for the heading — first match's locale city (or just state)
  const cityLabel = listings[0] ? getLocaleCity(listings[0], locale) : currentState;
  // TODO: i18n heading
  const heading = locale === "ar"
    ? `عقارات مشابهة في ${cityLabel}`
    : `Similar properties in ${cityLabel}`;

  return (
    <section aria-labelledby="similar-rail-heading" className="mb-10">
      <h2
        id="similar-rail-heading"
        className="font-display text-3xl md:text-4xl text-[#12100C] mb-6 tracking-tight"
      >
        {heading}
      </h2>

      {/* Horizontal scroller — pure CSS, no JS */}
      <div
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3"
        style={{ scrollbarWidth: "none" }}
        role="list"
        aria-label={heading}
      >
        {listings.map((listing) => {
          const title = getLocaleTitle(listing, locale);
          const city = getLocaleCity(listing, locale);
          const imgSrc = getListingImage(listing);
          const sdg = listing.priceSdg ?? Math.round(listing.priceUsd * SDG_PER_USD);

          return (
            <Link
              key={listing.id}
              href={`/listings/${listing.id}`}
              role="listitem"
              className="flex-none w-[240px] snap-start flex flex-col rounded-[var(--radius-glass)] overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8873A] focus-visible:ring-offset-1"
              style={{
                background:
                  "linear-gradient(135deg, rgba(253,248,240,0.90) 0%, rgba(240,230,208,0.72) 100%)",
                backdropFilter: "blur(16px) saturate(155%)",
                WebkitBackdropFilter: "blur(16px) saturate(155%)",
                border: "1px solid rgba(255,255,255,0.62)",
                boxShadow: "var(--shadow-warm-sm)",
              }}
              aria-label={`${title} — ${formatUsd(listing.priceUsd)}`}
            >
              {/* Square photo */}
              <div className="relative aspect-square w-full overflow-hidden rounded-t-[var(--radius-glass)]">
                <Image
                  src={imgSrc}
                  alt={title}
                  fill
                  sizes="240px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Card body */}
              <div className="flex flex-col gap-1 px-3 py-3">
                {/* Title */}
                <p className="font-display text-sm text-[#12100C] leading-tight line-clamp-1">
                  {title}
                </p>

                {/* City */}
                <p className="text-xs text-[#12100C]/55 leading-none truncate">
                  {city}
                </p>

                {/* Price */}
                <div className="flex flex-wrap items-baseline gap-1 mt-0.5">
                  <span className="font-display text-base text-[#C8401A] font-semibold leading-none">
                    {formatUsd(listing.priceUsd)}
                  </span>
                  <span className="text-[10px] text-[#12100C]/45 leading-none">
                    ≈ {(sdg / 1000).toFixed(0)}K SDG
                  </span>
                </div>

                {/* Beds / baths */}
                {(listing.bedrooms != null || listing.bathrooms != null) && (
                  <p className="text-[11px] text-[#12100C]/55 leading-none mt-0.5">
                    {listing.bedrooms != null && (
                      <span>{listing.bedrooms} bd</span>
                    )}
                    {listing.bedrooms != null && listing.bathrooms != null && (
                      <span className="mx-1 opacity-40">·</span>
                    )}
                    {listing.bathrooms != null && (
                      <span>{listing.bathrooms} ba</span>
                    )}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
