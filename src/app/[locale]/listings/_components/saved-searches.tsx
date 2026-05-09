"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

const STORAGE_KEY = "sukan:saved-searches";

interface SavedSearch {
  id: string;
  name: string;
  params: string; // serialized query string
  savedAt: number;
}

function loadSaved(): SavedSearch[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as SavedSearch[];
  } catch {
    return [];
  }
}

function storeSaved(list: SavedSearch[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export default function SavedSearches() {
  const t = useTranslations("browse");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [saved, setSaved] = useState<SavedSearch[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSaved(loadSaved());
    setMounted(true);
  }, []);

  function handleSave() {
    const name = window.prompt(t("savedNamePrompt"), "");
    if (name === null) return; // cancelled
    const trimmed = name.trim();
    if (!trimmed) return;

    const next: SavedSearch = {
      id: crypto.randomUUID(),
      name: trimmed,
      params: searchParams.toString(),
      savedAt: Date.now(),
    };
    const updated = [...saved, next];
    setSaved(updated);
    storeSaved(updated);
  }

  function handleDelete(id: string) {
    const updated = saved.filter((s) => s.id !== id);
    setSaved(updated);
    storeSaved(updated);
  }

  function handleApply(params: string) {
    const qs = params ? `${pathname}?${params}` : pathname;
    router.push(qs as Parameters<typeof router.push>[0]);
  }

  // Don't render on server — localStorage-only feature
  if (!mounted) return null;

  return (
    <div className="space-y-3">
      {/* Saved list — only visible if at least one saved */}
      {saved.length > 0 && (
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold/70">
            {t("savedSearches")}
          </p>
          <div className="space-y-1.5">
            {saved.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-gold/10 bg-earth px-3 py-2"
              >
                <button
                  type="button"
                  onClick={() => handleApply(s.params)}
                  className="flex-1 truncate text-start text-xs text-parchment hover:text-gold transition"
                >
                  {s.name}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(s.id)}
                  aria-label={t("savedDelete")}
                  className="shrink-0 text-mute-soft hover:text-terracotta transition"
                >
                  <svg
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    className="h-3 w-3"
                    aria-hidden
                  >
                    <line x1="1" y1="1" x2="11" y2="11" />
                    <line x1="11" y1="1" x2="1" y2="11" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save current search button */}
      <button
        type="button"
        onClick={handleSave}
        className="flex w-full items-center justify-center gap-1.5 rounded-md border border-gold/20 px-4 py-2 text-xs text-mute-soft transition hover:border-gold/50 hover:text-parchment"
      >
        {/* Bookmark icon */}
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-3.5 w-3.5"
          aria-hidden
        >
          <path d="M3 2h10v13l-5-3.5L3 15V2z" />
        </svg>
        {t("saveSearch")}
      </button>
    </div>
  );
}
