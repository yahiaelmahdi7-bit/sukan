'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Navigation, ExternalLink, Copy, Check } from 'lucide-react';
import type { Listing } from '@/lib/sample-listings';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ListingLocationMapProps {
  listing: Listing;
  locale: 'en' | 'ar';
  labels: {
    directions: string;
    openInOsm: string;
    copyCoords: string;
    coordsCopied: string;
    mapTitle: string;
  };
}

// ─── Dynamic import — no SSR ──────────────────────────────────────────────────

const LeafletMap = dynamic(() => import('@/components/leaflet-map'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-full rounded-[var(--radius-glass)] bg-sand/60 animate-pulse"
      aria-hidden
    />
  ),
});

// ─── Component ────────────────────────────────────────────────────────────────

export default function ListingLocationMap({
  listing,
  locale,
  labels,
}: ListingLocationMapProps) {
  const [copied, setCopied] = useState(false);

  const { latitude: lat, longitude: lng } = listing;
  const localTitle = locale === 'ar' ? listing.titleAr : listing.titleEn;
  const localCity = locale === 'ar' ? listing.cityAr : listing.city;

  // Build popup HTML (styled inline to match sukan-popup theme)
  const popupHtml = `
    <div style="padding:14px 16px;min-width:220px;">
      <p style="
        font-size:13px;
        font-weight:600;
        color:#FDF8F0;
        margin:0 0 6px;
        line-height:1.4;
      ">${localTitle}</p>
      <p style="
        font-size:12px;
        color:#8C7C69;
        margin:0;
        line-height:1.4;
      ">${localCity}, Sudan</p>
    </div>
  `;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const osmUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;

  function handleCopyCoords() {
    const text = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const actionClass =
    'smooth text-ink-mid hover:text-gold-dk transition text-sm inline-flex items-center gap-2 ps-3 pe-3 py-2 rounded-[var(--radius-pill)] hover:bg-gold/8';

  return (
    <div className="flex flex-col gap-3">
      {/* Map — fills the glass frame from the parent GlassPanel */}
      <div className="w-full h-[420px] md:h-[480px]">
        <LeafletMap
          center={[lat, lng]}
          zoom={15}
          height="100%"
          interactive
          markers={[
            {
              id: listing.id,
              position: [lat, lng],
              variant: 'pin',
              popupHtml,
            },
          ]}
        />
      </div>

      {/* Map action row — glass-warm pill strip */}
      <div
        className="flex flex-wrap items-center gap-1 px-2 py-1 rounded-[var(--radius-pill)]"
        style={{
          background: 'linear-gradient(135deg, rgba(255,252,246,0.65), rgba(244,234,215,0.50))',
          backdropFilter: 'blur(12px) saturate(150%)',
          WebkitBackdropFilter: 'blur(12px) saturate(150%)',
          border: '1px solid rgba(255,255,255,0.55)',
        }}
        role="group"
        aria-label={labels.mapTitle}
      >
        {/* Get directions */}
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={actionClass}
          aria-label={labels.directions}
        >
          <Navigation size={14} aria-hidden />
          <span>{labels.directions}</span>
        </a>

        <span className="text-gold/30 select-none" aria-hidden>·</span>

        {/* Open in OSM */}
        <a
          href={osmUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={actionClass}
          aria-label={labels.openInOsm}
        >
          <ExternalLink size={14} aria-hidden />
          <span>{labels.openInOsm}</span>
        </a>

        <span className="text-gold/30 select-none" aria-hidden>·</span>

        {/* Copy coordinates */}
        <button
          type="button"
          onClick={handleCopyCoords}
          className={actionClass}
          aria-label={labels.copyCoords}
          aria-live="polite"
        >
          {copied ? (
            <>
              <Check size={14} className="text-gold-dk" aria-hidden />
              <span className="text-gold-dk">{labels.coordsCopied}</span>
            </>
          ) : (
            <>
              <Copy size={14} aria-hidden />
              <span>{labels.copyCoords}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
