"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import FilterSidebar from "./filter-sidebar";
import SortSelect from "./sort-select";

interface StickyBarProps {
  total: number;
}

export default function StickyBar({ total }: StickyBarProps) {
  const t = useTranslations("browse");
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating glass-strong sticky bar — <lg only */}
      <div className="sticky top-16 z-30 glass-strong border-b border-white/30 px-4 py-2.5 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-ink-soft">
            {t("stickyResults", { count: total })}
          </span>
          <div className="flex items-center gap-2">
            <SortSelect compact />
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="smooth-fast inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-white/55 bg-white/45 px-3 py-1.5 text-xs font-semibold text-ink-mid backdrop-blur-md hover:border-gold/50 hover:text-ink"
            >
              <svg
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-3.5 w-3.5 text-gold-dk"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M2 4a1 1 0 011-1h10a1 1 0 110 2H3a1 1 0 01-1-1zm0 4a1 1 0 011-1h10a1 1 0 110 2H3a1 1 0 01-1-1zm0 4a1 1 0 011-1h5a1 1 0 110 2H3a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {t("stickyFilters")}
            </button>
          </div>
        </div>
      </div>

      {/* Dark-translucent backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-earth/50 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Slide-up sheet — glass-strong surface */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-[var(--radius-glass)] border-t border-white/30 glass-strong p-6 backdrop-blur-md transition-transform duration-300 lg:hidden ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ boxShadow: "var(--shadow-warm-lg)" }}
        aria-modal={open}
        role="dialog"
        aria-label={t("allFilters")}
      >
        <div className="mb-5 flex items-center justify-between">
          <span className="font-display text-lg text-ink">{t("allFilters")}</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="smooth-fast flex h-7 w-7 items-center justify-center rounded-full border border-white/55 bg-white/45 text-ink-mid backdrop-blur-md hover:text-ink"
            aria-label="Close filters"
          >
            <svg
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-3 w-3"
            >
              <line x1="1" y1="1" x2="11" y2="11" />
              <line x1="11" y1="1" x2="1" y2="11" />
            </svg>
          </button>
        </div>
        <FilterSidebar onClose={() => setOpen(false)} />
      </div>
    </>
  );
}
