/**
 * recently-viewed.ts — localStorage-backed helper for tracking recently viewed listings.
 *
 * Storage key: "sukan-recently-viewed" — JSON array of RecentlyViewedItem.
 * Max 8 entries, most-recent first. De-duped by id (re-view pushes to top).
 * All accessors are SSR-safe: return [] when window is undefined.
 */

const STORAGE_KEY = "sukan-recently-viewed";
const MAX_ENTRIES = 8;

export type RecentlyViewedItem = {
  id: string;
  title: string;
  image: string;
  priceUsd: number;
  viewedAt: number;
};

function readFromStorage(): RecentlyViewedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (v): v is RecentlyViewedItem =>
        typeof v === "object" &&
        v !== null &&
        typeof v.id === "string" &&
        typeof v.title === "string" &&
        typeof v.image === "string" &&
        typeof v.priceUsd === "number" &&
        typeof v.viewedAt === "number",
    );
  } catch {
    return [];
  }
}

function writeToStorage(items: RecentlyViewedItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore quota / private-browsing errors.
  }
}

/**
 * Adds a listing to the recently viewed list.
 * Re-viewing an existing listing moves it to the top without duplicating.
 * List is capped at MAX_ENTRIES (8).
 */
export function addRecentlyViewed(
  item: Omit<RecentlyViewedItem, "viewedAt">,
): void {
  const current = readFromStorage();
  // Remove existing entry for this id (if any) so we can re-insert at top
  const filtered = current.filter((v) => v.id !== item.id);
  const updated: RecentlyViewedItem[] = [
    { ...item, viewedAt: Date.now() },
    ...filtered,
  ].slice(0, MAX_ENTRIES);
  writeToStorage(updated);
}

/**
 * Returns recently viewed items, most recent first. Max 8.
 * Returns [] when called server-side.
 */
export function getRecentlyViewed(): RecentlyViewedItem[] {
  return readFromStorage();
}

/**
 * Clears all recently viewed items.
 */
export function clearRecentlyViewed(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore errors.
  }
}
