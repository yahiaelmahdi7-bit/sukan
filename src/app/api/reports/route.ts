import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendReportEmail } from "@/lib/resend";
import { z } from "zod";

const REASON_VALUES = ["scam", "wrong_info", "duplicate", "offensive", "other"] as const;

const BodySchema = z.object({
  listing_id: z.string().uuid(),
  reason: z.enum(REASON_VALUES),
  details: z.string().optional(),
  reporter_email: z.string().email().optional(),
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

  // Optional auth — store reporter_id if signed in
  const { data: { user } } = await supabase.auth.getUser();
  const reporterId = user?.id ?? null;

  const { error } = await supabase.from("listing_reports").insert({
    listing_id: body.listing_id,
    reporter_id: reporterId,
    reporter_email: body.reporter_email ?? null,
    reason: body.reason,
    details: body.details ?? null,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  // Look up listing title for the email subject (best-effort, non-fatal)
  const { data: listing } = await supabase
    .from("listings")
    .select("title_en")
    .eq("id", body.listing_id)
    .single();

  const listingTitle = listing?.title_en ?? body.listing_id;

  const appBase =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "https://sukan.app";
  const adminVerifyUrl = `${appBase}/admin/listings/${body.listing_id}`;

  // Send admin notification email — non-fatal
  sendReportEmail({
    locale: "en",
    listingId: body.listing_id,
    listingTitle,
    adminVerifyUrl,
    reason: body.reason,
    details: body.details,
    reporterEmail: body.reporter_email ?? null,
    reporterId,
  }).then((result) => {
    if (!result.ok && result.reason !== "not_configured" && result.reason !== "no_admin_email_configured") {
      console.error("[reports] Admin email failed:", result.reason);
    }
  }).catch(() => {
    // Non-fatal — report row is already persisted
  });

  return NextResponse.json({ ok: true });
}
