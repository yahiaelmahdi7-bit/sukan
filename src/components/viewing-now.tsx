"use client";

// TODO: i18n — replace hardcoded strings with translation keys

import { useEffect, useState } from "react";

/** Deterministic seed → integer in [min, max] using a simple hash */
function seededInt(seed: string, min: number, max: number, salt = 0): number {
  let h = salt;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  const pos = Math.abs(h);
  return min + (pos % (max - min + 1));
}

interface ViewingNowProps {
  listingId: string;
}

export function ViewingNow({ listingId }: ViewingNowProps) {
  const initial = seededInt(listingId, 8, 22);
  const [count, setCount] = useState(initial);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    function schedule() {
      // Random interval: 4–7 s
      const delay = 4000 + Math.random() * 3000;
      timeoutId = setTimeout(() => {
        setCount((prev) => {
          // +1 with 60% probability, −1 with 40%; clamp to [3, 30]
          const delta = Math.random() < 0.6 ? 1 : -1;
          return Math.max(3, Math.min(30, prev + delta));
        });
        schedule();
      }, delay);
    }

    schedule();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      <style>{`
        @keyframes sukan-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.55; transform: scale(0.78); }
        }
        .sukan-dot-pulse {
          animation: sukan-pulse 2.2s ease-in-out infinite;
        }
      `}</style>

      <span
        role="status"
        aria-live="polite"
        aria-label={`${count} people viewing this property right now`}
        className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[#C8401A]/30 px-3.5 py-1.5 text-xs font-medium text-[#12100C]/75 select-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(253,248,240,0.88) 0%, rgba(240,230,208,0.70) 100%)",
          backdropFilter: "blur(12px) saturate(150%)",
          WebkitBackdropFilter: "blur(12px) saturate(150%)",
          boxShadow:
            "0 2px 10px rgba(200,64,26,0.10), inset 0 1px 0 rgba(255,255,255,0.60)",
        }}
      >
        {/* Gold-tinted dot with pulse */}
        <span
          aria-hidden
          className="sukan-dot-pulse flex-none w-2 h-2 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, #e0a857 0%, #C8873A 60%, #a8631a 100%)",
            boxShadow: "0 0 6px rgba(200,135,58,0.55)",
          }}
        />
        {/* TODO: i18n */}
        <span>
          <span className="font-semibold text-[#C8401A]">{count}</span>
          {" "}
          {count === 1 ? "person" : "people"} viewing this property right now
        </span>
      </span>
    </>
  );
}
