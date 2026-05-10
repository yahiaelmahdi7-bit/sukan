// Compare store — localStorage-backed, SSR-safe
// Mutations dispatch a custom event so any subscribed component re-renders.

export type CompareItem = {
  id: string;
  title: string;
  image: string;
  priceUsd: number;
  state: string;
  bedrooms?: number;
  bathrooms?: number;
  areaSqm?: number;
  addedAt: number;
};

const MAX_COMPARE = 3;
const STORAGE_KEY = "sukan-compare";
const EVENT_NAME = "sukan-compare-changed";

// ── Helpers ────────────────────────────────────────────────────────────────

function read(): CompareItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CompareItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: CompareItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVENT_NAME));
}

// ── Public API ─────────────────────────────────────────────────────────────

export function getCompareItems(): CompareItem[] {
  return read().sort((a, b) => b.addedAt - a.addedAt);
}

export function isInCompare(id: string): boolean {
  return read().some((item) => item.id === id);
}

export function addToCompare(
  item: Omit<CompareItem, "addedAt">,
): { ok: boolean; reason?: "max" | "already" } {
  const current = read();
  if (current.some((i) => i.id === item.id)) return { ok: false, reason: "already" };
  if (current.length >= MAX_COMPARE) return { ok: false, reason: "max" };
  write([...current, { ...item, addedAt: Date.now() }]);
  return { ok: true };
}

export function removeFromCompare(id: string): void {
  write(read().filter((item) => item.id !== id));
}

export function clearCompare(): void {
  write([]);
}

/**
 * Subscribe to compare mutations.
 * Returns an unsubscribe function.
 */
export function subscribeCompare(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
}
