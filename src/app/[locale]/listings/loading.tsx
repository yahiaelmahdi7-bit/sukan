import Navbar from "@/components/navbar";
import ListingsGridSkeleton from "@/components/listings-grid-skeleton";

// Loading skeleton for the /listings page.
// Shown by Next.js while the server component resolves the listing query.
export default function ListingsLoading() {
  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* Header band skeleton */}
        <div className="bg-cream py-14 border-b border-sand/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="h-3 w-24 rounded-full bg-sand-dk/60 mb-3" aria-hidden />
            <div className="h-12 w-64 rounded-[var(--radius-card)] bg-sand-dk/50 mb-3" aria-hidden />
            <div className="h-4 w-36 rounded-full bg-sand-dk/40" aria-hidden />
          </div>
        </div>

        {/* Body skeleton */}
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="lg:flex lg:gap-10">
            {/* Sidebar placeholder */}
            <aside className="hidden lg:block lg:w-72 lg:shrink-0" aria-hidden>
              <div className="rounded-[var(--radius-glass)] border border-sand-dk bg-card/70 h-[420px]" />
            </aside>

            {/* Grid skeleton */}
            <div className="min-w-0 flex-1">
              {/* Results header */}
              <div className="mb-7 flex items-center justify-between">
                <div className="h-3.5 w-28 rounded-full bg-sand-dk/50" aria-hidden />
                <div className="flex gap-3">
                  <div className="h-8 w-20 rounded-[var(--radius-pill)] bg-sand-dk/40" aria-hidden />
                  <div className="h-8 w-24 rounded-[var(--radius-pill)] bg-sand-dk/40" aria-hidden />
                </div>
              </div>

              <ListingsGridSkeleton count={12} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
