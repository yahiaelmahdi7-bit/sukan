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
    <div className="mx-auto max-w-[720px] py-24 flex flex-col items-center text-center gap-6 px-4">
      {/* Pill */}
      <Pill variant="gold" size="sm">
        {eyebrow}
      </Pill>

      {/* Headline */}
      <h2 className="font-display text-4xl md:text-5xl text-parchment leading-tight">
        {title}
      </h2>

      {/* Subtitle */}
      <p className="text-mute-soft text-lg leading-[1.8] max-w-lg">
        {subtitle}
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 mt-2">
        {/* Primary — gold gradient */}
        <Link
          href="/listings?diaspora=true"
          className="inline-flex items-center justify-center rounded-[var(--radius-pill)] px-7 py-3 text-sm font-semibold text-earth transition-colors"
          style={{
            background: "linear-gradient(135deg, #c8873a 0%, #e0a857 100%)",
          }}
        >
          {browseCta}
        </Link>

        {/* Ghost — gold outline */}
        <Link
          href="/match"
          className="inline-flex items-center justify-center rounded-[var(--radius-pill)] border border-gold/50 px-7 py-3 text-sm font-semibold text-gold hover:border-gold hover:text-gold-bright transition-colors"
        >
          {matchCta}
        </Link>
      </div>
    </div>
  );
}
