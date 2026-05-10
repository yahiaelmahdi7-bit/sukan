"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import FilterSidebar from "./filter-sidebar";

export default function MobileFilterSheet() {
  const t = useTranslations("browse");
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger — glass pill, only visible on mobile */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="smooth-fast inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-white/55 bg-white/45 px-4 py-2 text-sm text-ink-mid backdrop-blur-md hover:border-gold/50 hover:text-ink lg:hidden"
      >
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4 text-gold-dk"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
        {t("filters")}
      </button>

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
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3">
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
