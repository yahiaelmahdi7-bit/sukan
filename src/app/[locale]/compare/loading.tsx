import Navbar from "@/components/navbar";

// Loading skeleton for the /compare page.
// Mirrors: header + side-by-side comparison columns.
export default function CompareLoading() {
  return (
    <>
      <Navbar />

      <main className="flex-1" aria-hidden>
        {/* Page header */}
        <div className="py-12 border-b border-sand/60 bg-cream">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col gap-3">
            <div className="skeleton h-3 w-24 rounded-full" />
            <div className="skeleton h-10 w-56 rounded-[var(--radius-card)]" />
            <div className="skeleton h-4 w-64 rounded-full" />
          </div>
        </div>

        {/* Comparison columns */}
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[var(--radius-glass)] border border-sand/60 bg-card/70 overflow-hidden"
              >
                {/* Property image */}
                <div className="skeleton h-48 w-full" />

                {/* Property details */}
                <div className="p-5 flex flex-col gap-4">
                  <div className="skeleton h-5 w-3/4 rounded-full" />
                  <div className="skeleton h-3 w-1/2 rounded-full" />

                  {/* Price */}
                  <div className="skeleton h-7 w-1/3 rounded-[var(--radius-card)]" />

                  {/* Attribute rows */}
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className="flex justify-between gap-4">
                      <div className="skeleton h-3 w-24 rounded-full" />
                      <div className="skeleton h-3 w-16 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
