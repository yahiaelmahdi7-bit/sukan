"use client";

import { useState, useEffect, useRef } from "react";

// TODO: i18n — locale-aware labels
const LABELS_EN = {
  onThisPage: "On this page",
  photos: "Photos",
  overview: "Overview",
  amenities: "Amenities",
  reality: "Property reality",
  neighborhood: "About this area",
  map: "Location",
  owner: "About the owner",
  reviews: "Reviews",
  similar: "Similar properties",
} as const;

const LABELS_AR: Record<keyof typeof LABELS_EN, string> = {
  onThisPage: "في هذه الصفحة",
  photos: "الصور",
  overview: "نظرة عامة",
  amenities: "المرافق",
  reality: "حقائق العقار",
  neighborhood: "عن هذا الحي",
  map: "الموقع",
  owner: "عن المالك",
  reviews: "التقييمات",
  similar: "عقارات مشابهة",
};

type SectionId =
  | "photos"
  | "overview"
  | "amenities"
  | "reality"
  | "neighborhood"
  | "map"
  | "owner"
  | "reviews"
  | "similar";

const SECTIONS: SectionId[] = [
  "photos",
  "overview",
  "amenities",
  "reality",
  "neighborhood",
  "map",
  "owner",
  "reviews",
  "similar",
];

interface ListingTocProps {
  locale: string;
}

export function ListingToc({ locale }: ListingTocProps) {
  const isRtl = locale === "ar";
  const labels = isRtl ? LABELS_AR : LABELS_EN;

  const [activeId, setActiveId] = useState<SectionId | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const visibleSections = new Map<SectionId, number>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id as SectionId;
          if (entry.isIntersecting) {
            visibleSections.set(id, entry.intersectionRatio);
          } else {
            visibleSections.delete(id);
          }
        });

        // Pick the section with the highest intersection ratio (most visible)
        // Fall back to the first visible one in document order
        if (visibleSections.size > 0) {
          let bestId: SectionId | null = null;
          let bestRatio = -1;
          // Iterate in SECTIONS order to prefer earlier section on ties
          for (const id of SECTIONS) {
            const ratio = visibleSections.get(id);
            if (ratio !== undefined && ratio > bestRatio) {
              bestRatio = ratio;
              bestId = id;
            }
          }
          if (bestId) setActiveId(bestId);
        }
      },
      {
        rootMargin: "0px 0px -40% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1.0],
      }
    );

    const observer = observerRef.current;

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  function handleClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    id: SectionId
  ) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Update active state immediately on click
      setActiveId(id);
    }
  }

  return (
    // hidden on < lg; fixed on lg+, positioned on the far inline-end edge
    <nav
      aria-label={labels.onThisPage}
      dir={isRtl ? "rtl" : "ltr"}
      className="hidden lg:block"
      style={{
        position: "fixed",
        top: "6rem",
        // RTL: left side. LTR: right side.
        [isRtl ? "left" : "right"]: "1.25rem",
        width: "11rem",
        zIndex: 30,
        // cream glass card
        background:
          "linear-gradient(135deg, rgba(255,252,246,0.90), rgba(244,234,215,0.82))",
        backdropFilter: "blur(18px) saturate(160%)",
        WebkitBackdropFilter: "blur(18px) saturate(160%)",
        border: "1px solid rgba(255,255,255,0.65)",
        borderRadius: "var(--radius-glass)",
        boxShadow: "var(--shadow-warm)",
        padding: "1rem 0.75rem",
      }}
    >
      {/* Eyebrow label */}
      <p
        className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-dk mb-3 px-1"
        aria-hidden
      >
        {labels.onThisPage}
      </p>

      {/* Divider */}
      <div
        className="mb-3 h-px"
        style={{ background: "rgba(200,135,58,0.20)" }}
        aria-hidden
      />

      <ul className="flex flex-col gap-0.5 list-none m-0 p-0">
        {SECTIONS.map((id) => {
          const label = labels[id];
          const isActive = activeId === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => handleClick(e, id)}
                className={[
                  "block text-sm leading-snug rounded px-2 py-1.5 transition-colors duration-150 no-underline",
                  isActive
                    ? "text-terracotta font-medium"
                    : "text-ink/55 hover:text-terracotta",
                ].join(" ")}
                style={
                  isActive
                    ? {
                        background: "rgba(196,92,60,0.08)",
                      }
                    : undefined
                }
                aria-current={isActive ? "location" : undefined}
              >
                {/* Active indicator bar */}
                <span className="flex items-center gap-1.5">
                  {isActive && (
                    <span
                      aria-hidden
                      className="flex-none h-3 w-0.5 rounded-full"
                      style={{ background: "var(--color-terracotta, #C45C3C)" }}
                    />
                  )}
                  {label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
