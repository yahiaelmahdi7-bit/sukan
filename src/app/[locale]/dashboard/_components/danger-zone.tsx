"use client";

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
    <div className="rounded-[var(--radius-card)] border border-terracotta/30 bg-terracotta/5 p-7">
      <h3 className="font-display text-xl text-terracotta mb-3">{title}</h3>
      <p className="text-sm text-mute-soft mb-6 leading-relaxed">{description}</p>
      <button
        type="button"
        onClick={() => console.log("delete-account stub")}
        className="rounded-[var(--radius-pill)] border border-terracotta text-terracotta px-6 py-2.5 text-sm font-semibold hover:bg-terracotta hover:text-parchment transition-colors"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
