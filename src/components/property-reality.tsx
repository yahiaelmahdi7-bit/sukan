// Server Component — no interactivity needed.
// "Property reality" stat block: Sudan-specific infrastructure facts
// derived from listing amenities + state. This is the single most
// differentiating feature vs Dubizzle-style portals for Sudanese buyers.

import { Zap, Droplet, Snowflake, Car, Sofa, Plane } from "lucide-react";
import GlassPanel from "@/components/glass-panel";
import type { SudanState } from "@/lib/sample-listings";

// ─── Airport distance map ────────────────────────────────────────────────────
// TODO: Extract to a separate data file and add more states as coverage grows.
const AIRPORT_DISTANCE: Partial<Record<SudanState, string>> = {
  khartoum: "8 km",
  // Bahri / Khartoum North — mapped to khartoum key since SudanState has no "bahri"
  al_jazirah: "180 km", // Wad Madani — no local airport, long-distance to Khartoum
  red_sea: "15 km",     // Port Sudan International
  kassala: "350 km",
  // Others fall through to the "—" fallback below
};

// Friendly display names for the airport distance cell
const AIRPORT_LABEL: Partial<Record<SudanState, string>> = {
  al_jazirah: "Long-distance",
};

// ─── Types ───────────────────────────────────────────────────────────────────

interface PropertyRealityProps {
  amenities?: string[];
  id: string;
  state: SudanState;
  /** "en" | "ar" — controls heading language */
  locale: "en" | "ar";
}

// ─── Sub-component: a single stat cell ───────────────────────────────────────

function StatCell({
  icon,
  label,
  value,
  highlight,
  muted,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  /** gold accent */
  highlight?: boolean;
  /** dimmed for "basic" infrastructure */
  muted?: boolean;
}) {
  return (
    <div className="flex flex-col items-start gap-2">
      {/* Icon container — gold-tinted pill */}
      <div
        className="flex items-center justify-center w-7 h-7 rounded-[var(--radius-pill)] flex-none"
        style={{
          background: highlight
            ? "linear-gradient(135deg, rgba(200,135,58,0.20), rgba(200,135,58,0.10))"
            : "linear-gradient(135deg, rgba(18,16,12,0.07), rgba(18,16,12,0.04))",
          border: highlight
            ? "1px solid rgba(200,135,58,0.35)"
            : "1px solid rgba(18,16,12,0.10)",
        }}
      >
        <span
          className={
            highlight
              ? "text-gold-dk"
              : muted
                ? "text-ink/35"
                : "text-ink/55"
          }
          style={{ display: "flex" }}
        >
          {icon}
        </span>
      </div>

      {/* Label — all-caps micro label */}
      <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink/45 leading-none">
        {label}
      </span>

      {/* Value — display font */}
      <span
        className={[
          "font-display leading-tight",
          value.length > 14 ? "text-sm" : "text-lg",
          highlight ? "text-gold-dk" : muted ? "text-ink/40" : "text-ink",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PropertyReality({
  amenities = [],
  state,
  locale,
}: PropertyRealityProps) {
  const a = new Set(amenities);

  // ── Power ────────────────────────────────────────────────────────────────
  const powerValue = a.has("generator")
    ? "Generator + grid"
    : a.has("solar")
      ? "Solar + grid"
      : "Grid only";
  const powerHighlight = a.has("generator") || a.has("solar");
  const powerMuted = !powerHighlight;

  // ── Water ────────────────────────────────────────────────────────────────
  const waterValue = a.has("water_tank") ? "Tank + city water" : "City water";
  const waterHighlight = a.has("water_tank");

  // ── Cooling ──────────────────────────────────────────────────────────────
  const coolingValue = a.has("ac") ? "AC fitted" : "Fans / passive";
  const coolingHighlight = a.has("ac");

  // ── Parking ──────────────────────────────────────────────────────────────
  const parkingValue = a.has("parking") ? "On-property" : "Street";
  const parkingHighlight = a.has("parking");

  // ── Furnishing ───────────────────────────────────────────────────────────
  const furnishingValue = a.has("furnished") ? "Furnished" : "Unfurnished";
  const furnishingHighlight = a.has("furnished");

  // ── Distance to airport ──────────────────────────────────────────────────
  const airportDist = AIRPORT_DISTANCE[state] ?? "—";
  const airportLabel = AIRPORT_LABEL[state];
  const airportValue = airportLabel ? `${airportLabel} (${airportDist})` : airportDist;
  const airportMuted = airportDist === "—";

  // ── Heading — bilingual ──────────────────────────────────────────────────
  // TODO: i18n — replace hardcoded strings with next-intl keys when translations are added.
  const heading = locale === "ar" ? "حقائق العقار" : "Property reality";

  return (
    <GlassPanel
      variant="warm"
      radius="glass"
      shadow="lg"
      className="p-5"
      aria-labelledby="property-reality-heading"
    >
      {/* Section heading */}
      <h2
        id="property-reality-heading"
        className="font-display text-xl text-ink tracking-tight mb-5"
      >
        {heading}
        {/* Bilingual subtitle on the same line, always shown */}
        <span className="ms-2 text-sm font-sans text-ink/40 tracking-normal">
          {locale === "ar" ? "Property reality" : "حقائق العقار"}
        </span>
      </h2>

      {/* 2-col mobile / 3-col desktop grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-6">
        <StatCell
          icon={<Zap size={14} strokeWidth={2} />}
          label={locale === "ar" ? "الكهرباء" : "Power"}
          value={powerValue}
          highlight={powerHighlight}
          muted={powerMuted}
        />
        <StatCell
          icon={<Droplet size={14} strokeWidth={2} />}
          label={locale === "ar" ? "المياه" : "Water"}
          value={waterValue}
          highlight={waterHighlight}
          muted={!waterHighlight}
        />
        <StatCell
          icon={<Snowflake size={14} strokeWidth={2} />}
          label={locale === "ar" ? "التبريد" : "Cooling"}
          value={coolingValue}
          highlight={coolingHighlight}
          muted={!coolingHighlight}
        />
        <StatCell
          icon={<Car size={14} strokeWidth={2} />}
          label={locale === "ar" ? "الموقف" : "Parking"}
          value={parkingValue}
          highlight={parkingHighlight}
          muted={!parkingHighlight}
        />
        <StatCell
          icon={<Sofa size={14} strokeWidth={2} />}
          label={locale === "ar" ? "الفرش" : "Furnishing"}
          value={furnishingValue}
          highlight={furnishingHighlight}
          muted={!furnishingHighlight}
        />
        <StatCell
          icon={<Plane size={14} strokeWidth={2} />}
          label={locale === "ar" ? "المطار" : "Airport"}
          value={airportValue}
          muted={airportMuted}
        />
      </div>
    </GlassPanel>
  );
}
