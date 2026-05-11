"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ── Helper: assert caller is admin ──────────────────────────────────────────

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("unauthenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.is_admin !== true) throw new Error("forbidden");

  return supabase;
}

// ── verifyProfile ────────────────────────────────────────────────────────────

export async function verifyProfile(
  userId: string,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const supabase = await assertAdmin();

    const { error } = await supabase
      .from("profiles")
      .update({
        is_verified: true,
        verified_at: new Date().toISOString(),
        verification_requested_at: null,
      })
      .eq("id", userId);

    if (error) return { success: false, error: error.message };

    revalidatePath("/[locale]/admin/verify", "page");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "unknown error",
    };
  }
}

// ── revokeVerification ───────────────────────────────────────────────────────

export async function revokeVerification(
  userId: string,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const supabase = await assertAdmin();

    const { error } = await supabase
      .from("profiles")
      .update({
        is_verified: false,
        verified_at: null,
      })
      .eq("id", userId);

    if (error) return { success: false, error: error.message };

    revalidatePath("/[locale]/admin/verify", "page");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "unknown error",
    };
  }
}

// ── requestVerification (called from profile page) ───────────────────────────

export async function requestVerification(): Promise<
  { success: true } | { success: false; error: string }
> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "unauthenticated" };

    const { error } = await supabase
      .from("profiles")
      .update({ verification_requested_at: new Date().toISOString() })
      .eq("id", user.id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/[locale]/dashboard/profile", "page");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "unknown error",
    };
  }
}
