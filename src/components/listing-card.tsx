import Image from "next/image";
import { useLocale, useTranslations, useFormatter } from "next-intl";
import { Link } from "@/i18n/navigation";
import FavoriteButton from "@/components/favorite-button";
import { VerifiedBadge } from "@/components/verified-badge";
import { StarRating } from "@/components/star-rating";
import {
  getListingImage,
  getLocaleCity,
  getLocaleTitle,
  type Listing,
} from "@/lib/sample-listings";
import type { Locale } from "@/i18n/routing";


export default function ListingCard({ listing }: { listing: Listing }) {
  const locale = useLocale() as Locale;
  const t = useTranslations();
  const format = useFormatter();
  const title = getLocaleTitle(listing, locale);
  const city = getLocaleCity(listing, locale);

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="smooth group block overflow-hidden rounded-[var(--radius-glass)] border border-sand-dk bg-card hover:-translate-y-1 hover:border-gold/45 hover:shadow-[var(--shadow-gold-glow)]"
      style={{ boxShadow: "var(--shadow-warm-sm)" }}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand">
        <Image
          src={getListingImage(listing)}
          alt={title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink/35 via-ink/5 to-ink/0"
        />
        {listing.tier === "featured" && (
          <span
            className="absolute top-3 ltr:left-3 rtl:right-3 inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-earth"
            style={{
              background:
                "linear-gradient(135deg, #e0a857 0%, #c8873a 100%)",
              boxShadow:
                "0 4px 14px rgba(200, 135, 58, 0.35), inset 0 1px 0 rgba(255,255,255,0.35)",
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-earth/70" aria-hidden />
            {t("listing.featured")}
          </span>
        )}
        <span className="absolute bottom-3 ltr:right-3 rtl:left-3 rounded-[var(--radius-pill)] border border-white/15 bg-ink/55 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-cream backdrop-blur-md backdrop-saturate-150">
          {t(`propertyType.${listing.propertyType}`)}
        </span>
        <div className="pointer-events-auto absolute top-3 z-10 ltr:right-3 rtl:left-3">
          <FavoriteButton listingId={listing.id} size="sm" />
        </div>
      </div>

      <div className="p-5">
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

        <p className="mt-1 text-sm text-ink-mid line-clamp-1">{city}</p>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-display text-2xl text-terracotta">
            {format.number(listing.priceUsd, {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })}
          </span>
          {listing.period !== "total" && (
            <span className="text-xs text-ink-mid">
              {listing.period === "month"
                ? t("listing.perMonth")
                : t("listing.perYear")}
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-ink-mid">
          {listing.bedrooms !== undefined && (
            <span>{t("listing.bedroomsShort", { count: listing.bedrooms })}</span>
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
          {listing.reviewCount !== undefined && listing.reviewCount > 0 && (
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
  );
}
