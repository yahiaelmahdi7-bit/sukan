"use client";

import { useState, useEffect, useRef } from "react";
import type { Listing } from "@/lib/sample-listings";
import { GlassInput } from "@/components/ui/glass-input";

export interface MapResultsPanelLabels {
  panelTitle: string;
  toggleList: string;
  hideList: string;
  flyToListing: string;
  legendRent: string;
  legendSale: string;
  legendFeatured: string;
  perMonth: string;
  perYear: string;
  perTotal: string;
  bedroomsShort: string;
  bathroomsShort: string;
  areaShort: string;
}

interface Props {
  listings: Listing[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  locale: string;
  labels: MapResultsPanelLabels;
  isOpen: boolean;
  onToggle: () => void;
}

// ── Sukan watermark mark used in thumbnails ───────────────────────────────────
function SukanMark() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ opacity: 0.22 }}
    >
      <path
        d="M8 15 C16 9,26 9,32 14 C38 19,48 22,56 17 C54 19,48 24.5,40 21.5 C32 18.5,22 18,14 21 C10 22.5,8 20,8 18 Z"
        fill="#C8873A"
      />
      <path
        d="M8 27 C16 22,26 21,32 26 C38 31,49 33,56 28.5 C54 30.5,48 35.5,40 33 C32 30.5,22 30,14 33 C10 34.5,8 32,8 30 Z"
        fill="#C8873A"
      />
      <path
        d="M8 39 C16 34,26 33.5,32 38 C38 42.5,49 44.5,56 40.5 C54.5 42.5,48 46.5,40 44.5 C32 42.5,22 42,14 44.5 C10 45.5,8 43.5,8 42 Z"
        fill="#C8873A"
      />
      <circle cx="24" cy="52" r="2" fill="#C8873A" />
      <circle cx="32" cy="52" r="2" fill="#C8873A" />
      <circle cx="40" cy="52" r="2" fill="#C8873A" />
    </svg>
  );
}

function formatPanelPrice(listing: Listing): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(listing.priceUsd);
}

function getPeriodLabel(
  listing: Listing,
  labels: MapResultsPanelLabels,
): string {
  if (listing.period === "month") return labels.perMonth;
  if (listing.period === "year") return labels.perYear;
  return labels.perTotal;
}

// ── Legend dot ────────────────────────────────────────────────────────────────
function LegendDot({
  color,
  label,
  star = false,
}: {
  color: string;
  label: string;
  star?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-ink-mid">
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ background: color }}
        aria-hidden
      />
      {star && (
        <span className="text-[10px] text-gold-bright" aria-hidden>
          ★
        </span>
      )}
      {label}
    </div>
  );
}

// ── Meta pill ─────────────────────────────────────────────────────────────────
function MetaPill({
  children,
  gold = false,
}: {
  children: React.ReactNode;
  gold?: boolean;
}) {
  return (
    <span
      className={[
        "inline-block rounded-[5px] border px-1.5 py-px text-[10px] font-semibold leading-relaxed",
        gold
          ? "border-gold/25 bg-gold/10 text-gold-dk"
          : "border-sand-dk/60 bg-sand/50 text-ink-mid",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function MapResultsPanel({
  listings,
  selectedId,
  onSelect,
  locale,
  labels,
  isOpen,
  onToggle,
}: Props) {
  const [query, setQuery] = useState("");
  const selectedRef = useRef<HTMLButtonElement>(null);

  // Filter listings by search query
  const filtered = query.trim()
    ? listings.filter((l) => {
        const q = query.toLowerCase();
        const title = locale === "ar" ? l.titleAr : l.titleEn;
        const city = locale === "ar" ? l.cityAr : l.city;
        return (
          title.toLowerCase().includes(q) || city.toLowerCase().includes(q)
        );
      })
    : listings;

  // Scroll the selected card into view whenever selectedId changes
  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedId]);

  return (
    <>
      {/* ── Floating toggle pill — mobile only ─────────────────────────────── */}
      <button
        onClick={onToggle}
        style={{ zIndex: 1100 }}
        className={[
          "smooth lg:hidden",
          "fixed bottom-6 start-1/2 -translate-x-1/2",
          "inline-flex items-center gap-2 whitespace-nowrap",
          "rounded-[var(--radius-pill)] px-5 py-3",
          "border border-white/55 bg-white/45 backdrop-blur-md",
          "text-[13px] font-bold text-gold-dk",
          "shadow-[var(--shadow-warm)]",
          "hover:bg-white/65 hover:border-gold/40",
        ].join(" ")}
        aria-label={isOpen ? labels.hideList : labels.toggleList}
      >
        <span className="text-[15px]" aria-hidden>
          ≡
        </span>
        {isOpen ? labels.hideList : labels.toggleList}
      </button>

      {/* ── Side panel — glass-strong card ─────────────────────────────────── */}
      <aside
        aria-label={labels.panelTitle}
        className="flex h-full flex-col overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,252,246,0.92) 0%, rgba(244,234,215,0.88) 100%)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          borderInlineStart: "1px solid rgba(255,255,255,0.7)",
          boxShadow: "var(--shadow-warm-lg)",
        }}
      >
        {/* Terracotta → gold gradient accent bar at the top */}
        <div
          aria-hidden
          className="h-[3px] w-full shrink-0"
          style={{
            background:
              "linear-gradient(90deg, #C8401A 0%, #C8873A 50%, #E0A857 100%)",
          }}
        />

        {/* ── Sticky header ────────────────────────────────────────────────── */}
        <div
          className="shrink-0 px-5 pb-4 pt-5"
          style={{ borderBottom: "1px solid rgba(214,196,160,0.4)" }}
        >
          {/* Eyebrow */}
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-dk">
            {labels.panelTitle}
          </p>

          {/* Result count */}
          <p className="mb-4 text-xs text-ink-mid">
            <span className="font-semibold text-gold-dk">
              {filtered.length}
            </span>
            {" "}
            {filtered.length === 1 ? "listing" : "listings"}
            {query.trim() ? " found" : " shown"}
          </p>

          {/* Search input */}
          <GlassInput
            tone="light"
            type="search"
            placeholder="Search listings…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search listings"
          />

          {/* Legend chips */}
          <div className="mt-4 flex flex-wrap gap-3">
            <LegendDot
              color="linear-gradient(135deg,#2A8B4F,#1A6B3A)"
              label={labels.legendRent}
            />
            <LegendDot
              color="linear-gradient(135deg,#E55A30,#C8401A)"
              label={labels.legendSale}
            />
            <LegendDot
              color="linear-gradient(135deg,#E8B84B,#C8873A)"
              label={labels.legendFeatured}
              star
            />
          </div>
        </div>

        {/* ── Scrollable listing list ───────────────────────────────────────── */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
              <span className="text-2xl opacity-30" aria-hidden>
                🏠
              </span>
              <p className="text-sm text-ink-mid">No listings match your search.</p>
            </div>
          )}

          {filtered.map((listing) => {
            const isSelected = listing.id === selectedId;
            const title =
              locale === "ar" ? listing.titleAr : listing.titleEn;
            const city =
              locale === "ar" ? listing.cityAr : listing.city;
            const price = formatPanelPrice(listing);
            const period = getPeriodLabel(listing, labels);

            return (
              <button
                key={listing.id}
                ref={isSelected ? selectedRef : null}
                onClick={() => onSelect(listing.id)}
                aria-pressed={isSelected}
                aria-label={`${title} — ${labels.flyToListing}`}
                className={[
                  "smooth-fast group w-full text-start",
                  "flex items-start gap-3 px-5 py-4",
                  // Divider
                  "border-b border-sand-dk/30",
                  // Active vs idle state
                  isSelected
                    ? "bg-terracotta/5"
                    : "hover:bg-gold/5",
                ].join(" ")}
                style={{
                  borderInlineStart: isSelected
                    ? "3px solid #C8401A"
                    : "3px solid transparent",
                  // Gold glow on hover for idle items
                  boxShadow: isSelected
                    ? "var(--shadow-terracotta-glow)"
                    : undefined,
                }}
              >
                {/* ── Thumbnail ─────────────────────────────────────────── */}
                <div
                  className={[
                    "smooth-fast relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl",
                    "card-watermark",
                    isSelected
                      ? "ring-1 ring-terracotta/40"
                      : "group-hover:ring-1 group-hover:ring-gold/35",
                  ].join(" ")}
                >
                  {listing.tier === "featured" && (
                    <span
                      className="absolute end-1 top-1 h-2 w-2 rounded-full"
                      style={{
                        background:
                          "linear-gradient(135deg,#e0a857,#c8873a)",
                        boxShadow: "0 0 4px rgba(200,135,58,0.6)",
                      }}
                      aria-hidden
                    />
                  )}
                  <SukanMark />
                </div>

                {/* ── Text content ──────────────────────────────────────── */}
                <div className="min-w-0 flex-1">
                  {/* Title */}
                  <p className="mb-0.5 line-clamp-2 text-[13px] font-semibold leading-snug text-ink">
                    {title}
                  </p>

                  {/* Price */}
                  <p className="mb-0.5 text-[15px] font-bold leading-none tabular-nums text-terracotta">
                    {price}
                    <span className="ms-1 text-[11px] font-normal text-ink-mid">
                      {period}
                    </span>
                  </p>

                  {/* City */}
                  <p className="mb-2 truncate text-[11px] text-ink-mid">
                    {city}
                  </p>

                  {/* Meta pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {listing.bedrooms !== undefined && (
                      <MetaPill>
                        {labels.bedroomsShort.replace(
                          "{count}",
                          String(listing.bedrooms),
                        )}
                      </MetaPill>
                    )}
                    {listing.bathrooms !== undefined && (
                      <MetaPill>
                        {labels.bathroomsShort.replace(
                          "{count}",
                          String(listing.bathrooms),
                        )}
                      </MetaPill>
                    )}
                    {listing.areaSqm !== undefined && (
                      <MetaPill>
                        {labels.areaShort.replace(
                          "{value}",
                          String(listing.areaSqm),
                        )}
                      </MetaPill>
                    )}
                    {listing.tier === "featured" && (
                      <MetaPill gold>★ Featured</MetaPill>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}
