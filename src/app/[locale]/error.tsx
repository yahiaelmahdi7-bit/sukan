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

  const excerpt = error.message
    ? error.message.slice(0, 200)
    : "Unknown error";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-32 px-4 bg-earth">
      <GlassPanel
        variant="deep"
        radius="glass-lg"
        highlight={false}
        shadow={false}
        className="flex flex-col items-center gap-6 px-8 py-12 text-center max-w-md w-full"
        style={{ boxShadow: "var(--shadow-gold-glow)" }}
      >
        {/* Brand mark */}
        <div className="opacity-50">
          <SukanMark size={64} monochrome="gold" />
        </div>

        {/* Headline */}
        <h1 className="font-display text-4xl text-parchment sm:text-5xl">
          {t("genericTitle")}
        </h1>

        {/* Body */}
        <p className="max-w-xs text-sm text-mute-soft leading-relaxed">
          {t("genericBody")}
        </p>

        {/* Error excerpt */}
        {excerpt && (
          <pre className="w-full rounded-[var(--radius-card)] border border-gold/15 bg-earth-deep/60 px-4 py-3 text-start font-mono text-xs text-mute-soft whitespace-pre-wrap break-all">
            {excerpt}
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
