// Server Component
import type { ReactNode } from "react";

export interface PillProps {
  variant: "terracotta" | "gold" | "muted";
  size?: "sm" | "md";
  children: ReactNode;
}

const VARIANT_CLASSES: Record<PillProps["variant"], string> = {
  terracotta:
    "bg-terracotta/15 text-terracotta border border-terracotta/30",
  gold:
    "bg-gold/15 text-gold-dk border border-gold/30",
  muted:
    "bg-sand text-ink border border-sand-dk",
};

const SIZE_CLASSES: Record<NonNullable<PillProps["size"]>, string> = {
  sm: "px-3 py-1 text-xs gap-1",
  md: "px-4 py-1.5 text-sm gap-1.5",
};

export default function Pill({ variant, size = "md", children }: PillProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-[var(--radius-pill)] font-semibold uppercase tracking-wider",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
      ].join(" ")}
    >
      {children}
    </span>
  );
}
