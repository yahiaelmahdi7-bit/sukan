"use client";

// NOTE: Mount <OnboardingTour /> inside the dashboard layout (src/app/[locale]/dashboard/layout.tsx)
// to activate it. It auto-hides after completion and never renders again for
// returning visitors (localStorage flag "sukan-onboarding-done").

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useTranslations, useLocale } from "next-intl";

const STORAGE_KEY = "sukan-onboarding-done";

interface TourStep {
  /** data-tour attribute on the target nav element */
  target: string;
  titleKey: string;
  bodyKey: string;
}

const STEPS: TourStep[] = [
  {
    target: "myListings",
    titleKey: "step1Title",
    bodyKey: "step1Body",
  },
  {
    target: "inquiries",
    titleKey: "step2Title",
    bodyKey: "step2Body",
  },
  {
    target: "savedSearches",
    titleKey: "step3Title",
    bodyKey: "step3Body",
  },
];

interface TooltipRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export default function OnboardingTour() {
  const t = useTranslations("onboarding");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<TooltipRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Only run on client, only once
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY) === "1") return;
    // Small delay so the sidebar has painted
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  // Measure target element whenever step changes
  const measureTarget = useCallback((targetKey: string) => {
    const el = document.querySelector(`[data-tour="${targetKey}"]`);
    if (!el) {
      setTargetRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    setTargetRect({ top: r.top, left: r.left, width: r.width, height: r.height });
  }, []);

  useEffect(() => {
    if (!visible) return;
    measureTarget(STEPS[step].target);
    // Re-measure on resize
    const onResize = () => measureTarget(STEPS[step].target);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [visible, step, measureTarget]);

  const dismiss = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible, dismiss]);

  const next = useCallback(() => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      dismiss();
    }
  }, [step, dismiss]);

  if (!visible) return null;

  const current = STEPS[step];

  // Tooltip position: place on the trailing edge of the target, clamp to viewport
  let tooltipTop = 0;
  let tooltipLeft = 0;
  const TOOLTIP_WIDTH = 280;
  const TOOLTIP_HEIGHT = 160; // approximate
  const GAP = 12;

  if (targetRect) {
    // Anchor vertically to the centre of the target element
    tooltipTop = targetRect.top + targetRect.height / 2 - TOOLTIP_HEIGHT / 2;
    // In LTR: place to the right of the target; in RTL: place to the left
    if (isRtl) {
      tooltipLeft = targetRect.left - TOOLTIP_WIDTH - GAP;
    } else {
      tooltipLeft = targetRect.left + targetRect.width + GAP;
    }

    // Clamp inside viewport
    tooltipTop = Math.max(
      GAP,
      Math.min(tooltipTop, window.innerHeight - TOOLTIP_HEIGHT - GAP),
    );
    tooltipLeft = Math.max(
      GAP,
      Math.min(tooltipLeft, window.innerWidth - TOOLTIP_WIDTH - GAP),
    );
  } else {
    // Fallback: bottom-end corner
    tooltipTop = window.innerHeight - TOOLTIP_HEIGHT - 24;
    tooltipLeft = isRtl ? 24 : window.innerWidth - TOOLTIP_WIDTH - 24;
  }

  return createPortal(
    <>
      {/* Dimmer overlay — semi-transparent so the UI is still readable */}
      <div
        aria-hidden
        className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-[2px]"
        style={{ transition: "opacity 250ms ease" }}
        onClick={dismiss}
      />

      {/* Spotlight ring around target */}
      {targetRect && (
        <div
          aria-hidden
          className="fixed z-[61] rounded-[var(--radius-pill)] pointer-events-none"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 8,
            boxShadow:
              "0 0 0 3px rgba(200,135,58,0.7), 0 0 0 6000px rgba(18,16,12,0.5)",
            transition: "top 250ms ease, left 250ms ease, width 250ms ease, height 250ms ease",
          }}
        />
      )}

      {/* Tooltip card */}
      <div
        ref={tooltipRef}
        role="dialog"
        aria-modal="false"
        aria-label={`Onboarding step ${step + 1} of ${STEPS.length}`}
        className="fixed z-[62] flex flex-col gap-4 glass-warm glass-highlight rounded-[var(--radius-glass)] border border-white/55 px-5 py-5"
        style={{
          top: tooltipTop,
          left: tooltipLeft,
          width: TOOLTIP_WIDTH,
          boxShadow: "var(--shadow-warm)",
          transition: "top 250ms ease, left 250ms ease, opacity 200ms ease",
        }}
      >
        {/* Step indicator */}
        <div className="flex items-center gap-1.5">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className="rounded-full transition-all duration-200"
              style={{
                width: i === step ? 18 : 6,
                height: 6,
                background:
                  i === step
                    ? "linear-gradient(90deg, #c8873a 0%, #e0a857 100%)"
                    : "rgba(200,135,58,0.25)",
              }}
            />
          ))}
        </div>

        {/* Text */}
        <div className="flex flex-col gap-1">
          <p
            className="font-display text-xl text-ink leading-tight"
            style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}
          >
            {t(current.titleKey as Parameters<typeof t>[0])}
          </p>
          <p className="text-sm leading-relaxed text-ink-mid">
            {t(current.bodyKey as Parameters<typeof t>[0])}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={dismiss}
            className="text-xs text-ink-mid hover:text-ink transition-colors"
          >
            {t("skip")}
          </button>
          <button
            type="button"
            onClick={next}
            className="smooth-fast inline-flex items-center rounded-[var(--radius-pill)] px-4 py-1.5 text-sm font-semibold text-cream"
            style={{
              background: "linear-gradient(135deg, #c8401a 0%, #9d2f0f 100%)",
              boxShadow:
                "0 4px 14px rgba(200,64,26,0.30), inset 0 1px 0 rgba(255,255,255,0.18)",
            }}
          >
            {step < STEPS.length - 1 ? t("next") : t("done")}
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
}
