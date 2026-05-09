import { streamText, convertToModelMessages, stepCountIs, tool } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { sampleListings, SUDAN_STATES } from "@/lib/sample-listings";
import type { SudanState, PropertyType, Amenity } from "@/lib/sample-listings";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

const SYSTEM_PROMPT = (locale: string) => `
You are Sukan's bilingual property assistant. Help the user find a home in Sudan.
Ask AT MOST 2 follow-up questions about: state preference, budget in USD, property type, bedrooms, must-have amenities.
Then call the searchListings tool with extracted preferences and present 1–3 best matches concisely.
Match the user's language (English or Arabic — ALWAYS respond in the same language they're writing in).
Be warm, brief, and skip the assistant filler.
If locale is '${locale}', prefer ${locale === "ar" ? "Arabic" : "English"} responses unless the user writes in the other language.
`.trim();

const MISSING_KEY_EN =
  "AI matching is not configured yet — paste your Anthropic API key in .env.local to enable.";
const MISSING_KEY_AR =
  "لم يُهيَّأ البحث الذكي بعد — أضف مفتاح Anthropic API إلى ملف .env.local لتفعيله.";

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: `${MISSING_KEY_EN} / ${MISSING_KEY_AR}` }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  let messages: unknown[];
  let locale = "en";
  try {
    const body = await req.json();
    messages = body.messages ?? [];
    locale = body.locale === "ar" ? "ar" : "en";
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const modelMessages = await convertToModelMessages(
    messages as Parameters<typeof convertToModelMessages>[0],
  );

  const result = streamText({
    model: anthropic("claude-sonnet-4-6"),
    system: SYSTEM_PROMPT(locale),
    messages: modelMessages,
    stopWhen: stepCountIs(4),
    tools: {
      searchListings: tool({
        description:
          "Search Sukan listings by preference filters and return top matching properties.",
        inputSchema: z.object({
          state: z
            .enum(SUDAN_STATES)
            .optional()
            .describe("Preferred Sudanese state"),
          propertyType: z
            .enum([
              "apartment",
              "house",
              "villa",
              "studio",
              "shop",
              "office",
              "land",
              "warehouse",
            ])
            .optional()
            .describe("Type of property"),
          purpose: z
            .enum(["rent", "sale"])
            .optional()
            .describe("Rent or buy"),
          maxPriceUsd: z
            .number()
            .optional()
            .describe("Maximum price in USD"),
          minBedrooms: z
            .number()
            .int()
            .optional()
            .describe("Minimum number of bedrooms"),
          amenities: z
            .array(
              z.enum([
                "parking",
                "generator",
                "water_tank",
                "furnished",
                "garden",
                "security",
                "ac",
                "solar",
                "wifi",
                "elevator",
                "balcony",
                "rooftop",
              ]),
            )
            .optional()
            .describe("Must-have amenities"),
        }),
        execute: async ({
          state,
          propertyType,
          purpose,
          maxPriceUsd,
          minBedrooms,
          amenities,
        }) => {
          let filtered = [...sampleListings];

          if (state) {
            filtered = filtered.filter((l) => l.state === (state as SudanState));
          }
          if (propertyType) {
            filtered = filtered.filter(
              (l) => l.propertyType === (propertyType as PropertyType),
            );
          }
          if (purpose) {
            filtered = filtered.filter((l) => l.purpose === purpose);
          }
          if (maxPriceUsd !== undefined) {
            filtered = filtered.filter((l) => l.priceUsd <= maxPriceUsd);
          }
          if (minBedrooms !== undefined) {
            filtered = filtered.filter(
              (l) => l.bedrooms !== undefined && l.bedrooms >= minBedrooms,
            );
          }
          if (amenities && amenities.length > 0) {
            filtered = filtered.filter((am) =>
              amenities.every((a) =>
                am.amenities.includes(a as Amenity),
              ),
            );
          }

          const top3 = filtered.slice(0, 3).map((l) => ({
            id: l.id,
            titleEn: l.titleEn,
            titleAr: l.titleAr,
            priceUsd: l.priceUsd,
            period: l.period,
            state: l.state,
            city: l.city,
            cityAr: l.cityAr,
            bedrooms: l.bedrooms,
            area: l.areaSqm,
            amenities: l.amenities,
          }));

          return {
            count: top3.length,
            listings: top3,
          };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
