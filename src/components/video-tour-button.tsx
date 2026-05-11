"use client";

import { useState, useEffect } from "react";
import { Play, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface VideoTourButtonProps {
  url: string;
  className?: string;
}

// Match a YouTube / YouTube Shorts / Vimeo URL and return the embed src.
// For anything else (or a direct mp4), we fall through to a <video> element.
function toEmbedSrc(url: string): { kind: "iframe" | "video"; src: string } {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return { kind: "iframe", src: `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0` };

  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return { kind: "iframe", src: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1` };

  return { kind: "video", src: url };
}

export function VideoTourButton({ url, className }: VideoTourButtonProps) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const embed = toEmbedSrc(url);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          "inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-gold/40 bg-white/70 px-5 py-2.5 text-sm font-semibold text-gold-dk backdrop-blur-md transition hover:border-gold/70 hover:bg-gold/10"
        }
      >
        <Play size={16} aria-hidden />
        {t("listing.watchTour")}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("listing.watchTour")}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="relative w-full max-w-4xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("common.close")}
              className="absolute -top-12 right-0 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <X size={20} aria-hidden />
            </button>
            <div className="relative aspect-video w-full overflow-hidden rounded-[var(--radius-glass)] bg-black shadow-2xl">
              {embed.kind === "iframe" ? (
                <iframe
                  src={embed.src}
                  title={t("listing.watchTour")}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              ) : (
                <video
                  src={embed.src}
                  controls
                  autoPlay
                  className="absolute inset-0 h-full w-full"
                >
                  <track kind="captions" />
                </video>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
