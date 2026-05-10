"use client";

import { useTransition, useState, useId } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import SukanMark from "@/components/sukan-mark";
import { getOrCreateInquiry } from "@/app/[locale]/dashboard/inquiries/actions";
import type { Listing } from "@/lib/sample-listings";

interface InquiryModalProps {
  listing: Listing;
  onClose: () => void;
}

type SubmitState = "idle" | "submitting" | "error";

export default function InquiryModal({ listing, onClose }: InquiryModalProps) {
  const t = useTranslations("inquiry");
  const locale = useLocale();
  const uid = useId();

  const listingTitle = locale === "ar" ? listing.titleAr : listing.titleEn;
  const city = (listing as { city?: string }).city ?? "";

  const [message, setMessage] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [isPending, startTransition] = useTransition();

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!message.trim()) {
      setErrorMessage(t("errorValidation"));
      setSubmitState("error");
      return;
    }

    setSubmitState("submitting");

    startTransition(async () => {
      const result = await getOrCreateInquiry(listing.id, message.trim());

      if (result.ok) {
        // Show the in-modal success state instead of navigating away
        setSubmitted(true);
      } else {
        // Fall back to the old API route for unauthenticated users
        try {
          const res = await fetch("/api/inquiries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              listingId: listing.id,
              name: "Guest",
              phone: "",
              message: message.trim(),
              locale,
            }),
          });
          const data = (await res.json()) as { ok: boolean; error?: string };

          if (data.ok) {
            // Unauthenticated path: show success state too
            setSubmitted(true);
          } else {
            setErrorMessage(data.error ?? t("errorGeneric"));
            setSubmitState("error");
          }
        } catch {
          setErrorMessage(result.error ?? t("errorGeneric"));
          setSubmitState("error");
        }
      }
    });
  }

  const waUrl = `https://wa.me/${listing.whatsappContact.replace(/\D/g, "")}`;
  const telUrl = `tel:${listing.whatsappContact}`;

  const messageId = `${uid}-message`;

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-earth/80 backdrop-blur-sm"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${uid}-title`}
    >
      {/* Panel */}
      <div className="relative w-full max-w-md bg-earth border border-gold/20 rounded-[var(--radius-card)] shadow-[0_8px_48px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden">

        {/* ── Success state ── */}
        {submitted ? (
          <div className="flex flex-col items-center gap-6 px-8 py-10 text-center">
            {/* Gold-tinted check icon */}
            <div
              className="flex items-center justify-center"
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, rgba(200,135,58,0.22) 0%, rgba(200,135,58,0.08) 100%)",
                border: "1px solid rgba(200,135,58,0.3)",
                color: "#C8873A",
              }}
              aria-hidden
            >
              <CheckCircle2 size={32} />
            </div>

            {/* Title + body */}
            <div className="flex flex-col gap-2">
              <h2
                className="font-display text-3xl text-parchment"
                style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}
                id={`${uid}-title`}
              >
                We&apos;ve messaged the landlord
              </h2>
              <p className="text-sm leading-relaxed text-mute-soft max-w-xs mx-auto">
                They typically reply within a few hours. We&apos;ll let you know the moment they do.
              </p>
            </div>

            {/* What's next hint pills */}
            {/* TODO: i18n */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <Link
                href={`/${locale}/dashboard/saved-searches`}
                onClick={onClose}
                className="smooth-fast inline-flex items-center rounded-[var(--radius-pill)] border border-gold/30 bg-gold/10 px-3.5 py-1.5 text-xs font-medium text-gold hover:bg-gold/20 hover:border-gold/50"
              >
                Save similar searches
              </Link>
              {city && (
                <Link
                  href={`/${locale}/listings?city=${encodeURIComponent(city)}`}
                  onClick={onClose}
                  className="smooth-fast inline-flex items-center rounded-[var(--radius-pill)] border border-gold/30 bg-gold/10 px-3.5 py-1.5 text-xs font-medium text-gold hover:bg-gold/20 hover:border-gold/50"
                >
                  Browse more in {city}
                </Link>
              )}
              <Link
                href={`/${locale}/listings`}
                onClick={onClose}
                className="smooth-fast inline-flex items-center rounded-[var(--radius-pill)] border border-gold/30 bg-gold/10 px-3.5 py-1.5 text-xs font-medium text-gold hover:bg-gold/20 hover:border-gold/50"
              >
                Get AI matched
              </Link>
            </div>

            {/* Done button */}
            <button
              type="button"
              onClick={onClose}
              className="w-full mt-1 flex items-center justify-center rounded-[var(--radius-pill)] border border-gold/30 bg-earth-soft/60 py-3 text-sm font-semibold text-parchment hover:border-gold/55 hover:bg-gold/10 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <>
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gold/15 px-6 py-4">
          <SukanMark size={28} monochrome="gold" />
          <div className="flex-1 min-w-0">
            <p
              id={`${uid}-title`}
              className="text-parchment font-semibold text-sm leading-snug truncate"
            >
              {t("title")}
            </p>
            <p className="text-mute-soft text-xs truncate mt-0.5">
              {listingTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="flex-none w-8 h-8 flex items-center justify-center rounded-full text-mute-soft hover:text-parchment hover:bg-gold/10 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body — only form state; success swaps to the success view above */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col p-6 gap-5">

          {/* Message */}
          <div className="flex flex-col">
            <label
              htmlFor={messageId}
              className="text-xs uppercase tracking-wider text-gold/80 mb-2"
            >
              {t("message")}
            </label>
            <textarea
              id={messageId}
              rows={4}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (submitState === "error") setSubmitState("idle");
              }}
              className="py-3.5 px-4 text-base bg-earth-soft border border-gold/20 rounded-md text-parchment placeholder:text-mute-soft focus:outline-none focus:border-gold/50 transition-colors resize-none"
              placeholder={t("messagePlaceholder")}
            />
          </div>

          {/* Inline error */}
          {submitState === "error" && errorMessage && (
            <p
              role="alert"
              className="rounded-md bg-terracotta/10 border border-terracotta/30 px-4 py-3 text-sm text-terracotta"
            >
              {errorMessage}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-terracotta hover:bg-terracotta-deep disabled:opacity-60 disabled:cursor-not-allowed text-parchment font-semibold py-3.5 text-base transition-colors"
          >
            {isPending ? (
              <>
                <SpinnerIcon />
                {t("sending")}
              </>
            ) : (
              t("send")
            )}
          </button>

          {/* Direct contact links */}
          <div className="flex items-center justify-center gap-4 pt-1">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-mute-soft hover:text-gold transition-colors underline-offset-2 hover:underline"
            >
              {t("orWhatsapp")}
            </a>
            <span className="text-gold/20" aria-hidden>|</span>
            <a
              href={telUrl}
              className="text-xs text-mute-soft hover:text-gold transition-colors underline-offset-2 hover:underline"
            >
              {t("orPhone")}
            </a>
          </div>
        </form>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Micro icons ── */

function CloseIcon() {
  return (
    <svg
      aria-hidden
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      aria-hidden
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-spin"
    >
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}
