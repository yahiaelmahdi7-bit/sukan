"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import type { SudanState, PropertyType, Amenity } from "@/lib/sample-listings";
import { getRegionByKey } from "@/lib/regions";

type ChipDescriptor = {
  key: string;
  label: string;
  remove: () => void;
};

export default function ActiveFilters() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function pushWithout(paramKey: string, value?: string) {
    const p = new URLSearchParams(searchParams.toString());
    if (value !== undefined) {
      const all = p.getAll(paramKey).filter((v) => v !== value);
      p.delete(paramKey);
      all.forEach((v) => p.append(paramKey, v));
    } else {
      p.delete(paramKey);
    }
    p.delete("page");
    const qs = p.toString();
    router.push((qs ? `${pathname}?${qs}` : pathname) as Parameters<typeof router.push>[0]);
  }

  // When removing region, also remove state and neighborhood (they were narrowed by it)
  function removeRegion() {
    const p = new URLSearchParams(searchParams.toString());
    p.delete("region");
    p.delete("neighborhood");
    p.delete("page");
    const qs = p.toString();
    router.push((qs ? `${pathname}?${qs}` : pathname) as Parameters<typeof router.push>[0]);
  }

  // When removing state, also remove neighborhood
  function removeState() {
    const p = new URLSearchParams(searchParams.toString());
    p.delete("state");
    p.delete("neighborhood");
    p.delete("page");
    const qs = p.toString();
    router.push((qs ? `${pathname}?${qs}` : pathname) as Parameters<typeof router.push>[0]);
  }

  const chips: ChipDescriptor[] = [];

  // Region chip — only show if explicitly set (not just derived)
  const region = searchParams.get("region");
  if (region) {
    const regionData = getRegionByKey(region);
    const regionLabel = (locale === "ar" ? regionData?.nameAr : regionData?.nameEn) ?? region;
    chips.push({
      key: "region",
      label: regionLabel,
      remove: removeRegion,
    });
  }

  const state = searchParams.get("state");
  if (state) {
    chips.push({
      key: "state",
      label: t(`states.${state as SudanState}`),
      remove: removeState,
    });
  }

  // Neighborhood chip
  const neighborhood = searchParams.get("neighborhood");
  if (neighborhood) {
    chips.push({
      key: "neighborhood",
      label: neighborhood,
      remove: () => pushWithout("neighborhood"),
    });
  }

  const type = searchParams.get("type");
  if (type) {
    chips.push({
      key: "type",
      label: t(`propertyType.${type as PropertyType}`),
      remove: () => pushWithout("type"),
    });
  }

  const purpose = searchParams.get("purpose");
  if (purpose) {
    chips.push({
      key: "purpose",
      label: purpose === "rent" ? t("browse.purposeRent") : t("browse.purposeSale"),
      remove: () => pushWithout("purpose"),
    });
  }

  const maxPrice = searchParams.get("maxPrice");
  if (maxPrice) {
    chips.push({
      key: "maxPrice",
      label: `≤ $${Number(maxPrice).toLocaleString()}`,
      remove: () => pushWithout("maxPrice"),
    });
  }

  const minBedrooms = searchParams.get("minBedrooms");
  if (minBedrooms) {
    chips.push({
      key: "minBedrooms",
      label: `${minBedrooms}+ ${t("listing.bedrooms").toLowerCase()}`,
      remove: () => pushWithout("minBedrooms"),
    });
  }

  const amenities = searchParams.getAll("amenity");
  amenities.forEach((a) => {
    chips.push({
      key: `amenity:${a}`,
      label: t(`amenity.${a as Amenity}`),
      remove: () => pushWithout("amenity", a),
    });
  });

  if (chips.length === 0) return null;

  return (
    <div
      className="flex flex-wrap gap-2"
      aria-label={t("browse.activeFiltersLabel")}
    >
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="smooth-fast inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-terracotta/35 bg-terracotta/12 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-terracotta backdrop-blur-sm hover:border-terracotta/55 hover:bg-terracotta/18"
        >
          {chip.label}
          <button
            type="button"
            onClick={chip.remove}
            aria-label={`${t("browse.removeFilter")}: ${chip.label}`}
            className="smooth-fast flex h-3.5 w-3.5 items-center justify-center rounded-full text-terracotta/60 hover:text-terracotta"
          >
            <svg
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-2.5 w-2.5"
              aria-hidden
            >
              <line x1="1" y1="1" x2="11" y2="11" />
              <line x1="11" y1="1" x2="1" y2="11" />
            </svg>
          </button>
        </span>
      ))}
    </div>
  );
}
