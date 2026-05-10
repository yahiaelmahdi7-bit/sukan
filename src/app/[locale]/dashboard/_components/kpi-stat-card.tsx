// Server Component — single KPI tile with delta trend
import GlassPanel from "@/components/glass-panel";

interface KpiStatCardProps {
  label: string;
  value: number;
  delta: number;
  deltaUpLabel: string;
  deltaDownLabel: string;
}

export default function KpiStatCard({
  label,
  value,
  delta,
  deltaUpLabel,
  deltaDownLabel,
}: KpiStatCardProps) {
  const isUp = delta >= 0;
  const deltaLabel = isUp
    ? deltaUpLabel.replace("{n}", String(delta))
    : deltaDownLabel.replace("{n}", String(Math.abs(delta)));

  return (
    <GlassPanel
      variant="warm"
      radius="card"
      highlight
      shadow
      className="p-6 flex flex-col gap-3"
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gold-dk">
        {label}
      </p>
      <p className="font-display text-5xl text-ink leading-none">
        {value.toLocaleString()}
      </p>
      <span
        className="self-start inline-flex items-center gap-1 rounded-[var(--radius-pill)] border border-white/60 bg-white/55 px-2.5 py-0.5 text-[11px] font-medium backdrop-blur-sm"
        style={{ color: isUp ? "#16a34a" : "#dc2626" }}
      >
        {isUp ? "↑" : "↓"} {deltaLabel}
      </span>
    </GlassPanel>
  );
}
