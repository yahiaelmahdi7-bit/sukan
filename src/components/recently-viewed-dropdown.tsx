"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { History, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  getRecentlyViewed,
  clearRecentlyViewed,
  type RecentlyViewedItem,
} from "@/lib/recently-viewed";

const SDG_PER_USD = 600;

function formatSdg(usd: number): string {
  const sdg = usd * SDG_PER_USD;
  if (sdg >= 1_000_000) return `${(sdg / 1_000_000).toFixed(1)}M SDG`;
  if (sdg >= 1_000) return `${(sdg / 1_000).toFixed(0)}K SDG`;
  return `${sdg.toLocaleString()} SDG`;
}

export default function RecentlyViewedDropdown() {
  const t = useTranslations("recentlyViewed");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Refresh list each time the dropdown opens
  useEffect(() => {
    if (open) {
      setItems(getRecentlyViewed());
    }
  }, [open]);

  // Click-outside to close
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  const handleClear = useCallback(() => {
    clearRecentlyViewed();
    setItems([]);
  }, []);

  const handleItemClick = useCallback(
    (id: string) => {
      setOpen(false);
      router.push(`/listings/${id}`);
    },
    [router],
  );

  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={t("label")}
        className="smooth-fast hidden items-center gap-1.5 rounded-[var(--radius-pill)] border border-white/60 bg-white/40 px-3 py-1.5 text-sm text-ink hover:border-gold/50 hover:bg-gold/10 sm:inline-flex"
      >
        <History size={14} className="shrink-0 text-ink/70" />
        {/* Label hidden on smaller screens — icon-only up to lg */}
        <span className="hidden lg:inline">{t("header")}</span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="dialog"
          aria-label={t("label")}
          className="absolute end-0 top-full z-50 mt-2 w-80 origin-top-right sm:w-96"
          style={{
            boxShadow: "var(--shadow-warm)",
          }}
        >
          {/* Glass panel */}
          <div
            className="glass-strong overflow-hidden rounded-[var(--radius-glass)] border border-white/60"
            style={{ backdropFilter: "blur(18px)" }}
          >
            {/* Header row */}
            <div className="flex items-center justify-between border-b border-white/40 px-4 py-3">
              <span className="text-sm font-semibold text-ink">
                {t("header")}
              </span>
              <div className="flex items-center gap-3">
                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="smooth-fast text-xs text-ink/50 hover:text-terracotta"
                  >
                    {t("clearAll")}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="smooth-fast rounded-full p-0.5 text-ink/40 hover:text-ink/70"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Body */}
            {items.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
                <History size={28} className="text-ink/20" />
                <p className="text-sm text-ink/50">
                  {t("empty")}
                </p>
                <a
                  href="/listings"
                  onClick={() => setOpen(false)}
                  className="smooth-fast mt-1 rounded-[var(--radius-pill)] bg-terracotta px-4 py-1.5 text-xs font-semibold text-cream hover:bg-terracotta-deep"
                  style={{ boxShadow: "0 4px 14px rgba(200, 64, 26, 0.22)" }}
                >
                  {t("startBrowsing")}
                </a>
              </div>
            ) : (
              /* Item list */
              <ul className="max-h-[min(420px,70vh)] overflow-y-auto overscroll-contain">
                {items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleItemClick(item.id)}
                      className="smooth-fast flex w-full items-center gap-3 px-4 py-2.5 text-start hover:bg-gold/10"
                    >
                      {/* Thumbnail */}
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-cream-deep">
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                          unoptimized={item.image.includes("unsplash.com")}
                        />
                      </div>

                      {/* Text */}
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-medium text-ink">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-xs">
                          <bdi className="font-semibold text-terracotta">
                            ${item.priceUsd.toLocaleString()}
                          </bdi>
                          <bdi className="ms-1.5 text-ink/40">
                            ≈ {formatSdg(item.priceUsd)}
                          </bdi>
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
