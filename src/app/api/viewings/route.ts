import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendViewingEmail } from "@/lib/resend";
import { z } from "zod";

const BodySchema = z.object({
  listing_id: z.string().uuid(),
  requester_name: z.string().min(1),
  requester_phone: z.string().min(1),
  preferred_date: z.string().optional(),  // ISO date string "YYYY-MM-DD"
  preferred_time: z.string().optional(),
});

export async function POST(req: Request): Promise<NextResponse> {
  let body: z.infer<typeof BodySchema>;
  try {
    const raw: unknown = await req.json();
    body = BodySchema.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "INVALID_BODY" }, { status: 400 });
  }

  const supabase = await createClient();

  // Optional auth
  const { data: { user } } = await supabase.auth.getUser();

  const { data: viewing, error } = await supabase
    .from("viewing_requests")
    .insert({
      listing_id: body.listing_id,
      requester_id: user?.id ?? null,
      requester_name: body.requester_name,
      requester_phone: body.requester_phone,
      preferred_date: body.preferred_date ?? null,
      preferred_time: body.preferred_time ?? null,
      status: "pending",
    })
    .select("id")
    .single();

  if (error || !viewing) {
    return NextResponse.json(
      { ok: false, error: error?.message ?? "INSERT_FAILED" },
      { status: 500 },
    );
  }

  // Build dashboard deep-links for the landlord's Confirm / Decline CTAs.
  // These are best-effort — the viewing row is already saved regardless.
  const appBase =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "https://sukan.app";
  const confirmUrl = `${appBase}/dashboard/viewings/${viewing.id}?action=confirm`;
  const declineUrl = `${appBase}/dashboard/viewings/${viewing.id}?action=decline`;
  const listingUrl = `${appBase}/en/listings/${body.listing_id}`;

  // Look up listing title and owner_id for the email (best-effort, non-fatal)
  const { data: listing } = await supabase
    .from("listings")
    .select("title_en, title_ar, owner_id")
    .eq("id", body.listing_id)
    .single();

  const listingTitle = listing?.title_en ?? body.listing_id;

  // TODO: Landlord email is only reachable via service role key (not available
  // in the browser client path). Wire listing.owner_id → profiles.email once
  // service-role access is added here. For now, landlord email is skipped.
  const landlordEmail: string | null = null;

  // Fire-and-forget; errors are logged but never bubble up to the HTTP response.
  sendViewingEmail({
    locale: "en",
    listingTitle,
    listingUrl,
    requesterName: body.requester_name,
    requesterPhone: body.requester_phone,
    requesterEmail: user?.email ?? null,
    preferredDate: body.preferred_date,
    preferredTime: body.preferred_time,
    confirmUrl,
    declineUrl,
    landlordEmail,
  }).then((result) => {
    if (!result.landlord.ok && result.landlord.reason !== "no_landlord_email" && result.landlord.reason !== "not_configured") {
      console.error("[viewings] Landlord email failed:", result.landlord.reason);
    }
    if (!result.tenant.ok && result.tenant.reason !== "no_tenant_email" && result.tenant.reason !== "not_configured") {
      console.error("[viewings] Tenant receipt email failed:", result.tenant.reason);
    }
  }).catch(() => {
    // Non-fatal — viewing row is already persisted
  });

  return NextResponse.json({ ok: true, viewing_id: viewing.id });
}
