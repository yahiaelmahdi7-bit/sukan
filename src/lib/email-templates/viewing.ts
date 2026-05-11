/**
 * viewing.ts — Viewing request emails
 *
 * Two emails are sent when a tenant requests a viewing:
 *   1. To the landlord  — confirmation + requester info + Confirm/Decline CTAs
 *   2. To the tenant    — receipt/confirmation of their request
 *
 * TODO: i18n later — EN/AR strings are defined inline below.
 */

import {
  wrapEmail,
  emailHeading,
  emailParagraph,
  emailButton,
  emailDivider,
  emailDetailRow,
  escHtml,
} from "./shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ViewingEmailParams {
  locale: string;
  listingTitle: string;
  listingUrl: string;
  listingImageUrl?: string;
  requesterName: string;
  requesterPhone: string;
  preferredDate?: string;
  preferredTime?: string;
  /** Deep-link that sets status=confirmed on the viewing row */
  confirmUrl: string;
  /** Deep-link that sets status=declined on the viewing row */
  declineUrl: string;
}

export interface ViewingReceiptParams {
  locale: string;
  requesterName: string;
  listingTitle: string;
  listingUrl: string;
  preferredDate?: string;
  preferredTime?: string;
}

// ---------------------------------------------------------------------------
// buildViewingLandlordEmail — sent to the landlord
// ---------------------------------------------------------------------------

export function buildViewingLandlordEmail(p: ViewingEmailParams): string {
  const isAr = p.locale === "ar";

  const title = isAr
    ? `طلب معاينة لـ ${p.listingTitle} · سُكَن`
    : `Viewing request for ${p.listingTitle} · Sukan`;

  const preheader = isAr
    ? `${p.requesterName} يرغب في معاينة إعلانك — تأكيد أو رفض`
    : `${p.requesterName} wants to view your listing — confirm or decline.`;

  const headingText = isAr ? "طلب معاينة جديد" : "New viewing request";

  const subText = isAr
    ? `طلب <strong>${escHtml(p.requesterName)}</strong> معاينة إعلانك عبر سُكَن.`
    : `<strong>${escHtml(p.requesterName)}</strong> has requested a viewing of your listing via Sukan.`;

  const labelRequester = isAr ? "الطالب" : "Requester";
  const labelPhone = isAr ? "الهاتف" : "Phone";
  const labelListing = isAr ? "الإعلان" : "Listing";
  const labelDate = isAr ? "التاريخ المفضل" : "Preferred Date";
  const labelTime = isAr ? "الوقت المفضل" : "Preferred Time";
  const ctaConfirm = isAr ? "تأكيد الموعد" : "Confirm Viewing";
  const ctaDecline = isAr ? "رفض الطلب" : "Decline";

  const listingImageBlock = p.listingImageUrl
    ? `<img src="${p.listingImageUrl}" width="528" height="180" alt="${escHtml(p.listingTitle)}"
        style="display:block;width:100%;height:180px;object-fit:cover;border-radius:8px;border:1px solid #E8DDD0;margin-bottom:24px;" />`
    : "";

  // Build detail rows conditionally
  const dateRow = p.preferredDate
    ? emailDetailRow({ label: labelDate, value: p.preferredDate })
    : "";
  const timeRow = p.preferredTime
    ? emailDetailRow({ label: labelTime, value: p.preferredTime })
    : "";

  const body = [
    listingImageBlock,
    emailHeading({ text: headingText, locale: p.locale }),
    emailParagraph({ text: subText, locale: p.locale }),

    `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
      style="border:1px solid #E8DDD0;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      ${emailDetailRow({ label: labelRequester, value: p.requesterName, isFirst: true })}
      ${emailDetailRow({ label: labelPhone, value: p.requesterPhone, telLink: true })}
      ${emailDetailRow({ label: labelListing, value: p.listingTitle })}
      ${dateRow}
      ${timeRow}
    </table>`,

    emailDivider(),

    `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td style="padding-${isAr ? "left" : "right"}:8px;width:50%;">
          ${emailButton({ label: ctaConfirm, url: p.confirmUrl, locale: p.locale })}
        </td>
        <td style="padding-${isAr ? "right" : "left"}:8px;width:50%;">
          ${emailButton({ label: ctaDecline, url: p.declineUrl, locale: p.locale, outline: true })}
        </td>
      </tr>
    </table>`,
  ].join("\n");

  return wrapEmail({ locale: p.locale, title, preheader, body });
}

// ---------------------------------------------------------------------------
// buildViewingReceiptEmail — sent to the tenant confirming their request
// ---------------------------------------------------------------------------

export function buildViewingReceiptEmail(p: ViewingReceiptParams): string {
  const isAr = p.locale === "ar";

  const title = isAr
    ? `تم استلام طلب معاينتك · سُكَن`
    : `Viewing request received · Sukan`;

  const preheader = isAr
    ? `طلب معاينتك لـ "${p.listingTitle}" قيد المراجعة.`
    : `Your viewing request for "${p.listingTitle}" is under review.`;

  const headingText = isAr ? "تم استلام طلبك" : "Request received";

  const subText = isAr
    ? `مرحباً ${escHtml(p.requesterName)}، استلمنا طلب معاينتك لـ "<strong>${escHtml(p.listingTitle)}</strong>" وسيتواصل معك المالك قريباً لتأكيد الموعد.`
    : `Hi ${escHtml(p.requesterName)}, we've received your viewing request for "<strong>${escHtml(p.listingTitle)}</strong>". The landlord will be in touch shortly to confirm.`;

  const labelListing = isAr ? "الإعلان" : "Listing";
  const labelDate = isAr ? "التاريخ المفضل" : "Preferred Date";
  const labelTime = isAr ? "الوقت المفضل" : "Preferred Time";
  const ctaView = isAr ? "عرض الإعلان" : "View Listing";

  const dateRow = p.preferredDate
    ? emailDetailRow({ label: labelDate, value: p.preferredDate })
    : "";
  const timeRow = p.preferredTime
    ? emailDetailRow({ label: labelTime, value: p.preferredTime })
    : "";

  const body = [
    emailHeading({ text: headingText, locale: p.locale }),
    emailParagraph({ text: subText, locale: p.locale }),

    `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
      style="border:1px solid #E8DDD0;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      ${emailDetailRow({ label: labelListing, value: p.listingTitle, isFirst: true })}
      ${dateRow}
      ${timeRow}
    </table>`,

    emailDivider(),
    emailButton({ label: ctaView, url: p.listingUrl, locale: p.locale }),
  ].join("\n");

  return wrapEmail({ locale: p.locale, title, preheader, body });
}

// ---------------------------------------------------------------------------
// Subject line helpers
// ---------------------------------------------------------------------------

export function viewingLandlordSubject(listingTitle: string, locale: string): string {
  return locale === "ar"
    ? `طلب معاينة لـ ${listingTitle} · سُكَن`
    : `Viewing request for ${listingTitle} · Sukan`;
}

export function viewingReceiptSubject(listingTitle: string, locale: string): string {
  return locale === "ar"
    ? `تم استلام طلب معاينتك لـ ${listingTitle} · سُكَن`
    : `Viewing request confirmed — ${listingTitle} · Sukan`;
}
