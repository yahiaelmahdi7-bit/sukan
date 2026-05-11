import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

// Loading skeleton for individual insight articles (/insights/[slug]).
// Mirrors: hero image + single-column article prose + author bio.
export default function InsightSlugLoading() {
  return (
    <>
      <Navbar />

      <main className="flex-1" aria-hidden>
        {/* Hero image */}
        <div className="skeleton h-64 w-full sm:h-80 lg:h-[420px]" />

        {/* Article */}
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5">
            {/* Breadcrumb */}
            <div className="skeleton h-3 w-36 rounded-full" />
            {/* Tags */}
            <div className="flex gap-2">
              <div className="skeleton h-5 w-16 rounded-[var(--radius-pill)]" />
              <div className="skeleton h-5 w-20 rounded-[var(--radius-pill)]" />
            </div>
            {/* Title */}
            <div className="skeleton h-10 w-full rounded-[var(--radius-card)]" />
            <div className="skeleton h-10 w-2/3 rounded-[var(--radius-card)]" />
            {/* Meta */}
            <div className="flex items-center gap-3">
              <div className="skeleton h-8 w-8 rounded-full" />
              <div className="skeleton h-3 w-28 rounded-full" />
              <div className="skeleton h-3 w-20 rounded-full" />
            </div>

            {/* Divider */}
            <div className="skeleton h-px w-full" />

            {/* Body prose */}
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="skeleton h-3.5 w-full rounded-full" />
                <div className="skeleton h-3.5 w-full rounded-full" />
                <div className="skeleton h-3.5 w-5/6 rounded-full" />
              </div>
            ))}

            {/* Pull-quote placeholder */}
            <div className="border-s-4 border-gold/40 ps-5 py-1 flex flex-col gap-2">
              <div className="skeleton h-4 w-full rounded-full" />
              <div className="skeleton h-4 w-3/4 rounded-full" />
            </div>

            {/* More body */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="skeleton h-3.5 w-full rounded-full" />
                <div className="skeleton h-3.5 w-full rounded-full" />
                <div className="skeleton h-3.5 w-4/5 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
