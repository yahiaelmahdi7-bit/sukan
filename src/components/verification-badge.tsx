"use client";

import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

export type VerificationTier =
  | "landlord-verified"
  | "property-verified"
  | "visited";

interface VerificationBadgeProps {
  tier: VerificationTier;
  size?: "sm" | "md";
  showLabel?: boolean;
}

const TIER_COLORS: Record<
  VerificationTier,
  { bg: string; border: string; text: string; iconBg: string }
> = {
  "landlord-verified": {
    bg: "rgba(59,130,246,0.10)",
    border: "rgba(59,130,246,0.35)",
    text: "#1d4ed8",
    iconBg: "#3b82f6",
  },
  "property-verified": {
    bg: "rgba(34,197,94,0.10)",
    border: "rgba(34,197,94,0.35)",
    text: "#15803d",
    iconBg: "#22c55e",
  },
  visited: {
    bg: "rgba(200,135,58,0.10)",
    border: "rgba(200,135,58,0.40)",
    text: "#9d6b1f",
    iconBg: "#c8873a",
  },
};

export function VerificationBadge({
  tier,
  size = "sm",
  showLabel = true,
}: VerificationBadgeProps) {
  const t = useTranslations();
  const labelKey =
    tier === "landlord-verified"
      ? "verification.tierLandlord"
      : tier === "property-verified"
      ? "verification.tierProperty"
      : "verification.tierVisited";
  const tooltipKey =
    tier === "landlord-verified"
      ? "verification.tooltipLandlord"
      : tier === "property-verified"
      ? "verification.tooltipProperty"
      : "verification.tooltipVisited";
  const label = t(labelKey);
  const tooltip = t(tooltipKey);
  const colors = TIER_COLORS[tier];
  const iconSize = size === "sm" ? 12 : 14;

  return (
    <span
      title={tooltip}
      aria-label={tooltip}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${
        size === "sm" ? "text-[11px]" : "text-xs"
      } font-medium`}
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.text,
      }}
    >
      <ShieldCheck
        size={iconSize}
        strokeWidth={2}
        style={{ color: colors.iconBg }}
        aria-hidden
      />
      {showLabel && <span>{label}</span>}
    </span>
  );
}
