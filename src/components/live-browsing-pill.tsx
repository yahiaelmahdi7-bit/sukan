"use client";

// TODO: i18n — strings are hardcoded EN/AR, switched via useLocale()
import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";

/** Seed a starting viewer count in [30, 80] deterministically on the client. */
function seedCount(): number {
  return 30 + Math.floor(Math.random() * 51);
}

/**
 * A compact pill that shows a live-ish "N browsing right now" count.
 * The number drifts ±1 every 5–9 s with slight upward bias, clamped to [15, 150].
 * Renders nothing on the server (count is purely client-side fiction for liveness signal).
 */
export default function LiveBrowsingPill() {
  const locale = useLocale();
  const isAr = locale === "ar";

  const [count, setCount] = useState<number | null>(null);
  const countRef = useRef<number>(0);

  // Initialise on mount so SSR and client agree on null → then animate in.
  useEffect(() => {
    const initial = seedCount();
    countRef.current = initial;
    setCount(initial);
  }, []);

  useEffect(() => {
    if (count === null) return;

    function schedule() {
      // Drift interval: 5 000–9 000 ms
      const delay = 5000 + Math.random() * 4000;
      return window.setTimeout(() => {
        // Slight upward bias: +1 with p=0.55, -1 with p=0.45
        const delta = Math.random() < 0.55 ? 1 : -1;
        const next = Math.min(150, Math.max(15, countRef.current + delta));
        countRef.current = next;
        setCount(next);
        timerRef.current = schedule();
      }, delay);
    }

    const timerRef = { current: schedule() };
    return () => window.clearTimeout(timerRef.current);
  }, [count === null]); // re-run only when transitioning null → number

  if (count === null) return null;

  const label = isAr ? `${count} يتصفحون الآن` : `${count} browsing right now`;

  return (
    <>
      <style>{`
        @keyframes sukan-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.45; transform: scale(0.7); }
        }
        .sukan-pulse-dot {
          animation: sukan-pulse 1.8s ease-in-out infinite;
        }
      `}</style>

      <span
        className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-gold/30 bg-white/50 px-3 py-1 text-xs font-medium text-ink-mid backdrop-blur-sm"
        style={{ boxShadow: "0 1px 6px rgba(200,135,58,0.10)" }}
        aria-live="polite"
        aria-label={label}
      >
        {/* Gold pulsing dot */}
        <span
          className="sukan-pulse-dot h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ background: "var(--color-gold, #C8873A)" }}
          aria-hidden
        />
        {label}
      </span>
    </>
  );
}
