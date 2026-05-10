import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { callHiggsfieldEnhance } from "@/lib/photo-enhance";

// ---------------------------------------------------------------------------
// Simple in-memory rate-limit: 20 enhancements per user per hour.
// This lives in module scope so it persists across requests within a single
// serverless function instance. For multi-instance deployments, swap for a
// Redis counter (e.g. Upstash). The Map is bounded by the number of distinct
// users active in the current hour, which is acceptable for v1.
// ---------------------------------------------------------------------------
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);

  if (!entry || now >= entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_WINDOW_MS });
    if (rateLimitMap.size > 500) {
      console.warn(
        `[photo-enhance] rateLimitMap has ${rateLimitMap.size} entries — consider switching to Redis.`,
      );
    }
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count += 1;
  return true;
}

// ---------------------------------------------------------------------------
// POST /api/photos/enhance
// Body: { photoUrl: string } | { photoId: string }
// ---------------------------------------------------------------------------
export async function POST(req: Request): Promise<NextResponse> {
  // 1. Check env
  if (!process.env.HIGGSFIELD_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "AI enhancement not configured" },
      { status: 503 },
    );
  }

  // 2. Auth check
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  // 3. Rate limit
  if (!checkRateLimit(user.id)) {
    return NextResponse.json(
      { ok: false, error: "Rate limit exceeded — 20 enhancements per hour" },
      { status: 429 },
    );
  }

  // 4. Parse body
  let photoUrl: string;
  try {
    const raw = (await req.json()) as { photoUrl?: string; photoId?: string };

    if (raw.photoUrl) {
      photoUrl = raw.photoUrl;
    } else if (raw.photoId) {
      // Look up the photo by id and verify ownership via the listing owner_id
      const { data: photo, error: photoError } = await supabase
        .from("listing_photos")
        .select("url, listing_id, listings!inner(owner_id)")
        .eq("id", raw.photoId)
        .single();

      if (photoError || !photo) {
        return NextResponse.json(
          { ok: false, error: "Photo not found" },
          { status: 404 },
        );
      }

      // TypeScript: listings is returned as joined object
      const listing = photo.listings as unknown as { owner_id: string };
      if (listing.owner_id !== user.id) {
        return NextResponse.json(
          { ok: false, error: "Forbidden" },
          { status: 403 },
        );
      }

      if (!photo.url) {
        return NextResponse.json(
          { ok: false, error: "Photo has no public URL" },
          { status: 400 },
        );
      }

      photoUrl = photo.url;
    } else {
      return NextResponse.json(
        { ok: false, error: "Provide photoUrl or photoId" },
        { status: 400 },
      );
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body" },
      { status: 400 },
    );
  }

  // 5. Ownership check when only photoUrl was given (URL must belong to the
  //    authenticated user's storage bucket path: {userId}/...)
  if (!photoUrl.includes(`/${user.id}/`)) {
    // Soft check: we can't fully verify a URL is owned by the user without a
    // DB lookup, but we enforce that it lives under the user's bucket prefix.
    // Callers using photoId get a hard DB ownership check above.
    // For photoUrl, we do a best-effort prefix check.
    //
    // If stricter enforcement is needed, switch all callers to photoId.
    return NextResponse.json(
      { ok: false, error: "Forbidden: photo does not belong to you" },
      { status: 403 },
    );
  }

  // 6. Call Higgsfield
  let enhancedSourceUrl: string;
  try {
    enhancedSourceUrl = await callHiggsfieldEnhance(photoUrl);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Enhancement failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 502 });
  }

  // 7. If Higgsfield returned a different URL (not the stub passthrough),
  //    download the enhanced image and re-upload to our Supabase bucket so we
  //    own the asset and it doesn't expire.
  let finalUrl = enhancedSourceUrl;

  if (enhancedSourceUrl !== photoUrl) {
    try {
      const imgRes = await fetch(enhancedSourceUrl);
      if (!imgRes.ok) throw new Error("Could not download enhanced image");

      const contentType =
        imgRes.headers.get("content-type") ?? "image/jpeg";
      const ext = contentType.includes("png") ? "png" : "jpg";

      // Derive a new storage path next to the original, with -enhanced suffix
      const originalPath = new URL(photoUrl).pathname
        .split("/object/public/listing-photos/")
        .at(1);

      const basePath = originalPath
        ? originalPath.replace(/(\.[^.]+)$/, `-enhanced$1`)
        : `${user.id}/enhanced/${Date.now()}-enhanced.${ext}`;

      const bytes = await imgRes.arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from("listing-photos")
        .upload(basePath, bytes, {
          contentType,
          upsert: true,
        });

      if (uploadError) {
        // Non-fatal: return the Higgsfield URL directly if upload fails
        console.error("[photo-enhance] Re-upload failed:", uploadError.message);
      } else {
        const { data: publicData } = supabase.storage
          .from("listing-photos")
          .getPublicUrl(basePath);
        finalUrl = publicData.publicUrl;
      }
    } catch (uploadErr) {
      // Non-fatal: fall back to Higgsfield-hosted URL
      console.error("[photo-enhance] Re-upload error:", uploadErr);
    }
  }

  return NextResponse.json({ ok: true, enhancedUrl: finalUrl });
}
