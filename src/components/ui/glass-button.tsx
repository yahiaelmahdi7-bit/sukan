import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant =
  | "terracotta" // primary CTA — terracotta gradient with halo
  | "gold" // secondary featured — gold gradient
  | "ghost-light" // outlined glass on cream
  | "ghost-dark" // outlined glass on dark earth
  | "danger"; // destructive — terracotta-deep solid

type Size = "sm" | "md" | "lg";

const SIZE: Record<Size, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-7 text-sm",
};

const VARIANT_CLASS: Record<Variant, string> = {
  terracotta: "text-cream hover:brightness-[1.05]",
  gold: "text-earth hover:brightness-[1.05]",
  "ghost-light":
    "border border-gold/40 bg-white/45 text-gold-dk hover:border-gold/70 hover:bg-gold/10 hover:text-terracotta backdrop-blur-md",
  "ghost-dark":
    "border border-gold/30 bg-earth-soft/60 text-parchment hover:border-gold/55 hover:bg-gold/10 backdrop-blur-md",
  danger:
    "bg-terracotta-deep text-cream hover:bg-terracotta",
};

const VARIANT_STYLE: Partial<Record<Variant, React.CSSProperties>> = {
  terracotta: {
    background: "linear-gradient(135deg, #c8401a 0%, #9d2f0f 100%)",
    boxShadow:
      "0 8px 22px rgba(200, 64, 26, 0.28), inset 0 1px 0 rgba(255,255,255,0.18)",
  },
  gold: {
    background: "linear-gradient(135deg, #c8873a 0%, #e0a857 100%)",
    boxShadow:
      "0 8px 22px rgba(200, 135, 58, 0.30), inset 0 1px 0 rgba(255,255,255,0.30)",
  },
};

export interface GlassButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leading?: ReactNode;
  trailing?: ReactNode;
  full?: boolean;
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  function GlassButton(
    {
      variant = "terracotta",
      size = "md",
      leading,
      trailing,
      full,
      className = "",
      style,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={[
          "smooth inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] font-semibold disabled:cursor-not-allowed disabled:opacity-50",
          SIZE[size],
          VARIANT_CLASS[variant],
          full ? "w-full" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ ...VARIANT_STYLE[variant], ...style }}
        {...rest}
      >
        {leading}
        {children}
        {trailing}
      </button>
    );
  },
);
