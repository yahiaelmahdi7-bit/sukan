// Server Component
import { Link } from "@/i18n/navigation";
import Pill from "@/components/pill";

export interface DiasporaCalloutProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  browseCta: string;
  matchCta: string;
}

export default function DiasporaCallout({
  eyebrow,
  title,
  subtitle,
  browseCta,
  matchCta,
}: DiasporaCalloutProps) {
  return (
    <div className="py-20">
      <div
        className="glass-warm glass-highlight relative mx-auto flex max-w-3xl flex-col items-center gap-6 overflow-hidden rounded-[var(--radius-glass-lg)] border border-white/60 px-6 py-16 text-center sm:px-12"
        style={{ boxShadow: "var(--shadow-warm-lg)" }}
      >
        {/* Soft inner gold halo */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(224,168,87,0.32), transparent 70%)",
          }}
        />

        {/* Pill */}
        <Pill variant="gold" size="sm">
          {eyebrow}
        </Pill>

        {/* Headline */}
        <h2 className="font-display text-4xl leading-[1.08] tracking-tight text-ink md:text-5xl">
          {title}
        </h2>

        {/* Subtitle */}
        <p className="max-w-lg text-base leading-[1.8] text-ink-mid sm:text-lg">
          {subtitle}
        </p>

        {/* CTAs */}
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:gap-4">
          {/* Primary — gold gradient */}
          <Link
            href="/listings?diaspora=true"
            className="smooth inline-flex items-center justify-center rounded-[var(--radius-pill)] px-7 py-3 text-sm font-semibold text-earth hover:brightness-[1.05]"
            style={{
              background:
                "linear-gradient(135deg, #c8873a 0%, #e0a857 100%)",
              boxShadow:
                "0 8px 24px rgba(200, 135, 58, 0.32), inset 0 1px 0 rgba(255,255,255,0.35)",
            }}
          >
            {browseCta}
          </Link>

          {/* Ghost — glass outline */}
          <Link
            href="/match"
            className="smooth inline-flex items-center justify-center rounded-[var(--radius-pill)] border border-gold/40 bg-white/45 px-7 py-3 text-sm font-semibold text-gold-dk backdrop-blur-md hover:border-gold/70 hover:bg-gold/10 hover:text-gold-dk"
          >
            {matchCta}
          </Link>
        </div>
      </div>
    </div>
  );
}
