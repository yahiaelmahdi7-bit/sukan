import Navbar from "@/components/navbar";
import ListingsGridSkeleton from "@/components/listings-grid-skeleton";

// Loading skeleton for the dashboard.
// Shown by Next.js while the dashboard layout's auth check and data fetches resolve.
export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />

      <div className="flex flex-1 pt-6 gap-6 px-4 sm:px-6">
        {/* Sidebar skeleton */}
        <aside className="hidden lg:block shrink-0 self-start sticky top-24" aria-hidden>
          <div
            className="w-56 rounded-[var(--radius-glass)] border border-sand-dk bg-card p-5 flex flex-col gap-3"
            style={{ minHeight: 400 }}
          >
            {/* User name */}
            <div className="h-4 w-36 rounded-full bg-sand-dk/50 mb-2" />
            {/* Nav items */}
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className="h-8 w-full rounded-[var(--radius-pill)] bg-sand-dk/30" />
            ))}
          </div>
        </aside>

        {/* Main skeleton */}
        <main className="flex-1 min-w-0 pb-12">
          {/* Welcome banner skeleton */}
          <div className="mb-8" aria-hidden>
            <div className="h-8 w-64 rounded-[var(--radius-card)] bg-sand-dk/50 mb-2" />
            <div className="h-4 w-48 rounded-full bg-sand-dk/35" />
          </div>

          {/* KPI stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" aria-hidden>
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className="rounded-[var(--radius-glass)] border border-sand-dk bg-card p-5 flex flex-col gap-2"
              >
                <div className="h-3 w-20 rounded-full bg-sand-dk/50" />
                <div className="h-7 w-16 rounded-full bg-sand-dk/40" />
              </div>
            ))}
          </div>

          {/* Listings grid skeleton */}
          <div className="mb-6" aria-hidden>
            <div className="h-6 w-36 rounded-full bg-sand-dk/50 mb-4" />
          </div>
          <ListingsGridSkeleton count={6} />
        </main>
      </div>
    </div>
  );
}
