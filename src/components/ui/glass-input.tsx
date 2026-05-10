import { forwardRef } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type Tone = "light" | "dark";

const TONE: Record<Tone, string> = {
  // Cream pages — frosted parchment input
  light:
    "border-white/55 bg-white/55 text-ink placeholder:text-ink-mid/65 focus:border-gold/55 focus:bg-white/75 focus:ring-gold/20",
  // Dark earth pages — deep glass with gold focus
  dark:
    "border-gold/20 bg-earth-soft/80 text-parchment placeholder:text-mute-soft/70 focus:border-gold/55 focus:bg-earth/90 focus:ring-gold/25",
};

const BASE =
  "smooth-fast w-full rounded-xl border px-3.5 py-2.5 text-sm backdrop-blur-md focus:outline-none focus:ring-2 disabled:opacity-50";

export interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  tone?: Tone;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  function GlassInput({ tone = "light", className = "", ...rest }, ref) {
    return (
      <input
        ref={ref}
        className={[BASE, TONE[tone], className].filter(Boolean).join(" ")}
        {...rest}
      />
    );
  },
);

export interface GlassTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  tone?: Tone;
}

export const GlassTextarea = forwardRef<HTMLTextAreaElement, GlassTextareaProps>(
  function GlassTextarea({ tone = "light", className = "", ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        className={[BASE, TONE[tone], "resize-y", className]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      />
    );
  },
);
