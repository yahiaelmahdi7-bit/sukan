'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import type * as L from 'leaflet';

// ─── Types ────────────────────────────────────────────────────────────────────

export type MarkerVariant = 'state' | 'listing' | 'pin';

export interface MapMarker {
  id: string;
  position: [number, number];
  variant: MarkerVariant;
  label?: string;
  href?: string;
  count?: number;
  /** Popup HTML string — used for listing markers */
  popupHtml?: string;
}

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
      : '';

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

// ─── Component ────────────────────────────────────────────────────────────────

export default function LeafletMap({
  center,
  zoom = 6,
  markers = [],
  draggable = false,
  onMarkerDrag,
  height = '400px',
  interactive = true,
  className = '',
}: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Leaflet is CJS/browser-only — dynamic import to avoid SSR
    let map: L.Map;

    (async () => {
      // Leaflet ships CJS with a `.default` re-export in ESM interop,
      // but the @types/leaflet package types the namespace directly.
      // We import the whole module and use it as the namespace.
      const leafletModule = await import('leaflet');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = (leafletModule.default ?? leafletModule) as typeof import('leaflet');

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

      // OpenStreetMap tiles — dark-friendly "Stadia Alidade Smooth Dark"
      // Falls back to OSM standard which is light; we overlay a CSS tint below
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add markers
      addMarkers(L, map, markers, draggable, onMarkerDrag);
    })();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = [];
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-sync markers when they change (without remounting the whole map)
  useEffect(() => {
    if (!mapRef.current) return;
    (async () => {
      const leafletModule = await import('leaflet');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = (leafletModule.default ?? leafletModule) as typeof import('leaflet');
      // Remove existing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      addMarkers(L, mapRef.current!, markers, draggable, onMarkerDrag);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers]);

  function addMarkers(
    L: typeof import('leaflet'),
    map: L.Map,
    markers: MapMarker[],
    draggable: boolean,
    onMarkerDrag?: (pos: [number, number]) => void,
  ) {
    markers.forEach((m) => {
      let iconHtml: string;
      let iconSize: [number, number];
      let iconAnchor: [number, number];
      let popupAnchor: [number, number];

      switch (m.variant) {
        case 'state':
          iconHtml = stateIconHtml(m.count);
          iconSize = [32, 32];
          iconAnchor = [16, 16];
          popupAnchor = [0, -20];
          break;
        case 'listing':
          iconHtml = listingIconHtml();
          iconSize = [24, 24];
          iconAnchor = [12, 12];
          popupAnchor = [0, -16];
          break;
        case 'pin':
        default:
          iconHtml = pinIconHtml();
          iconSize = [40, 52];
          iconAnchor = [20, 52];
          popupAnchor = [0, -54];
          break;
      }

      const icon = L.divIcon({
        html: iconHtml,
        className: '', // clear Leaflet's default white box
        iconSize,
        iconAnchor,
        popupAnchor,
      });

      const marker = L.marker(m.position, {
        icon,
        draggable: m.variant === 'pin' && draggable,
      });

      if (m.variant === 'pin' && draggable && onMarkerDrag) {
        marker.on('dragend', () => {
          const { lat, lng } = marker.getLatLng();
          onMarkerDrag([lat, lng]);
        });
      }

      if (m.label && m.variant === 'state') {
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
        ">${m.label}${m.count !== undefined ? `<span style="color:#E0A857;margin-left:6px;">${m.count}</span>` : ''}</div>`;

        marker.bindTooltip(tooltipHtml, {
          permanent: false,
          direction: 'top',
          opacity: 1,
          className: 'sukan-tooltip',
        });
      }

      if (m.popupHtml) {
        marker.bindPopup(m.popupHtml, {
          minWidth: 240,
          maxWidth: 300,
          className: 'sukan-popup',
        });
      }

      if (m.href && m.variant === 'state') {
        marker.on('click', () => {
          window.location.href = m.href!;
        });
        // Cursor affordance
        const el = marker.getElement?.();
        if (el) el.style.cursor = 'pointer';
        marker.on('add', () => {
          const el = marker.getElement();
          if (el) el.style.cursor = 'pointer';
        });
      }

      marker.addTo(map);
      markersRef.current.push(marker);
    });
  }

  return (
    <>
      {/* Leaflet tooltip/popup overrides — injected into the page head via a style tag */}
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
        /* Suppress Leaflet default icon broken images */
        .leaflet-marker-icon.leaflet-div-icon {
          background: transparent;
          border: none;
        }
      `}</style>
      <div
        ref={containerRef}
        style={{ height, width: '100%' }}
        className={`rounded-[var(--radius-card)] overflow-hidden ${className}`}
      />
    </>
  );
}
