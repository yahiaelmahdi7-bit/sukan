// Server Component
import { ShieldCheck, MapPin, TrendingUp, MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import GlassPanel from "@/components/glass-panel";

export interface DiasporaTrustStripProps {
  locale: string;
}

export default async function DiasporaTrustStrip({ locale }: DiasporaTrustStripProps) {
  const t = await getTranslations("diasporaPage2");

  type Pillar = {
    icon: React.ReactNode;
    title: string;
    body: string;
    linkHref?: string;
    linkLabel?: string;
  };

  const PILLARS: Pillar[] = [
    {
      icon: <ShieldCheck size={32} strokeWidth={1.5} />,
      title: t("trustVerifiedTitle"),
      body: t("trustVerifiedBody"),
      linkHref: "/agents",
      linkLabel: t("trustVerifiedLink"),
    },
    {
      icon: <MapPin size={32} strokeWidth={1.5} />,
      title: t("trustGuidesTitle"),
      body: t("trustGuidesBody"),
      linkHref: "/guides",
      linkLabel: t("trustGuidesLink"),
    },
    {
      icon: <TrendingUp size={32} strokeWidth={1.5} />,
      title: t("trustInsightsTitle"),
      body: t("trustInsightsBody"),
      linkHref: "/insights",
      linkLabel: t("trustInsightsLink"),
    },
    {
      icon: <MessageCircle size={32} strokeWidth={1.5} />,
      title: t("trustWhatsappTitle"),
      body: t("trustWhatsappBody"),
      // No link — pure trust signal
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {PILLARS.map((pillar, idx) => (
        <GlassPanel
          key={idx}
          variant="warm"
          radius="glass"
          shadow
          className="smooth lift flex flex-col gap-4 p-7"
        >
          {/* Icon circle */}
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-gold-dk"
            style={{ background: "rgba(200,135,58,0.12)" }}
          >
            {pillar.icon}
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-display text-lg font-semibold leading-snug text-ink">
              {pillar.title}
            </h3>
            <p className="text-sm leading-relaxed text-ink-mid">{pillar.body}</p>
          </div>

          {pillar.linkHref && pillar.linkLabel && (
            <Link
              href={pillar.linkHref as never}
              className="mt-auto text-sm font-semibold text-terracotta transition-colors hover:text-terracotta-deep"
            >
              {pillar.linkLabel}
            </Link>
          )}
        </GlassPanel>
      ))}
    </div>
  );
}
