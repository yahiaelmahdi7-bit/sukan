import { Resend } from "resend";

export interface SendInquiryEmailParams {
  landlordEmail: string;
  listingTitle: string;
  listingUrl: string;
  inquirerName: string;
  inquirerPhone: string;
  message: string;
  locale: string;
}

export type SendInquiryEmailResult =
  | { ok: true; id: string }
  | { ok: false; reason: string };

/**
 * Sends a new-inquiry notification email to the landlord.
 *
 * Returns { ok: false, reason: 'not_configured' } when RESEND_API_KEY is not
 * set — callers must treat this as a non-fatal soft failure.
 */
export async function sendInquiryEmail(
  params: SendInquiryEmailParams,
): Promise<SendInquiryEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return { ok: false, reason: "not_configured" };
  }

  const {
    landlordEmail,
    listingTitle,
    listingUrl,
    inquirerName,
    inquirerPhone,
    message,
    locale,
  } = params;

  const from =
    process.env.RESEND_FROM_EMAIL ?? "Sukan <noreply@sukan.app>";

  const isAr = locale === "ar";

  const subject = isAr
    ? "استفسار جديد على إعلانك في سُكَن"
    : "New inquiry on your Sukan listing";

  // WhatsApp deep-link for the landlord to reply to the inquirer
  const waReplyText = isAr
    ? `أهلاً، أريد الرد على استفسارك عن إعلاني على سُكَن: ${listingTitle}`
    : `Hi, I'm replying to your inquiry about my listing on Sukan: ${listingTitle}`;
  const waUrl = `https://wa.me/${inquirerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(waReplyText)}`;

  const html = buildEmailHtml({
    isAr,
    listingTitle,
    listingUrl,
    inquirerName,
    inquirerPhone,
    message,
    waUrl,
  });

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to: [landlordEmail],
      subject,
      html,
    });

    if (result.error) {
      return { ok: false, reason: result.error.message };
    }

    if (!result.data?.id) {
      return { ok: false, reason: "no_id_returned" };
    }

    return { ok: true, id: result.data.id };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "unknown_error";
    return { ok: false, reason: message };
  }
}

/* ─────────────────────────────────────────────────────────
   HTML email builder
   Max-width 560 table layout — resilient across email clients.
   Brand palette: parchment bg (#FDF8F0), earth text (#12100C),
   terracotta accent (#C8401A).
───────────────────────────────────────────────────────── */

interface BuildEmailHtmlParams {
  isAr: boolean;
  listingTitle: string;
  listingUrl: string;
  inquirerName: string;
  inquirerPhone: string;
  message: string;
  waUrl: string;
}

function buildEmailHtml(p: BuildEmailHtmlParams): string {
  const dir = p.isAr ? "rtl" : "ltr";

  const labelInquirer = p.isAr ? "المستفسر" : "Inquirer";
  const labelPhone = p.isAr ? "الهاتف" : "Phone";
  const labelListing = p.isAr ? "الإعلان" : "Listing";
  const labelMessage = p.isAr ? "الرسالة" : "Message";
  const ctaWhatsapp = p.isAr ? "الرد عبر واتساب" : "Reply via WhatsApp";
  const ctaView = p.isAr ? "عرض الإعلان على سُكَن" : "View on Sukan";
  const headingText = p.isAr
    ? "استفسار جديد على إعلانك"
    : "New inquiry on your listing";
  const subheadingText = p.isAr
    ? "أرسل أحد المستخدمين الرسالة التالية عبر سُكَن."
    : "Someone sent you the following message via Sukan.";
  const footerText = p.isAr
    ? "أُرسل من سُكَن &middot; Sukan"
    : "Sent from Sukan &middot; سُكَن";

  return `<!DOCTYPE html>
<html lang="${p.isAr ? "ar" : "en"}" dir="${dir}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${headingText}</title>
</head>
<body style="margin:0;padding:0;background:#FDF8F0;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FDF8F0;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Outer card -->
        <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(18,16,12,0.08);">

          <!-- Header band -->
          <tr>
            <td style="background:#12100C;padding:28px 32px 24px;text-align:${p.isAr ? "right" : "left"};">
              <!-- Wordmark -->
              <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:22px;font-weight:bold;color:#C8873A;letter-spacing:0.04em;">
                Sukan &nbsp;&nbsp; <span style="font-size:18px;color:#C8873A;">سُكَن</span>
              </p>
              <p style="margin:0;font-family:Georgia,serif;font-size:13px;color:#8c7c69;">
                ${p.isAr ? "بيت السودان للسكن" : "Sudan's home for housing"}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 32px 24px;direction:${dir};">
              <h1 style="margin:0 0 8px;font-family:Georgia,serif;font-size:22px;color:#12100C;font-weight:bold;">
                ${headingText}
              </h1>
              <p style="margin:0 0 28px;font-size:14px;color:#5a4f42;line-height:1.6;">
                ${subheadingText}
              </p>

              <!-- Details table -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e8ddd0;border-radius:8px;overflow:hidden;margin-bottom:24px;">
                ${buildRow(labelInquirer, p.inquirerName, true)}
                ${buildRow(labelPhone, p.inquirerPhone, false)}
                ${buildRow(labelListing, p.listingTitle, false)}
              </table>

              <!-- Message block -->
              <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#8c7c69;font-family:Georgia,serif;">
                ${labelMessage}
              </p>
              <div style="background:#fdf4e8;border-left:3px solid #C8401A;padding:14px 18px;border-radius:4px;margin-bottom:28px;font-size:14px;color:#12100C;line-height:1.7;white-space:pre-wrap;">${escapeHtml(p.message)}</div>

              <!-- CTAs -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;">
                <tr>
                  <td style="padding-${p.isAr ? "left" : "right"}:8px;">
                    <a href="${p.waUrl}" style="display:block;text-align:center;background:#C8401A;color:#ffffff;text-decoration:none;padding:13px 20px;border-radius:999px;font-size:14px;font-weight:bold;font-family:Georgia,serif;">
                      ${ctaWhatsapp}
                    </a>
                  </td>
                  <td style="padding-${p.isAr ? "right" : "left"}:8px;">
                    <a href="${p.listingUrl}" style="display:block;text-align:center;background:#ffffff;color:#C8401A;text-decoration:none;padding:13px 20px;border-radius:999px;font-size:14px;font-weight:bold;font-family:Georgia,serif;border:1.5px solid #C8401A;">
                      ${ctaView}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f7f0e6;padding:18px 32px;border-top:1px solid #e8ddd0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#8c7c69;font-family:Georgia,serif;">
                ${footerText}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildRow(label: string, value: string, isFirst: boolean): string {
  const borderTop = isFirst ? "" : "border-top:1px solid #e8ddd0;";
  return `
  <tr>
    <td style="${borderTop}padding:10px 16px;width:30%;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#8c7c69;background:#fdf8f0;font-family:Georgia,serif;">
      ${label}
    </td>
    <td style="${borderTop}padding:10px 16px;font-size:14px;color:#12100C;font-family:Georgia,serif;">
      ${escapeHtml(value)}
    </td>
  </tr>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
