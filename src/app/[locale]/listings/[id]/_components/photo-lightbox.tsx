"use client";

import Image from "next/image";
import { useEffect, useRef, useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { CREAM_BLUR } from "@/lib/blur";

/* ─────────────────────────────────────────────────────────
   PhotoLightbox — fullscreen photo viewer

   Props
   ─────
   photos       Array of photo URLs
   initialIndex Index of the photo to open at
   title        Alt text base string
   onClose      Called when the lightbox should dismiss

   RTL / swipe notes
   ──────────────────
   • Prev/next chevrons follow the page reading direction (logical
     properties): "next" arrow always points toward the end of the line.
     In LTR this is →; in RTL this is ←.
   • Touch swipe: swipe-left-finger → next photo, swipe-right-finger →
     prev photo, regardless of locale. This matches the dominant
     convention for image galleries (same as iOS Photos, Instagram, etc.)
     where the gesture moves the photo deck, not the viewport cursor.
   • Keyboard ArrowLeft / ArrowRight respect RTL: in RTL locales the
     right-arrow key moves to the next (later) photo, matching the logical
     reading direction.
───────────────────────────────────────────────────────── */

export interface PhotoLightboxProps {
  photos: string[];
  initialIndex: number;
  title: string;
  onClose: () => void;
  isRtl?: boolean;
}

export function PhotoLightbox({
  photos,
  initialIndex,
  title,
  onClose,
  isRtl = false,
}: PhotoLightboxProps) {
  const t = useTranslations("lightbox");
  const [current, setCurrent] = useState(initialIndex);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Touch tracking for swipe
  const touchStartX = useRef<number | null>(null);

  const total = photos.length;

  const goNext = useCallback(() => {
    setCurrent((i) => (i + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setCurrent((i) => (i - 1 + total) % total);
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      // RTL-aware: in RTL, ArrowRight = next (further in reading order)
      if (e.key === "ArrowRight") {
        isRtl ? goNext() : goNext();
        return;
      }
      if (e.key === "ArrowLeft") {
        isRtl ? goPrev() : goPrev();
        return;
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, goNext, goPrev, isRtl]);

  // Body scroll lock
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Touch swipe handlers
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = (e.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
    touchStartX.current = null;
    const threshold = 40;
    if (dx < -threshold) goNext(); // swipe left → next
    if (dx > threshold) goPrev();  // swipe right → prev
  }

  // Click on backdrop (not on photo or controls) → close
  function onBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === backdropRef.current) onClose();
  }

  const src = photos[current] ?? "";
  const counter = t("counter", { current: current + 1, total });
  const closeLabel = t("close");
  const prevLabel = t("prev");
  const nextLabel = t("next");

  return (
    <div
      ref={backdropRef}
      role="dialog"
      aria-modal
      aria-label={t("dialogLabel", { title })}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: "rgba(18,16,12,0.95)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
      onClick={onBackdropClick}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Top bar: counter (start) + close (end) */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between px-4 py-3 z-10 pointer-events-none">
        <span
          className="rounded-[var(--radius-pill)] bg-black/50 px-3 py-1 text-xs font-semibold text-cream/80 tabular-nums pointer-events-none"
          aria-live="polite"
          aria-atomic
        >
          {counter}
        </span>
        <button
          type="button"
          aria-label={closeLabel}
          onClick={onClose}
          className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-cream/80 hover:bg-black/70 hover:text-cream transition-colors"
        >
          <svg
            aria-hidden
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Prev button — logical start side */}
      {total > 1 && (
        <button
          type="button"
          aria-label={prevLabel}
          onClick={goPrev}
          className="absolute start-3 sm:start-5 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-cream/80 hover:bg-black/70 hover:text-cream transition-colors"
        >
          {/* In LTR this is ←; in RTL the browser flips it automatically via logical props + rtl:rotate */}
          <svg
            aria-hidden
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="rtl:rotate-180"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* Next button — logical end side */}
      {total > 1 && (
        <button
          type="button"
          aria-label={nextLabel}
          onClick={goNext}
          className="absolute end-3 sm:end-5 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-cream/80 hover:bg-black/70 hover:text-cream transition-colors"
        >
          <svg
            aria-hidden
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="rtl:rotate-180"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Main photo */}
      <div
        className="relative"
        style={{ maxWidth: "92vw", maxHeight: "92vh", width: "92vw", height: "92vh" }}
      >
        <Image
          key={src}
          src={src}
          alt={`${title} — ${current + 1} / ${total}`}
          fill
          sizes="92vw"
          quality={90}
          placeholder="blur"
          blurDataURL={CREAM_BLUR}
          className="object-contain"
          priority
        />
      </div>

      {/* Thumbnail strip — bottom */}
      {total > 1 && (
        <div
          className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-2 px-4 pointer-events-none"
          aria-hidden
        >
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`${title} ${i + 1}`}
              className={`pointer-events-auto h-1.5 rounded-full transition-all ${
                i === current
                  ? "w-5 bg-cream"
                  : "w-1.5 bg-cream/40 hover:bg-cream/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
