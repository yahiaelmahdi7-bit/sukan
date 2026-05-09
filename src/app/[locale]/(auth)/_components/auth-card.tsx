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
 * Dark earth background, centred card, logo top, generous padding.
 */
export default function AuthCard({
  headline,
  subtitle,
  children,
  footer,
}: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-earth px-4 py-16">
      <div className="w-full max-w-[460px] rounded-card bg-earth-soft border border-gold/10 p-10 shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Link href="/" aria-label="Sukan home">
            <SukanMark size={56} />
          </Link>
        </div>

        {/* Headline */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl text-parchment">{headline}</h1>
          <p className="mt-2 text-sm text-mute-soft">{subtitle}</p>
        </div>

        {/* Form slot */}
        {children}

        {/* Footer slot */}
        {footer && (
          <div className="mt-8 border-t border-gold/10 pt-6 text-center text-sm text-mute-soft">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
