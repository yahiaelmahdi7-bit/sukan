/**
 * favorites.ts — pure helpers for managing saved listing IDs.
 *
 * Storage key: "sukan:favorites" — JSON array of listing ID strings.
 * All localStorage accessors are guarded for SSR.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

const STORAGE_KEY = "sukan:favorites";

// ─── Local Storage ─────────────────────────────────────────────

export function getLocalFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === "string");
  } catch {
    return [];
  }
}

export function setLocalFavorites(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Ignore quota / private-browsing errors.
  }
}

/**
 * Toggles a listing ID in localStorage.
 * @returns true if the listing is now favorited, false if removed.
 */
export function toggleLocalFavorite(id: string): boolean {
  const current = getLocalFavorites();
  const idx = current.indexOf(id);
  if (idx === -1) {
    setLocalFavorites([...current, id]);
    return true;
  } else {
    setLocalFavorites(current.filter((v) => v !== id));
    return false;
  }
}

// ─── Supabase Merge ────────────────────────────────────────────

/**
 * Reads localStorage favorites, inserts each into `saved_listings`
 * for the authenticated user (idempotent — ignores conflicts),
 * then clears localStorage.
 */
export async function mergeAnonymousIntoSupabase(
  supabase: SupabaseClient,
  userId: string,
): Promise<void> {
  const ids = getLocalFavorites();
  if (ids.length === 0) return;

  for (const listingId of ids) {
    try {
      await supabase
        .from("saved_listings")
        .upsert(
          { user_id: userId, listing_id: listingId },
          { onConflict: "user_id,listing_id", ignoreDuplicates: true },
        );
    } catch {
      // Non-fatal — continue with remaining ids.
    }
  }

  setLocalFavorites([]);
}
