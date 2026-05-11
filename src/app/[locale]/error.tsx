"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import SukanMark from "@/components/sukan-mark";
import GlassPanel from "@/components/glass-panel";
import { GlassButton } from "@/components/ui/glass-button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations("errors");

  // Only show digest in dev — never leak raw error messages in production
  const isDev = process.env.NODE_ENV === "development";
  const detail = isDev && error.message ? error.message.slice(0, 200) : null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-32 px-4 bg-earth">
      {/* Large muted watermark behind the card */}
      <div
        className="pointer-events-none select-none absolute opacity-[0.04]"
        aria-hidden
      >
        <SukanMark size={320} monochrome="gold" />
      </div>

      <GlassPanel
        variant="deep"
        radius="glass-lg"
        highlight={false}
        shadow={false}
        className="relative z-10 flex flex-col items-center gap-6 px-8 py-12 text-center max-w-md w-full"
        style={{ boxShadow: "var(--shadow-gold-glow)" }}
      >
        {/* Brand mark */}
        <div
          className="animate-pulse opacity-60"
          style={{ animationDuration: "2.4s", animationTimingFunction: "ease-in-out" }}
        >
          <SukanMark size={56} monochrome="gold" />
        </div>

        {/* Headline */}
        <h1 className="font-display text-4xl text-parchment sm:text-5xl leading-tight">
          {t("genericTitle")}
        </h1>

        {/* Wave accent */}
        <div className="flex items-center gap-1.5 opacity-30">
          {[40, 56, 72, 56, 40].map((w, i) => (
            <div
              key={i}
              className="h-px rounded-full bg-gold"
              style={{ width: w }}
            />
          ))}
        </div>

        {/* Body */}
        <p className="max-w-xs text-sm text-mute-soft leading-relaxed">
          {t("genericBody")}
        </p>

        {/* Dev-only error excerpt */}
        {detail && (
          <pre className="w-full rounded-[var(--radius-card)] border border-gold/15 bg-earth-deep/60 px-4 py-3 text-start font-mono text-xs text-mute-soft whitespace-pre-wrap break-all">
            {detail}
          </pre>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <GlassButton variant="terracotta" size="md" onClick={reset}>
            {t("tryAgain")}
          </GlassButton>
          <Link href="/">
            <GlassButton variant="ghost-dark" size="md">
              {t("notFoundHome")}
            </GlassButton>
          </Link>
        </div>
      </GlassPanel>
    </main>
  );
}
