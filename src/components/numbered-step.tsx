// Server Component
import type { ReactNode } from "react";

export interface NumberedStepProps {
  index: number;
  icon: ReactNode;
  title: string;
  body: string;
}

export default function NumberedStep({
  index,
  icon,
  title,
  body,
}: NumberedStepProps) {
  const indexStr = String(index).padStart(2, "0");

  return (
    <div className="relative bg-earth border border-gold/15 rounded-[var(--radius-card)] p-8 transition hover:-translate-y-0.5 hover:border-gold/30 overflow-hidden">
      {/* Watermark number — top end corner */}
      <span
        aria-hidden
        className="absolute top-3 end-4 font-display text-7xl text-gold/8 leading-none font-bold select-none"
      >
        {indexStr}
      </span>

      {/* Icon */}
      <div className="mb-5 text-gold w-11 h-11 flex items-center justify-center">
        {icon}
      </div>

      {/* Title */}
      <h3 className="font-display text-xl text-parchment font-semibold mb-3">
        {title}
      </h3>

      {/* Body */}
      <p className="text-mute-soft text-sm leading-relaxed">{body}</p>
    </div>
  );
}
