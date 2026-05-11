"use client";

import Image from "next/image";
import { useState, useRef, useCallback } from "react";
import { CREAM_BLUR } from "@/lib/blur";
import SukanMark from "@/components/sukan-mark";
import { PhotoLightbox } from "./photo-lightbox";

/* ─────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────── */

export interface GalleryPhoto {
  id: string;
  url: string;
  position: number;
}

interface PhotoGalleryClientProps {
  photos: GalleryPhoto[];
  title: string;
  tier?: string;
  featuredLabel?: string;
  isRtl?: boolean;
}

/* ─────────────────────────────────────────────────────────
   PhotoGalleryClient

   Owns all gallery rendering + lightbox state.
   The listing detail page (server component) passes down
   the fetched photo URLs and the listing title; this client
   component handles every click interaction.
───────────────────────────────────────────────────────── */

export function PhotoGalleryClient({
  photos,
  title,
  tier,
  featuredLabel,
  isRtl = false,
}: PhotoGalleryClientProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Keep refs to each photo button so we can return focus on close
  const photoButtonRefs = useRef<Map<number, HTMLButtonElement | null>>(new Map());

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    const idx = lightboxIndex;
    setLightboxIndex(null);
    // Return focus to the originally-clicked photo button
    if (idx !== null) {
      const btn = photoButtonRefs.current.get(idx);
      // Use a microtask so the lightbox has unmounted first
      Promise.resolve().then(() => btn?.focus());
    }
  }, [lightboxIndex]);

  const allUrls = photos.map((p) => p.url);
  const heroPhoto = photos[0] ?? null;
  const thumbPhotos = photos.slice(1);

  const featuredPill = tier === "featured" && featuredLabel ? (
    <span
      className="absolute top-4 ltr:left-4 rtl:right-4 inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-earth pointer-events-none"
      style={{
        background: "linear-gradient(135deg, #e0a857 0%, #c8873a 100%)",
        boxShadow:
          "0 4px 14px rgba(200, 135, 58, 0.35), inset 0 1px 0 rgba(255,255,255,0.35)",
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-earth/70" aria-hidden />
      ★ {featuredLabel}
    </span>
  ) : null;

  // Helper: shared photo button shell
  function PhotoButton({
    index,
    className,
    children,
  }: {
    index: number;
    className?: string;
    children: React.ReactNode;
  }) {
    return (
      <button
        ref={(el) => {
          photoButtonRefs.current.set(index, el);
        }}
        type="button"
        aria-label={`${title} ${index + 1}`}
        onClick={() => openLightbox(index)}
        className={`relative block w-full overflow-hidden cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-1 ${className ?? ""}`}
      >
        {children}
      </button>
    );
  }

  return (
    <>
      {/* ── Mobile: large hero + horizontal thumb strip ── */}
      <div className="lg:hidden">
        <div
          className="relative aspect-[16/10] w-full rounded-[var(--radius-glass-lg)] overflow-hidden"
          style={{ boxShadow: "var(--shadow-warm-lg)" }}
        >
          {heroPhoto ? (
            <PhotoButton index={0} className="aspect-[16/10] rounded-[var(--radius-glass-lg)]">
              <Image
                src={heroPhoto.url}
                alt={title}
                fill
                sizes="(max-width: 1024px) 100vw"
                quality={85}
                placeholder="blur"
                blurDataURL={CREAM_BLUR}
                className="object-cover"
                priority
              />
              {featuredPill}
            </PhotoButton>
          ) : (
            <PlaceholderSlot label={title} large />
          )}
        </div>

        {/* Thumbnail strip */}
        {thumbPhotos.length > 0 && (
          <div className="flex gap-2 mt-2 overflow-x-auto pb-1 snap-x snap-mandatory">
            {thumbPhotos.map((photo, i) => (
              <PhotoButton
                key={photo.id}
                index={i + 1}
                className="flex-none w-24 snap-start aspect-square rounded-[var(--radius-glass)]"
                // style applied via wrapper below
              >
                <div
                  className="relative w-24 aspect-square rounded-[var(--radius-glass)] overflow-hidden"
                  style={{ boxShadow: "var(--shadow-warm-sm)" }}
                >
                  <Image
                    src={photo.url}
                    alt={`${title} ${i + 2}`}
                    fill
                    sizes="96px"
                    quality={75}
                    placeholder="blur"
                    blurDataURL={CREAM_BLUR}
                    className="object-cover"
                  />
                </div>
              </PhotoButton>
            ))}
          </div>
        )}
      </div>

      {/* ── Desktop: hero (2 cols) + 2×2 thumb grid ── */}
      <div
        className={`hidden lg:grid gap-2 ${
          photos.length === 0 ? "lg:grid-cols-1" : "lg:grid-cols-3"
        }`}
      >
        {/* Large hero slot */}
        <div
          className={`relative aspect-[16/10] rounded-[var(--radius-glass-lg)] overflow-hidden ${
            photos.length === 0 ? "" : "lg:col-span-2"
          }`}
          style={{ boxShadow: "var(--shadow-warm-lg)" }}
        >
          {heroPhoto ? (
            <PhotoButton
              index={0}
              className="aspect-[16/10] rounded-[var(--radius-glass-lg)] overflow-hidden"
            >
              <Image
                src={heroPhoto.url}
                alt={title}
                fill
                sizes="(min-width: 1024px) 66vw"
                quality={85}
                placeholder="blur"
                blurDataURL={CREAM_BLUR}
                className="object-cover"
                priority
              />
              {featuredPill}
            </PhotoButton>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center card-watermark">
              <SukanMark monochrome="gold" size={140} className="opacity-[0.13]" />
            </div>
          )}
        </div>

        {/* 2×2 thumb grid — only when extra photos exist */}
        {thumbPhotos.length > 0 && (
          <div className="grid grid-cols-2 grid-rows-2 gap-2">
            {thumbPhotos.slice(0, 4).map((photo, i) => (
              <PhotoButton
                key={photo.id}
                index={i + 1}
                className="aspect-square rounded-[var(--radius-glass)] overflow-hidden"
              >
                <div
                  className="relative w-full h-full rounded-[var(--radius-glass)] overflow-hidden"
                  style={{ boxShadow: "var(--shadow-warm-sm)" }}
                >
                  <Image
                    src={photo.url}
                    alt={`${title} ${i + 2}`}
                    fill
                    sizes="(min-width: 1024px) 17vw"
                    quality={75}
                    placeholder="blur"
                    blurDataURL={CREAM_BLUR}
                    className="object-cover"
                  />
                </div>
              </PhotoButton>
            ))}

            {/* Fill empty slots when fewer than 4 thumbs */}
            {thumbPhotos.length < 4 &&
              Array.from({ length: 4 - thumbPhotos.length }, (_, i) => (
                <div
                  key={`empty-${i}`}
                  className="card-watermark rounded-[var(--radius-glass)] aspect-square opacity-30"
                />
              ))}
          </div>
        )}
      </div>

      {/* ── Lightbox portal ── */}
      {lightboxIndex !== null && allUrls.length > 0 && (
        <PhotoLightbox
          photos={allUrls}
          initialIndex={lightboxIndex}
          title={title}
          onClose={closeLightbox}
          isRtl={isRtl}
        />
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   Placeholder slot (no photos uploaded yet)
───────────────────────────────────────────────────────── */

function PlaceholderSlot({ label, large }: { label: string; large?: boolean }) {
  return (
    <div
      className={`card-watermark overflow-hidden relative w-full ${large ? "aspect-[16/10] rounded-[var(--radius-glass-lg)]" : "aspect-square rounded-[var(--radius-glass)]"}`}
      aria-label={label}
      role="img"
      style={
        large
          ? { boxShadow: "var(--shadow-warm-lg)" }
          : { boxShadow: "var(--shadow-warm-sm)" }
      }
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <SukanMark monochrome="gold" size={large ? 140 : 80} className="opacity-[0.13]" />
      </div>
    </div>
  );
}
