/**
 * report.ts — Listing report email sent to admin
 *
 * Sent when a user submits a report against a listing.
 * The admin receives: reporter info (may be anonymous), reason category,
 * optional message, and a link to the admin verify/moderate page.
 *
 * TODO: i18n later — Only EN is used for admin emails (admin is always EN).
 *       AR copy is kept for completeness in case of future user-facing reports.
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

export type ReportReason = "scam" | "wrong_info" | "duplicate" | "offensive" | "other";

export interface ReportEmailParams {
  locale: string; // typically always "en" for admin
  listingId: string;
  listingTitle: string;
  /** Link to the admin moderation page for this listing */
  adminVerifyUrl: string;
  reason: ReportReason;
  details?: string;
  /** May be undefined/null for anonymous reports */
  reporterEmail?: string | null;
  /** May be undefined/null for anonymous reports */
  reporterId?: string | null;
}

// ---------------------------------------------------------------------------
// Human-readable reason labels
// ---------------------------------------------------------------------------

const REASON_LABELS_EN: Record<ReportReason, string> = {
  scam: "Suspected Scam",
  wrong_info: "Wrong / Misleading Information",
  duplicate: "Duplicate Listing",
  offensive: "Offensive Content",
  other: "Other",
};

const REASON_LABELS_AR: Record<ReportReason, string> = {
  scam: "احتيال محتمل",
  wrong_info: "معلومات خاطئة أو مضللة",
  duplicate: "إعلان مكرر",
  offensive: "محتوى مسيء",
  other: "أخرى",
};

// ---------------------------------------------------------------------------
// buildReportEmail
// ---------------------------------------------------------------------------

export function buildReportEmail(p: ReportEmailParams): string {
  const isAr = p.locale === "ar";

  const title = isAr
    ? `[تقرير] ${p.listingTitle} · سُكَن`
    : `[Report] ${p.listingTitle} · Sukan`;

  const preheader = isAr
    ? `تم الإبلاغ عن إعلان — السبب: ${REASON_LABELS_AR[p.reason]}`
    : `Listing reported — reason: ${REASON_LABELS_EN[p.reason]}`;

  const headingText = isAr ? "تم الإبلاغ عن إعلان" : "Listing reported";

  const subText = isAr
    ? "أبلغ أحد المستخدمين عن الإعلان التالي. يرجى مراجعته واتخاذ الإجراء المناسب."
    : "A user has reported the following listing. Please review it and take appropriate action.";

  const labelListing = isAr ? "الإعلان" : "Listing";
  const labelReason = isAr ? "السبب" : "Reason";
  const labelReporter = isAr ? "المُبلِّغ" : "Reporter";
  const labelDetails = isAr ? "التفاصيل" : "Details";
  const labelDetailsUpper = isAr ? "التفاصيل" : "DETAILS";
  const ctaReview = isAr ? "مراجعة الإعلان في لوحة الإدارة" : "Review in Admin Panel";

  const reasonLabel = isAr ? REASON_LABELS_AR[p.reason] : REASON_LABELS_EN[p.reason];
  const reporterDisplay =
    p.reporterEmail ?? p.reporterId ?? (isAr ? "مجهول" : "Anonymous");

  const detailsBlock =
    p.details
      ? [
          `<p style="margin:0 0 6px;font-family:Lato,'Helvetica Neue',Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#8C7C69;">
            ${labelDetailsUpper}
          </p>`,
          emailQuoteBlock(p.details, isAr),
        ].join("\n")
      : "";

  const body = [
    emailHeading({ text: headingText, locale: p.locale }),
    emailParagraph({ text: subText, locale: p.locale }),

    `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
      style="border:1px solid #E8DDD0;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      ${emailDetailRow({ label: labelListing, value: p.listingTitle, isFirst: true })}
      ${emailDetailRow({ label: labelReason, value: reasonLabel })}
      ${emailDetailRow({ label: labelReporter, value: reporterDisplay })}
    </table>`,

    detailsBlock,

    emailDivider(),
    emailButton({ label: ctaReview, url: p.adminVerifyUrl, locale: p.locale }),
  ].join("\n");

  return wrapEmail({ locale: p.locale, title, preheader, body });
}

// ---------------------------------------------------------------------------
// Subject line helper
// ---------------------------------------------------------------------------

export function reportEmailSubject(listingTitle: string, locale: string): string {
  return locale === "ar"
    ? `[تقرير] ${listingTitle} · سُكَن`
    : `[Report] ${listingTitle} · Sukan`;
}
