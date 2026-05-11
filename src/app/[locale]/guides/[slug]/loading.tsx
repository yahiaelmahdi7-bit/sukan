import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

// Loading skeleton for individual guide pages (/guides/[slug]).
// Mirrors: full-bleed hero image + content column + sidebar vitals card.
export default function GuideSlugLoading() {
  return (
    <>
      <Navbar />

      <main className="flex-1" aria-hidden>
        {/* Full-bleed hero skeleton */}
        <div className="skeleton h-64 w-full sm:h-80 lg:h-96" />

        {/* Article + sidebar layout */}
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
            {/* Article body */}
            <article className="flex-1 flex flex-col gap-4">
              {/* Breadcrumb */}
              <div className="skeleton h-3 w-40 rounded-full" />
              {/* Title */}
              <div className="skeleton h-10 w-3/4 rounded-[var(--radius-card)]" />
              {/* Meta row */}
              <div className="flex gap-3">
                <div className="skeleton h-5 w-20 rounded-[var(--radius-pill)]" />
                <div className="skeleton h-5 w-24 rounded-[var(--radius-pill)]" />
              </div>
              {/* Body paragraphs */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="skeleton h-3.5 w-full rounded-full" />
                  <div className="skeleton h-3.5 w-full rounded-full" />
                  <div className="skeleton h-3.5 w-4/5 rounded-full" />
                </div>
              ))}
            </article>

            {/* Sidebar — vitals card */}
            <aside className="w-full lg:w-72 lg:shrink-0">
              <div className="rounded-[var(--radius-glass)] border border-sand/60 bg-card/70 p-5 flex flex-col gap-4">
                <div className="skeleton h-4 w-24 rounded-full" />
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex justify-between gap-4">
                    <div className="skeleton h-3 w-28 rounded-full" />
                    <div className="skeleton h-3 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
