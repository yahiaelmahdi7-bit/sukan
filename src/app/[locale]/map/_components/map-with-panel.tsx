"use client";

import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { MapMarker } from "@/components/leaflet-map";
import type { Listing, PropertyType, Purpose } from "@/lib/sample-listings";
import { STATE_COORDS } from "@/lib/sample-listings";
import { buildListingPopupHtml, type PopupLabels } from "@/components/map-listing-preview";
import { formatShortPrice } from "@/lib/format-price";
import MapClient from "./map-client";
import MapResultsPanel, { type MapResultsPanelLabels } from "./map-results-panel";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MapFilterLabels {
  filterAnyPurpose: string;
  filterRent: string;
  filterSale: string;
  filterAnyType: string;
  filterMaxPrice: string;
  filterMaxPricePlaceholder: string;
  filterApply: string;
  filterClear: string;
  resultCount: string;
  resultCountPlural: string;
  listView: string;
  toggleAllListings: string;
  toggleByState: string;
}

interface Props {
  listings: Listing[];
  markers: MapMarker[];
  center: [number, number];
  zoom: number;
  locale: string;
  labels: MapResultsPanelLabels;
  filterLabels: MapFilterLabels;
  popupLabels: PopupLabels;
}

// ─── Property type options (abbreviated for the filter bar) ───────────────────

const PROPERTY_TYPES: { value: PropertyType; labelEn: string; labelAr: string }[] = [
  { value: "apartment", labelEn: "Apt", labelAr: "شقة" },
  { value: "house", labelEn: "House", labelAr: "منزل" },
  { value: "villa", labelEn: "Villa", labelAr: "فيلا" },
  { value: "studio", labelEn: "Studio", labelAr: "استوديو" },
  { value: "shop", labelEn: "Shop", labelAr: "محل" },
  { value: "office", labelEn: "Office", labelAr: "مكتب" },
  { value: "land", labelEn: "Land", labelAr: "أرض" },
  { value: "warehouse", labelEn: "Warehouse", labelAr: "مستودع" },
];

// ─── Deterministic jitter helper ─────────────────────────────────────────────

function jitterOffset(id: string, axis: 0 | 1): number {
  // Use multiple chars for better distribution
  const seed = id
    .split('')
    .reduce((acc, ch, i) => acc + ch.charCodeAt(0) * (i + 1), 0);
  const prime = axis === 0 ? 17 : 23;
  return ((seed % (prime * 2)) - prime) * 0.003;
}

// ─── Build markers from filtered listings ─────────────────────────────────────

function buildListingMarkers(
  listings: Listing[],
  locale: string,
  popupLabels: PopupLabels,
): MapMarker[] {
  return listings.map((l) => {
    // Check for coordinate collision
    const hasSamePos = listings.some(
      (other) =>
        other.id !== l.id &&
        Math.abs(other.latitude - l.latitude) < 0.001 &&
        Math.abs(other.longitude - l.longitude) < 0.001,
    );

    const lat = l.latitude + (hasSamePos ? jitterOffset(l.id, 0) : 0);
    const lng = l.longitude + (hasSamePos ? jitterOffset(l.id, 1) : 0);

    const tone: 'rent' | 'sale' | 'featured' =
      l.tier === 'featured' ? 'featured' : l.purpose === 'rent' ? 'rent' : 'sale';

    const priceLabel = l.priceSdg
      ? formatShortPrice(l.priceSdg, 'SDG', locale === 'ar' ? 'ar' : 'en')
      : formatShortPrice(l.priceUsd, 'USD', locale === 'ar' ? 'ar' : 'en');

    const href = `/${locale}/listings/${l.id}`;
    const popupHtml = buildListingPopupHtml(l, locale, { href, labels: popupLabels });

    return {
      id: l.id,
      position: [lat, lng] as [number, number],
      variant: 'priceLabel' as const,
      priceLabel,
      tone,
      popupHtml,
    };
  });
}

// ─── Build state-level markers ─────────────────────────────────────────────

function buildStateMarkers(
  listings: Listing[],
  locale: string,
  stateNames: Record<string, string>,
): MapMarker[] {
  const counts: Record<string, number> = {};
  for (const l of listings) {
    counts[l.state] = (counts[l.state] ?? 0) + 1;
  }
  return Object.entries(STATE_COORDS).map(([state, pos]) => ({
    id: state,
    position: pos,
    variant: 'state' as const,
    label: stateNames[state] ?? state,
    href: `/${locale}/listings?state=${state}`,
    count: counts[state] ?? 0,
  }));
}

// ─── Filter bar ───────────────────────────────────────────────────────────────

function FilterBar({
  locale,
  labels,
  purpose,
  type,
  maxPrice,
  onPurposeChange,
  onTypeChange,
  onMaxPriceChange,
  onClear,
}: {
  locale: string;
  labels: MapFilterLabels;
  purpose: string;
  type: string;
  maxPrice: string;
  onPurposeChange: (v: string) => void;
  onTypeChange: (v: string) => void;
  onMaxPriceChange: (v: string) => void;
  onClear: () => void;
}) {
  const isAr = locale === 'ar';
  const hasFilters = purpose || type || maxPrice;

  const pillBase =
    "inline-flex items-center gap-1.5 whitespace-nowrap rounded-[var(--radius-pill)] border px-3.5 py-1.5 text-[12px] font-semibold transition-colors duration-150 cursor-pointer";
  const pillIdle =
    "border-white/55 bg-white/55 text-ink-mid backdrop-blur-md hover:border-gold/45 hover:text-ink";
  const pillActive =
    "border-terracotta/50 bg-terracotta text-cream shadow-[0_2px_8px_rgba(200,64,26,0.22)]";

  return (
    <div
      className="flex items-center gap-2 overflow-x-auto py-2 px-4 scrollbar-hide"
      style={{ scrollbarWidth: 'none' }}
    >
      {/* Purpose pills */}
      <button
        onClick={() => onPurposeChange("")}
        className={`${pillBase} ${!purpose ? pillActive : pillIdle}`}
      >
        {labels.filterAnyPurpose}
      </button>
      <button
        onClick={() => onPurposeChange("rent")}
        className={`${pillBase} ${purpose === "rent" ? pillActive : pillIdle}`}
      >
        {labels.filterRent}
      </button>
      <button
        onClick={() => onPurposeChange("sale")}
        className={`${pillBase} ${purpose === "sale" ? pillActive : pillIdle}`}
      >
        {labels.filterSale}
      </button>

      {/* Divider */}
      <div className="h-5 w-px shrink-0 bg-sand-dk/50" aria-hidden />

      {/* Type select */}
      <div className="relative shrink-0">
        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
          aria-label={labels.filterAnyType}
          style={{
            appearance: 'none',
            WebkitAppearance: 'none',
            background: type ? '#C8401A' : 'rgba(255,255,255,0.55)',
            color: type ? '#FDF8F0' : '#7a5530',
            border: type ? '1px solid rgba(200,64,26,0.5)' : '1px solid rgba(255,255,255,0.55)',
            borderRadius: 'var(--radius-pill)',
            padding: '6px 28px 6px 14px',
            fontSize: '12px',
            fontWeight: 600,
            backdropFilter: 'blur(12px)',
            cursor: 'pointer',
            outline: 'none',
            minWidth: '90px',
          }}
        >
          <option value="">{labels.filterAnyType}</option>
          {PROPERTY_TYPES.map((pt) => (
            <option key={pt.value} value={pt.value}>
              {isAr ? pt.labelAr : pt.labelEn}
            </option>
          ))}
        </select>
        {/* Chevron */}
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: '50%',
            right: isAr ? 'auto' : '10px',
            left: isAr ? '10px' : 'auto',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            fontSize: '9px',
            color: type ? '#FDF8F0' : '#7a5530',
          }}
        >
          ▼
        </span>
      </div>

      {/* Max price input */}
      <div className="relative shrink-0">
        <span
          aria-hidden
          style={{
            position: 'absolute',
            [isAr ? 'right' : 'left']: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '11px',
            color: '#7a5530',
            pointerEvents: 'none',
          }}
        >
          $
        </span>
        <input
          type="number"
          min={0}
          placeholder={labels.filterMaxPricePlaceholder}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(e.target.value)}
          aria-label={labels.filterMaxPrice}
          style={{
            width: '110px',
            background: maxPrice ? 'rgba(255,252,246,0.88)' : 'rgba(255,255,255,0.55)',
            border: maxPrice ? '1px solid rgba(200,135,58,0.5)' : '1px solid rgba(255,255,255,0.55)',
            borderRadius: 'var(--radius-pill)',
            padding: `6px 12px 6px ${isAr ? '12px' : '22px'}`,
            paddingRight: isAr ? '22px' : '12px',
            fontSize: '12px',
            color: '#12100C',
            backdropFilter: 'blur(12px)',
            outline: 'none',
          }}
        />
      </div>

      {/* Clear button — shown only when filters are active */}
      {hasFilters && (
        <button
          onClick={onClear}
          className="shrink-0 rounded-[var(--radius-pill)] border border-sand-dk/60 bg-white/55 px-3 py-1.5 text-[11px] font-semibold text-ink-mid backdrop-blur-md hover:border-terracotta/40 hover:text-terracotta transition-colors"
        >
          {labels.filterClear} ×
        </button>
      )}
    </div>
  );
}

// ─── Map view toggle ──────────────────────────────────────────────────────────

function ViewToggle({
  mode,
  labels,
  onToggle,
}: {
  mode: 'listings' | 'states';
  labels: MapFilterLabels;
  onToggle: (m: 'listings' | 'states') => void;
}) {
  const pillBase =
    "px-4 py-1.5 text-[12px] font-semibold rounded-[var(--radius-pill)] transition-colors duration-150 cursor-pointer";

  return (
    <div
      className="inline-flex items-center rounded-[var(--radius-pill)] border border-white/55 bg-white/55 backdrop-blur-md p-0.5"
    >
      <button
        onClick={() => onToggle('listings')}
        className={`${pillBase} ${
          mode === 'listings'
            ? 'bg-terracotta text-cream shadow-[0_2px_8px_rgba(200,64,26,0.22)]'
            : 'text-ink-mid hover:text-ink'
        }`}
        aria-pressed={mode === 'listings'}
      >
        {labels.toggleAllListings}
      </button>
      <button
        onClick={() => onToggle('states')}
        className={`${pillBase} ${
          mode === 'states'
            ? 'bg-terracotta text-cream shadow-[0_2px_8px_rgba(200,64,26,0.22)]'
            : 'text-ink-mid hover:text-ink'
        }`}
        aria-pressed={mode === 'states'}
      >
        {labels.toggleByState}
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function MapWithPanel({
  listings,
  markers: _initialMarkers,
  center,
  zoom,
  locale,
  labels,
  filterLabels,
  popupLabels,
}: Props) {
  const searchParams = useSearchParams();

  // ── Filter state (mirrors URL params) ─────────────────────────────────────
  const [purpose, setPurpose] = useState<string>(searchParams.get("purpose") ?? "");
  const [type, setType] = useState<string>(searchParams.get("type") ?? "");
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get("maxPrice") ?? "");
  const [viewMode, setViewMode] = useState<'listings' | 'states'>('listings');

  // ── State names from URL (passed via labels via server) ───────────────────
  const stateNames = useMemo(() => {
    // We'll build a simple map from state key → localized name
    // The panel labels don't carry state names, so we use the state key directly
    // (the SudanStateMap approach does use useTranslations, but here on client
    //  we have no translation function — state names will be in English from
    //  a passed-down record; we embed them in filterLabels.stateNames if needed.
    //  For v1 we rely on the marker label set by the server component.)
    return {} as Record<string, string>;
  }, []);

  // ── Map + panel selection state ───────────────────────────────────────────
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // ── Apply filters to listings ─────────────────────────────────────────────
  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      if (purpose && l.purpose !== (purpose as Purpose)) return false;
      if (type && l.propertyType !== (type as PropertyType)) return false;
      if (maxPrice) {
        const limit = parseInt(maxPrice, 10);
        if (!isNaN(limit) && l.priceUsd > limit) return false;
      }
      return true;
    });
  }, [listings, purpose, type, maxPrice]);

  // ── Build markers from filtered listings ──────────────────────────────────
  const markers = useMemo(() => {
    if (viewMode === 'states') {
      return buildStateMarkers(filteredListings, locale, stateNames);
    }
    return buildListingMarkers(filteredListings, locale, popupLabels);
  }, [filteredListings, locale, popupLabels, viewMode, stateNames]);

  // ── Sync filters to URL (using history API to avoid next-intl type constraints) ──
  useEffect(() => {
    const params = new URLSearchParams();
    if (purpose) params.set('purpose', purpose);
    if (type) params.set('type', type);
    if (maxPrice) params.set('maxPrice', maxPrice);
    const qs = params.toString();
    const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    window.history.replaceState(null, '', url);
  }, [purpose, type, maxPrice]);

  // ── Marker click: flyTo + open popup ─────────────────────────────────────
  const handleMarkerClick = useCallback(
    (id: string) => {
      setSelectedId(id);
      const listing = listings.find((l) => l.id === id);
      if (listing && mapContainerRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const flyTo = (mapContainerRef.current as any).__sukanFlyTo;
        if (typeof flyTo === 'function') {
          flyTo(listing.latitude, listing.longitude, 14);
        }
      }
    },
    [listings],
  );

  // ── Panel card click: flyTo ───────────────────────────────────────────────
  const handleCardSelect = useCallback(
    (id: string) => {
      setSelectedId(id);
      const listing = listings.find((l) => l.id === id);
      if (listing && mapContainerRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const flyTo = (mapContainerRef.current as any).__sukanFlyTo;
        if (typeof flyTo === 'function') {
          flyTo(listing.latitude, listing.longitude, 14);
        }
      }
    },
    [listings],
  );

  const isAr = locale === 'ar';
  const count = filteredListings.length;
  const countLabel =
    count === 1
      ? filterLabels.resultCount
      : filterLabels.resultCountPlural;

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      {/* ── Top control bar ──────────────────────────────────────────────────── */}
      <div
        className="relative z-[900] flex shrink-0 flex-col"
        style={{
          background: 'rgba(255,252,246,0.90)',
          backdropFilter: 'blur(20px) saturate(175%)',
          WebkitBackdropFilter: 'blur(20px) saturate(175%)',
          borderBottom: '1px solid rgba(214,196,160,0.4)',
        }}
      >
        {/* Row 1: Result count + view toggle + list link */}
        <div className="flex items-center justify-between gap-3 px-4 py-2.5">
          <p className="text-[12px] font-semibold text-ink-mid whitespace-nowrap">
            <span className="text-terracotta font-bold">{count}</span>{' '}
            {countLabel}
          </p>

          <ViewToggle mode={viewMode} labels={filterLabels} onToggle={setViewMode} />

          <Link
            href={`/${locale}/listings`}
            className="whitespace-nowrap text-[11px] font-semibold text-gold-dk hover:text-terracotta transition-colors"
          >
            {filterLabels.listView} →
          </Link>
        </div>

        {/* Row 2: Filter bar (only in "All listings" mode) */}
        {viewMode === 'listings' && (
          <FilterBar
            locale={locale}
            labels={filterLabels}
            purpose={purpose}
            type={type}
            maxPrice={maxPrice}
            onPurposeChange={setPurpose}
            onTypeChange={setType}
            onMaxPriceChange={setMaxPrice}
            onClear={() => { setPurpose(''); setType(''); setMaxPrice(''); }}
          />
        )}
      </div>

      {/* ── Map + side panel ─────────────────────────────────────────────────── */}
      <div className="relative flex flex-1 min-h-0 overflow-hidden">
        {/* Map */}
        <div
          ref={mapContainerRef}
          className="relative min-h-0 flex-1 overflow-hidden"
        >
          <MapClient
            center={center}
            zoom={zoom}
            markers={markers}
            height="100%"
            interactive
            tileSet="street"
            onMarkerClick={handleMarkerClick}
          />
        </div>

        {/* Side panel — glass card (lg+), bottom sheet (mobile) */}
        <div
          className={[
            "lg:relative lg:flex lg:w-[340px] lg:shrink-0",
            "max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0",
            "max-lg:transition-transform max-lg:duration-300",
            panelOpen
              ? "max-lg:translate-y-0 max-lg:z-[1050]"
              : "max-lg:translate-y-full max-lg:z-[1050] max-lg:pointer-events-none",
          ].join(" ")}
          style={panelOpen ? { maxHeight: "62vh" } : undefined}
        >
          <div
            className={[
              "h-full w-full overflow-hidden",
              "max-lg:rounded-t-[var(--radius-glass-lg)]",
            ].join(" ")}
          >
            <MapResultsPanel
              listings={filteredListings}
              selectedId={selectedId}
              onSelect={handleCardSelect}
              locale={locale}
              labels={labels}
              isOpen={panelOpen}
              onToggle={() => setPanelOpen((o) => !o)}
            />
          </div>
        </div>

        {/* Mobile backdrop */}
        {panelOpen && (
          <div
            className="lg:hidden fixed inset-0 z-[1040] bg-earth/40 backdrop-blur-sm"
            onClick={() => setPanelOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
