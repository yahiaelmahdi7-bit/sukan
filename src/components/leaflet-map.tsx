"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type * as L from "leaflet";

// ─── Types ────────────────────────────────────────────────────────────────────

export type MarkerVariant = "state" | "listing" | "pin" | "priceLabel";

export interface MapMarker {
  id: string;
  position: [number, number];
  variant: MarkerVariant;
  label?: string;
  href?: string;
  count?: number;
  /** Popup HTML string — used for listing markers */
  popupHtml?: string;
  // priceLabel variant extras
  priceLabel?: string;
  tone?: "rent" | "sale" | "featured";
}

export type TileSet = "satellite" | "street";

export interface LeafletMapProps {
  center: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  /** Single-marker draggable mode for the post wizard */
  draggable?: boolean;
  onMarkerDrag?: (pos: [number, number]) => void;
  height?: string;
  /** When false, disables zoom/pan — good for static previews */
  interactive?: boolean;
  className?: string;
  /** Tile layer to use: 'satellite' (Esri) or 'street' (OSM). Default: 'street' */
  tileSet?: TileSet;
  /** Called when a priceLabel variant marker is clicked, with the marker id */
  onMarkerClick?: (id: string) => void;
}

// ─── Marker icon HTML helpers ─────────────────────────────────────────────────

function stateIconHtml(count: number | undefined): string {
  const badge =
    count !== undefined && count > 0
      ? `<span style="
          position:absolute;
          top:-6px;
          right:-6px;
          background:#C8401A;
          color:#FDF8F0;
          font-size:10px;
          font-weight:700;
          line-height:1;
          min-width:16px;
          height:16px;
          border-radius:999px;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:0 3px;
          border:1.5px solid #12100C;
        ">${count}</span>`
      : "";

  return `<div style="
    position:relative;
    width:32px;
    height:32px;
    background:#E0A857;
    border-radius:50%;
    display:flex;
    align-items:center;
    justify-content:center;
    box-shadow:0 3px 10px rgba(0,0,0,0.5),0 1px 3px rgba(0,0,0,0.4);
    border:2px solid rgba(253,248,240,0.25);
  ">
    <svg width="16" height="16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8 15 C16 9,26 9,32 14 C38 19,48 22,56 17 C54 19,48 24.5,40 21.5 C32 18.5,22 18,14 21 C10 22.5,8 20,8 18 Z" fill="#12100C"/>
      <path d="M8 27 C16 22,26 21,32 26 C38 31,49 33,56 28.5 C54 30.5,48 35.5,40 33 C32 30.5,22 30,14 33 C10 34.5,8 32,8 30 Z" fill="#12100C"/>
      <path d="M8 39 C16 34,26 33.5,32 38 C38 42.5,49 44.5,56 40.5 C54.5 42.5,48 46.5,40 44.5 C32 42.5,22 42,14 44.5 C10 45.5,8 43.5,8 42 Z" fill="#12100C"/>
      <circle cx="24" cy="52" r="2" fill="#12100C"/>
      <circle cx="32" cy="52" r="2" fill="#12100C"/>
      <circle cx="40" cy="52" r="2" fill="#12100C"/>
    </svg>
    ${badge}
  </div>`;
}

function listingIconHtml(): string {
  return `<div style="
    width:24px;
    height:24px;
    background:#C8401A;
    border-radius:50%;
    display:flex;
    align-items:center;
    justify-content:center;
    box-shadow:0 2px 8px rgba(0,0,0,0.5);
    border:2px solid rgba(253,248,240,0.3);
  ">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1v-9.5z" fill="#FDF8F0" opacity="0.9"/>
      <rect x="9" y="14" width="6" height="7" rx="0.5" fill="#C8401A"/>
    </svg>
  </div>`;
}

function pinIconHtml(): string {
  return `<div style="
    width:40px;
    height:52px;
    display:flex;
    flex-direction:column;
    align-items:center;
    filter:drop-shadow(0 4px 12px rgba(0,0,0,0.55));
  ">
    <div style="
      width:40px;
      height:40px;
      background:#C8401A;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      display:flex;
      align-items:center;
      justify-content:center;
      border:2.5px solid rgba(253,248,240,0.3);
    ">
      <div style="width:12px;height:12px;background:#FDF8F0;border-radius:50%;transform:rotate(45deg);opacity:0.9;"></div>
    </div>
  </div>`;
}

function priceLabelIconHtml(priceLabel: string, tone: "rent" | "sale" | "featured"): string {
  let bg: string;
  let color: string;
  let prefix: string;
  let animClass: string;

  switch (tone) {
    case "rent":
      bg = "linear-gradient(135deg, #2A8B4F, #1A6B3A)";
      color = "#FDF8F0";
      prefix = "";
      animClass = "";
      break;
    case "sale":
      bg = "linear-gradient(135deg, #E55A30, #C8401A)";
      color = "#FDF8F0";
      prefix = "";
      animClass = "";
      break;
    case "featured":
    default:
      bg = "linear-gradient(135deg, #E8B84B, #C8873A)";
      color = "#12100C";
      prefix = "★ ";
      animClass = "sukan-pin-pulse";
      break;
  }

  const text = `${prefix}${priceLabel}`;

  return `<div class="${animClass}" style="
    display:inline-flex;
    flex-direction:column;
    align-items:center;
    filter:drop-shadow(0 3px 10px rgba(0,0,0,0.55));
    cursor:pointer;
  ">
    <div class="sukan-price-pin" style="
      background:${bg};
      color:${color};
      font-size:11px;
      font-weight:700;
      font-family:system-ui,-apple-system,sans-serif;
      letter-spacing:0.02em;
      white-space:nowrap;
      min-width:64px;
      padding:6px 12px;
      border-radius:999px;
      text-align:center;
      border:1.5px solid rgba(255,255,255,0.25);
      line-height:1.2;
      transition:transform 0.15s ease, box-shadow 0.15s ease;
    ">${text}</div>
    <div style="
      width:0;
      height:0;
      border-left:5px solid transparent;
      border-right:5px solid transparent;
      border-top:7px solid ${tone === "rent" ? "#1A6B3A" : tone === "sale" ? "#C8401A" : "#C8873A"};
      margin-top:-1px;
    "></div>
  </div>`;
}

// ─── Tile layer URLs ───────────────────────────────────────────────────────────
//
// Default: CartoDB Positron tiles for the street view — clean light grey
// streets on a near-white background, the same minimalist aesthetic as
// Google Maps' light style. Free, no API key, no billing required.
// Esri World Imagery for satellite (also free, no key).
//
// Optional upgrade path: if NEXT_PUBLIC_MAPBOX_TOKEN is set, the maps
// switch to Mapbox light-v11 + satellite-streets-v12 instead. Site
// functions identically without a token.

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

type TileLayerConfig = {
  url: string;
  attribution: string;
  maxZoom: number;
  tileSize?: number;
  zoomOffset?: number;
  subdomains?: string;
};

const TILE_LAYERS: Record<"satellite" | "street", TileLayerConfig> = MAPBOX_TOKEN
  ? {
      satellite: {
        url: `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`,
        attribution:
          '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
        tileSize: 512,
        zoomOffset: -1,
      },
      street: {
        url: `https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`,
        attribution:
          '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
        tileSize: 512,
        zoomOffset: -1,
      },
    }
  : {
      satellite: {
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution:
          "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
        maxZoom: 19,
      },
      street: {
        url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 20,
        subdomains: "abcd",
      },
    };

// ─── Component ────────────────────────────────────────────────────────────────

export default function LeafletMap({
  center,
  zoom = 6,
  markers = [],
  draggable = false,
  onMarkerDrag,
  height = "400px",
  interactive = true,
  className = "",
  tileSet = "street",
  onMarkerClick,
}: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [activeTile, setActiveTile] = useState<TileSet>(tileSet);
  // Keep a ref in sync so the toggle button closure always sees the latest value
  const activeTileRef = useRef<TileSet>(tileSet);

  useEffect(() => {
    if (!containerRef.current) return;

    let map: L.Map;

    (async () => {
      const leafletModule = await import("leaflet");

      const L = (leafletModule.default ?? leafletModule) as typeof import("leaflet");

      if (mapRef.current) return; // already mounted

      map = L.map(containerRef.current!, {
        center,
        zoom,
        zoomControl: interactive,
        dragging: interactive,
        touchZoom: interactive,
        scrollWheelZoom: false,
        doubleClickZoom: interactive,
        boxZoom: interactive,
        keyboard: interactive,
        attributionControl: true,
      });

      mapRef.current = map;

      // Initial tile layer
      const cfg = TILE_LAYERS[activeTileRef.current];
      tileLayerRef.current = L.tileLayer(cfg.url, {
        attribution: cfg.attribution,
        maxZoom: cfg.maxZoom,
        tileSize: cfg.tileSize ?? 256,
        zoomOffset: cfg.zoomOffset ?? 0,
        ...(cfg.subdomains ? { subdomains: cfg.subdomains } : {}),
      }).addTo(map);

      addMarkers(L, map, markers, draggable, onMarkerDrag, onMarkerClick);
    })();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = [];
        tileLayerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swap tile layer when activeTile changes (after initial mount)
  useEffect(() => {
    activeTileRef.current = activeTile;
    if (!mapRef.current || !tileLayerRef.current) return;
    (async () => {
      const leafletModule = await import("leaflet");

      const L = (leafletModule.default ?? leafletModule) as typeof import("leaflet");
      tileLayerRef.current?.remove();
      const cfg = TILE_LAYERS[activeTile];
      tileLayerRef.current = L.tileLayer(cfg.url, {
        attribution: cfg.attribution,
        maxZoom: cfg.maxZoom,
        tileSize: cfg.tileSize ?? 256,
        zoomOffset: cfg.zoomOffset ?? 0,
        ...(cfg.subdomains ? { subdomains: cfg.subdomains } : {}),
      }).addTo(mapRef.current!);
    })();
  }, [activeTile]);

  // Re-sync markers when they change (without remounting the whole map)
  useEffect(() => {
    if (!mapRef.current) return;
    (async () => {
      const leafletModule = await import("leaflet");

      const L = (leafletModule.default ?? leafletModule) as typeof import("leaflet");
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      addMarkers(L, mapRef.current!, markers, draggable, onMarkerDrag, onMarkerClick);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers]);

  function addMarkers(
    L: typeof import("leaflet"),
    map: L.Map,
    markers: MapMarker[],
    draggable: boolean,
    onMarkerDrag?: (pos: [number, number]) => void,
    onMarkerClick?: (id: string) => void,
  ) {
    markers.forEach((m) => {
      let iconHtml: string;
      let iconSize: [number, number];
      let iconAnchor: [number, number];
      let popupAnchor: [number, number];

      switch (m.variant) {
        case "state":
          iconHtml = stateIconHtml(m.count);
          iconSize = [32, 32];
          iconAnchor = [16, 16];
          popupAnchor = [0, -20];
          break;
        case "listing":
          iconHtml = listingIconHtml();
          iconSize = [24, 24];
          iconAnchor = [12, 12];
          popupAnchor = [0, -16];
          break;
        case "priceLabel": {
          const label = m.priceLabel ?? "";
          const tone = m.tone ?? "sale";
          iconHtml = priceLabelIconHtml(label, tone);
          // Width is dynamic; use a wide enough default. The icon itself
          // is absolutely positioned via the anchor — anchor at horizontal
          // center + bottom of the downward triangle pointer.
          iconSize = [100, 40];
          iconAnchor = [50, 40];
          popupAnchor = [0, -44];
          break;
        }
        case "pin":
        default:
          iconHtml = pinIconHtml();
          iconSize = [40, 52];
          iconAnchor = [20, 52];
          popupAnchor = [0, -54];
          break;
      }

      const icon = L.divIcon({
        html: iconHtml,
        className: "", // clear Leaflet's default white box
        iconSize,
        iconAnchor,
        popupAnchor,
      });

      const marker = L.marker(m.position, {
        icon,
        draggable: m.variant === "pin" && draggable,
      });

      if (m.variant === "pin" && draggable && onMarkerDrag) {
        marker.on("dragend", () => {
          const { lat, lng } = marker.getLatLng();
          onMarkerDrag([lat, lng]);
        });
      }

      if (m.label && m.variant === "state") {
        const tooltipHtml = `<div style="
          background:#1F1A14;
          color:#FDF8F0;
          border:1px solid rgba(200,135,58,0.3);
          border-radius:8px;
          padding:6px 10px;
          font-size:12px;
          font-weight:600;
          white-space:nowrap;
          pointer-events:none;
        ">${m.label}${m.count !== undefined ? `<span style="color:#E0A857;margin-left:6px;">${m.count}</span>` : ""}</div>`;

        marker.bindTooltip(tooltipHtml, {
          permanent: false,
          direction: "top",
          opacity: 1,
          className: "sukan-tooltip",
        });
      }

      if (m.popupHtml) {
        marker.bindPopup(m.popupHtml, {
          minWidth: 260,
          maxWidth: 290,
          className: "sukan-popup sukan-listing-popup",
          // No padding — our card handles its own spacing
          autoPan: true,
          autoPanPadding: [20, 20],
        });
      }

      // Click handling — priceLabel variant fires callback AND opens popup
      // State variant navigates to the listing page
      if (m.variant === "priceLabel" && onMarkerClick) {
        marker.on("click", () => {
          onMarkerClick(m.id);
          if (m.popupHtml) {
            marker.openPopup();
          }
        });
        marker.on("add", () => {
          const el = marker.getElement();
          if (el) el.style.cursor = "pointer";
        });
      } else if (m.href && m.variant === "state") {
        marker.on("click", () => {
          window.location.href = m.href!;
        });
        marker.on("add", () => {
          const el = marker.getElement();
          if (el) el.style.cursor = "pointer";
        });
      }

      marker.addTo(map);
      markersRef.current.push(marker);
    });
  }

  // Public flyTo — exposed via a callback ref pattern used by MapWithPanel
  // We expose this via a data attribute on the container so MapWithPanel can
  // call it without needing a full forwardRef dance.
  useEffect(() => {
    if (!containerRef.current) return;
    // Attach a callable flyTo to the DOM node so parent components can call it
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (containerRef.current as any).__sukanFlyTo = (lat: number, lng: number, z = 14) => {
      if (mapRef.current) {
        mapRef.current.flyTo([lat, lng], z, { duration: 0.8 });
      }
    };
  });

  return (
    <>
      <style>{`
        .sukan-tooltip .leaflet-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-tooltip.sukan-tooltip {
          background: transparent;
          border: none;
          box-shadow: none;
          padding: 0;
        }
        /* Dark popup (for state markers / generic) */
        .sukan-popup .leaflet-popup-content-wrapper {
          background: #1F1A14;
          color: #FDF8F0;
          border: 1px solid rgba(200,135,58,0.25);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.6);
          padding: 0;
        }
        .sukan-popup .leaflet-popup-content {
          margin: 0;
          min-width: 240px;
        }
        .sukan-popup .leaflet-popup-tip {
          background: #1F1A14;
        }
        .sukan-popup .leaflet-popup-close-button {
          color: #8C7C69;
          font-size: 18px;
          top: 8px;
          right: 8px;
        }
        /* Listing popup — cream glass card style */
        .sukan-listing-popup .leaflet-popup-content-wrapper {
          background: #FFFCF6;
          color: #12100C;
          border: 1px solid rgba(255,255,255,0.7);
          border-radius: 14px;
          box-shadow:
            0 6px 12px rgba(122,85,48,0.08),
            0 28px 56px rgba(122,85,48,0.18);
          padding: 0;
          overflow: hidden;
        }
        .sukan-listing-popup .leaflet-popup-content {
          margin: 0;
          width: 260px !important;
        }
        .sukan-listing-popup .leaflet-popup-tip-container {
          margin-top: -1px;
        }
        .sukan-listing-popup .leaflet-popup-tip {
          background: #FFFCF6;
          box-shadow: none;
        }
        .sukan-listing-popup .leaflet-popup-close-button {
          z-index: 2;
          color: rgba(122,85,48,0.6);
          font-size: 20px;
          top: 6px;
          right: 6px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,252,246,0.85);
          border-radius: 50%;
          line-height: 1;
        }
        .sukan-listing-popup .leaflet-popup-close-button:hover {
          color: #C8401A;
        }
        /* Suppress Leaflet default icon broken images */
        .leaflet-marker-icon.leaflet-div-icon {
          background: transparent;
          border: none;
        }
        /* Price-label pin hover */
        .sukan-price-pin:hover {
          transform: scale(1.15) translateY(-3px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.5);
        }
        /* Featured pulse animation */
        @keyframes sukanPinPulse {
          0%   { transform: scale(1);    filter: drop-shadow(0 3px 10px rgba(0,0,0,0.55)); }
          50%  { transform: scale(1.06); filter: drop-shadow(0 5px 16px rgba(232,184,75,0.55)); }
          100% { transform: scale(1);    filter: drop-shadow(0 3px 10px rgba(0,0,0,0.55)); }
        }
        .sukan-pin-pulse {
          animation: sukanPinPulse 2.4s ease-in-out infinite;
        }
      `}</style>
      <div style={{ position: "relative", height, width: "100%" }}>
        <div
          ref={containerRef}
          style={{ height: "100%", width: "100%" }}
          className={`rounded-[var(--radius-card)] overflow-hidden ${className}`}
        />
        {/* Layer toggle button — bottom-end, only shown in interactive mode */}
        {interactive && (
          <button
            onClick={() => setActiveTile((prev) => (prev === "satellite" ? "street" : "satellite"))}
            style={{
              position: "absolute",
              bottom: "16px",
              right: "16px",
              zIndex: 1000,
              background: "rgba(18,16,12,0.88)",
              border: "1.5px solid rgba(200,135,58,0.55)",
              color: "#E0A857",
              fontFamily: "system-ui,-apple-system,sans-serif",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              padding: "6px 14px",
              borderRadius: "999px",
              cursor: "pointer",
              backdropFilter: "blur(6px)",
              whiteSpace: "nowrap",
              transition: "background 0.15s, border-color 0.15s",
            }}
            aria-label={
              activeTile === "satellite" ? "Switch to street map" : "Switch to satellite view"
            }
          >
            {activeTile === "satellite" ? "🗺 Street" : "🛰 Satellite"}
          </button>
        )}
      </div>
    </>
  );
}
