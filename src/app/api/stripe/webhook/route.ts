import { NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

// Must run on Node.js so we can read the raw body for Stripe signature verification.
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!stripe) {
    return new Response("Stripe not configured", { status: 503 });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("Webhook secret missing", { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return new Response("Missing signature", { status: 400 });
  }

  // Read raw body BEFORE any JSON parsing — Stripe verifies against raw bytes.
  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    console.error("[stripe-webhook] sig verify failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const listingId = session.metadata?.listing_id;

    if (listingId) {
      // Use the service-role admin client to bypass RLS.
      // The webhook request has no user context.
      try {
        const supabase = createAdminClient();
        const { error } = await supabase
          .from("listings")
          .update({
            status: "active",
            tier: "featured",
            published_at: new Date().toISOString(),
          })
          .eq("id", listingId);

        if (error) {
          console.error("[stripe-webhook] DB update failed:", error.message);
        }
      } catch (err) {
        console.error("[stripe-webhook] admin client error:", err);
      }
    }
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
