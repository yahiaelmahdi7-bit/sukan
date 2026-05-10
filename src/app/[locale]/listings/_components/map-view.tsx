"use client";

import dynamic from "next/dynamic";
import { useRef, useCallback } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Listing } from "@/lib/sample-listings";
import {
  getLocaleTitle,
  getLocaleCity,
} from "@/lib/sample-listings";
import type { Locale } from "@/i18n/routing";
import type { MapMarker } from "@/components/leaflet-map";
import SukanMark from "@/components/sukan-mark";

const LeafletMap = dynamic(() => import("@/components/leaflet-map"), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center rounded-[var(--radius-card)] glass-warm"
      style={{ height: "70vh", boxShadow: "var(--shadow-warm)" }}
    >
      <SukanMark size={48} monochrome="gold" className="animate-pulse opacity-30" />
    </div>
  ),
});

interface MapViewProps {
  listings: Listing[];
}

export default function MapView({ listings }: MapViewProps) {
  const locale = useLocale() as Locale;
  const stripRef = useRef<HTMLDivElement>(null);

  // Build markers for LeafletMap
  const markers: MapMarker[] = listings.map((l) => {
    const title = getLocaleTitle(l, locale);
    const city = getLocaleCity(l, locale);
    const priceStr = `$${l.priceUsd.toLocaleString()}${l.period !== "total" ? `/${l.period}` : ""}`;

    const popupHtml = `
      <div style="padding:12px 14px;font-family:system-ui,sans-serif;">
        <p style="font-size:13px;font-weight:600;color:#12100C;margin:0 0 2px;">${title}</p>
        <p style="font-size:11px;color:#8C7C69;margin:0 0 8px;">${city}</p>
        <p style="font-size:15px;font-weight:700;color:#C8873A;margin:0 0 10px;">${priceStr}</p>
        <a
          href="/${locale}/listings/${l.id}"
          style="display:inline-block;background:#C8401A;color:#FDF8F0;border-radius:999px;padding:5px 14px;font-size:11px;font-weight:600;text-decoration:none;letter-spacing:0.04em;"
        >View →</a>
      </div>
    `;
    return {
      id: l.id,
      position: [l.latitude, l.longitude] as [number, number],
      variant: "listing" as const,
      label: title,
      popupHtml,
    };
  });

  // Center: average of all listing coords, fallback to Sudan center
  const center: [number, number] =
    listings.length > 0
      ? [
          listings.reduce((s, l) => s + l.latitude, 0) / listings.length,
          listings.reduce((s, l) => s + l.longitude, 0) / listings.length,
        ]
      : [15.5007, 32.5599];

  const scrollToCard = useCallback((id: string) => {
    if (!stripRef.current) return;
    const el = stripRef.current.querySelector(`[data-id="${id}"]`) as HTMLElement | null;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* Map — 70vh */}
      <div
        className="overflow-hidden rounded-[var(--radius-card)] border border-white/55"
        style={{ boxShadow: "var(--shadow-warm)" }}
      >
        <LeafletMap
          center={center}
          zoom={listings.length === 1 ? 13 : 6}
          markers={markers}
          height="70vh"
          interactive
        />
      </div>

      {/* Horizontal card strip */}
      {listings.length > 0 && (
        <div
          ref={stripRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {listings.map((listing) => {
            const title = getLocaleTitle(listing, locale);
            const city = getLocaleCity(listing, locale);
            const priceStr = `$${listing.priceUsd.toLocaleString()}`;

            return (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                data-id={listing.id}
                onClick={() => scrollToCard(listing.id)}
                style={{
                  scrollSnapAlign: "start",
                  minWidth: "200px",
                  boxShadow: "var(--shadow-warm-sm)",
                }}
                className="smooth group block w-[200px] shrink-0 overflow-hidden rounded-[var(--radius-card)] border border-white/55 glass-warm lift hover:border-gold/40"
              >
                {/* Mini image placeholder */}
                <div className="card-watermark relative h-[100px] w-full">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <SukanMark
                      size={48}
                      monochrome="gold"
                      className="opacity-10 transition group-hover:opacity-20"
                    />
                  </div>
                  {listing.tier === "featured" && (
                    <span className="absolute top-2 ltr:left-2 rtl:right-2 rounded-[var(--radius-pill)] bg-gold px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-earth">
                      ★
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="truncate text-xs font-semibold text-ink">{title}</p>
                  <p className="truncate text-[11px] text-ink-soft">{city}</p>
                  <p className="mt-1.5 font-display text-base text-gold-dk">{priceStr}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
