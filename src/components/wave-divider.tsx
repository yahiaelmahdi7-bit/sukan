// Server Component — no 'use client' needed
export interface WaveDividerProps {
  flip?: boolean;
  color?: "gold" | "terracotta" | "gold-bright" | "mute";
  intensity?: "subtle" | "normal" | "bold";
}

const COLOR_HEX: Record<NonNullable<WaveDividerProps["color"]>, string> = {
  gold: "%23c8873a",
  terracotta: "%23c8401a",
  "gold-bright": "%23e0a857",
  mute: "%238c7c69",
};

const OPACITY: Record<NonNullable<WaveDividerProps["intensity"]>, number> = {
  subtle: 0.3,
  normal: 0.5,
  bold: 0.8,
};

// Two SVG paths with a slight horizontal stagger so adjacent dividers don't
// look identical. Path A starts at x=0, path B starts at x=30 (offset).
function buildSvgUrl(hex: string, opacity: number): string {
  // Path A: normal phase
  const pathA = `M0 6 C20 0,40 12,60 6 C80 0,100 12,120 6`;
  // Path B: shifted phase — starts half a wavelength offset
  const pathB = `M0 6 C10 12,30 0,60 6 C90 12,110 0,120 6`;

  const svg = [
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 12' preserveAspectRatio='none'>`,
    `<path d='${pathA}' fill='none' stroke='${hex}' stroke-width='1' stroke-opacity='${opacity}'/>`,
    `<path d='${pathB}' fill='none' stroke='${hex}' stroke-width='0.6' stroke-opacity='${opacity * 0.55}'/>`,
    `</svg>`,
  ].join("");

  return `url("data:image/svg+xml;utf8,${svg}")`;
}

export default function WaveDivider({
  flip = false,
  color = "gold",
  intensity = "normal",
}: WaveDividerProps) {
  const hex = COLOR_HEX[color];
  const opacity = OPACITY[intensity];
  const bgImage = buildSvgUrl(hex, opacity);

  return (
    <div
      aria-hidden
      style={{
        display: "block",
        width: "100%",
        height: "14px",
        backgroundImage: bgImage,
        backgroundSize: "120px 14px",
        backgroundRepeat: "repeat-x",
        transform: flip ? "scaleY(-1)" : undefined,
      }}
    />
  );
}
