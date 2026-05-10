import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";

type Tone = "light" | "dark";

const TONE: Record<Tone, string> = {
  light:
    "border-white/55 bg-white/55 text-ink focus:border-gold/55 focus:bg-white/75 focus:ring-gold/20",
  dark:
    "border-gold/20 bg-earth-soft/80 text-parchment focus:border-gold/55 focus:bg-earth/90 focus:ring-gold/25",
};

export interface GlassSelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  tone?: Tone;
}

export const GlassSelect = forwardRef<HTMLSelectElement, GlassSelectProps>(
  function GlassSelect({ tone = "light", className = "", children, ...rest }, ref) {
    return (
      <select
        ref={ref}
        className={[
          "smooth-fast w-full rounded-xl border px-3.5 py-2.5 text-sm backdrop-blur-md focus:outline-none focus:ring-2 disabled:opacity-50",
          TONE[tone],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      >
        {children}
      </select>
    );
  },
);
