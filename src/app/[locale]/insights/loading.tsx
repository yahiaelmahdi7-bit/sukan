import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

// Loading skeleton for the /insights index page.
// Mirrors: header strip + article card list (featured + grid).
export default function InsightsLoading() {
  return (
    <>
      <Navbar />

      <main className="flex-1" aria-hidden>
        {/* Header section skeleton */}
        <div className="py-16 border-b border-sand/60 bg-cream">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-4 text-center">
            <div className="skeleton h-3 w-24 rounded-full" />
            <div className="skeleton h-12 w-72 rounded-[var(--radius-card)]" />
            <div className="skeleton h-4 w-96 rounded-full" />
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 flex flex-col gap-8">
          {/* Featured insight skeleton — wide card */}
          <div className="rounded-[var(--radius-glass)] border border-sand/60 bg-card/70 overflow-hidden flex flex-col sm:flex-row">
            <div className="skeleton h-48 w-full sm:h-auto sm:w-56 sm:shrink-0" />
            <div className="p-6 flex flex-col gap-3 flex-1">
              <div className="skeleton h-3 w-20 rounded-full" />
              <div className="skeleton h-7 w-4/5 rounded-[var(--radius-card)]" />
              <div className="skeleton h-4 w-full rounded-full" />
              <div className="skeleton h-4 w-3/4 rounded-full" />
              <div className="mt-auto skeleton h-8 w-28 rounded-[var(--radius-pill)]" />
            </div>
          </div>

          {/* Article grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[var(--radius-glass)] border border-sand/60 bg-card/70 overflow-hidden"
              >
                <div className="skeleton h-36 w-full" />
                <div className="p-4 flex flex-col gap-2.5">
                  <div className="skeleton h-3 w-14 rounded-full" />
                  <div className="skeleton h-5 w-3/4 rounded-full" />
                  <div className="skeleton h-3 w-full rounded-full" />
                  <div className="skeleton h-3 w-2/3 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
