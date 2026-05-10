"use client";

import { useState, useRef, useEffect } from "react";
import { Share2, Link2, Check } from "lucide-react";
import { useTranslations } from "next-intl";

interface ShareButtonProps {
  url: string;
  title: string;
}

export function ShareButton({ url, title }: ShareButtonProps) {
  const t = useTranslations("share");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback — silently fail
    }
  }

  const waUrl = `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`;
  const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={t("share")}
        className="inline-flex items-center gap-1.5 rounded-full border border-[#C8873A]/40 bg-white/60 px-3 py-1.5 text-sm text-[#C8873A] backdrop-blur-sm transition hover:bg-[#C8873A]/10"
      >
        <Share2 size={14} aria-hidden="true" />
        <span>{t("share")}</span>
      </button>

      {open && (
        <div className="absolute end-0 z-50 mt-2 w-44 rounded-2xl border border-white/40 bg-white/90 p-1.5 shadow-lg backdrop-blur-md">
          {/* WhatsApp */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#12100C] hover:bg-[#C8401A]/8 transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
              <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.17 1.6 5.99L0 24l6.18-1.62A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 22c-1.85 0-3.66-.5-5.23-1.44l-.37-.22-3.87 1.01 1.04-3.78-.24-.39A9.93 9.93 0 0 1 2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm5.49-7.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.21 5.09 4.5.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
            </svg>
            {t("viaWhatsapp")}
          </a>

          {/* X / Twitter */}
          <a
            href={xUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#12100C] hover:bg-[#C8401A]/8 transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.906-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            {t("viaTwitter")}
          </a>

          {/* Copy link */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#12100C] hover:bg-[#C8401A]/8 transition"
          >
            {copied ? (
              <Check size={14} className="text-green-600" aria-hidden="true" />
            ) : (
              <Link2 size={14} aria-hidden="true" />
            )}
            {copied ? t("copied") : t("copyLink")}
          </button>
        </div>
      )}
    </div>
  );
}
