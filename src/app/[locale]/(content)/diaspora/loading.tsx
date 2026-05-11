import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

// Loading skeleton for the /diaspora page.
// Mirrors: hero strip + trust pillars + listing rail + guides section.
export default function DiasporaLoading() {
  return (
    <>
      <Navbar />

      <main className="flex-1" aria-hidden>
        {/* Hero strip */}
        <div className="bg-earth py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col gap-5 items-center text-center">
            <div className="skeleton h-3 w-28 rounded-full opacity-50" />
            <div className="skeleton h-14 w-80 rounded-[var(--radius-card)] opacity-60" />
            <div className="skeleton h-4 w-96 rounded-full opacity-40" />
            <div className="skeleton h-4 w-72 rounded-full opacity-40" />
            <div className="flex gap-3 mt-2">
              <div className="skeleton h-10 w-32 rounded-[var(--radius-pill)] opacity-50" />
              <div className="skeleton h-10 w-28 rounded-[var(--radius-pill)] opacity-40" />
            </div>
          </div>
        </div>

        {/* Trust pillars */}
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[var(--radius-glass)] border border-sand/60 bg-card/70 p-5 flex flex-col gap-3 items-center text-center"
              >
                <div className="skeleton h-8 w-8 rounded-full" />
                <div className="skeleton h-4 w-20 rounded-full" />
                <div className="skeleton h-3 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Listing rail */}
        <div className="mx-auto max-w-5xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="skeleton h-5 w-40 rounded-full mb-5" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-72 shrink-0 rounded-[var(--radius-glass)] border border-sand/60 bg-card/70 overflow-hidden"
              >
                <div className="skeleton h-44 w-full" />
                <div className="p-4 flex flex-col gap-2">
                  <div className="skeleton h-4 w-3/4 rounded-full" />
                  <div className="skeleton h-3 w-1/2 rounded-full" />
                  <div className="skeleton h-5 w-1/3 rounded-full" />
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
