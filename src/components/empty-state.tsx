// TODO: i18n
import type { ReactNode } from "react";
import Link from "next/link";

interface Cta {
  label: string;
  href: string;
}

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  body: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
}

export default function EmptyState({
  icon,
  title,
  body,
  primaryCta,
  secondaryCta,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div
        className="relative overflow-hidden glass-warm glass-highlight flex flex-col items-center gap-6 px-10 py-12 text-center w-full max-w-[480px]"
        style={{
          borderRadius: "var(--radius-glass)",
          boxShadow: "var(--shadow-warm)",
          border: "1px solid rgba(255,255,255,0.55)",
        }}
      >
        {/* Gold-tinted icon container */}
        <div
          className="flex items-center justify-center shrink-0"
          style={{
            width: 52,
            height: 52,
            borderRadius: "var(--radius-glass)",
            background:
              "linear-gradient(135deg, rgba(200,135,58,0.18) 0%, rgba(200,135,58,0.08) 100%)",
            border: "1px solid rgba(200,135,58,0.25)",
            color: "#C8873A",
          }}
          aria-hidden
        >
          {icon}
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2">
          <h2
            className="font-display text-2xl text-ink"
            style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}
          >
            {title}
          </h2>
          <p className="text-sm leading-relaxed text-ink-mid max-w-xs mx-auto">
            {body}
          </p>
        </div>

        {/* CTAs */}
        {(primaryCta || secondaryCta) && (
          <div className="flex flex-wrap items-center justify-center gap-3 mt-1">
            {primaryCta && (
              <Link
                href={primaryCta.href}
                className="smooth inline-flex items-center justify-center rounded-[var(--radius-pill)] px-6 py-2.5 text-sm font-semibold text-cream"
                style={{
                  background: "linear-gradient(135deg, #c8401a 0%, #9d2f0f 100%)",
                  boxShadow:
                    "0 8px 22px rgba(200,64,26,0.28), inset 0 1px 0 rgba(255,255,255,0.18)",
                }}
              >
                {primaryCta.label}
              </Link>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="smooth inline-flex items-center justify-center rounded-[var(--radius-pill)] border border-gold/40 bg-white/45 px-6 py-2.5 text-sm font-semibold text-gold-dk hover:border-gold/70 hover:bg-gold/10 hover:text-terracotta backdrop-blur-md"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
