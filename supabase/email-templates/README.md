# Supabase Auth → Resend Email Hook

Sukan sends auth emails (signup confirm, magic link, password reset) **through Resend, not Supabase**. The HTML lives in this folder, version-controlled. Supabase calls a webhook on our app, the webhook renders the right template and ships it via Resend.

## How it works

1. User triggers an auth action (signs up, requests magic link, etc.)
2. Supabase fires the **Send Email Hook** → `POST /api/auth/email-hook` on sukansd.com
3. The route verifies the webhook signature, picks the matching HTML template, replaces `{{ .ConfirmationURL }}` with the real verify URL, and sends via Resend
4. Supabase sees a 200 response and skips its own email

| Email action | Template file |
| --- | --- |
| `signup` | `confirm-signup.html` |
| `magiclink` | `magic-link.html` |
| `recovery` | `reset-password.html` |
| `invite`, `email_change`, `reauthentication` | falls back to `magic-link.html` (extend later if needed) |

## One-time setup

### 1. Environment variables

Already in `.env.local`:
- `RESEND_API_KEY` — your Resend API key (rotate via https://resend.com/api-keys)
- `RESEND_FROM_EMAIL` — e.g. `Sukan <no-reply@sukansd.com>` (domain must be verified in Resend)

Add:
- `SUPABASE_AUTH_HOOK_SECRET` — paste the secret Supabase generates when you create the hook (it starts with `v1,whsec_…`)

Add the same three vars to **Vercel → Project Settings → Environment Variables** for Production + Preview.

### 2. Configure the hook in Supabase Dashboard

**Authentication → Hooks → Send Email Hook**

- **Enable hook:** on
- **Type:** HTTPS
- **URL:** `https://sukansd.com/api/auth/email-hook`
- Click **Generate secret** → copy the full secret (`v1,whsec_…`) → paste into `SUPABASE_AUTH_HOOK_SECRET` in `.env.local` and Vercel
- Save

### 3. Verify it works

In Supabase Dashboard → **Authentication → Users**, send yourself a magic link or reset password. Check:
- Email arrives from `no-reply@sukansd.com`
- HTML matches the brand templates in this folder
- Function logs in Vercel show `200`

## Editing templates

Templates use `{{ .ConfirmationURL }}` — the hook substitutes this at send time, so the same files can also be pasted into Supabase's dashboard if you ever disable the hook.

Other Supabase variables (`{{ .Email }}`, `{{ .Token }}`, `{{ .SiteURL }}`) won't be substituted by the hook — extend `src/app/api/auth/email-hook/route.ts` if you need them.

## Fallback (no hook)

If the hook is disabled, paste each `.html` file into the matching template in **Authentication → Email Templates** (HTML tab). Supabase will then substitute `{{ .ConfirmationURL }}` natively. Configure SMTP under **Project Settings → Auth → SMTP** if you also want Supabase to send from `@sukansd.com`:

- Host: `smtp.resend.com`
- Port: `465`
- Username: `resend`
- Password: your `RESEND_API_KEY`
- Sender: `no-reply@sukansd.com`
