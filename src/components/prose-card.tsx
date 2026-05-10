// Server Component — reusable long-form reading container.
// Wraps children in a calibrated prose environment with optional
// eyebrow + title header. Variants shift the background tint.
import type { ReactNode } from "react";

type ProseVariant = "cream" | "warm" | "sand";

const VARIANT_BG: Record<ProseVariant, string> = {
  cream: "bg-white/90",
  warm: "bg-[#F8EFDB]/90",
  sand: "bg-[#F0E6D0]/90",
};

interface ProseCardProps {
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  variant?: ProseVariant;
  className?: string;
}

export default function ProseCard({
  eyebrow,
  title,
  children,
  variant = "cream",
  className = "",
}: ProseCardProps) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-[var(--radius-glass)]",
        "border border-[#D6C4A0]/60",
        "p-7 sm:p-8 lg:p-10",
        VARIANT_BG[variant],
        "backdrop-blur-[20px] saturate-[170%]",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ boxShadow: "var(--shadow-glass)" }}
    >
      {/* Inner top highlight bevel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[var(--radius-glass)]"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 26%)",
          mixBlendMode: "overlay",
        }}
      />

      <div className={["relative", className].filter(Boolean).join(" ")}>
        {eyebrow && (
          <p className="sukan-eyebrow mb-3">{eyebrow}</p>
        )}
        {title && (
          <h2 className="mb-5 font-display text-3xl leading-tight tracking-tight text-ink">
            {title}
          </h2>
        )}
        <div className="sukan-prose">{children}</div>
      </div>
    </div>
  );
}
