"use client";

import { useEffect, useRef, useState } from "react";

export interface HeroStat {
  value: string;
  label: string;
}

export interface HeroStatsProps {
  stats: HeroStat[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Pull the leading integer out of a value string like "1,247", "18+", "98%". */
function parseNumeric(raw: string): { numeric: number; suffix: string } {
  // Strip commas, grab the leading integer, keep whatever follows as suffix
  const cleaned = raw.replace(/,/g, "");
  const match = cleaned.match(/^(\d+)(.*)/);
  if (!match) return { numeric: 0, suffix: raw };
  return { numeric: parseInt(match[1], 10), suffix: match[2] };
}

/** Ease-out curve: t goes 0→1, returns 0→1 with deceleration. */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Format a raw integer back to the locale-formatted form (adds commas). */
function formatInt(n: number, originalHadCommas: boolean): string {
  if (originalHadCommas && n >= 1000) {
    return n.toLocaleString("en-US");
  }
  return String(n);
}

// ---------------------------------------------------------------------------
// Single animated stat
// ---------------------------------------------------------------------------

function AnimatedStat({ stat }: { stat: HeroStat }) {
  const { numeric, suffix } = parseNumeric(stat.value);
  const hadCommas = stat.value.includes(",");

  // SSR / first render: show the real value so crawlers see it
  const [display, setDisplay] = useState<string>(stat.value);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          observer.disconnect();

          const DURATION = 1200;
          const start = performance.now();

          // Kick off from 0
          setDisplay("0");

          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / DURATION, 1);
            const eased = easeOut(progress);
            const current = Math.round(eased * numeric);

            if (progress < 1) {
              setDisplay(formatInt(current, hadCommas) + suffix);
              rafRef.current = requestAnimationFrame(tick);
            } else {
              // Land on the exact original string
              setDisplay(stat.value);
            }
          };

          rafRef.current = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [numeric, suffix, hadCommas, stat.value, hasAnimated]);

  return (
    <div className="flex flex-col gap-0.5">
      <span
        ref={ref}
        className="font-display text-3xl text-terracotta leading-none tabular-nums"
      >
        {display}
      </span>
      <span className="text-xs uppercase tracking-wider text-ink-mid">
        {stat.label}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export default function HeroStats({ stats }: HeroStatsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 mt-6 pt-5 border-t border-sand-dk">
      {stats.map((stat) => (
        <AnimatedStat key={stat.label} stat={stat} />
      ))}
    </div>
  );
}
