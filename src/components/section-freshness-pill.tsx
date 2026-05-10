// Server Component — no "use client" directive needed
import { Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Listing } from "@/lib/sample-listings";

interface SectionFreshnessPillProps {
  listings: Listing[];
  locale?: string;
}

/** Reference date: today (hardcoded per spec). */
const TODAY = new Date("2026-05-11T00:00:00Z");
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Counts listings whose `createdAt` falls within the last 7 days from TODAY.
 * Renders nothing if the count is 0.
 */
export default async function SectionFreshnessPill({
  listings,
}: SectionFreshnessPillProps) {
  const t = await getTranslations("homepage");

  const newCount = listings.filter((l) => {
    if (!l.createdAt) return false;
    const age = TODAY.getTime() - new Date(l.createdAt).getTime();
    return age >= 0 && age <= SEVEN_DAYS_MS;
  }).length;

  if (newCount === 0) return null;

  const label = t("newThisWeek", { count: newCount });

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-3 py-1 text-[11px] font-semibold text-white"
      style={{
        background:
          "linear-gradient(135deg, #C8401A 0%, #C8873A 100%)",
        boxShadow:
          "0 0 0 1px rgba(200,135,58,0.35), 0 2px 8px rgba(200,64,26,0.22)",
      }}
      aria-label={label}
    >
      <Sparkles size={11} strokeWidth={2} aria-hidden />
      {label}
    </span>
  );
}
