import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

// Loading skeleton for the /guides index page.
// Mirrors the page's header strip + card grid layout.
export default function GuidesLoading() {
  return (
    <>
      <Navbar />

      <main className="flex-1" aria-hidden>
        {/* Header section skeleton */}
        <div className="py-16 border-b border-sand/60 bg-cream">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-4 text-center">
            <div className="skeleton h-3 w-20 rounded-full" />
            <div className="skeleton h-12 w-64 rounded-[var(--radius-card)]" />
            <div className="skeleton h-4 w-80 rounded-full" />
          </div>
        </div>

        {/* Guide cards grid */}
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[var(--radius-glass)] border border-sand/60 bg-card/70 overflow-hidden"
              >
                {/* Hero image area */}
                <div className="skeleton h-44 w-full" />
                {/* Content */}
                <div className="p-4 flex flex-col gap-2.5">
                  <div className="skeleton h-3 w-16 rounded-full" />
                  <div className="skeleton h-5 w-3/4 rounded-full" />
                  <div className="skeleton h-3 w-full rounded-full" />
                  <div className="skeleton h-3 w-4/5 rounded-full" />
                  <div className="mt-2 flex gap-2">
                    <div className="skeleton h-5 w-14 rounded-[var(--radius-pill)]" />
                    <div className="skeleton h-5 w-14 rounded-[var(--radius-pill)]" />
                  </div>
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
