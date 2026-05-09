"use client";

import dynamic from "next/dynamic";
import type { MapMarker } from "@/components/leaflet-map";

const LeafletMap = dynamic(() => import("@/components/leaflet-map"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-[var(--radius-card)] bg-sand/40 animate-pulse flex items-center justify-center"
      style={{ height: 360 }}
    >
      <span className="text-mute-soft text-sm">Loading map…</span>
    </div>
  ),
});

export default function PostMap({
  center,
  pin,
  onPinDrag,
}: {
  center: [number, number];
  pin: [number, number];
  onPinDrag: (next: [number, number]) => void;
}) {
  const markers: MapMarker[] = [
    {
      id: "post-pin",
      position: pin,
      variant: "pin",
    },
  ];

  return (
    <div className="rounded-[var(--radius-card)] overflow-hidden border border-gold/30">
      <LeafletMap
        center={center}
        zoom={11}
        markers={markers}
        height="360px"
        interactive
        draggable
        onMarkerDrag={onPinDrag}
      />
    </div>
  );
}
