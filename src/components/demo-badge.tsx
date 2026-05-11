"use client";

import { useTranslations } from "next-intl";

interface DemoBadgeProps {
  size?: "sm" | "md";
}

export function DemoBadge({ size = "sm" }: DemoBadgeProps) {
  const t = useTranslations();
  const label = t("listing.demoBadge");
  const px = size === "sm" ? "px-2 py-0.5" : "px-2.5 py-1";
  const text = size === "sm" ? "text-[10px]" : "text-xs";

  return (
    <span
      title={t("listing.demoBadgeTooltip")}
      className={`inline-flex items-center gap-1 rounded-[var(--radius-pill)] ${px} ${text} font-semibold uppercase tracking-[0.14em] text-amber-900`}
      style={{
        background: "linear-gradient(135deg, #fde68a 0%, #f59e0b 100%)",
        boxShadow:
          "0 3px 10px rgba(245,158,11,0.35), inset 0 1px 0 rgba(255,255,255,0.35)",
      }}
    >
      {label}
    </span>
  );
}
