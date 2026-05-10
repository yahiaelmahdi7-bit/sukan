"use client";

import dynamic from "next/dynamic";
import type { MapMarker, TileSet } from "@/components/leaflet-map";

const LeafletMap = dynamic(() => import("@/components/leaflet-map"), {
  ssr: false,
  loading: () => (
    <div
      className="skeleton flex w-full animate-pulse items-center justify-center bg-sand"
      style={{ height: "100%" }}
    >
      <span className="text-sm text-ink-mid">Loading map…</span>
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
