"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { SUDAN_STATES, type PropertyType, type Amenity, type SudanState } from "@/lib/sample-listings";
import { regions, getRegionByState, getRegionByKey, type RegionKey } from "@/lib/regions";
import { getNeighborhoodsForState, type NeighborhoodName } from "@/lib/sudan-neighborhoods";
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
  "smooth-fast w-full rounded-xl border border-white/55 bg-white/55 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-mid/65 backdrop-blur-md focus:outline-none focus:border-gold/55 focus:bg-white/80 focus:ring-2 focus:ring-gold/20";

const selectCls = `${inputCls} appearance-none`;

const groupHeader =
  "text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-dk";

const groupDivider = "border-t border-sand-dk pt-5 mt-5";

// Pill button style for region & neighborhood filters
const pillBase =
  "smooth-fast rounded-[var(--radius-pill)] border px-3 py-1.5 text-xs font-semibold transition-colors";
const pillInactive =
  "border-white/55 bg-white/45 text-ink-mid backdrop-blur-sm hover:border-gold/50 hover:text-ink";
const pillActive =
  "border-terracotta/60 bg-terracotta text-cream shadow-[0_2px_8px_rgba(200,64,26,0.25)]";

interface FilterSidebarProps {
  className?: string;
  onClose?: () => void;
}

export default function FilterSidebar({ className = "", onClose }: FilterSidebarProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentRegion = searchParams.get("region") ?? "";
  const currentState = searchParams.get("state") ?? "";
  const currentNeighborhood = searchParams.get("neighborhood") ?? "";
  const currentType = searchParams.get("type") ?? "";
  const currentPurpose = searchParams.get("purpose") ?? "";
  const currentMaxPrice = searchParams.get("maxPrice") ?? "";
  const currentMinBedrooms = searchParams.get("minBedrooms") ?? "";
  const currentAmenities = searchParams.getAll("amenity");

  // Derive the active region from state if region param not set
  const derivedRegion = currentRegion
    ? currentRegion
    : currentState
    ? (getRegionByState(currentState)?.key ?? "")
    : "";

  // States to show in the state dropdown (narrowed when a region is selected)
  const allowedStates: readonly string[] = derivedRegion
    ? (regions.find((r) => r.key === derivedRegion)?.states ?? SUDAN_STATES)
    : SUDAN_STATES;

  // Neighborhoods for the selected state — pulled from the curated Sudan-wide
  // dictionary so every state has real options even before listings exist there.
  const locale = useLocale();
  const isAr = locale === "ar";
  const neighborhoodsForState: NeighborhoodName[] = currentState
    ? getNeighborhoodsForState(currentState)
    : [];

  function buildParams(overrides: Record<string, string | string[] | undefined>) {
    const p = new URLSearchParams();
    const base: Record<string, string | string[]> = {
      region: currentRegion,
      state: currentState,
      neighborhood: currentNeighborhood,
      type: currentType,
      purpose: currentPurpose,
      maxPrice: currentMaxPrice,
      minBedrooms: currentMinBedrooms,
      amenity: currentAmenities,
    };
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

  function selectRegion(regionKey: string) {
    if (regionKey === currentRegion) {
      // Toggle off
      push({ region: undefined, state: undefined, neighborhood: undefined, page: undefined });
    } else {
      // Selecting a region clears state and neighborhood (they'll be re-narrowed)
      push({ region: regionKey, state: undefined, neighborhood: undefined, page: undefined });
    }
  }

  function selectState(stateVal: string) {
    // When state changes, clear neighborhood; keep region if compatible
    const newRegion = stateVal ? (getRegionByState(stateVal)?.key ?? "") : currentRegion;
    push({
      state: stateVal || undefined,
      neighborhood: undefined,
      region: newRegion || undefined,
      page: undefined,
    });
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

      {/* ─── Region ─────────────────────────────────────────────────────────── */}
      <div>
        {/* TODO: i18n */}
        <p className={`mb-3 ${groupHeader}`}>Region</p>
        <div className="flex flex-wrap gap-1.5">
          {/* All regions pill */}
          <button
            type="button"
            onClick={() =>
              push({ region: undefined, state: undefined, neighborhood: undefined, page: undefined })
            }
            className={`${pillBase} ${!derivedRegion ? pillActive : pillInactive}`}
          >
            {/* TODO: i18n */}
            All
          </button>
          {regions.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => selectRegion(r.key)}
              className={`${pillBase} ${derivedRegion === r.key ? pillActive : pillInactive}`}
            >
              {r.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* ─── State ──────────────────────────────────────────────────────────── */}
      <div className={groupDivider}>
        <p className={`mb-3 ${groupHeader}`}>{t("browse.stateLabel")}</p>
        <select
          className={selectCls}
          value={currentState}
          onChange={(e) => selectState(e.target.value)}
          aria-label={t("browse.stateLabel")}
        >
          <option value="">{t("browse.anyState")}</option>
          {(allowedStates as string[]).map((s) => (
            <option key={s} value={s}>
              {t(`states.${s as SudanState}`)}
            </option>
          ))}
        </select>
      </div>

      {/* ─── Neighborhood (only when a state is selected) ───────────────────── */}
      {currentState && (
        <div className={groupDivider}>
          {/* TODO: i18n */}
          <p className={`mb-3 ${groupHeader}`}>Neighborhood</p>
          {neighborhoodsForState.length === 0 ? (
            <p className="text-xs text-ink-mid/70 italic">
              {/* TODO: i18n */}
              No neighborhoods configured for this state
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => push({ neighborhood: undefined, page: undefined })}
                className={`${pillBase} ${!currentNeighborhood ? pillActive : pillInactive}`}
              >
                {/* TODO: i18n */}
                Any
              </button>
              {neighborhoodsForState.map((n) => (
                <button
                  key={n.slug}
                  type="button"
                  onClick={() =>
                    push({
                      neighborhood: currentNeighborhood === n.slug ? undefined : n.slug,
                      page: undefined,
                    })
                  }
                  className={`${pillBase} ${currentNeighborhood === n.slug ? pillActive : pillInactive}`}
                >
                  {isAr ? n.ar : n.en}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

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
        <p id="filter-purpose-label" className={`mb-3 ${groupHeader}`}>{t("browse.purposeLabel")}</p>
        <div
          role="group"
          aria-labelledby="filter-purpose-label"
          className="inline-flex w-full rounded-[var(--radius-pill)] border border-white/55 bg-white/45 p-1 backdrop-blur-md"
        >
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
                aria-pressed={active}
                onClick={() => push({ purpose: val || undefined, page: undefined })}
                className={`smooth-fast flex-1 rounded-[var(--radius-pill)] px-3 py-1.5 text-xs font-semibold ${
                  active
                    ? "bg-terracotta text-cream shadow-[0_2px_10px_rgba(200,64,26,0.30)]"
                    : "text-ink-mid hover:text-ink"
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
                className="flex cursor-pointer items-center gap-3 text-sm text-ink"
              >
                <span
                  onClick={() => toggleAmenity(key)}
                  role="checkbox"
                  aria-checked={checked}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") toggleAmenity(key);
                  }}
                  className={`smooth-fast relative flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-[5px] border ${
                    checked
                      ? "border-terracotta"
                      : "border-sand-dk bg-white/65"
                  }`}
                >
                  <span
                    className={`absolute inset-0 origin-left bg-terracotta transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      checked ? "scale-x-100" : "scale-x-0"
                    }`}
                    aria-hidden
                  />
                  {checked && (
                    <svg
                      viewBox="0 0 12 12"
                      className="relative h-3 w-3 text-cream"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden
                    >
                      <polyline points="1.5,6 4.5,9 10.5,3" />
                    </svg>
                  )}
                </span>
                <span onClick={() => toggleAmenity(key)} className="select-none">
                  {t(`amenity.${key}`)}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* ─── Clear all ──────────────────────────────────────────────────────── */}
      <div className="mt-6 border-t border-sand-dk pt-5">
        <button
          type="button"
          onClick={() => router.push("/listings" as Parameters<typeof router.push>[0])}
          className="smooth-fast w-full rounded-[var(--radius-pill)] border border-white/55 bg-white/45 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-mid backdrop-blur-md hover:border-gold/50 hover:text-ink"
        >
          {t("browse.clearFilters")}
        </button>
      </div>
    </aside>
  );
}
