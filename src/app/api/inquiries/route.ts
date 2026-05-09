import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getListingById } from "@/lib/sample-listings";
import { sendInquiryEmail } from "@/lib/resend";

// TODO: Replace with Supabase select once real listings live in the database.
// At that point, call:
//   const { data: listing } = await supabase
//     .from("listings")
//     .select("id, title_en, title_ar, whatsapp_contact")
//     .eq("id", listingId)
//     .single();

// TODO: Wire landlordEmail to profiles.email once landlord profiles exist.
// For now a hardcoded placeholder is used so the flow can be demoed end-to-end.
const FALLBACK_LANDLORD_EMAIL = "inquiries@sukan.app";

const InquirySchema = z.object({
  listingId: z.string().min(1),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(7, "Phone must be at least 7 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  locale: z.string().optional().default("en"),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const parsed = InquirySchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Validation error";
    return NextResponse.json(
      { ok: false, error: firstError },
      { status: 422 },
    );
  }

  const { listingId, name, phone, message, locale } = parsed.data;

  // Resolve listing (currently from sample data — see TODO above)
  const listing = getListingById(listingId);
  if (!listing) {
    return NextResponse.json(
      { ok: false, error: "Listing not found" },
      { status: 404 },
    );
  }

  const listingTitle = locale === "ar" ? listing.titleAr : listing.titleEn;

  // Build the canonical listing URL for the email CTA.
  // NEXT_PUBLIC_APP_URL should be set in Vercel env vars (e.g. https://sukan.app).
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "https://sukan.app";
  const listingUrl = `${appUrl}/${locale}/listings/${listing.id}`;

  // Insert into Supabase — RLS policy "inquiries: public insert" allows anon
  const supabase = await createClient();
  const { error: dbError } = await supabase.from("inquiries").insert({
    listing_id: listingId,
    name,
    phone,
    message,
    channel: "message",
    locale,
  });

  if (dbError) {
    console.error("[inquiries] DB insert failed:", dbError.message);
    return NextResponse.json(
      { ok: false, error: "Could not save your inquiry. Please try again." },
      { status: 500 },
    );
  }

  // Send notification email — non-fatal: log and continue if Resend fails
  const emailResult = await sendInquiryEmail({
    // TODO: Replace FALLBACK_LANDLORD_EMAIL with the listing landlord's
    //       profiles.email once the foreign-key join is in place.
    landlordEmail: FALLBACK_LANDLORD_EMAIL,
    listingTitle,
    listingUrl,
    inquirerName: name,
    inquirerPhone: phone,
    message,
    locale,
  });

  if (!emailResult.ok) {
    if (emailResult.reason === "not_configured") {
      console.warn("[inquiries] Resend not configured — email skipped.");
    } else {
      console.error("[inquiries] Email send failed:", emailResult.reason);
    }
  }

  return NextResponse.json({ ok: true });
}
