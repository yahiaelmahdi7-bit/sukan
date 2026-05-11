import Navbar from "@/components/navbar";
import ListingsGridSkeleton from "@/components/listings-grid-skeleton";

// Loading skeleton for the listing detail page.
// Shown by Next.js while the server component fetches listing data and photos.
export default function ListingDetailLoading() {
  return (
    <>
      <Navbar />

      <main className="bg-cream min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

          {/* Breadcrumb skeleton */}
          <div className="mb-6 flex items-center gap-2" aria-hidden>
            <div className="h-3 w-12 rounded-full bg-sand-dk/50" />
            <div className="h-3 w-2 rounded-full bg-sand-dk/30" />
            <div className="h-3 w-20 rounded-full bg-sand-dk/50" />
            <div className="h-3 w-2 rounded-full bg-sand-dk/30" />
            <div className="h-3 w-32 rounded-full bg-sand-dk/50" />
          </div>

          {/* Photo gallery skeleton */}
          <section className="mb-8" aria-hidden>
            {/* Mobile */}
            <div className="lg:hidden">
              <div
                className="aspect-[16/10] w-full rounded-[var(--radius-glass-lg)] bg-sand-dk/40 animate-pulse"
                style={{ animationDuration: "1.6s" }}
              />
              <div className="flex gap-2 mt-2">
                {Array.from({ length: 4 }, (_, i) => (
                  <div
                    key={i}
                    className="flex-none w-24 aspect-square rounded-[var(--radius-glass)] bg-sand-dk/30 animate-pulse"
                    style={{ animationDelay: `${i * 60}ms` }}
                  />
                ))}
              </div>
            </div>

            {/* Desktop */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-2">
              <div
                className="lg:col-span-2 aspect-[16/10] rounded-[var(--radius-glass-lg)] bg-sand-dk/40 animate-pulse"
                style={{ animationDuration: "1.6s" }}
              />
              <div className="grid grid-cols-2 grid-rows-2 gap-2">
                {Array.from({ length: 4 }, (_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-[var(--radius-glass)] bg-sand-dk/30 animate-pulse"
                    style={{ animationDelay: `${i * 60}ms` }}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Title / price + contact sidebar skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 flex flex-col gap-5" aria-hidden>
              <div className="h-3 w-32 rounded-full bg-sand-dk/50" />
              <div className="h-12 w-3/4 rounded-[var(--radius-card)] bg-sand-dk/50" />
              <div className="flex gap-2">
                <div className="h-7 w-16 rounded-[var(--radius-pill)] bg-sand-dk/40" />
                <div className="h-7 w-20 rounded-[var(--radius-pill)] bg-sand-dk/30" />
              </div>
              <div className="h-12 w-44 rounded-[var(--radius-card)] bg-sand-dk/40" />
            </div>

            {/* Contact card skeleton */}
            <div className="lg:col-span-1" aria-hidden>
              <div className="rounded-[var(--radius-glass)] border border-sand-dk bg-card p-6 flex flex-col gap-4">
                <div className="h-12 w-full rounded-[var(--radius-pill)] bg-sand-dk/50" />
                <div className="h-10 w-full rounded-[var(--radius-pill)] bg-sand-dk/30" />
                <div className="h-10 w-full rounded-[var(--radius-pill)] bg-sand-dk/25" />
                <div className="h-10 w-full rounded-[var(--radius-pill)] bg-sand-dk/20" />
              </div>
            </div>
          </div>

          {/* Specs skeleton */}
          <div className="mb-10" aria-hidden>
            <div className="rounded-[var(--radius-glass)] border border-sand-dk bg-card/70 p-5">
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <div className="h-2.5 w-12 rounded-full bg-sand-dk/50" />
                    <div className="h-5 w-16 rounded-full bg-sand-dk/40" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Description skeleton */}
          <div className="mb-10" aria-hidden>
            <div className="h-9 w-48 rounded-[var(--radius-card)] bg-sand-dk/50 mb-5" />
            <div className="flex flex-col gap-2">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className={`h-3.5 rounded-full bg-sand-dk/35 ${i === 4 ? "w-2/3" : "w-full"}`} />
              ))}
            </div>
          </div>

          {/* Map placeholder */}
          <div className="mb-10" aria-hidden>
            <div className="h-9 w-36 rounded-[var(--radius-card)] bg-sand-dk/50 mb-5" />
            <div
              className="h-[480px] w-full rounded-[var(--radius-glass)] bg-sand-dk/30 animate-pulse"
              style={{ animationDuration: "1.8s" }}
            />
          </div>

          {/* Similar listings skeleton */}
          <div className="mb-10">
            <div className="h-9 w-52 rounded-[var(--radius-card)] bg-sand-dk/50 mb-6" aria-hidden />
            <ListingsGridSkeleton count={3} />
          </div>
        </div>
      </main>
    </>
  );
}
