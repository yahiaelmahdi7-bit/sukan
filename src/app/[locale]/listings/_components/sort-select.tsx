"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { value: "recent", labelKey: "browse.sortRecent" as const },
  { value: "price_asc", labelKey: "browse.sortPriceAsc" as const },
  { value: "price_desc", labelKey: "browse.sortPriceDesc" as const },
  { value: "bedrooms_desc", labelKey: "browse.sortBedrooms" as const },
  { value: "area_desc", labelKey: "browse.sortAreaDesc" as const },
];

interface SortSelectProps {
  /** Compact mode — show only icon + active label abbreviation, used in sticky bar */
  compact?: boolean;
}

export default function SortSelect({ compact = false }: SortSelectProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") ?? "recent";
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  function handleChange(value: string) {
    const p = new URLSearchParams(searchParams.toString());
    p.set("sort", value);
    p.delete("page");
    router.push(`${pathname}?${p.toString()}` as Parameters<typeof router.push>[0]);
    setOpen(false);
  }

  const currentLabel =
    SORT_OPTIONS.find((o) => o.value === currentSort)?.labelKey ?? "browse.sortRecent";

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("browse.sortLabel")}
        className={`smooth-fast flex items-center gap-2 rounded-[var(--radius-pill)] border border-white/55 bg-white/55 px-3.5 py-2 text-sm text-ink backdrop-blur-md hover:border-gold/50 hover:bg-white/75 focus:outline-none focus:ring-2 focus:ring-gold/20 ${
          compact ? "py-1.5 text-xs" : ""
        }`}
      >
        {/* Sort icon */}
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-3.5 w-3.5 shrink-0 text-gold-dk"
          aria-hidden
        >
          <line x1="2" y1="4" x2="14" y2="4" />
          <line x1="2" y1="8" x2="11" y2="8" />
          <line x1="2" y1="12" x2="8" y2="12" />
        </svg>
        {!compact && (
          <span className="whitespace-nowrap">{t(currentLabel)}</span>
        )}
        {compact && (
          <span className="sr-only">{t(currentLabel)}</span>
        )}
        {/* Chevron */}
        <svg
          viewBox="0 0 10 6"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className={`smooth-fast h-2.5 w-2.5 shrink-0 text-ink-mid ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="M1 1l4 4 4-4" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <ul
          role="listbox"
          aria-label={t("browse.sortLabel")}
          className="glass-strong glass-highlight absolute end-0 z-50 mt-2 min-w-[200px] overflow-hidden rounded-[var(--radius-glass)] border border-white/60 py-1.5"
          style={{ boxShadow: "var(--shadow-warm-lg)" }}
        >
          {SORT_OPTIONS.map((opt) => {
            const isActive = currentSort === opt.value;
            return (
              <li key={opt.value} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => handleChange(opt.value)}
                  className={`smooth-fast flex w-full items-center gap-2.5 px-4 py-2.5 text-start text-sm ${
                    isActive
                      ? "bg-gold/15 font-medium text-gold-dk"
                      : "text-ink hover:bg-gold/8 hover:text-terracotta"
                  }`}
                >
                  {isActive && (
                    <svg
                      viewBox="0 0 12 12"
                      fill="currentColor"
                      className="h-2.5 w-2.5 shrink-0 text-gold-dk"
                      aria-hidden
                    >
                      <path d="M1.5 6L4.5 9 10.5 3" stroke="currentColor" fill="none" strokeWidth={2} />
                    </svg>
                  )}
                  {!isActive && <span className="h-2.5 w-2.5 shrink-0" />}
                  {t(opt.labelKey)}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
