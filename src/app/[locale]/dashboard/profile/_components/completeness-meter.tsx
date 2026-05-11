// Server-renderable (no client hooks needed — pure display)
// Accepts already-computed values so it can be used in both server and client
// contexts without wiring to the DB again.

interface CompletenessMeterProps {
  pct: number;
  /** Array of missing-item labels to display as hints */
  missing: string[];
  title: string;
  doneLabel: string;
}

export function CompletenessMeter({
  pct,
  missing,
  title,
  doneLabel,
}: CompletenessMeterProps) {
  const clampedPct = Math.min(100, Math.max(0, pct));

  // Color shifts: red → amber → gold → terracotta-warm → green-ish gold at 100
  const barColor =
    clampedPct >= 100
      ? "bg-gradient-to-r from-gold to-terracotta"
      : clampedPct >= 60
        ? "bg-gradient-to-r from-gold/80 to-gold"
        : "bg-gradient-to-r from-terracotta/70 to-gold/60";

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-ink">{title}</span>
        <span
          className={[
            "text-xs font-bold tabular-nums",
            clampedPct >= 100 ? "text-gold-dk" : "text-terracotta",
          ].join(" ")}
        >
          {clampedPct}%
        </span>
      </div>

      {/* Track */}
      <div className="h-2 w-full rounded-full bg-sand/60 overflow-hidden">
        <div
          className={["h-full rounded-full smooth", barColor].join(" ")}
          style={{ width: `${clampedPct}%` }}
          role="progressbar"
          aria-valuenow={clampedPct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Missing items */}
      {missing.length > 0 ? (
        <p className="text-xs text-ink-mid leading-relaxed">
          {missing.join(" · ")}
        </p>
      ) : (
        <p className="text-xs text-gold-dk font-medium">{doneLabel}</p>
      )}
    </div>
  );
}
