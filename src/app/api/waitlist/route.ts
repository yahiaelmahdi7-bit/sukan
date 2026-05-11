import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const BodySchema = z.object({
  email: z.string().email().max(320),
  source: z.string().max(64).optional(),
  locale: z.enum(["en", "ar"]).optional(),
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
  const source = body.source ?? "whatsapp_bot";

  const { error } = await supabase
    .from("waitlist")
    .insert({ email: body.email, source, locale: body.locale ?? "en" });

  // Duplicate email/source pair is fine — treat as success so the form
  // doesn't leak whether the user is already signed up.
  if (error && error.code !== "23505") {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
