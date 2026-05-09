'use client';

import dynamic from 'next/dynamic';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { type Listing, STATE_COORDS, SUDAN_STATES, type SudanState } from '@/lib/sample-listings';
import type { Locale } from '@/i18n/routing';
import type { MapMarker } from '@/components/leaflet-map';

// Dynamically import LeafletMap so it's never SSR-evaluated
// (Leaflet requires browser globals — window, document)
const LeafletMap = dynamic(() => import('@/components/leaflet-map'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-[var(--radius-card)] bg-earth-soft animate-pulse flex items-center justify-center"
      style={{ height: '100%', minHeight: '360px' }}
    >
      <span className="text-mute-soft text-sm">Loading map…</span>
    </div>
  ),
});

// ─── Types ────────────────────────────────────────────────────────────────────

interface SudanStateMapProps {
  listings: Listing[];
  /** Map container height (CSS string) */
  height?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function countByState(listings: Listing[]): Record<SudanState, number> {
  const counts = {} as Record<SudanState, number>;
  for (const s of SUDAN_STATES) counts[s] = 0;
  for (const l of listings) counts[l.state] = (counts[l.state] ?? 0) + 1;
  return counts;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SudanStateMap({
  listings,
  height = '520px',
}: SudanStateMapProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations();
  const router = useRouter();

  const counts = countByState(listings);

  // Build a marker per state
  const markers: MapMarker[] = SUDAN_STATES.map((state) => {
    const stateName = t(`states.${state}`);
    const count = counts[state];

    return {
      id: state,
      position: STATE_COORDS[state],
      variant: 'state',
      label: stateName,
      href: `/listings?state=${state}`,
      count,
    };
  });

  // Top-3 most active states for the legend
  const topStates = [...SUDAN_STATES]
    .filter((s) => counts[s] > 0)
    .sort((a, b) => counts[b] - counts[a])
    .slice(0, 3);

  // Sudan bounding box center
  const sudanCenter: [number, number] = [15.5, 30.0];

  return (
    <div className="w-full">
      {/* Map */}
      <div style={{ height }} className="w-full">
        <LeafletMap
          center={sudanCenter}
          zoom={5}
          markers={markers}
          height={height}
          interactive
          className="border border-gold/15"
        />
      </div>

      {/* Legend — below the map, breathable */}
      {topStates.length > 0 && (
        <div className="mt-10 pt-8 border-t border-gold/15">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold mb-6">
            {t('map.legendTitle')}
          </p>
          <div className="flex flex-wrap gap-3">
            {topStates.map((state) => (
              <button
                key={state}
                onClick={() =>
                  router.push({
                    pathname: '/listings',
                    query: { state },
                  })
                }
                className="flex items-center gap-2.5 rounded-[var(--radius-pill)] border border-gold/20 bg-earth-soft px-4 py-2.5 text-sm text-parchment hover:border-gold/50 hover:bg-gold/8 transition-colors"
              >
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: '#E0A857' }}
                />
                <span>{t(`states.${state}`)}</span>
                <span className="text-mute-soft text-xs">
                  {t('map.listingsHere', { count: counts[state] })}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
