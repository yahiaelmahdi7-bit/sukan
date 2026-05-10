"use client";

import { GlassButton } from "@/components/ui/glass-button";

interface DangerZoneProps {
  title: string;
  description: string;
  buttonLabel: string;
}

export default function DangerZone({
  title,
  description,
  buttonLabel,
}: DangerZoneProps) {
  return (
    <div
      className="rounded-[var(--radius-card)] border border-terracotta/40 glass-warm p-7"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,252,246,0.72), rgba(200,64,26,0.05))",
        boxShadow: "var(--shadow-warm-sm)",
      }}
    >
      <h3 className="font-display text-xl text-terracotta-deep mb-3">{title}</h3>
      <p className="text-sm text-ink-mid mb-6 leading-relaxed">{description}</p>
      <GlassButton
        variant="danger"
        size="md"
        type="button"
        onClick={() => console.log("delete-account stub")}
      >
        {buttonLabel}
      </GlassButton>
    </div>
  );
}
