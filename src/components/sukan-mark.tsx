import { useId } from "react";

export interface SukanMarkProps {
  size?: number;
  className?: string;
  monochrome?: "gold" | "parchment" | "earth" | "terracotta";
  title?: string;
}

const MONOCHROME_COLORS: Record<NonNullable<SukanMarkProps["monochrome"]>, string> = {
  gold: "#C8873A",
  parchment: "#FDF8F0",
  earth: "#12100C",
  terracotta: "#C8401A",
};

// Calligraphic wave paths for the three horizontal strokes of Arabic س (sin).
// Each path is a closed filled region whose top and bottom edges are cubic
// Bézier curves — the varying vertical gap between them simulates ink pressure
// (thick at the crest, thin at the trough).
//
// Wave 1: y-center ~16, amplitude ~6   — widest swell, most prominent
// Wave 2: y-center ~28, amplitude ~5   — mid rhythm
// Wave 3: y-center ~40, amplitude ~4.5 — tightest, tapers right (pen-lift)
//
// Coordinates use max 1 decimal place per svg-precision best practice.
const WAVE_1 =
  "M8 15 C16 9,26 9,32 14 C38 19,48 22,56 17 C54 19,48 24.5,40 21.5 C32 18.5,22 18,14 21 C10 22.5,8 20,8 18 Z";
const WAVE_2 =
  "M8 27 C16 22,26 21,32 26 C38 31,49 33,56 28.5 C54 30.5,48 35.5,40 33 C32 30.5,22 30,14 33 C10 34.5,8 32,8 30 Z";
const WAVE_3 =
  "M8 39 C16 34,26 33.5,32 38 C38 42.5,49 44.5,56 40.5 C54.5 42.5,48 46.5,40 44.5 C32 42.5,22 42,14 44.5 C10 45.5,8 43.5,8 42 Z";

export default function SukanMark({
  size = 64,
  className,
  monochrome,
  title,
}: SukanMarkProps) {
  const uid = useId();
  const gradientId = `sukan-grad-${uid}`;
  const titleId = `sukan-title-${uid}`;

  const fill = monochrome ? MONOCHROME_COLORS[monochrome] : `url(#${gradientId})`;
  // Dots use a mid-point of the gradient as a solid fallback for crispness at
  // small sizes; in monochrome mode they match the chosen color token.
  const dotFill = monochrome ? MONOCHROME_COLORS[monochrome] : "#D4943F";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...(title
        ? { "aria-labelledby": titleId, role: "img" }
        : { "aria-hidden": true })}
    >
      {title && <title id={titleId}>{title}</title>}

      {!monochrome && (
        <defs>
          <linearGradient
            id={gradientId}
            x1="8"
            y1="8"
            x2="56"
            y2="56"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#C8873A" />
            <stop offset="100%" stopColor="#E0A857" />
          </linearGradient>
        </defs>
      )}

      {/* Three calligraphic strokes of sin (س) */}
      <path d={WAVE_1} fill={fill} />
      <path d={WAVE_2} fill={fill} />
      <path d={WAVE_3} fill={fill} />

      {/* Three diacritical dots of sin — x: 24, 32, 40 (8px apart); y: 52 */}
      <circle cx="24" cy="52" r="2" fill={dotFill} />
      <circle cx="32" cy="52" r="2" fill={dotFill} />
      <circle cx="40" cy="52" r="2" fill={dotFill} />
    </svg>
  );
}
