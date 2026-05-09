"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { SUDAN_STATES, type SudanState, type PropertyType, type Amenity } from "@/lib/sample-listings";
import SavedSearches from "./saved-searches";

const PROPERTY_TYPES: PropertyType[] = [
  "apartment", "house", "villa", "studio",
  "shop", "office", "land", "warehouse",
];

const AMENITY_KEYS: Amenity[] = [
  "parking", "generator", "water_tank", "furnished",
  "garden", "security", "ac", "solar", "wifi",
  "elevator", "balcony", "rooftop",
];

const inputCls =
  "w-full bg-earth border border-gold/20 rounded-md px-3 py-2 text-parchment text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20";

const selectCls =
  "w-full bg-earth border border-gold/20 rounded-md px-3 py-2 text-parchment text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 appearance-none";

// Group header: tiny, uppercase, generous tracking, gold/70
const groupHeader = "text-[11px] font-semibold uppercase tracking-[0.18em] text-gold/70";

// Thin gold/10 divider placed above each group (except first)
const groupDivider = "border-t border-gold/10 pt-4 mt-4";

interface FilterSidebarProps {
  className?: string;
  onClose?: () => void;
}

export default function FilterSidebar({ className = "", onClose }: FilterSidebarProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read current values
  const currentState = searchParams.get("state") ?? "";
  const currentType = searchParams.get("type") ?? "";
  const currentPurpose = searchParams.get("purpose") ?? "";
  const currentMaxPrice = searchParams.get("maxPrice") ?? "";
  const currentMinBedrooms = searchParams.get("minBedrooms") ?? "";
  const currentAmenities = searchParams.getAll("amenity");

  function buildParams(overrides: Record<string, string | string[] | undefined>) {
    const p = new URLSearchParams();
    const base: Record<string, string | string[]> = {
      state: currentState,
      type: currentType,
      purpose: currentPurpose,
      maxPrice: currentMaxPrice,
      minBedrooms: currentMinBedrooms,
      amenity: currentAmenities,
    };
    // Preserve non-filter params (sort, view) from URL
    const sort = searchParams.get("sort");
    if (sort) base.sort = sort;
    const view = searchParams.get("view");
    if (view) base.view = view;

    const merged = { ...base, ...overrides };
    for (const [k, v] of Object.entries(merged)) {
      if (!v || v === "" || (Array.isArray(v) && v.length === 0)) continue;
      if (Array.isArray(v)) {
        v.forEach((item) => p.append(k, item));
      } else {
        p.set(k, v);
      }
    }
    return p.toString();
  }

  function push(overrides: Record<string, string | string[] | undefined>) {
    const qs = buildParams(overrides);
    router.push((qs ? `${pathname}?${qs}` : pathname) as Parameters<typeof router.push>[0]);
    onClose?.();
  }

  function toggleAmenity(key: Amenity) {
    const next = currentAmenities.includes(key)
      ? currentAmenities.filter((a) => a !== key)
      : [...currentAmenities, key];
    push({ amenity: next, page: undefined });
  }

  return (
    <aside className={`space-y-0 ${className}`}>
      {/* ─── Saved searches ─────────────────────────────────────────────────── */}
      <div className="mb-5">
        <SavedSearches />
      </div>

      {/* ─── State ──────────────────────────────────────────────────────────── */}
      <div>
        <p className={`mb-3 ${groupHeader}`}>{t("browse.stateLabel")}</p>
        <select
          className={selectCls}
          value={currentState}
          onChange={(e) => push({ state: e.target.value || undefined, page: undefined })}
          aria-label={t("browse.stateLabel")}
        >
          <option value="">{t("browse.anyState")}</option>
          {SUDAN_STATES.map((s) => (
            <option key={s} value={s}>
              {t(`states.${s}`)}
            </option>
          ))}
        </select>
      </div>

      {/* ─── Property type ──────────────────────────────────────────────────── */}
      <div className={groupDivider}>
        <p className={`mb-3 ${groupHeader}`}>{t("browse.typeLabel")}</p>
        <select
          className={selectCls}
          value={currentType}
          onChange={(e) => push({ type: e.target.value || undefined, page: undefined })}
          aria-label={t("browse.typeLabel")}
        >
          <option value="">{t("browse.anyType")}</option>
          {PROPERTY_TYPES.map((pt) => (
            <option key={pt} value={pt}>
              {t(`propertyType.${pt}`)}
            </option>
          ))}
        </select>
      </div>

      {/* ─── Purpose ────────────────────────────────────────────────────────── */}
      <div className={groupDivider}>
        <p className={`mb-3 ${groupHeader}`}>{t("browse.purposeLabel")}</p>
        <div className="flex gap-2">
          {(["", "rent", "sale"] as const).map((val) => {
            const label =
              val === "" ? t("browse.anyPurpose") :
              val === "rent" ? t("browse.purposeRent") :
              t("browse.purposeSale");
            const active = currentPurpose === val;
            return (
              <button
                key={val}
                type="button"
                onClick={() => push({ purpose: val || undefined, page: undefined })}
                className={`flex-1 rounded-md px-3 py-2 text-xs font-medium border transition ${
                  active
                    ? "bg-gold/20 border-gold text-parchment"
                    : "bg-earth border-gold/20 text-mute-soft hover:border-gold/50"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Min bedrooms ───────────────────────────────────────────────────── */}
      <div className={groupDivider}>
        <p className={`mb-3 ${groupHeader}`}>{t("browse.minBedrooms")}</p>
        <input
          type="number"
          min={0}
          max={20}
          className={inputCls}
          value={currentMinBedrooms}
          placeholder="0"
          onChange={(e) =>
            push({ minBedrooms: e.target.value || undefined, page: undefined })
          }
          aria-label={t("browse.minBedrooms")}
        />
      </div>

      {/* ─── Max price ──────────────────────────────────────────────────────── */}
      <div className={groupDivider}>
        <p className={`mb-3 ${groupHeader}`}>{t("browse.maxPrice")}</p>
        <input
          type="number"
          min={0}
          step={100}
          className={inputCls}
          value={currentMaxPrice}
          placeholder={t("browse.anyAmount")}
          onChange={(e) =>
            push({ maxPrice: e.target.value || undefined, page: undefined })
          }
          aria-label={t("browse.maxPrice")}
        />
      </div>

      {/* ─── Amenities ──────────────────────────────────────────────────────── */}
      <div className={groupDivider}>
        <p className={`mb-3 ${groupHeader}`}>{t("browse.amenitiesLabel")}</p>
        <div className="space-y-2.5">
          {AMENITY_KEYS.map((key) => {
            const checked = currentAmenities.includes(key);
            return (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-3 text-sm text-parchment"
              >
                {/* Custom checkbox with micro-animation */}
                <span
                  onClick={() => toggleAmenity(key)}
                  role="checkbox"
                  aria-checked={checked}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") toggleAmenity(key);
                  }}
                  className={`relative flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-sm border transition-all duration-200 ${
                    checked
                      ? "border-terracotta"
                      : "border-gold/30 bg-earth"
                  }`}
                >
                  {/* Terracotta fill expanding from start side */}
                  <span
                    className={`absolute inset-0 origin-left bg-terracotta/80 transition-transform duration-200 ${
                      checked ? "scale-x-100" : "scale-x-0"
                    }`}
                    aria-hidden
                  />
                  {checked && (
                    <svg
                      viewBox="0 0 12 12"
                      className="relative h-3 w-3 text-parchment"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden
                    >
                      <polyline points="1.5,6 4.5,9 10.5,3" />
                    </svg>
                  )}
                </span>
                <span
                  onClick={() => toggleAmenity(key)}
                  className="select-none"
                >
                  {t(`amenity.${key}`)}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* ─── Clear all ──────────────────────────────────────────────────────── */}
      <div className="mt-5 pt-5 border-t border-gold/10">
        <button
          type="button"
          onClick={() => router.push("/listings" as Parameters<typeof router.push>[0])}
          className="w-full rounded-md border border-gold/20 px-4 py-2 text-sm text-mute-soft transition hover:border-gold/50 hover:text-parchment"
        >
          {t("browse.clearFilters")}
        </button>
      </div>
    </aside>
  );
}
