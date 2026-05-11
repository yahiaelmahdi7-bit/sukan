import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { sendAlertEmail, type AlertListingItem } from "@/lib/resend";

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
  const appBase =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "https://sukan.app";

  let alertsMatched = 0;
  let emailsSent = 0;

  for (const alert of alerts as PriceAlert[]) {
    // Build query for matching listings created in last 24h
    let query = supabase
      .from("listings")
      .select("id, title_en, title_ar, price, currency, state, city, property_type, purpose, created_at")
      .eq("is_published", true)
      .eq("purpose", alert.purpose)
      .gte("created_at", since);

    if (alert.state) query = query.eq("state", alert.state);
    if (alert.property_type) query = query.eq("property_type", alert.property_type);
    if (alert.max_price != null) query = query.lte("price", alert.max_price);

    const { data: matches } = await query;
    if (!matches || matches.length === 0) continue;

    alertsMatched++;

    // Skip email dispatch if Resend is not configured
    if (!resendKey) continue;

    // Fetch user email + display name via admin auth API
    const { data: userData } = await supabase.auth.admin.getUserById(alert.user_id);
    const userEmail = userData?.user?.email;
    if (!userEmail) continue;

    // Best-effort first name from user_metadata; fall back to "there"
    const firstName =
      (userData.user?.user_metadata?.full_name as string | undefined)
        ?.split(" ")[0] ?? "there";

    // Build search label from alert criteria (e.g. "Khartoum, Sudan")
    const searchLabel = [alert.state, alert.property_type]
      .filter(Boolean)
      .join(", ") || "Sudan";

    // Build search-params URL for "see all matches" CTA
    const searchParams = new URLSearchParams();
    if (alert.state) searchParams.set("state", alert.state);
    if (alert.property_type) searchParams.set("property_type", alert.property_type);
    if (alert.max_price != null) searchParams.set("max_price", String(alert.max_price));
    searchParams.set("purpose", alert.purpose);
    const allMatchesUrl = `${appBase}/en/listings?${searchParams.toString()}`;
    const unsubscribeUrl = `${appBase}/dashboard/saved-searches`;

    // Map DB rows to the AlertListingItem shape expected by the template
    const listingItems: AlertListingItem[] = (matches as MatchedListing[]).map((l) => ({
      id: l.id,
      titleEn: l.title_en,
      titleAr: l.title_ar,
      price: l.price,
      currency: l.currency,
      city: l.city,
      state: l.state,
    }));

    const result = await sendAlertEmail({
      locale: "en",
      recipientEmail: userEmail,
      firstName,
      searchLabel,
      listings: listingItems,
      allMatchesUrl,
      unsubscribeUrl,
      alertId: alert.id,
    });

    if (result.ok) {
      emailsSent++;
    } else if (result.reason !== "not_configured") {
      console.error(`[alerts] Email failed for alert ${alert.id}:`, result.reason);
    }
  }

  return NextResponse.json({
    processed: alerts.length,
    alerts_matched: alertsMatched,
    emails_sent: emailsSent,
  });
}
