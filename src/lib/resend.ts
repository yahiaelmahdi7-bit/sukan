/**
 * resend.ts — Sukan transactional email senders
 *
 * All HTML is generated from the shared email design system in
 * src/lib/email-templates/*.ts — table-based, inline styles, bilingual.
 *
 * Each function:
 *  - Returns { ok: false, reason: 'not_configured' } when RESEND_API_KEY
 *    is absent (non-fatal for callers).
 *  - Returns { ok: true, id } on success or { ok: false, reason } on error.
 */

import { Resend } from "resend";
import {
  buildInquiryEmail,
  inquiryEmailSubject,
} from "./email-templates/inquiry";
import {
  buildViewingLandlordEmail,
  buildViewingReceiptEmail,
  viewingLandlordSubject,
  viewingReceiptSubject,
} from "./email-templates/viewing";
import {
  buildReportEmail,
  reportEmailSubject,
} from "./email-templates/report";
import {
  buildAlertEmail,
  alertEmailSubject,
  type AlertListingItem,
} from "./email-templates/alert";

// Re-export types so callers can import from one place
export type { AlertListingItem };

// ---------------------------------------------------------------------------
// Shared result type
// ---------------------------------------------------------------------------

export type EmailResult =
  | { ok: true; id: string }
  | { ok: false; reason: string };

// ---------------------------------------------------------------------------
// Internal: get Resend client or return not_configured
// ---------------------------------------------------------------------------

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

function getFrom(): string {
  return process.env.RESEND_FROM_EMAIL ?? "Sukan <noreply@sukan.app>";
}

async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<EmailResult> {
  const resend = getResend();
  if (!resend) return { ok: false, reason: "not_configured" };

  try {
    const result = await resend.emails.send({
      from: getFrom(),
      to: [to],
      subject,
      html,
    });

    if (result.error) return { ok: false, reason: result.error.message };
    if (!result.data?.id) return { ok: false, reason: "no_id_returned" };
    return { ok: true, id: result.data.id };
  } catch (err: unknown) {
    const reason = err instanceof Error ? err.message : "unknown_error";
    return { ok: false, reason };
  }
}

// ---------------------------------------------------------------------------
// sendInquiryEmail
// Landlord receives this when a prospective tenant messages about a listing.
// ---------------------------------------------------------------------------

export interface SendInquiryEmailParams {
  landlordEmail: string;
  locale: string;
  listingTitle: string;
  listingUrl: string;
  listingImageUrl?: string;
  inquirerName: string;
  inquirerPhone: string;
  message: string;
}

export type SendInquiryEmailResult = EmailResult;

export async function sendInquiryEmail(
  params: SendInquiryEmailParams,
): Promise<SendInquiryEmailResult> {
  const html = buildInquiryEmail(params);
  const subject = inquiryEmailSubject(params.listingTitle, params.locale);
  return sendEmail(params.landlordEmail, subject, html);
}

// ---------------------------------------------------------------------------
// sendViewingEmail
// Two emails: one to the landlord (with Confirm/Decline CTAs) and one to
// the tenant as a receipt.  Both are sent in parallel; failures are non-fatal.
// ---------------------------------------------------------------------------

export interface SendViewingEmailParams {
  locale: string;
  listingTitle: string;
  listingUrl: string;
  listingImageUrl?: string;
  requesterName: string;
  requesterPhone: string;
  requesterEmail?: string | null;
  preferredDate?: string;
  preferredTime?: string;
  /** deep-link to dashboard that sets status=confirmed */
  confirmUrl: string;
  /** deep-link to dashboard that sets status=declined */
  declineUrl: string;
  /** Landlord email — required for the landlord notification */
  landlordEmail?: string | null;
}

export interface SendViewingEmailResult {
  landlord: EmailResult;
  tenant: EmailResult;
}

export async function sendViewingEmail(
  params: SendViewingEmailParams,
): Promise<SendViewingEmailResult> {
  const [landlordResult, tenantResult] = await Promise.all([
    // Landlord email
    params.landlordEmail
      ? sendEmail(
          params.landlordEmail,
          viewingLandlordSubject(params.listingTitle, params.locale),
          buildViewingLandlordEmail(params),
        )
      : Promise.resolve<EmailResult>({ ok: false, reason: "no_landlord_email" }),

    // Tenant receipt
    params.requesterEmail
      ? sendEmail(
          params.requesterEmail,
          viewingReceiptSubject(params.listingTitle, params.locale),
          buildViewingReceiptEmail({
            locale: params.locale,
            requesterName: params.requesterName,
            listingTitle: params.listingTitle,
            listingUrl: params.listingUrl,
            preferredDate: params.preferredDate,
            preferredTime: params.preferredTime,
          }),
        )
      : Promise.resolve<EmailResult>({ ok: false, reason: "no_tenant_email" }),
  ]);

  return { landlord: landlordResult, tenant: tenantResult };
}

// ---------------------------------------------------------------------------
// sendReportEmail
// Admin receives this when a listing is reported.
// ---------------------------------------------------------------------------

export interface SendReportEmailParams {
  locale?: string;
  listingId: string;
  listingTitle: string;
  adminVerifyUrl: string;
  reason: "scam" | "wrong_info" | "duplicate" | "offensive" | "other";
  details?: string;
  reporterEmail?: string | null;
  reporterId?: string | null;
}

export type SendReportEmailResult = EmailResult;

export async function sendReportEmail(
  params: SendReportEmailParams,
): Promise<SendReportEmailResult> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return { ok: false, reason: "no_admin_email_configured" };

  const locale = params.locale ?? "en";
  const html = buildReportEmail({ ...params, locale });
  const subject = reportEmailSubject(params.listingTitle, locale);
  return sendEmail(adminEmail, subject, html);
}

// ---------------------------------------------------------------------------
// sendAlertEmail
// Tenant receives this daily when their saved search matches new listings.
// ---------------------------------------------------------------------------

export interface SendAlertEmailParams {
  locale: string;
  recipientEmail: string;
  firstName: string;
  searchLabel: string;
  listings: AlertListingItem[];
  allMatchesUrl: string;
  unsubscribeUrl: string;
  alertId: string;
}

export type SendAlertEmailResult = EmailResult;

export async function sendAlertEmail(
  params: SendAlertEmailParams,
): Promise<SendAlertEmailResult> {
  if (params.listings.length === 0) {
    return { ok: false, reason: "no_listings" };
  }

  const html = buildAlertEmail(params);
  const subject = alertEmailSubject(
    params.listings.length,
    params.searchLabel,
    params.locale,
  );
  return sendEmail(params.recipientEmail, subject, html);
}
