"use client";

import dynamic from "next/dynamic";
import type { MapMarker, TileSet } from "@/components/leaflet-map";

const LeafletMap = dynamic(() => import("@/components/leaflet-map"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-[var(--radius-card)] bg-earth-soft animate-pulse flex items-center justify-center"
      style={{ height: "100%" }}
    >
      <span className="text-mute-soft text-sm">Loading map…</span>
    </div>
  ),
});

export default function MapClient({
  center,
  zoom,
  markers,
  height = "100%",
  interactive = true,
  tileSet,
  onMarkerClick,
}: {
  center: [number, number];
  zoom: number;
  markers: MapMarker[];
  height?: string;
  interactive?: boolean;
  tileSet?: TileSet;
  onMarkerClick?: (id: string) => void;
}) {
  return (
    <LeafletMap
      center={center}
      zoom={zoom}
      markers={markers}
      height={height}
      interactive={interactive}
      tileSet={tileSet}
      onMarkerClick={onMarkerClick}
    />
  );
}
