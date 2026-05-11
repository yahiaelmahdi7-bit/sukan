// Server Component — renders a static anchor tag, no client interactivity needed.
// Uses next-intl getTranslations() (server-side) instead of useTranslations().
import { MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";

interface WhatsAppCtaProps {
  /**
   * E.164 phone number, e.g. "+249912345678".
   * Falls back to a placeholder if omitted.
   * TODO: remove default once all listings have verified owner phones.
   */
  phone?: string;
  listingTitle: string;
  /** Absolute URL of the listing page, e.g. https://sukan.app/en/listings/abc */
  listingUrl: string;
  locale: "en" | "ar";
  className?: string;
}

/** Strip everything except digits from a phone string for wa.me links. */
function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, "");
}

export async function WhatsAppCta({
  phone = "+249912345678", // TODO: wire to real owner phone from DB
  listingTitle,
  listingUrl,
  locale: _locale,
  className = "",
}: WhatsAppCtaProps) {
  const t = await getTranslations("whatsapp");
  const label = t("cta");
  const message = t("message", { title: listingTitle, url: listingUrl });

  const href = `https://wa.me/${digitsOnly(phone)}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        "smooth flex items-center justify-center gap-2",
        "rounded-[var(--radius-pill)] px-6 py-3",
        "text-sm font-semibold text-white",
        "hover:brightness-[1.05]",
        "transition-[filter]",
        className,
      ].join(" ")}
      style={{
        background: "linear-gradient(135deg, #25d366 0%, #1eb558 100%)",
        boxShadow:
          "0 8px 22px rgba(37, 211, 102, 0.30), inset 0 1px 0 rgba(255,255,255,0.22)",
      }}
      aria-label={label}
    >
      <MessageCircle size={16} strokeWidth={2} aria-hidden className="flex-none" />
      {label}
    </a>
  );
}
