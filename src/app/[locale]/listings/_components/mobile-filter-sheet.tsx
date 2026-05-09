"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import FilterSidebar from "./filter-sidebar";

export default function MobileFilterSheet() {
  const t = useTranslations("browse");
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger button — only visible on mobile */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-pill border border-gold/30 bg-earth-soft px-4 py-2 text-sm text-parchment transition hover:border-gold/60 lg:hidden"
      >
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4 text-gold"
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

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Slide-up sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-2xl border-t border-gold/20 bg-earth-deep p-6 shadow-2xl transition-transform duration-300 lg:hidden ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        aria-modal={open}
        role="dialog"
        aria-label={t("allFilters")}
      >
        <div className="mb-5 flex items-center justify-between">
          <span className="font-display text-lg text-parchment">{t("allFilters")}</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/20 text-mute-soft hover:text-parchment transition"
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
