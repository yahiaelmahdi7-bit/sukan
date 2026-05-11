// Server Component — no interactivity needed
import { TrendingUp } from "lucide-react";
import { getTranslations } from "next-intl/server";

export interface CurrencySnapshotProps {
  size?: "sm" | "lg";
}

// Hardcoded rate — updated manually until Central Bank feed lands in Q3 2026
const USD_TO_SDG = 600;
const UPDATED_DATE = "11 May 2026";

export default async function CurrencySnapshot({
  size = "sm",
}: CurrencySnapshotProps) {
  const t = await getTranslations("currency");
  const updatedLabel = `${UPDATED_DATE} · ${t("updatedManually")}`;

  if (size === "lg") {
    return (
      <div
        className="relative overflow-hidden rounded-[var(--radius-glass)] border border-gold/40 bg-gold/8 p-7 backdrop-blur-sm"
        style={{ boxShadow: "0 0 0 1px rgba(200,135,58,0.12), 0 4px 20px rgba(200,135,58,0.10)" }}
      >
        {/* Subtle glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-10 -end-10 h-32 w-32 rounded-full blur-2xl"
          style={{ background: "radial-gradient(closest-side, rgba(200,135,58,0.18), transparent)" }}
        />

        <div className="relative flex items-start gap-4">
          <div
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            style={{ background: "rgba(200,135,58,0.15)" }}
          >
            <TrendingUp size={20} className="text-gold-dk" strokeWidth={1.5} aria-hidden="true" />
          </div>

          <div className="flex flex-col gap-1">
            {/* Primary rate — bdi ensures correct number direction in both LTR/RTL contexts */}
            <p className="font-display text-3xl leading-none text-ink md:text-4xl">
              <bdi>1 USD ≈{" "}
              <span className="text-gold-dk">{USD_TO_SDG.toLocaleString()} SDG</span></bdi>
            </p>

            {/* Secondary context line */}
            <p className="text-sm text-ink-mid">
              <bdi>1,000 USD ≈{" "}
              <span className="font-semibold text-ink">
                {(1000 * USD_TO_SDG).toLocaleString()} SDG
              </span></bdi>
            </p>

            {/* Timestamp */}
            <p className="mt-1 text-xs text-ink-mid/70">
              {updatedLabel}
            </p>

            {/* Road-map note */}
            <p className="mt-3 text-xs text-ink-mid/60 italic">
              {t("q3Note")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── sm (default) ────────────────────────────────────────────────────────────
  return (
    <div
      className="inline-flex items-center gap-2.5 rounded-[var(--radius-pill)] border border-gold/35 bg-gold/8 px-4 py-2 backdrop-blur-sm"
      style={{ boxShadow: "0 2px 10px rgba(200,135,58,0.10)" }}
    >
      <TrendingUp size={14} className="shrink-0 text-gold-dk" strokeWidth={1.5} aria-hidden="true" />
      <bdi className="text-sm font-semibold text-ink">
        1 USD ≈{" "}
        <span className="text-gold-dk">{USD_TO_SDG.toLocaleString()} SDG</span>
      </bdi>
      <span className="text-xs text-ink-mid/60">· {updatedLabel}</span>
    </div>
  );
}
