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
    <div
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "1fr",
        height: "640px",
      }}
      // On lg+ use side-by-side layout
      className="lg:grid-cols-[1fr_340px]"
    >
      {/* Map area */}
      <div
        ref={mapContainerRef}
        style={{ height: "100%", minHeight: 0, position: "relative" }}
        className="rounded-[var(--radius-card)] lg:rounded-e-none overflow-hidden"
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

      {/* Panel — always rendered; hidden via CSS on small screens unless open */}
      <div
        style={{
          height: "100%",
          minHeight: 0,
          overflow: "hidden",
        }}
        className={[
          // On large screens: always visible in the grid column
          "hidden lg:block",
          // On small screens: fixed slide-over
          panelOpen
            ? "!block fixed inset-y-0 end-0 w-[340px] z-[1050] shadow-2xl"
            : "",
        ]
          .join(" ")
          .trim()}
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

      {/* Backdrop for mobile slide-over */}
      {panelOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[1040] bg-black/50"
          onClick={() => setPanelOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
