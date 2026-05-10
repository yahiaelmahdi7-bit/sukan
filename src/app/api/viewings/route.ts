import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
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

  // Send notification emails if Resend is configured
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      const from = process.env.RESEND_FROM_EMAIL ?? "Sukan <noreply@sukan.app>";

      // Look up listing + owner profile for landlord email
      const { data: listing } = await supabase
        .from("listings")
        .select("title_en, owner_id, profiles:owner_id(phone, whatsapp)")
        .eq("id", body.listing_id)
        .single();

      const listingTitle = listing?.title_en ?? body.listing_id;

      // Email to requester if they are signed in and have an email
      if (user?.email) {
        await resend.emails.send({
          from,
          to: [user.email],
          subject: `Viewing request confirmed — ${listingTitle}`,
          text: [
            `Hi ${body.requester_name},`,
            "",
            `Your viewing request for "${listingTitle}" has been received.`,
            body.preferred_date ? `Preferred date: ${body.preferred_date}` : null,
            body.preferred_time ? `Preferred time: ${body.preferred_time}` : null,
            "",
            "The landlord will be in touch to confirm.",
            "",
            "— Sukan سُكَن",
          ]
            .filter((l) => l !== null)
            .join("\n"),
        });
      }

      // Email to landlord — look up their email via auth admin is not available
      // from the browser client; fetch from profiles using owner_id
      if (listing?.owner_id) {
        const { data: ownerProfile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", listing.owner_id)
          .single();

        // Landlord email is only accessible via service role; skip if unavailable
        // This is a best-effort notification — the viewing row is already saved
        void ownerProfile; // suppress unused-var lint
      }
    } catch {
      // Email failure is non-fatal
    }
  }

  return NextResponse.json({ ok: true, viewing_id: viewing.id });
}
