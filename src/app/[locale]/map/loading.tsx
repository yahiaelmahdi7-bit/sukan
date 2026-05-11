import Navbar from "@/components/navbar";

// Loading skeleton for the /map page.
// Mirrors the full-bleed map layout: a nav bar + a split panel (map + results).
export default function MapLoading() {
  return (
    <>
      <Navbar />

      <main className="flex flex-1 overflow-hidden" aria-hidden>
        {/* Results panel skeleton — left side on desktop */}
        <aside className="hidden md:flex md:w-[360px] md:shrink-0 flex-col gap-3 p-4 border-e border-sand/40 bg-cream overflow-hidden">
          {/* Search bar placeholder */}
          <div className="skeleton h-10 w-full rounded-[var(--radius-pill)]" />

          {/* Filter chips */}
          <div className="flex gap-2">
            <div className="skeleton h-7 w-20 rounded-[var(--radius-pill)]" />
            <div className="skeleton h-7 w-24 rounded-[var(--radius-pill)]" />
            <div className="skeleton h-7 w-16 rounded-[var(--radius-pill)]" />
          </div>

          {/* Card skeletons */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-[var(--radius-card)] border border-sand/60 bg-card/70 p-3 flex gap-3"
            >
              <div className="skeleton h-16 w-20 shrink-0 rounded-[var(--radius-card)]" />
              <div className="flex flex-col gap-2 flex-1 justify-center">
                <div className="skeleton h-3 w-3/4 rounded-full" />
                <div className="skeleton h-3 w-1/2 rounded-full" />
                <div className="skeleton h-3 w-1/3 rounded-full" />
              </div>
            </div>
          ))}
        </aside>

        {/* Map area skeleton */}
        <div className="flex-1 bg-sand/20 relative">
          {/* Parchment shimmer fills the map canvas */}
          <div className="absolute inset-0 skeleton opacity-60" />

          {/* Simulated map cluster pins */}
          <div className="absolute top-1/3 left-1/3 skeleton h-8 w-8 rounded-full opacity-40" />
          <div className="absolute top-1/2 left-1/2 skeleton h-6 w-6 rounded-full opacity-30" />
          <div className="absolute top-2/5 right-1/3 skeleton h-10 w-10 rounded-full opacity-50" />
        </div>
      </main>
    </>
  );
}
