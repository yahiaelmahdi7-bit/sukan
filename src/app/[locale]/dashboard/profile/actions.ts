"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ProfileUpdateResult =
  | { ok: true }
  | { ok: false; error: string };

export type AvatarUploadResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

// ── updateProfile ─────────────────────────────────────────────────────────────
// Patches the caller's own profiles row. Only whitelisted fields are touched.

export async function updateProfile(
  formData: FormData,
): Promise<ProfileUpdateResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Not authenticated" };
  }

  // Extract fields from FormData
  const fullName = formData.get("full_name") as string | null;
  const phone = formData.get("phone") as string | null;
  const bio = formData.get("bio") as string | null;
  const whatsappOptIn = formData.get("whatsapp_opt_in") === "true";
  const avatarUrl = formData.get("avatar_url") as string | null;

  // Build patch — only include non-null provided fields
  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (fullName !== null) patch.full_name = fullName || null;
  if (phone !== null) patch.phone = phone || null;
  if (bio !== null) {
    // Enforce 280-char limit server-side
    patch.bio = bio.slice(0, 280) || null;
  }
  patch.whatsapp_opt_in = whatsappOptIn;
  if (avatarUrl !== null) patch.avatar_url = avatarUrl || null;

  const { error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", user.id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/[locale]/dashboard/profile", "page");
  revalidatePath("/[locale]/dashboard", "page");

  return { ok: true };
}

// ── uploadAvatar ──────────────────────────────────────────────────────────────
// Receives raw file bytes via FormData, uploads to the `avatars` bucket, and
// returns the public URL. Handles missing bucket gracefully (logs + returns error
// instead of throwing). The caller can then pass the URL to updateProfile.

export async function uploadAvatar(
  formData: FormData,
): Promise<AvatarUploadResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Not authenticated" };
  }

  const file = formData.get("avatar") as File | null;
  if (!file || file.size === 0) {
    return { ok: false, error: "No file provided" };
  }

  // 5 MB guard
  if (file.size > 5 * 1024 * 1024) {
    return { ok: false, error: "File exceeds 5 MB limit" };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  // One file per user — overwrite previous avatar deterministically
  const storagePath = `${user.id}/avatar.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(storagePath, bytes, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    // Bucket may not exist or RLS prevents write
    console.error("[uploadAvatar] storage error:", uploadError.message);
    return { ok: false, error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(storagePath);

  // Cache-bust so the browser re-fetches the new image immediately
  const bustUrl = `${publicUrl}?v=${Date.now()}`;

  return { ok: true, url: bustUrl };
}
