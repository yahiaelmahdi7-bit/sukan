import { useTranslations } from "next-intl";

interface VerifiedBadgeProps {
  size?: "sm" | "md";
  tooltipKey?: string;
}

export function VerifiedBadge({
  size = "sm",
  tooltipKey = "verified.tooltip",
}: VerifiedBadgeProps) {
  const t = useTranslations();
  const tooltip = t(tooltipKey);
  const iconSize = size === "sm" ? 14 : 18;
  const textClass = size === "sm" ? "text-xs" : "text-sm";

  return (
    <span
      title={tooltip}
      className={`inline-flex items-center gap-1 rounded-full bg-[#FDF8F0] px-2 py-0.5 ${textClass} font-medium text-[#C8873A] border border-[#C8873A]/30`}
    >
      {/* Shield-check icon */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
      <span>{tooltip}</span>
    </span>
  );
}
