"use client";

/**
 * Search autocomplete dropdown for the Sukan hero search.
 *
 * Architecture:
 *   - Pure presentational component — all state lives in hero-search.tsx
 *   - `searchAll()` is the matching engine, exported for the parent
 *   - `flattenResults()` gives the flat array for keyboard nav
 *   - Keyboard navigation is handled by the parent input; activeIndex is
 *     passed down so highlighted rows can be styled
 */

import { Globe, MapPin, Home } from "lucide-react";
import { useTranslations } from "next-intl";
import { sudanNeighborhoods } from "@/lib/sudan-neighborhoods";
import { sampleListings } from "@/lib/sample-listings";

// ─── Static label maps (avoids depending on next-intl in the pure engine) ─────

const STATE_LABELS_EN: Record<string, string> = {
  khartoum: "Khartoum",
  al_jazirah: "Al Jazirah",
  blue_nile: "Blue Nile",
  sennar: "Sennar",
  white_nile: "White Nile",
  north_kordofan: "North Kordofan",
  south_kordofan: "South Kordofan",
  west_kordofan: "West Kordofan",
  north_darfur: "North Darfur",
  south_darfur: "South Darfur",
  east_darfur: "East Darfur",
  central_darfur: "Central Darfur",
  west_darfur: "West Darfur",
  kassala: "Kassala",
  red_sea: "Red Sea",
  gedaref: "Gedaref",
  river_nile: "River Nile",
  northern: "Northern",
};

const STATE_LABELS_AR: Record<string, string> = {
  khartoum: "الخرطوم",
  al_jazirah: "الجزيرة",
  blue_nile: "النيل الأزرق",
  sennar: "سنار",
  white_nile: "النيل الأبيض",
  north_kordofan: "شمال كردفان",
  south_kordofan: "جنوب كردفان",
  west_kordofan: "غرب كردفان",
  north_darfur: "شمال دارفور",
  south_darfur: "جنوب دارفور",
  east_darfur: "شرق دارفور",
  central_darfur: "وسط دارفور",
  west_darfur: "غرب دارفور",
  kassala: "كسلا",
  red_sea: "البحر الأحمر",
  gedaref: "القضارف",
  river_nile: "نهر النيل",
  northern: "الشمالية",
};

// ─── Result types ─────────────────────────────────────────────────────────────

export type StateResult = {
  kind: "state";
  key: string;
  label: string;
};

export type NeighborhoodResult = {
  kind: "neighborhood";
  slug: string;
  stateKey: string;
  label: string;
  secondary: string;
};

export type ListingResult = {
  kind: "listing";
  id: string;
  label: string;
  secondary: string;
};

export type SearchResult = StateResult | NeighborhoodResult | ListingResult;

export type SearchResults = {
  states: StateResult[];
  neighborhoods: NeighborhoodResult[];
  listings: ListingResult[];
};

// ─── Search engine ────────────────────────────────────────────────────────────

export function searchAll(
  query: string,
  locale: "en" | "ar",
): SearchResults {
  const needle = query.trim().toLowerCase();
  if (needle.length < 2) {
    return { states: [], neighborhoods: [], listings: [] };
  }

  const stateLabels = locale === "ar" ? STATE_LABELS_AR : STATE_LABELS_EN;
  const stateLabelsOther = locale === "ar" ? STATE_LABELS_EN : STATE_LABELS_AR;

  // States — match primary label, opposite-locale label, or slug
  const states: StateResult[] = [];
  for (const [key, label] of Object.entries(stateLabels)) {
    const other = stateLabelsOther[key] ?? "";
    if (
      label.toLowerCase().includes(needle) ||
      other.toLowerCase().includes(needle) ||
      key.replace(/_/g, " ").includes(needle)
    ) {
      states.push({ kind: "state", key, label });
      if (states.length >= 4) break;
    }
  }

  // Neighborhoods — iterate all states, match en + ar + slug
  const neighborhoods: NeighborhoodResult[] = [];
  outer: for (const [stateKey, list] of Object.entries(sudanNeighborhoods)) {
    for (const n of list) {
      if (
        n.en.toLowerCase().includes(needle) ||
        n.ar.includes(needle) ||
        n.slug.replace(/-/g, " ").includes(needle)
      ) {
        const stateName = stateLabels[stateKey] ?? stateKey;
        const displayLabel = locale === "ar" ? n.ar : n.en;
        neighborhoods.push({
          kind: "neighborhood",
          slug: n.slug,
          stateKey,
          label: displayLabel,
          secondary: stateName,
        });
        if (neighborhoods.length >= 6) break outer;
      }
    }
  }

  // Listings — match titleEn + titleAr + city + cityAr
  const listings: ListingResult[] = [];
  for (const l of sampleListings) {
    if (
      l.titleEn.toLowerCase().includes(needle) ||
      l.titleAr.includes(needle) ||
      l.city.toLowerCase().includes(needle) ||
      l.cityAr.includes(needle)
    ) {
      const label = locale === "ar" ? l.titleAr : l.titleEn;
      const city = locale === "ar" ? l.cityAr : l.city;
      const stateName = stateLabels[l.state] ?? l.state;
      listings.push({
        kind: "listing",
        id: l.id,
        label,
        secondary: `${city} · ${stateName}`,
      });
      if (listings.length >= 4) break;
    }
  }

  return { states, neighborhoods, listings };
}

/** Flatten results into a single ordered array for keyboard navigation. */
export function flattenResults(results: SearchResults): SearchResult[] {
  return [...results.states, ...results.neighborhoods, ...results.listings];
}

// ─── Presentational component ─────────────────────────────────────────────────

type Props = {
  results: SearchResults;
  query: string;
  locale: "en" | "ar";
  activeIndex: number;
  listboxId: string;
  onHover: (idx: number) => void;
  onSelect: (result: SearchResult) => void;
  onSeeAll: () => void;
};

export default function SearchAutocomplete({
  results,
  query,
  locale,
  activeIndex,
  listboxId,
  onHover,
  onSelect,
  onSeeAll,
}: Props) {
  const t = useTranslations("search");
  const { states, neighborhoods, listings } = results;
  const hasResults =
    states.length > 0 || neighborhoods.length > 0 || listings.length > 0;

  if (!hasResults) return null;

  const isRtl = locale === "ar";

  // Render one option row — using a plain function (not a component) to avoid
  // remounting issues with inner-component pattern.
  function renderRow(result: SearchResult, idx: number) {
    const isActive = idx === activeIndex;

    let icon: React.ReactNode;
    let primary: string;
    let secondary: string | undefined;
    let rowKey: string;

    if (result.kind === "state") {
      icon = <Globe size={15} strokeWidth={1.8} aria-hidden />;
      primary = result.label;
      secondary = undefined;
      rowKey = `state-${result.key}`;
    } else if (result.kind === "neighborhood") {
      icon = <MapPin size={15} strokeWidth={1.8} aria-hidden />;
      primary = result.label;
      secondary = result.secondary;
      rowKey = `nbhd-${result.slug}`;
    } else {
      icon = <Home size={15} strokeWidth={1.8} aria-hidden />;
      primary = result.label;
      secondary = result.secondary;
      rowKey = `listing-${result.id}`;
    }

    return (
      <div
        key={rowKey}
        role="option"
        aria-selected={isActive}
        id={`${listboxId}-opt-${idx}`}
        className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer smooth-fast ${
          isActive ? "bg-terracotta/10" : "hover:bg-terracotta/[0.06]"
        }`}
        onMouseEnter={() => onHover(idx)}
        onMouseLeave={() => onHover(-1)}
        onMouseDown={(e) => {
          // Prevent blur on the input before the click registers
          e.preventDefault();
          onSelect(result);
        }}
      >
        <span className="shrink-0 text-ink-mid/60">{icon}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink leading-tight">
            {primary}
          </p>
          {secondary && (
            <p className="truncate text-xs text-ink-mid/70 mt-0.5">
              {secondary}
            </p>
          )}
        </div>
      </div>
    );
  }

  function SectionHeader({ label }: { label: string }) {
    return (
      <div
        role="presentation"
        className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gold-dk select-none"
      >
        {label}
      </div>
    );
  }

  // Row index counter — sections render in order: states → neighborhoods → listings
  let rowIdx = 0;

  return (
    <div
      id={listboxId}
      role="listbox"
      aria-label={t("placeholder")}
      className="absolute start-0 end-0 top-full mt-2 rounded-[var(--radius-glass)] border border-white/55 bg-white/90 backdrop-blur-xl overflow-hidden z-50"
      style={{
        boxShadow: "var(--shadow-warm-lg, 0 16px 48px rgba(60,40,20,0.18))",
      }}
    >
      {states.length > 0 && (
        <>
          <SectionHeader label={t("sectionStates")} />
          {states.map((r) => {
            const el = renderRow(r, rowIdx);
            rowIdx++;
            return el;
          })}
        </>
      )}

      {neighborhoods.length > 0 && (
        <>
          <SectionHeader label={t("sectionNeighborhoods")} />
          {neighborhoods.map((r) => {
            const el = renderRow(r, rowIdx);
            rowIdx++;
            return el;
          })}
        </>
      )}

      {listings.length > 0 && (
        <>
          <SectionHeader label={t("sectionListings")} />
          {listings.map((r) => {
            const el = renderRow(r, rowIdx);
            rowIdx++;
            return el;
          })}
        </>
      )}

      {/* "See all results for …" footer */}
      <div className="border-t border-black/[0.06]">
        <button
          type="button"
          className="w-full px-4 py-2.5 text-start text-xs text-terracotta font-medium hover:bg-terracotta/[0.06] smooth-fast"
          onMouseDown={(e) => {
            e.preventDefault();
            onSeeAll();
          }}
        >
          {t("seeAll", { query: query.trim() })}
          {isRtl ? " ←" : " →"}
        </button>
      </div>
    </div>
  );
}
