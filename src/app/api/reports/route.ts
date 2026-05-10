import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
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

  // Send admin notification email if configured
  const adminEmail = process.env.ADMIN_EMAIL;
  const resendKey = process.env.RESEND_API_KEY;

  if (adminEmail && resendKey) {
    try {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "Sukan <noreply@sukan.app>",
        to: [adminEmail],
        subject: `Listing reported: ${body.listing_id}`,
        text: `Reason: ${body.reason}\n\n${body.details ?? "(no details)"}\n\nListing ID: ${body.listing_id}\nReporter: ${body.reporter_email ?? reporterId ?? "anonymous"}`,
      });
    } catch {
      // Email failure is non-fatal — report was already saved
    }
  }

  return NextResponse.json({ ok: true });
}
