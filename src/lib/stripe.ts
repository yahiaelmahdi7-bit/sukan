import Stripe from "stripe";

const KEY = process.env.STRIPE_SECRET_KEY;

export const stripe: Stripe | null = KEY
  ? new Stripe(KEY, { apiVersion: "2025-02-24.acacia" })
  : null;

export function isStripeConfigured(): boolean {
  return !!KEY;
}
