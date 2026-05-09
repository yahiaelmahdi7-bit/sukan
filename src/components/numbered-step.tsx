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
    <div className="relative bg-card border border-sand-dk rounded-[var(--radius-card)] p-8 transition hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-[0_8px_28px_rgba(18,16,12,0.08)] overflow-hidden">
      {/* Watermark number — top end corner */}
      <span
        aria-hidden
        className="absolute top-3 end-4 font-display text-7xl text-gold/12 leading-none font-bold select-none"
      >
        {indexStr}
      </span>

      {/* Icon */}
      <div className="mb-5 text-gold w-11 h-11 flex items-center justify-center">
        {icon}
      </div>

      {/* Title */}
      <h3 className="font-display text-xl text-ink font-semibold mb-3">
        {title}
      </h3>

      {/* Body */}
      <p className="text-ink-mid text-sm leading-relaxed">{body}</p>
    </div>
  );
}
