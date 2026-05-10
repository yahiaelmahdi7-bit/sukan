// Server Component — no client state needed
import GlassPanel from "@/components/glass-panel";

interface StatCardProps {
  label: string;
  value: number | string;
  delta?: string;
}

export default function StatCard({ label, value, delta }: StatCardProps) {
  return (
    <GlassPanel
      variant="warm"
      radius="card"
      highlight
      shadow
      className="p-7 flex flex-col gap-3"
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gold-dk">
        {label}
      </p>
      <p className="font-display text-5xl text-ink leading-none">
        {value}
      </p>
      {delta && (
        <span
          className="self-start inline-flex items-center gap-1 rounded-[var(--radius-pill)] border border-white/60 bg-white/55 px-2.5 py-0.5 text-[11px] font-medium text-ink-mid backdrop-blur-sm"
        >
          ↑ {delta}
        </span>
      )}
    </GlassPanel>
  );
}
