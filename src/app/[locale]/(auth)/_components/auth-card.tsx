import GlassPanel from "@/components/glass-panel";
import SukanMark from "@/components/sukan-mark";
import { Link } from "@/i18n/navigation";

interface AuthCardProps {
  headline: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Reusable server-component card shell for all auth pages.
 * Cream atmosphere background, centred glass-warm card, logo top, generous padding.
 */
export default function AuthCard({
  headline,
  subtitle,
  children,
  footer,
}: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent px-4 py-16">
      {/* Local gold haze behind the card */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 42%, rgba(200,135,58,0.10) 0%, transparent 72%)",
        }}
      />

      <GlassPanel
        variant="warm"
        radius="glass-lg"
        shadow="lg"
        highlight
        className="w-full max-w-[460px] p-10"
      >
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Link href="/" aria-label="Sukan home">
            <SukanMark size={52} />
          </Link>
        </div>

        {/* Headline */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-normal text-ink">
            {headline}
          </h1>
          <p className="mt-2 text-sm text-ink-mid">{subtitle}</p>
        </div>

        {/* Form slot */}
        {children}

        {/* Footer slot */}
        {footer && (
          <div className="mt-8 border-t border-gold/20 pt-6 text-center text-sm text-ink-mid">
            {footer}
          </div>
        )}
      </GlassPanel>
    </div>
  );
}
