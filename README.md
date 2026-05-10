# Sukan (سكن)

Sudan's first AI-powered property listing platform. Mobile-first bilingual (Arabic/English) PWA connecting landlords, tenants, and diaspora investors.

## Status
Pre-alpha. Live preview at [sukan.vercel.app](https://sukan.vercel.app). Auto-deploys from `main` via Vercel + GitHub integration.

## Stack
- Next.js 16 (App Router, Cache Components)
- Supabase (Postgres + Auth + Storage)
- Anthropic Claude API (matching, descriptions, price estimates)
- Twilio WhatsApp API (landlord listing bot)
- Stripe (diaspora payments)
- Vercel + Cloudflare CDN

## Features

| # | Feature | Status |
|---|---------|--------|
| 1 | Analytics dashboard | ✓ scaffolded |
| 2 | Photo upload (drag-drop, 5-file, Supabase Storage) | ✓ scaffolded, requires migrations applied |
| 3 | Price alerts (saved searches, daily cron email) | ✓ scaffolded, requires migrations applied |
| 4 | Verified landlord badge + profile flag | ✓ scaffolded, requires migrations applied |
| 5 | Landlord reviews & star ratings | ✓ scaffolded, requires migrations applied |
| 6 | AI description generator (Claude, bilingual) | ✓ scaffolded |
| 7 | AI price estimator (Claude, Sudanese ranges) | ✓ scaffolded |
| 8 | Viewing request modal (email notification) | ✓ scaffolded, requires migrations applied |
| 9 | Share button (WhatsApp / X / copy-link) | ✓ scaffolded |
| 10 | Report listing (modal + admin email) | ✓ scaffolded, requires migrations applied |

To apply all migrations: `supabase db push`

## Environment variables

| Variable | Required | Used by |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase client (browser + server) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase client (browser + server) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | `/api/alerts/check` cron — bypasses RLS to scan all alerts |
| `RESEND_API_KEY` | Yes | Inquiry, viewing, report, and alert notification emails |
| `RESEND_FROM_EMAIL` | No | From address for all Resend emails (defaults to `Sukan <noreply@sukan.app>`) |
| `ANTHROPIC_API_KEY` | Yes (AI features) | `/api/generate-description` and `/api/estimate-price` |
| `CRON_SECRET` | Yes | Authenticates Vercel Cron calls to `/api/alerts/check` via `x-cron-secret` header |
| `ADMIN_EMAIL` | Yes | Destination for listing report notifications |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical URL used in emails and metadata |
| `HIGGSFIELD_API_KEY` | Yes (AI photo enhancement) | `POST /api/photos/enhance` — sends landlord photos to Higgsfield for real-estate-tuned image enhancement. If unset the route returns 503. Get your key at [app.higgsfield.ai](https://app.higgsfield.ai). |
| `HIGGSFIELD_STUB` | No | Set to `true` to run enhancement in stub mode (returns the original photo unchanged) — useful for local dev without credentials. |

## Brand
- Name: Sukan / سكن ("housing")
- Mark: The River Letter — Arabic س drawn as three Nile-bend waves
- Palette: deep earth #12100C, terracotta #C8401A, gold #C8873A, parchment #FDF8F0
- Type: Cormorant Garamond (display), Lato (body), Noto Naskh Arabic

