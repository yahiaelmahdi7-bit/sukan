import { useLocale, useTranslations, useFormatter } from "next-intl";
import { Link } from "@/i18n/navigation";
import SukanMark from "@/components/sukan-mark";
import {
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
      className="group block overflow-hidden rounded-[var(--radius-card)] border border-gold/15 bg-earth-soft transition duration-200 hover:-translate-y-0.5 hover:border-gold/30 hover:shadow-2xl hover:shadow-black/30"
    >
      <div className="card-watermark relative aspect-[4/3] w-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <SukanMark
            size={120}
            monochrome="gold"
            className="opacity-15 transition group-hover:opacity-25"
          />
        </div>
        {listing.tier === "featured" && (
          <span className="absolute top-3 ltr:left-3 rtl:right-3 rounded-pill bg-gold px-3 py-1 text-xs font-semibold uppercase tracking-wider text-earth">
            {t("listing.featured")}
          </span>
        )}
        <span className="absolute top-3 ltr:right-3 rtl:left-3 rounded-pill bg-earth/80 px-3 py-1 text-xs uppercase tracking-wider text-parchment backdrop-blur-sm">
          {t(`propertyType.${listing.propertyType}`)}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-xl text-parchment line-clamp-1">
            {title}
          </h3>
          <span className="rounded-pill border border-gold/30 px-3 py-0.5 text-[10px] uppercase tracking-wider text-mute-soft whitespace-nowrap">
            {t(`states.${listing.state}`)}
          </span>
        </div>

        <p className="mt-1 text-sm text-mute-soft line-clamp-1">{city}</p>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-display text-2xl text-gold-bright">
            {format.number(listing.priceUsd, {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })}
          </span>
          {listing.period !== "total" && (
            <span className="text-xs text-mute-soft">
              {listing.period === "month"
                ? t("listing.perMonth")
                : t("listing.perYear")}
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-mute-soft">
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
        </div>
      </div>
    </Link>
  );
}
