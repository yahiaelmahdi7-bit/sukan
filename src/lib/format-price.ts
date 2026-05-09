/**
 * Formats a numeric value into a short price string suitable for map pin labels.
 *
 * Examples (USD):
 *   999         → "999 USD"
 *   1500        → "1.5K USD"
 *   28000       → "28K USD"
 *   850000      → "850K USD"
 *   1200000     → "1.2M USD"
 *
 * Examples (SDG):
 *   510000      → "510K SDG"
 *   1500000     → "1.5M SDG"
 *
 * Locale is accepted for future Arabic-numeral support; Latin digits are used
 * in both locales for now (Arabic digit rendering is a planned follow-up).
 */
export function formatShortPrice(
  value: number,
  currency: 'USD' | 'SDG',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  locale: 'en' | 'ar' = 'en',
): string {
  let formatted: string;

  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    // Show one decimal only when there's a meaningful fractional part
    const rounded = Math.round(millions * 10) / 10;
    formatted = rounded % 1 === 0 ? `${rounded}M` : `${rounded.toFixed(1)}M`;
  } else if (value >= 1_000) {
    const thousands = value / 1_000;
    const rounded = Math.round(thousands * 10) / 10;
    formatted = rounded % 1 === 0 ? `${rounded}K` : `${rounded.toFixed(1)}K`;
  } else {
    formatted = String(Math.round(value));
  }

  return `${formatted} ${currency}`;
}
