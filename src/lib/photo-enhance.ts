/**
 * Higgsfield image enhancement helper.
 *
 * TODO: The API calls below use the Higgsfield REST API based on known
 * patterns from the MCP tool schema. The model used is `nano_banana_2`
 * (Nano Banana Pro, Google) which supports image-to-image with an "image"
 * role input and produces photorealistic 4K output.
 *
 * API base: https://api.higgsfield.ai
 * Auth:     Authorization: Bearer <HIGGSFIELD_API_KEY>
 *
 * If the endpoint shape differs from what is implemented here, update
 * callHiggsfieldEnhance() below. The stub path returns the input URL
 * unchanged so the UI is demoed without credentials.
 */

export const REAL_ESTATE_ENHANCE_PROMPT = [
  "Enhance this real estate property photograph:",
  "improve lighting and exposure, increase sharpness and clarity,",
  "balance highlights and shadows, gentle warm color grading,",
  "do NOT change the architecture, furniture placement, or composition.",
  "Keep the property exactly as photographed.",
  "Output should look like a professional real-estate listing photo.",
].join(" ");

const HIGGSFIELD_API_BASE = "https://api.higgsfield.ai";
const MODEL_ID = "nano_banana_2";
const POLL_INTERVAL_MS = 5_000;
const MAX_POLLS = 24; // 2 minutes max

interface HiggsfieldJobResponse {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  results?: Array<{ url?: string }>;
  poll_after_seconds?: number;
}

async function createEnhanceJob(
  photoUrl: string,
  apiKey: string,
): Promise<string> {
  const res = await fetch(`${HIGGSFIELD_API_BASE}/v1/image/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL_ID,
      prompt: REAL_ESTATE_ENHANCE_PROMPT,
      medias: [{ value: photoUrl, role: "image" }],
      aspect_ratio: "auto",
      resolution: "2k",
      count: 1,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Higgsfield job creation failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as { id?: string };
  if (!data.id) {
    throw new Error("Higgsfield response missing job id");
  }
  return data.id;
}

async function pollJobUntilDone(
  jobId: string,
  apiKey: string,
): Promise<string> {
  for (let attempt = 0; attempt < MAX_POLLS; attempt++) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

    const res = await fetch(`${HIGGSFIELD_API_BASE}/v1/jobs/${jobId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!res.ok) {
      throw new Error(`Higgsfield poll failed (${res.status})`);
    }

    const data = (await res.json()) as HiggsfieldJobResponse;

    if (data.status === "completed") {
      const url = data.results?.[0]?.url;
      if (!url) throw new Error("Higgsfield job completed but no result URL");
      return url;
    }

    if (data.status === "failed") {
      throw new Error("Higgsfield enhancement job failed");
    }

    // Respect server-suggested poll delay if provided
    if (data.poll_after_seconds && data.poll_after_seconds > 0) {
      await new Promise((r) =>
        setTimeout(r, data.poll_after_seconds! * 1000 - POLL_INTERVAL_MS),
      );
    }
  }

  throw new Error("Higgsfield job timed out after 2 minutes");
}

/**
 * callHiggsfieldEnhance — send a photo URL to Higgsfield and return the
 * enhanced image URL.
 *
 * If HIGGSFIELD_API_KEY is not set this function will throw; the caller
 * (route.ts) guards for that before calling here.
 *
 * The stub mode (HIGGSFIELD_STUB=true env var, or no API key) returns the
 * input URL unchanged so the full UI flow can be demoed without credentials.
 */
export async function callHiggsfieldEnhance(
  photoUrl: string,
): Promise<string> {
  const apiKey = process.env.HIGGSFIELD_API_KEY;

  if (!apiKey || process.env.HIGGSFIELD_STUB === "true") {
    // Stub: return input unchanged — useful for UI demos and tests.
    console.warn(
      "[photo-enhance] Stub mode: HIGGSFIELD_API_KEY not set, returning original URL.",
    );
    return photoUrl;
  }

  const jobId = await createEnhanceJob(photoUrl, apiKey);
  const enhancedUrl = await pollJobUntilDone(jobId, apiKey);
  return enhancedUrl;
}
