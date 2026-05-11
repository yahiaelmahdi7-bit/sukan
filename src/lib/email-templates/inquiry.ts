/**
 * inquiry.ts — Inquiry notification email sent to landlords
 *
 * Triggered when a prospective tenant submits an inquiry on a listing.
 * The landlord sees: inquirer name + phone + message, listing thumbnail,
 * a "Reply via WhatsApp" primary CTA, and a secondary "Open in Sukan" link.
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
  emailQuoteBlock,
  escHtml,
} from "./shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface InquiryEmailParams {
  locale: string;
  landlordEmail: string; // used externally by the caller
  listingTitle: string;
  listingUrl: string;
  listingImageUrl?: string;
  inquirerName: string;
  inquirerPhone: string;
  message: string;
}

// ---------------------------------------------------------------------------
// buildInquiryEmail — returns the full HTML string
// ---------------------------------------------------------------------------

export function buildInquiryEmail(p: InquiryEmailParams): string {
  const isAr = p.locale === "ar";

  // ── Copy ──────────────────────────────────────────────────────────────────
  const title = isAr
    ? `استفسار جديد على ${p.listingTitle} · سُكان`
    : `New inquiry on ${p.listingTitle} · Sukan`;

  const preheader = isAr
    ? `${p.inquirerName} مهتم بإعلانك — ردّ الآن`
    : `${p.inquirerName} is interested in your listing — reply now.`;

  const headingText = isAr
    ? "وصلك استفسار جديد"
    : "You have a new inquiry";

  const subText = isAr
    ? `أرسل <strong>${escHtml(p.inquirerName)}</strong> الرسالة التالية عبر سُكان بخصوص إعلانك.`
    : `<strong>${escHtml(p.inquirerName)}</strong> sent the following message via Sukan about your listing.`;

  const labelInquirer = isAr ? "المستفسر" : "Inquirer";
  const labelPhone = isAr ? "الهاتف" : "Phone";
  const labelListing = isAr ? "الإعلان" : "Listing";
  const labelMessage = isAr ? "الرسالة" : "Message";
  const labelMessageUpper = isAr ? "الرسالة" : "MESSAGE";

  const ctaWhatsapp = isAr ? "الرد عبر واتساب" : "Reply via WhatsApp";
  const ctaDashboard = isAr ? "فتح لوحة التحكم في سُكان" : "Open in Sukan dashboard";

  // ── WhatsApp deep-link ────────────────────────────────────────────────────
  const waReplyText = isAr
    ? `أهلاً، أريد الرد على استفسارك عن إعلاني على سُكان: ${p.listingTitle}`
    : `Hi, I'm replying to your inquiry about my listing on Sukan: ${p.listingTitle}`;
  const waUrl = `https://wa.me/${p.inquirerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(waReplyText)}`;

  // ── Listing thumbnail ─────────────────────────────────────────────────────
  const listingImageBlock = p.listingImageUrl
    ? `<img src="${p.listingImageUrl}" width="528" height="200" alt="${escHtml(p.listingTitle)}"
        style="display:block;width:100%;height:200px;object-fit:cover;border-radius:8px;border:1px solid #E8DDD0;margin-bottom:24px;" />`
    : "";

  // ── Body HTML ─────────────────────────────────────────────────────────────
  const body = [
    listingImageBlock,
    emailHeading({ text: headingText, locale: p.locale }),
    emailParagraph({ text: subText, locale: p.locale }),

    // Details table
    `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
      style="border:1px solid #E8DDD0;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      ${emailDetailRow({ label: labelInquirer, value: p.inquirerName, isFirst: true })}
      ${emailDetailRow({ label: labelPhone, value: p.inquirerPhone, telLink: true })}
      ${emailDetailRow({ label: labelListing, value: p.listingTitle })}
    </table>`,

    // Message
    `<p style="margin:0 0 6px;font-family:Lato,'Helvetica Neue',Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#8C7C69;">
      ${labelMessageUpper}
    </p>`,
    emailQuoteBlock(p.message, isAr),

    emailDivider(),

    // CTA row — WhatsApp primary + Dashboard secondary
    `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td style="padding-${isAr ? "left" : "right"}:8px;width:50%;">
          ${emailButton({ label: ctaWhatsapp, url: waUrl, locale: p.locale })}
        </td>
        <td style="padding-${isAr ? "right" : "left"}:8px;width:50%;">
          ${emailButton({ label: ctaDashboard, url: p.listingUrl, locale: p.locale, outline: true })}
        </td>
      </tr>
    </table>`,
  ].join("\n");

  return wrapEmail({
    locale: p.locale,
    title,
    preheader,
    body,
  });
}

// ---------------------------------------------------------------------------
// subject helper — exported for use in the route
// ---------------------------------------------------------------------------

export function inquiryEmailSubject(listingTitle: string, locale: string): string {
  return locale === "ar"
    ? `استفسار جديد على ${listingTitle} · سُكان`
    : `New inquiry on ${listingTitle} · Sukan`;
}
