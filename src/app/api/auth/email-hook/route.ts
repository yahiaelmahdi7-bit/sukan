/**
 * Supabase Send Email Hook
 *
 * Receives a webhook from Supabase Auth whenever it would otherwise send an
 * email (signup confirm, magic link, password reset, etc.) and dispatches a
 * brand-styled email via Resend instead. Returning 200 with an empty JSON body
 * tells Supabase "we handled it — don't send your own email."
 *
 * Configure in Supabase Dashboard → Authentication → Hooks → Send Email Hook:
 *   URL:    https://sukansd.com/api/auth/email-hook
 *   Secret: see SUPABASE_AUTH_HOOK_SECRET in .env (starts with v1,whsec_…)
 *
 * Docs: https://supabase.com/docs/guides/auth/auth-hooks/send-email-hook
 */

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { Webhook } from "standardwebhooks";

export const runtime = "nodejs";

type EmailActionType =
  | "signup"
  | "magiclink"
  | "recovery"
  | "invite"
  | "email_change"
  | "email_change_current"
  | "email_change_new"
  | "reauthentication";

type Payload = {
  user: { id: string; email: string };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: EmailActionType;
    site_url: string;
    token_new?: string;
    token_hash_new?: string;
  };
};

const TEMPLATES_DIR = path.join(
  process.cwd(),
  "supabase",
  "email-templates",
);

// ─── Template + subject mapping ──────────────────────────────────────────────

function templateFor(action: EmailActionType): {
  file: string;
  subject: string;
} | null {
  switch (action) {
    case "signup":
      return {
        file: "confirm-signup.html",
        subject: "Confirm your Sukan account · أكّد حسابك في سُكان",
      };
    case "magiclink":
      return {
        file: "magic-link.html",
        subject: "Your Sukan sign-in link · رابط تسجيل الدخول",
      };
    case "recovery":
      return {
        file: "reset-password.html",
        subject: "Reset your Sukan password · إعادة تعيين كلمة المرور",
      };
    // email_change / invite / reauthentication fall back to the magic-link
    // shell; copy still reads correctly. Build dedicated templates when needed.
    case "invite":
    case "email_change":
    case "email_change_current":
    case "email_change_new":
    case "reauthentication":
      return {
        file: "magic-link.html",
        subject: "Action required on your Sukan account",
      };
    default:
      return null;
  }
}

// ─── Build the confirmation URL Supabase would have built itself ─────────────

function buildConfirmationUrl(d: Payload["email_data"]): string {
  // Supabase's internal verify endpoint — mirrors what {{ .ConfirmationURL }}
  // expands to in the dashboard templates.
  const url = new URL(`${d.site_url.replace(/\/$/, "")}/auth/v1/verify`);
  url.searchParams.set("token", d.token_hash);
  url.searchParams.set("type", d.email_action_type);
  url.searchParams.set("redirect_to", d.redirect_to);
  return url.toString();
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const secret = process.env.SUPABASE_AUTH_HOOK_SECRET;
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "Sukan <no-reply@sukansd.com>";

  if (!secret || !resendKey) {
    return NextResponse.json(
      { error: "email hook not configured" },
      { status: 500 },
    );
  }

  // Verify the webhook signature using Standard Webhooks (svix-compatible)
  const rawBody = await req.text();
  const headers = {
    "webhook-id": req.headers.get("webhook-id") ?? "",
    "webhook-timestamp": req.headers.get("webhook-timestamp") ?? "",
    "webhook-signature": req.headers.get("webhook-signature") ?? "",
  };

  let payload: Payload;
  try {
    // Supabase stores the secret base64-encoded with a "v1,whsec_" prefix.
    // Standard Webhooks expects the raw base64 portion.
    const cleanedSecret = secret.replace(/^v1,whsec_/, "");
    const wh = new Webhook(cleanedSecret);
    payload = wh.verify(rawBody, headers) as Payload;
  } catch (err) {
    console.error("[auth-email-hook] signature verification failed", err);
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const action = payload.email_data?.email_action_type;
  const tpl = templateFor(action);
  if (!tpl) {
    console.error("[auth-email-hook] unsupported action", action);
    return NextResponse.json({ error: "unsupported action" }, { status: 400 });
  }

  const confirmationUrl = buildConfirmationUrl(payload.email_data);

  let html: string;
  try {
    html = await readFile(path.join(TEMPLATES_DIR, tpl.file), "utf8");
  } catch (err) {
    console.error("[auth-email-hook] template read failed", tpl.file, err);
    return NextResponse.json({ error: "template missing" }, { status: 500 });
  }

  // Supabase template variables aren't interpolated by Supabase when we
  // intercept the email, so do it here. Replace every `{{ .ConfirmationURL }}`
  // (with any whitespace variant) with the real URL.
  html = html.replace(/\{\{\s*\.ConfirmationURL\s*\}\}/g, confirmationUrl);

  const resend = new Resend(resendKey);
  const { error: sendError } = await resend.emails.send({
    from: fromEmail,
    to: payload.user.email,
    subject: tpl.subject,
    html,
  });

  if (sendError) {
    console.error("[auth-email-hook] resend send failed", sendError);
    return NextResponse.json({ error: "send failed" }, { status: 502 });
  }

  return NextResponse.json({});
}
