// Server component — no "use client" needed.
// TODO: i18n — replace hardcoded heading strings with translation keys

import { getNeighborhoodBlurb } from "@/lib/neighborhoods";

interface NeighborhoodBlurbProps {
  city: string;
  locale: "en" | "ar";
}

export function NeighborhoodBlurb({ city, locale }: NeighborhoodBlurbProps) {
  const blurb = getNeighborhoodBlurb(city);
  if (!blurb) return null;

  const isAr = locale === "ar";
  const heading = isAr ? "عن هذا الحي" : "About this area";
  const name = isAr ? blurb.nameAr : blurb.nameEn;
  const body = isAr ? blurb.bodyAr : blurb.bodyEn;

  return (
    <section
      aria-labelledby="neighborhood-heading"
      className="mb-10"
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* TODO: i18n heading */}
      <h2
        id="neighborhood-heading"
        className="font-display text-3xl md:text-4xl text-[#12100C] mb-5 tracking-tight"
      >
        {heading}
      </h2>

      <div
        className="rounded-[var(--radius-glass)] px-6 py-5 flex flex-col gap-2"
        style={{
          background:
            "linear-gradient(135deg, rgba(253,248,240,0.82) 0%, rgba(240,230,208,0.60) 100%)",
          backdropFilter: "blur(18px) saturate(160%)",
          WebkitBackdropFilter: "blur(18px) saturate(160%)",
          border: "1px solid rgba(255,255,255,0.62)",
          boxShadow: "var(--shadow-warm-sm)",
        }}
      >
        <p className="font-display text-lg text-[#C8873A] tracking-tight leading-tight">
          {name}
        </p>
        <p className="font-sans text-[#12100C]/80 text-sm leading-[1.85]">{body}</p>
      </div>
    </section>
  );
}
