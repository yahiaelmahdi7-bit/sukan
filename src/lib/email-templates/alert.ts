/**
 * alert.ts — Saved-search alert email sent to tenants
 *
 * Sent daily (via cron) when new listings match a user's saved search.
 * Shows: personalised greeting, up to 3 listing cards (title/price/CTA),
 * a "See all matches" button, and an unsubscribe footer note.
 *
 * TODO: i18n later — EN/AR strings are defined inline below.
 */

import {
  wrapEmail,
  emailHeading,
  emailParagraph,
  emailButton,
  emailDivider,
  emailListingCard,
  escHtml,
} from "./shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AlertListingItem {
  id: string;
  titleEn: string | null;
  titleAr: string | null;
  price: number;
  currency: string;
  city: string;
  state: string;
  imageUrl?: string;
}

export interface AlertEmailParams {
  locale: string;
  firstName: string;
  /** Human-readable city/state label for the saved search */
  searchLabel: string;
  /** All matched listings — we display max 3, link to rest */
  listings: AlertListingItem[];
  /** Full URL to /listings?... with saved search filters pre-applied */
  allMatchesUrl: string;
  /** URL for unsubscribing from this alert — /dashboard/saved-searches/[id]/unsubscribe */
  unsubscribeUrl: string;
  alertId: string;
}

// ---------------------------------------------------------------------------
// formatPrice — simple price formatter (no Intl dependency)
// ---------------------------------------------------------------------------

function formatPrice(price: number, currency: string): string {
  if (currency === "SDG") return `${price.toLocaleString()} ج.س.`;
  if (currency === "USD") return `$${price.toLocaleString()}`;
  if (currency === "SAR") return `${price.toLocaleString()} ر.س`;
  if (currency === "AED") return `${price.toLocaleString()} د.إ`;
  return `${price.toLocaleString()} ${currency}`;
}

// ---------------------------------------------------------------------------
// buildAlertEmail
// ---------------------------------------------------------------------------

export function buildAlertEmail(p: AlertEmailParams): string {
  const isAr = p.locale === "ar";
  const count = p.listings.length;

  const title = isAr
    ? `${count} إعلان${count > 1 ? "ات" : ""} جديد${count > 1 ? "ة" : ""} في ${p.searchLabel} · سُكَن`
    : `${count} new listing${count > 1 ? "s" : ""} matched your search · Sukan`;

  const preheader = isAr
    ? `وجدنا ${count} إعلان${count > 1 ? "ات" : ""} جديد${count > 1 ? "ة" : ""} تطابق بحثك في ${p.searchLabel}.`
    : `We found ${count} new listing${count > 1 ? "s" : ""} in ${p.searchLabel} matching your saved search.`;

  const headingText = isAr
    ? `${count} إعلان${count > 1 ? "ات" : ""} جديد${count > 1 ? "ة" : ""} لك`
    : `${count} new listing${count > 1 ? "s" : ""} for you`;

  const greeting = isAr
    ? `مرحباً ${escHtml(p.firstName)}،`
    : `Hi ${escHtml(p.firstName)},`;

  const subText = isAr
    ? `وجدنا إعلانات جديدة في <strong>${escHtml(p.searchLabel)}</strong> تطابق معاييرك المحفوظة. إليك أفضل النتائج:`
    : `We found new listings in <strong>${escHtml(p.searchLabel)}</strong> matching your saved search criteria. Here are the top results:`;

  const ctaSeeAll = isAr ? "عرض جميع النتائج" : "See all matches";
  const ctaListing = isAr ? "عرض الإعلان" : "View listing";

  // App base URL for listing deep-links
  const appBase =
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_APP_URL
      ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")
      : "https://sukan.app";

  // Show up to 3 listing cards
  const topListings = p.listings.slice(0, 3);

  const listingCards = topListings
    .map((l) => {
      const listingTitle = (isAr ? l.titleAr : l.titleEn) ?? l.titleEn ?? l.titleAr ?? "Listing";
      const location = `${l.city}, ${l.state}`;
      const price = formatPrice(l.price, l.currency);
      const url = `${appBase}/${p.locale}/listings/${l.id}`;

      return emailListingCard({
        title: listingTitle,
        price,
        location,
        url,
        imageUrl: l.imageUrl,
        locale: p.locale,
        ctaLabel: ctaListing,
      });
    })
    .join("\n");

  const remainingCount = p.listings.length - topListings.length;
  const remainingNote =
    remainingCount > 0
      ? emailParagraph({
          text: isAr
            ? `وهناك ${remainingCount} إعلان${remainingCount > 1 ? "ات" : ""} إضافي${remainingCount > 1 ? "ة" : ""} — انقر أدناه للاطلاع عليها.`
            : `There are ${remainingCount} more listing${remainingCount > 1 ? "s" : ""} — click below to see them all.`,
          locale: p.locale,
        })
      : "";

  // Unsubscribe footer note
  const unsubNote = isAr
    ? `لإلغاء الاشتراك في هذا التنبيه، <a href="${p.unsubscribeUrl}" style="color:#8C7C69;">انقر هنا</a>.`
    : `To unsubscribe from this alert, <a href="${p.unsubscribeUrl}" style="color:#8C7C69;">click here</a>.`;

  const body = [
    emailHeading({ text: headingText, locale: p.locale }),
    emailParagraph({ text: greeting, locale: p.locale }),
    emailParagraph({ text: subText, locale: p.locale }),

    emailDivider(),

    listingCards,

    remainingNote,

    emailDivider(),

    emailButton({ label: ctaSeeAll, url: p.allMatchesUrl, locale: p.locale }),
  ].join("\n");

  return wrapEmail({
    locale: p.locale,
    title,
    preheader,
    body,
    footerNote: unsubNote,
  });
}

// ---------------------------------------------------------------------------
// Subject line helper
// ---------------------------------------------------------------------------

export function alertEmailSubject(
  count: number,
  searchLabel: string,
  locale: string,
): string {
  if (locale === "ar") {
    return `${count} إعلان${count > 1 ? "ات" : ""} جديد${count > 1 ? "ة" : ""} في ${searchLabel} · سُكَن`;
  }
  return `${count} new listing${count > 1 ? "s" : ""} matched your search · Sukan`;
}
