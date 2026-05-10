"use client";

import { useState, useCallback, useRef } from "react";
import type { MapMarker } from "@/components/leaflet-map";
import type { Listing } from "@/lib/sample-listings";
import MapClient from "./map-client";
import MapResultsPanel, { type MapResultsPanelLabels } from "./map-results-panel";

interface Props {
  listings: Listing[];
  markers: MapMarker[];
  center: [number, number];
  zoom: number;
  locale: string;
  labels: MapResultsPanelLabels;
}

export default function MapWithPanel({
  listings,
  markers,
  center,
  zoom,
  locale,
  labels,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // When a marker is clicked: set selected ID and flyTo that listing
  const handleMarkerClick = useCallback(
    (id: string) => {
      setSelectedId(id);
      const listing = listings.find((l) => l.id === id);
      if (listing && mapContainerRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const flyTo = (mapContainerRef.current as any).__sukanFlyTo;
        if (typeof flyTo === "function") {
          flyTo(listing.latitude, listing.longitude, 14);
        }
      }
    },
    [listings],
  );

  // When a card in the panel is clicked: set selected ID and flyTo
  const handleCardSelect = useCallback(
    (id: string) => {
      setSelectedId(id);
      const listing = listings.find((l) => l.id === id);
      if (listing && mapContainerRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const flyTo = (mapContainerRef.current as any).__sukanFlyTo;
        if (typeof flyTo === "function") {
          flyTo(listing.latitude, listing.longitude, 14);
        }
      }
    },
    [listings],
  );

  return (
    /* ── Full-height wrapper — fills the outer container ────────────────── */
    <div className="relative flex h-full w-full overflow-hidden">
      {/* ── Map area — fills all available space ──────────────────────────── */}
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
          tileSet="satellite"
          onMarkerClick={handleMarkerClick}
        />
      </div>

      {/* ── Side panel — floating glass card (lg+) ────────────────────────── */}
      {/*
          On large screens: fixed-width column always visible beside the map.
          On small screens: hidden by default; slides up from the bottom when
          panelOpen is true (bottom-sheet pattern).
      */}
      <div
        className={[
          // Large screens: always-visible side column
          "lg:relative lg:flex lg:w-[340px] lg:shrink-0",
          // Small screens: bottom sheet — fixed, slides in from bottom
          "max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0",
          "max-lg:transition-transform max-lg:duration-300",
          panelOpen
            ? "max-lg:translate-y-0 max-lg:z-[1050]"
            : "max-lg:translate-y-full max-lg:z-[1050] max-lg:pointer-events-none",
        ].join(" ")}
        style={
          panelOpen
            ? {
                // Bottom sheet: show from 40% viewport height up, rounded top corners only
                maxHeight: "62vh",
              }
            : undefined
        }
      >
        {/* Mobile: rounded top corners only */}
        <div
          className={[
            "h-full w-full overflow-hidden",
            // On small screens round only the top corners
            "max-lg:rounded-t-[var(--radius-glass-lg)]",
            // On large screens use the full outer wrapper's radius (none needed — flush)
          ].join(" ")}
        >
          <MapResultsPanel
            listings={listings}
            selectedId={selectedId}
            onSelect={handleCardSelect}
            locale={locale}
            labels={labels}
            isOpen={panelOpen}
            onToggle={() => setPanelOpen((o) => !o)}
          />
        </div>
      </div>

      {/* ── Mobile backdrop ───────────────────────────────────────────────── */}
      {panelOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[1040] bg-earth/40 backdrop-blur-sm"
          onClick={() => setPanelOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
