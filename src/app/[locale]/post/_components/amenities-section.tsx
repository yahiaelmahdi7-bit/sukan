"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, Check } from "lucide-react";
import { AMENITY_CATEGORIES, type AmenityCategoryKey } from "@/lib/amenities";
import type { Amenity } from "@/lib/sample-listings";

interface AmenitiesSectionProps {
  selected: Amenity[];
  onChange: (next: Amenity[]) => void;
}

const labelCls =
  "block text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-dk mb-1.5";

export default function AmenitiesSection({
  selected,
  onChange,
}: AmenitiesSectionProps) {
  const t = useTranslations("post");
  const tc = useTranslations("amenityCategory");
  const ta = useTranslations("amenity");

  // First two categories expanded by default for discoverability;
  // the rest are collapsed but always show their selected count.
  const [openCats, setOpenCats] = useState<Set<AmenityCategoryKey>>(
    () => new Set<AmenityCategoryKey>(["essentials", "kitchen"]),
  );

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  function toggleCategory(key: AmenityCategoryKey) {
    setOpenCats((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  function toggleAmenity(slug: Amenity) {
    if (selectedSet.has(slug)) {
      onChange(selected.filter((s) => s !== slug));
    } else {
      onChange([...selected, slug]);
    }
  }

  function expandAll() {
    setOpenCats(new Set(AMENITY_CATEGORIES.map((c) => c.key)));
  }

  function collapseAll() {
    setOpenCats(new Set());
  }

  const allOpen = openCats.size === AMENITY_CATEGORIES.length;

  return (
    <fieldset>
      <div className="flex items-center justify-between gap-3 mb-2">
        <legend className={`${labelCls} mb-0`}>
          {t("amenitiesLabel")}
        </legend>
        <button
          type="button"
          onClick={allOpen ? collapseAll : expandAll}
          className="smooth-fast text-[11px] font-semibold uppercase tracking-wider text-gold-dk hover:text-terracotta"
        >
          {allOpen ? t("amenitiesCollapseAll") : t("amenitiesExpandAll")}
        </button>
      </div>
      <p className="text-xs text-ink-mid mb-3">
        {t("amenitiesHint")}{" "}
        <span className="text-ink font-medium">
          ·{" "}
          {selected.length > 0
            ? t("amenitiesSelected", { count: selected.length })
            : t("amenitiesNoneSelected")}
        </span>
      </p>

      <div className="space-y-2">
        {AMENITY_CATEGORIES.map((category) => {
          const open = openCats.has(category.key);
          const selectedInCategory = category.items.filter((i) =>
            selectedSet.has(i.slug),
          ).length;

          return (
            <div
              key={category.key}
              className="rounded-[var(--radius-card)] border border-white/55 glass-warm overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleCategory(category.key)}
                className="smooth-fast w-full flex items-center justify-between gap-3 px-4 py-3 text-start hover:bg-white/30"
                aria-expanded={open}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-sm font-semibold text-ink">
                    {tc(category.key)}
                  </span>
                  {selectedInCategory > 0 && (
                    <span
                      className="rounded-[var(--radius-pill)] bg-gold/20 text-gold-dk text-[10px] font-bold px-2 py-0.5 tabular-nums"
                      aria-label={t("amenitiesSelected", {
                        count: selectedInCategory,
                      })}
                    >
                      {selectedInCategory}
                    </span>
                  )}
                </span>
                <ChevronDown
                  size={16}
                  className={[
                    "smooth-fast text-ink-mid shrink-0",
                    open ? "rotate-180" : "",
                  ].join(" ")}
                  aria-hidden
                />
              </button>

              {open && (
                <div className="px-4 pb-4 pt-1 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {category.items.map(({ slug, icon: Icon }) => {
                    const isSelected = selectedSet.has(slug);
                    return (
                      <button
                        key={slug}
                        type="button"
                        onClick={() => toggleAmenity(slug)}
                        aria-pressed={isSelected}
                        className={[
                          "smooth-fast group relative flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-start text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
                          isSelected
                            ? "border-terracotta/60 bg-terracotta/10 text-ink"
                            : "border-white/55 bg-white/45 text-ink-mid hover:border-gold/45 hover:text-ink hover:bg-white/65",
                        ].join(" ")}
                      >
                        <Icon
                          size={16}
                          className={[
                            "shrink-0",
                            isSelected ? "text-terracotta" : "text-gold-dk",
                          ].join(" ")}
                          aria-hidden
                        />
                        <span className="flex-1 leading-tight">
                          {ta(slug)}
                        </span>
                        {isSelected && (
                          <Check
                            size={14}
                            className="text-terracotta shrink-0"
                            aria-hidden
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
