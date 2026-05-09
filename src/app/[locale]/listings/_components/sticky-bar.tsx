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
      {/* Sticky bar — only on <lg */}
      <div className="sticky top-16 z-30 border-b border-gold/10 bg-earth/90 px-4 py-2.5 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-mute-soft">
            {t("stickyResults", { count: total })}
          </span>
          <div className="flex items-center gap-2">
            <SortSelect compact />
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-pill border border-gold/30 bg-earth-soft px-3 py-1.5 text-xs font-medium text-parchment transition hover:border-gold/60"
            >
              <svg
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-3.5 w-3.5 text-gold"
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
