import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, isStripeConfigured } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  // 1. Auth check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { ok: false, error: "Sign in to continue" },
      { status: 401 },
    );
  }

  // 2. Parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const listingId =
    body !== null &&
    typeof body === "object" &&
    "listingId" in body &&
    typeof (body as Record<string, unknown>).listingId === "string"
      ? (body as Record<string, string>).listingId
      : null;

  if (!listingId) {
    return NextResponse.json(
      { ok: false, error: "listingId is required" },
      { status: 400 },
    );
  }

  // 3. Verify the listing belongs to this user
  const { data: listing, error: fetchError } = await supabase
    .from("listings")
    .select("id, owner_id, tier, status")
    .eq("id", listingId)
    .maybeSingle();

  if (fetchError || !listing) {
    return NextResponse.json(
      { ok: false, error: "Listing not found" },
      { status: 404 },
    );
  }

  if (listing.owner_id !== user.id) {
    return NextResponse.json(
      { ok: false, error: "Forbidden" },
      { status: 403 },
    );
  }

  // 4. Stripe configured?
  if (!isStripeConfigured() || !stripe) {
    return NextResponse.json(
      { ok: false, error: "Payments not configured" },
      { status: 503 },
    );
  }

  // 5. Price ID configured?
  const priceId = process.env.STRIPE_PRICE_FEATURED;
  if (!priceId) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Payments not configured: STRIPE_PRICE_FEATURED env var is missing",
      },
      { status: 503 },
    );
  }

  // 6. Build redirect URLs
  // Detect locale from Accept-Language or default to "en"
  const locale =
    req.headers.get("x-next-intl-locale") ??
    req.nextUrl.pathname.split("/")[1] ??
    "en";

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    req.nextUrl.origin;

  const successUrl = `${origin}/${locale}/post/success?session_id={CHECKOUT_SESSION_ID}&listingId=${listingId}`;
  const cancelUrl = `${origin}/${locale}/post?step=4&listingId=${listingId}`;

  // 7. Create Checkout Session
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        listing_id: listingId,
        user_id: user.id,
        locale,
      },
      customer_email: user.email,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (err) {
    console.error("[stripe-checkout]", err);
    return NextResponse.json(
      { ok: false, error: "Could not create checkout session. Please try again." },
      { status: 500 },
    );
  }
}
