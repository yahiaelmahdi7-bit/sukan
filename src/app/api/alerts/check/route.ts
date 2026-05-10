import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { Resend } from "resend";

// ---------------------------------------------------------------------------
// Admin Supabase client — bypasses RLS using the service role key.
// Only used in this cron route; never exposed to the browser.
// ---------------------------------------------------------------------------
function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL not set");
  }

  return createServerClient(url, serviceRoleKey, {
    cookies: { getAll: () => [], setAll: () => {} },
    auth: { persistSession: false },
  });
}

// ---------------------------------------------------------------------------
// Inline row types (generated types may be stale)
// ---------------------------------------------------------------------------
interface PriceAlert {
  id: string;
  user_id: string;
  state: string | null;
  property_type: string | null;
  purpose: string;
  max_price: number | null;
  currency: string;
}

interface MatchedListing {
  id: string;
  title_en: string | null;
  title_ar: string | null;
  price: number;
  currency: string;
  state: string;
  city: string;
  property_type: string;
  purpose: string;
  created_at: string;
}

export async function POST(req: Request): Promise<NextResponse> {
  // Authenticate the cron call
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || req.headers.get("x-cron-secret") !== cronSecret) {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  const resendKey = process.env.RESEND_API_KEY;

  let supabase: ReturnType<typeof createAdminClient>;
  try {
    supabase = createAdminClient();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "ADMIN_CLIENT_ERROR";
    return NextResponse.json({ ok: false, error: message }, { status: 503 });
  }

  // Fetch all active alerts
  const { data: alerts, error: alertsError } = await supabase
    .from("price_alerts")
    .select("id, user_id, state, property_type, purpose, max_price, currency")
    .eq("is_active", true);

  if (alertsError) {
    return NextResponse.json({ ok: false, error: alertsError.message }, { status: 500 });
  }

  if (!alerts || alerts.length === 0) {
    return NextResponse.json({ processed: 0, alerts_matched: 0, emails_sent: 0 });
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  let alertsMatched = 0;
  let emailsSent = 0;

  const resend = resendKey ? new Resend(resendKey) : null;
  const from = process.env.RESEND_FROM_EMAIL ?? "Sukan <noreply@sukan.app>";

  for (const alert of alerts as PriceAlert[]) {
    // Build query for matching listings created in last 24h
    let query = supabase
      .from("listings")
      .select("id, title_en, title_ar, price, currency, state, city, property_type, purpose, created_at")
      .eq("is_published", true)
      .eq("purpose", alert.purpose)
      .gte("created_at", since);

    if (alert.state) {
      query = query.eq("state", alert.state);
    }
    if (alert.property_type) {
      query = query.eq("property_type", alert.property_type);
    }
    if (alert.max_price != null) {
      query = query.lte("price", alert.max_price);
    }

    const { data: matches } = await query;

    if (!matches || matches.length === 0) continue;

    alertsMatched++;

    if (!resend) continue;

    // Fetch the user's email via admin auth API
    const { data: userData } = await supabase.auth.admin.getUserById(alert.user_id);
    const userEmail = userData?.user?.email;

    if (!userEmail) continue;

    // Build listing summary
    const listingLines = (matches as MatchedListing[])
      .map(
        (l) =>
          `• ${l.title_en ?? "Listing"} — $${l.price} USD — ${l.city}, ${l.state}\n  https://sukan.app/listings/${l.id}`,
      )
      .join("\n\n");

    try {
      await resend.emails.send({
        from,
        to: [userEmail],
        subject: `${matches.length} new listing${matches.length > 1 ? "s" : ""} matching your Sukan alert`,
        text: [
          "New listings matching your saved search on Sukan:",
          "",
          listingLines,
          "",
          "Manage your alerts at https://sukan.app/alerts",
          "",
          "— Sukan سُكَن",
        ].join("\n"),
      });
      emailsSent++;
    } catch {
      // Non-fatal — continue to next alert
    }
  }

  return NextResponse.json({
    processed: alerts.length,
    alerts_matched: alertsMatched,
    emails_sent: emailsSent,
  });
}
