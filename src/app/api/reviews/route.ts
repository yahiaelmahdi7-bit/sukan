import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const BodySchema = z.object({
  landlord_id: z.string().uuid(),
  listing_id: z.string().uuid().nullable().optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
  comment_ar: z.string().optional(),
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

  // Must be authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  const reviewerId = user.id;

  // Cannot review your own listing
  if (body.listing_id) {
    const { data: listing } = await supabase
      .from("listings")
      .select("owner_id")
      .eq("id", body.listing_id)
      .single();

    if (listing?.owner_id === reviewerId) {
      return NextResponse.json(
        { ok: false, error: "CANNOT_REVIEW_OWN_LISTING" },
        { status: 400 },
      );
    }
  }

  const { error } = await supabase.from("reviews").insert({
    reviewer_id: reviewerId,
    landlord_id: body.landlord_id,
    listing_id: body.listing_id ?? null,
    rating: body.rating,
    comment: body.comment ?? null,
    comment_ar: body.comment_ar ?? null,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
