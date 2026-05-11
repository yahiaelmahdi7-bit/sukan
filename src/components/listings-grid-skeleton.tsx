// Server Component — decorative skeleton for the listings grid.
// Renders 6 placeholder cards (3 cols × 2 rows on desktop) with a cream glass
// background and an animated shimmer so the page feels responsive while the
// listings query resolves behind a Suspense boundary.

export default function ListingsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {/* Shimmer keyframe — injected once per skeleton render */}
      <style>{`
        @keyframes sukan-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .sukan-skeleton-shimmer {
          background: linear-gradient(
            90deg,
            rgba(240,230,208,0.55) 25%,
            rgba(255,252,246,0.85) 50%,
            rgba(240,230,208,0.55) 75%
          );
          background-size: 200% 100%;
          animation: sukan-shimmer 1.6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .sukan-skeleton-shimmer {
            animation: none;
            background: rgba(240,230,208,0.55);
          }
        }
      `}</style>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </>
  );
}

function SkeletonCard() {
  return (
    <div
      className="overflow-hidden rounded-[var(--radius-glass)] border border-sand-dk bg-card"
      style={{ boxShadow: "var(--shadow-warm-sm)" }}
      aria-hidden="true"
    >
      {/* Photo area */}
      <div className="aspect-[4/3] w-full sukan-skeleton-shimmer" />

      {/* Body */}
      <div className="p-5 flex flex-col gap-3">
        {/* Title row */}
        <div className="flex items-center justify-between gap-3">
          <div className="h-5 w-2/3 rounded-full sukan-skeleton-shimmer" />
          <div className="h-4 w-16 rounded-full sukan-skeleton-shimmer" />
        </div>

        {/* City line */}
        <div className="h-3.5 w-1/2 rounded-full sukan-skeleton-shimmer" />

        {/* Price + agent row */}
        <div className="mt-1 flex items-end justify-between gap-2">
          <div className="flex flex-col gap-1.5">
            <div className="h-6 w-24 rounded-full sukan-skeleton-shimmer" />
            <div className="h-3 w-20 rounded-full sukan-skeleton-shimmer" />
          </div>
          {/* Avatar circle */}
          <div
            className="rounded-full sukan-skeleton-shimmer flex-none"
            style={{ width: 26, height: 26 }}
          />
        </div>

        {/* Beds / baths / area */}
        <div className="mt-1 flex gap-3">
          <div className="h-3 w-10 rounded-full sukan-skeleton-shimmer" />
          <div className="h-3 w-10 rounded-full sukan-skeleton-shimmer" />
          <div className="h-3 w-14 rounded-full sukan-skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}
