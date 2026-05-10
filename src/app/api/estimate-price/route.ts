import { generateText, Output } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { NextResponse } from "next/server";

const BodySchema = z.object({
  propertyType: z.string(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  areaSqm: z.number().optional(),
  state: z.string(),
  city: z.string(),
  amenities: z.array(z.string()).optional(),
  purpose: z.string(),
});

const OutputSchema = z.object({
  min: z.number(),
  max: z.number(),
  suggested: z.number(),
  currency: z.literal("USD"),
  reasoning_en: z.string(),
  reasoning_ar: z.string(),
});

export async function POST(req: Request): Promise<NextResponse> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "AI_NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  let body: z.infer<typeof BodySchema>;
  try {
    const raw: unknown = await req.json();
    body = BodySchema.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "INVALID_BODY" }, { status: 400 });
  }

  const { propertyType, bedrooms, bathrooms, areaSqm, state, city, amenities, purpose } = body;

  const prompt = [
    "Estimate fair-market USD price for a Sudan property.",
    "Use realistic Sudanese real-estate ranges (Khartoum apartments $300-$1500/mo; villas $80k-$300k; etc.).",
    "Provide min, max, and suggested price plus brief reasoning in English and Arabic.",
    "Currency must always be USD.",
    "",
    "Property details:",
    `- Type: ${propertyType}`,
    `- Purpose: ${purpose}`,
    `- Location: ${city}, ${state}, Sudan`,
    bedrooms != null ? `- Bedrooms: ${bedrooms}` : null,
    bathrooms != null ? `- Bathrooms: ${bathrooms}` : null,
    areaSqm != null ? `- Area: ${areaSqm} sqm` : null,
    amenities?.length ? `- Amenities: ${amenities.join(", ")}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const result = await generateText({
      model: anthropic("claude-sonnet-4-20250514"),
      output: Output.object({ schema: OutputSchema }),
      prompt,
    });

    return NextResponse.json({ ok: true, ...result.output });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "UNKNOWN_ERROR";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
