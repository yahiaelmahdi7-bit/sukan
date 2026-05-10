// Server Component
//
// The signature surface for Sukan's redesigned UI. A parchment-tinted glass
// card with backdrop blur, a hairline white stroke, optional inner top
// highlight, and a warm earth-tinted shadow. Drop-in replacement for any
// `bg-card border border-sand-dk` block where premium depth is wanted.
import type { HTMLAttributes, ReactNode } from "react";

type Variant = "cream" | "warm" | "sand" | "deep" | "strong";
type Radius = "card" | "glass" | "glass-lg" | "pill";

const VARIANT_CLASS: Record<Variant, string> = {
  cream: "glass",
  warm: "glass-warm",
  sand: "glass-sand",
  deep: "glass-deep",
  strong: "glass-strong",
};

const RADIUS_STYLE: Record<Radius, string> = {
  card: "rounded-[var(--radius-card)]",
  glass: "rounded-[var(--radius-glass)]",
  "glass-lg": "rounded-[var(--radius-glass-lg)]",
  pill: "rounded-[var(--radius-pill)]",
};

export interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  radius?: Radius;
  highlight?: boolean;
  /** "warm" earth-tinted shadow on by default; pass false to drop it */
  shadow?: boolean | "lg";
  children: ReactNode;
}

export default function GlassPanel({
  variant = "cream",
  radius = "glass",
  highlight = true,
  shadow = true,
  className = "",
  children,
  ...rest
}: GlassPanelProps) {
  const shadowStyle =
    shadow === "lg"
      ? { boxShadow: "var(--shadow-warm-lg)" }
      : shadow
        ? { boxShadow: "var(--shadow-glass)" }
        : undefined;

  return (
    <div
      className={[
        "relative overflow-hidden",
        VARIANT_CLASS[variant],
        RADIUS_STYLE[radius],
        highlight ? "glass-highlight" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={shadowStyle}
      {...rest}
    >
      {children}
    </div>
  );
}
