import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

// Loading skeleton for the /agents directory page.
// Mirrors: header strip + agent card grid.
export default function AgentsLoading() {
  return (
    <>
      <Navbar />

      <main className="flex-1" aria-hidden>
        {/* Header section */}
        <div className="py-16 border-b border-sand/60 bg-cream">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-4 text-center">
            <div className="skeleton h-3 w-20 rounded-full" />
            <div className="skeleton h-12 w-56 rounded-[var(--radius-card)]" />
            <div className="skeleton h-4 w-80 rounded-full" />
          </div>
        </div>

        {/* Agent cards grid */}
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[var(--radius-glass)] border border-sand/60 bg-card/70 p-5 flex flex-col gap-4"
              >
                {/* Avatar + name */}
                <div className="flex items-center gap-3">
                  <div className="skeleton h-12 w-12 rounded-full shrink-0" />
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="skeleton h-4 w-3/4 rounded-full" />
                    <div className="skeleton h-3 w-1/2 rounded-full" />
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex gap-4">
                  <div className="skeleton h-3 w-16 rounded-full" />
                  <div className="skeleton h-3 w-16 rounded-full" />
                </div>

                {/* Tags */}
                <div className="flex gap-2">
                  <div className="skeleton h-5 w-20 rounded-[var(--radius-pill)]" />
                  <div className="skeleton h-5 w-16 rounded-[var(--radius-pill)]" />
                </div>

                {/* CTA */}
                <div className="skeleton h-9 w-full rounded-[var(--radius-pill)]" />
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
