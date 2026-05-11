/**
 * shared.ts — Sukan transactional email design system
 *
 * Table-based, inline-styles-only HTML for maximum compatibility across
 * Gmail, Outlook, Apple Mail, etc.  No <style> tags, no flexbox/grid,
 * no external CSS, no JS.
 *
 * Brand palette:
 *   Parchment bg  #FDF8F0
 *   Ink / text    #12100C
 *   Terracotta    #C8401A
 *   Gold          #C8873A
 *   Warm white    #FFFFFF
 *   Warm border   #E8DDD0
 *   Sand row bg   #FAF5ED
 *
 * Fonts: "Cormorant Garamond, Georgia, serif" (headings)
 *        "Lato, 'Helvetica Neue', Arial, sans-serif" (body)
 *
 * TODO: i18n later — EN/AR strings are defined inline per template.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WrapEmailParams {
  /** "en" or "ar" — controls dir="rtl" and lang attr */
  locale: string;
  /** Plain-text <title> for the email */
  title: string;
  /**
   * Short text shown as inbox preview / preheader.
   * Keep under 140 characters.
   */
  preheader: string;
  /** The rendered body HTML (use the helper functions below) */
  body: string;
  /**
   * Optional note appended inside the footer, e.g. unsubscribe instructions.
   * Leave undefined for purely transactional emails.
   */
  footerNote?: string;
}

export interface EmailButtonParams {
  label: string;
  url: string;
  locale: string;
  /** Defaults to terracotta filled. Set true for the ghost/outline variant */
  outline?: boolean;
}

export interface EmailHeadingParams {
  text: string;
  locale: string;
}

export interface EmailParagraphParams {
  text: string;
  locale: string;
}

// ---------------------------------------------------------------------------
// wrapEmail — full HTML document wrapper
// ---------------------------------------------------------------------------

export function wrapEmail({
  locale,
  title,
  preheader,
  body,
  footerNote,
}: WrapEmailParams): string {
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";
  const lang = isAr ? "ar" : "en";

  const wordmark = isAr
    ? "سوكان &nbsp;&nbsp; <span style=\"font-family:Lato,'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#C8873A;letter-spacing:0.06em;\">SUKAN</span>"
    : "Sukan &nbsp;&nbsp; <span style=\"font-family:Lato,'Helvetica Neue',Arial,sans-serif;font-size:12px;color:#C8873A;letter-spacing:0.12em;\">سوكان</span>";

  const footerBrand = isAr
    ? "أُرسل من سوكان &middot; Sudan&rsquo;s home for housing"
    : "Sent by Sukan &middot; Sudan&rsquo;s home for housing";

  const footerNoteHtml = footerNote
    ? `<p style="margin:8px 0 0;font-size:11px;color:#A09080;font-family:Lato,'Helvetica Neue',Arial,sans-serif;line-height:1.5;">${footerNote}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${escHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#FDF8F0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">

  <!-- Preheader: visible in inbox preview, hidden in email body -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;color:#FDF8F0;line-height:1px;">${escHtml(preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>

  <!-- Full-width outer wrapper -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#FDF8F0;border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- 600px inner card -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600"
          style="max-width:600px;width:100%;background:#FFFFFF;border-radius:14px;overflow:hidden;box-shadow:0 2px 20px rgba(18,16,12,0.09);">

          <!-- ─── Brand header ─── -->
          <tr>
            <td style="background:#12100C;padding:28px 36px 24px;text-align:${isAr ? "right" : "left"};">
              <p style="margin:0 0 3px;font-family:'Cormorant Garamond',Georgia,serif;font-size:26px;font-weight:700;color:#C8873A;letter-spacing:0.03em;line-height:1.2;">
                ${wordmark}
              </p>
              <p style="margin:0;font-family:Lato,'Helvetica Neue',Arial,sans-serif;font-size:12px;color:#6B5E50;letter-spacing:0.06em;text-transform:uppercase;">
                ${isAr ? "بيت السودان للسكن" : "Sudan's Home for Housing"}
              </p>
            </td>
          </tr>

          <!-- ─── Body content ─── -->
          <tr>
            <td style="padding:36px 36px 28px;direction:${dir};">
              ${body}
            </td>
          </tr>

          <!-- ─── Footer ─── -->
          <tr>
            <td style="background:#FAF5ED;padding:18px 36px;border-top:1px solid #E8DDD0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#8C7C69;font-family:Lato,'Helvetica Neue',Arial,sans-serif;line-height:1.5;">
                ${footerBrand}
              </p>
              ${footerNoteHtml}
            </td>
          </tr>

        </table>
        <!-- /600px inner card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
}

// ---------------------------------------------------------------------------
// emailButton — primary or outline CTA button
// ---------------------------------------------------------------------------

export function emailButton({ label, url, locale, outline }: EmailButtonParams): string {
  const isAr = locale === "ar";
  const bg = outline ? "#FFFFFF" : "#C8401A";
  const color = outline ? "#C8401A" : "#FFFFFF";
  const border = outline ? "2px solid #C8401A" : "2px solid #C8401A";
  const align = isAr ? "right" : "left";

  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0;${isAr ? "margin-left:auto;" : ""}">
  <tr>
    <td style="border-radius:999px;background:${bg};border:${border};">
      <a href="${url}" target="_blank"
        style="display:inline-block;padding:13px 28px;font-family:'Cormorant Garamond',Georgia,serif;font-size:15px;font-weight:700;color:${color};text-decoration:none;border-radius:999px;letter-spacing:0.02em;text-align:${align};">
        ${label}
      </a>
    </td>
  </tr>
</table>`;
}

// ---------------------------------------------------------------------------
// emailHeading — display heading in Cormorant Garamond
// ---------------------------------------------------------------------------

export function emailHeading({ text, locale }: EmailHeadingParams): string {
  const isAr = locale === "ar";
  return `<h1 style="margin:0 0 10px;font-family:'Cormorant Garamond',Georgia,serif;font-size:26px;font-weight:700;color:#12100C;line-height:1.25;letter-spacing:${isAr ? "0" : "0.01em"};">
  ${text}
</h1>`;
}

// ---------------------------------------------------------------------------
// emailParagraph — body paragraph
// ---------------------------------------------------------------------------

export function emailParagraph({ text, locale: _locale }: EmailParagraphParams): string {
  return `<p style="margin:0 0 20px;font-family:Lato,'Helvetica Neue',Arial,sans-serif;font-size:14px;color:#3D3229;line-height:1.7;">
  ${text}
</p>`;
}

// ---------------------------------------------------------------------------
// emailDivider — subtle warm separator
// ---------------------------------------------------------------------------

export function emailDivider(): string {
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:24px 0;">
  <tr>
    <td style="border-top:1px solid #E8DDD0;font-size:0;line-height:0;">&nbsp;</td>
  </tr>
</table>`;
}

// ---------------------------------------------------------------------------
// emailDetailRow — one label/value row inside an info table
// ---------------------------------------------------------------------------

export interface DetailRowParams {
  label: string;
  value: string;
  isFirst?: boolean;
  /** If true, wraps value in a <a href> tel: link */
  telLink?: boolean;
}

export function emailDetailRow({ label, value, isFirst, telLink }: DetailRowParams): string {
  const borderTop = isFirst ? "" : "border-top:1px solid #E8DDD0;";
  const valueHtml = telLink
    ? `<a href="tel:${escHtml(value)}" style="color:#C8401A;text-decoration:none;">${escHtml(value)}</a>`
    : escHtml(value);

  return `<tr>
  <td style="${borderTop}padding:10px 16px;width:32%;font-family:Lato,'Helvetica Neue',Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.07em;color:#8C7C69;background:#FAF5ED;vertical-align:top;">
    ${label}
  </td>
  <td style="${borderTop}padding:10px 16px;font-family:Lato,'Helvetica Neue',Arial,sans-serif;font-size:14px;color:#12100C;vertical-align:top;">
    ${valueHtml}
  </td>
</tr>`;
}

// ---------------------------------------------------------------------------
// emailQuoteBlock — message/quote highlighted block
// ---------------------------------------------------------------------------

export function emailQuoteBlock(text: string, isAr: boolean): string {
  const borderSide = isAr ? "border-right" : "border-left";
  return `<div style="background:#FAF5ED;${borderSide}:3px solid #C8873A;padding:16px 20px;border-radius:4px;margin:0 0 28px;font-family:Lato,'Helvetica Neue',Arial,sans-serif;font-size:14px;color:#12100C;line-height:1.75;white-space:pre-wrap;">${escHtml(text)}</div>`;
}

// ---------------------------------------------------------------------------
// emailListingCard — single listing thumbnail card for alert emails
// ---------------------------------------------------------------------------

export interface ListingCardParams {
  title: string;
  price: string;
  location: string;
  url: string;
  imageUrl?: string;
  locale: string;
  ctaLabel: string;
}

export function emailListingCard({
  title,
  price,
  location,
  url,
  imageUrl,
  locale,
  ctaLabel,
}: ListingCardParams): string {
  const isAr = locale === "ar";
  const align = isAr ? "right" : "left";

  const imageBlock = imageUrl
    ? `<img src="${imageUrl}" width="528" height="180" alt="${escHtml(title)}"
        style="display:block;width:100%;height:180px;object-fit:cover;border-radius:8px 8px 0 0;border:0;" />`
    : `<div style="width:100%;height:120px;background:#F0E8DC;border-radius:8px 8px 0 0;display:block;"></div>`;

  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
  style="margin-bottom:16px;border:1px solid #E8DDD0;border-radius:10px;overflow:hidden;background:#FFFFFF;">
  <tr><td>${imageBlock}</td></tr>
  <tr>
    <td style="padding:16px 20px;text-align:${align};">
      <p style="margin:0 0 4px;font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;font-weight:700;color:#12100C;line-height:1.3;">
        ${escHtml(title)}
      </p>
      <p style="margin:0 0 4px;font-family:Lato,'Helvetica Neue',Arial,sans-serif;font-size:15px;font-weight:700;color:#C8401A;">
        ${escHtml(price)}
      </p>
      <p style="margin:0 0 14px;font-family:Lato,'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#8C7C69;">
        ${escHtml(location)}
      </p>
      ${emailButton({ label: ctaLabel, url, locale, outline: true })}
    </td>
  </tr>
</table>`;
}

// ---------------------------------------------------------------------------
// Utility: HTML-escape a plain string for safe embedding
// ---------------------------------------------------------------------------

export function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
