// Server Component — no client state needed
interface StatCardProps {
  label: string;
  value: number | string;
  delta?: string;
}

export default function StatCard({ label, value, delta }: StatCardProps) {
  return (
    <div className="bg-earth-soft rounded-[var(--radius-card)] border border-gold/15 p-7 flex flex-col gap-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-gold/80">
        {label}
      </p>
      <p className="font-display text-5xl text-parchment leading-none">
        {value}
      </p>
      {delta && (
        <p className="text-sm text-mute-soft">{delta}</p>
      )}
    </div>
  );
}
