'use client';

/**
 * map-listing-preview.tsx
 *
 * Generates styled HTML strings for Leaflet popup content.
 * Because Leaflet operates outside React's render tree we use raw DOM strings.
 * The card is self-contained with inline styles so it renders correctly
 * regardless of which CSS classes Leaflet strips.
 *
 * Usage:
 *   import { buildListingPopupHtml } from '@/components/map-listing-preview';
 *   marker.bindPopup(buildListingPopupHtml(listing, locale, { href, labels }));
 */

import type { Listing, PricePeriod } from '@/lib/sample-listings';
import { getListingImage } from '@/lib/sample-listings';

export interface PopupLabels {
  perMonth: string;
  perYear: string;
  perTotal: string;
  bedroomsShort: string;
  bathroomsShort: string;
  areaShort: string;
  viewListing: string;
}

function periodSuffix(period: PricePeriod, labels: PopupLabels): string {
  if (period === 'month') return labels.perMonth;
  if (period === 'year') return labels.perYear;
  return labels.perTotal;
}

function formatPrice(listing: Listing): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(listing.priceUsd);
}

/**
 * Returns a fully-styled HTML string for the Leaflet popup card.
 * Max width 280px, cream glass background, shadow-warm.
 */
export function buildListingPopupHtml(
  listing: Listing,
  locale: string,
  opts: {
    href: string;
    labels: PopupLabels;
  },
): string {
  const { href, labels } = opts;
  const isAr = locale === 'ar';

  const title = isAr ? listing.titleAr : listing.titleEn;
  const city = isAr ? listing.cityAr : listing.city;
  const stateName = listing.state.replace(/_/g, ' ');
  const imageUrl = getListingImage(listing);
  const price = formatPrice(listing);
  const suffix = periodSuffix(listing.period, labels);
  const isFeatured = listing.tier === 'featured';
  const dir = isAr ? 'rtl' : 'ltr';

  // Build bed/bath/area row
  const metaParts: string[] = [];
  if (listing.bedrooms !== undefined) {
    metaParts.push(labels.bedroomsShort.replace('{count}', String(listing.bedrooms)));
  }
  if (listing.bathrooms !== undefined) {
    metaParts.push(labels.bathroomsShort.replace('{count}', String(listing.bathrooms)));
  }
  if (listing.areaSqm !== undefined) {
    metaParts.push(labels.areaShort.replace('{value}', String(listing.areaSqm)));
  }
  const metaHtml = metaParts
    .map(
      (s) =>
        `<span style="
          display:inline-block;
          padding:2px 8px;
          border-radius:5px;
          background:rgba(240,230,208,0.7);
          border:1px solid rgba(200,135,58,0.25);
          font-size:10px;
          font-weight:600;
          color:#7a5530;
          line-height:1.6;
        ">${s}</span>`,
    )
    .join('');

  const featuredBadge = isFeatured
    ? `<span style="
        position:absolute;
        top:8px;
        ${isAr ? 'left' : 'right'}:8px;
        background:linear-gradient(135deg,#E8B84B,#C8873A);
        color:#12100C;
        font-size:9px;
        font-weight:700;
        letter-spacing:0.08em;
        text-transform:uppercase;
        padding:2px 7px;
        border-radius:999px;
        border:1px solid rgba(255,255,255,0.4);
        line-height:1.5;
      ">&#9733; Featured</span>`
    : '';

  return `<div dir="${dir}" style="
    width:260px;
    font-family:system-ui,-apple-system,sans-serif;
    border-radius:14px;
    overflow:hidden;
    background:#FFFCF6;
    color:#12100C;
  ">
    <!-- Photo -->
    <div style="position:relative;width:100%;height:160px;overflow:hidden;background:#F0E6D0;">
      <img
        src="${imageUrl}"
        alt="${title.replace(/"/g, '&quot;')}"
        loading="lazy"
        style="width:100%;height:100%;object-fit:cover;display:block;"
      />
      ${featuredBadge}
    </div>

    <!-- Content -->
    <div style="padding:12px 14px 14px;">
      <!-- Price -->
      <div style="display:flex;align-items:baseline;gap:4px;margin-bottom:4px;">
        <span style="font-size:17px;font-weight:700;color:#C8401A;line-height:1.2;">${price}</span>
        <span style="font-size:11px;color:#7a5530;">${suffix}</span>
      </div>

      <!-- Title -->
      <p style="
        font-size:13px;
        font-weight:600;
        color:#12100C;
        line-height:1.35;
        margin:0 0 4px;
        overflow:hidden;
        display:-webkit-box;
        -webkit-line-clamp:1;
        -webkit-box-orient:vertical;
      ">${title}</p>

      <!-- City, State -->
      <p style="font-size:11px;color:#7a5530;margin:0 0 8px;">
        ${city} &bull; ${stateName}
      </p>

      <!-- Beds / baths / area row -->
      ${metaHtml.length > 0 ? `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px;">${metaHtml}</div>` : ''}

      <!-- View listing link -->
      <a
        href="${href}"
        style="
          display:block;
          text-align:center;
          background:linear-gradient(135deg,#E55A30,#C8401A);
          color:#FDF8F0;
          font-size:12px;
          font-weight:700;
          padding:8px 14px;
          border-radius:999px;
          text-decoration:none;
          letter-spacing:0.02em;
          border:1px solid rgba(255,255,255,0.18);
        "
      >${labels.viewListing} &#8594;</a>
    </div>
  </div>`;
}
