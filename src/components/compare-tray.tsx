"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Scale } from "lucide-react";
import {
  getCompareItems,
  removeFromCompare,
  clearCompare,
  subscribeCompare,
  type CompareItem,
} from "@/lib/compare";

// ── Placeholder slot ───────────────────────────────────────────────────────

function EmptySlot() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-1 rounded-[10px] text-center"
      style={{
        width: 140,
        height: 100,
        border: "1.5px dashed rgba(200,135,58,0.35)",
        background: "rgba(240,230,208,0.25)",
      }}
    >
      <Scale size={14} className="text-gold/60" />
      <span className="text-[10px] leading-tight text-ink-mid/70">
        Pick one more {/* TODO: i18n */}
      </span>
    </div>
  );
}

// ── Filled slot ────────────────────────────────────────────────────────────

function FilledSlot({
  item,
  onRemove,
}: {
  item: CompareItem;
  onRemove: (id: string) => void;
}) {
  return (
    <div
      className="relative flex flex-col overflow-hidden rounded-[10px]"
      style={{
        width: 140,
        height: 100,
        border: "1px solid rgba(200,135,58,0.22)",
        background: "rgba(253,248,240,0.7)",
      }}
    >
      {/* Photo */}
      <div className="relative shrink-0" style={{ height: 56 }}>
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="140px"
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex min-h-0 flex-1 flex-col justify-between px-2 pb-1.5 pt-1">
        <p className="line-clamp-1 text-[10px] font-medium leading-tight text-ink">
          {item.title}
        </p>
        <p
          className="text-[11px] font-semibold leading-none"
          style={{ color: "#C8401A" }}
        >
          ${item.priceUsd.toLocaleString()}
        </p>
      </div>

      {/* Remove */}
      <button
        type="button"
        aria-label={`Remove ${item.title} from compare`} // TODO: i18n
        onClick={() => onRemove(item.id)}
        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink/50 text-cream transition-colors hover:bg-ink/80"
      >
        <X size={10} strokeWidth={2.5} />
      </button>
    </div>
  );
}

// ── Main tray ──────────────────────────────────────────────────────────────

export default function CompareTray() {
  const [items, setItems] = useState<CompareItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    const sync = () => {
      const next = getCompareItems();
      setItems((prev) => {
        // Animate slide-up when gaining first item, slide-down when losing last
        if (prev.length === 0 && next.length > 0) setVisible(true);
        if (prev.length > 0 && next.length === 0) {
          // Give the slide-down animation time before removing from DOM
          setTimeout(() => setVisible(false), 300);
        }
        return next;
      });
    };
    sync();
    return subscribeCompare(sync);
  }, []);

  // SSR guard
  if (!mounted) return null;
  if (!visible && items.length === 0) return null;

  const slots = [0, 1, 2];
  const compareHref = "/compare";

  return (
    <>
      {/* Keyframe for slide-up */}
      <style>{`
        @keyframes _sk_tray_up {
          from { transform: translateY(110%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes _sk_tray_down {
          from { transform: translateY(0);    opacity: 1; }
          to   { transform: translateY(110%); opacity: 0; }
        }
      `}</style>

      <div
        role="region"
        aria-label="Compare tray" // TODO: i18n
        className="fixed bottom-6 ltr:right-6 rtl:left-6 rtl:right-auto z-40 flex items-end gap-3"
        style={{
          animation:
            items.length > 0
              ? "_sk_tray_up 0.35s cubic-bezier(0.16,1,0.3,1) both"
              : "_sk_tray_down 0.3s ease-in both",
        }}
      >
        {/* Glass card */}
        <div
          className="flex items-center gap-3 rounded-[var(--radius-glass)] border border-white/60 p-3"
          style={{
            background:
              "linear-gradient(135deg, rgba(253,248,240,0.92) 0%, rgba(253,248,240,0.80) 100%)",
            backdropFilter: "blur(16px) saturate(180%)",
            boxShadow: "var(--shadow-warm)",
          }}
        >
          {/* Slots */}
          <div className="flex items-center gap-2">
            {slots.map((i) => {
              const item = items[i];
              return item ? (
                <FilledSlot
                  key={item.id}
                  item={item}
                  onRemove={removeFromCompare}
                />
              ) : (
                <EmptySlot key={`empty-${i}`} />
              );
            })}
          </div>

          {/* CTA column */}
          <div className="flex flex-col items-stretch gap-2 ps-1">
            <a
              href={compareHref}
              className="inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-pill)] px-4 py-2 text-sm font-semibold text-cream transition-colors hover:opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, #c8401a 0%, #9d2f0f 100%)",
                boxShadow:
                  "0 6px 16px rgba(200,64,26,0.28), inset 0 1px 0 rgba(255,255,255,0.15)",
                whiteSpace: "nowrap",
              }}
            >
              <Scale size={14} />
              Compare {items.length} {/* TODO: i18n */}
            </a>
            <button
              type="button"
              onClick={clearCompare}
              className="text-center text-[11px] text-ink-mid/70 underline underline-offset-2 transition-colors hover:text-terracotta"
            >
              Clear all {/* TODO: i18n */}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
