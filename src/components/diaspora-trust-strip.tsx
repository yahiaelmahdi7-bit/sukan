// Server Component
// TODO: i18n — all strings are currently hardcoded EN/AR inline
import { ShieldCheck, MapPin, TrendingUp, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import GlassPanel from "@/components/glass-panel";

export interface DiasporaTrustStripProps {
  locale: string;
}

type Pillar = {
  icon: React.ReactNode;
  titleEn: string;
  titleAr: string;
  bodyEn: string;
  bodyAr: string;
  linkHref?: string;
  linkLabelEn?: string;
  linkLabelAr?: string;
};

const PILLARS: Pillar[] = [
  {
    icon: <ShieldCheck size={32} strokeWidth={1.5} />,
    titleEn: "Verified agents",
    titleAr: "وكلاء موثَّقون",
    bodyEn:
      "Every agent and landlord in our directory is identity-checked. Browse the network and reach out directly.",
    bodyAr:
      "كل وكيل ومالك في دليلنا خضع للتحقق من هويته. تصفح الشبكة وتواصل مباشرة.",
    linkHref: "/agents",
    linkLabelEn: "Browse agents →",
    linkLabelAr: "تصفح الوكلاء →",
  },
  {
    icon: <MapPin size={32} strokeWidth={1.5} />,
    titleEn: "Neighborhood guides",
    titleAr: "أدلة الأحياء",
    bodyEn:
      "8 honest guides covering power, water, diaspora favorites, and typical rents — written by people who live there.",
    bodyAr:
      "٨ أدلة صادقة تغطي الكهرباء والمياه والأحياء المفضلة للمغتربين وأسعار الإيجار المعتادة.",
    linkHref: "/guides",
    linkLabelEn: "Read the guides →",
    linkLabelAr: "اقرأ الأدلة →",
  },
  {
    icon: <TrendingUp size={32} strokeWidth={1.5} />,
    titleEn: "Market reports",
    titleAr: "تقارير السوق",
    bodyEn:
      "Quarterly rental and sale market reports. Most recent: \"Khartoum rentals Q1 2026.\" No paywalls.",
    bodyAr:
      "تقارير ربع سنوية لسوقَي الإيجار والبيع. الأحدث: «إيجارات الخرطوم — الربع الأول ٢٠٢٦». مجانية.",
    linkHref: "/insights",
    linkLabelEn: "Read insights →",
    linkLabelAr: "اقرأ التحليلات →",
  },
  {
    icon: <MessageCircle size={32} strokeWidth={1.5} />,
    titleEn: "WhatsApp-first contact",
    titleAr: "تواصل عبر واتساب أولاً",
    bodyEn:
      "Every listing has a WhatsApp deep-link. Reach landlords in the channel they actually answer.",
    bodyAr:
      "كل إعلان يحتوي على رابط واتساب مباشر. تواصل مع الملاك عبر القناة التي يردون فيها فعلاً.",
    // No link — pure trust signal
  },
];

export default function DiasporaTrustStrip({ locale }: DiasporaTrustStripProps) {
  const isAr = locale === "ar";

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {PILLARS.map((pillar, idx) => {
        const title = isAr ? pillar.titleAr : pillar.titleEn;
        const body = isAr ? pillar.bodyAr : pillar.bodyEn;
        const linkLabel = isAr ? pillar.linkLabelAr : pillar.linkLabelEn;

        return (
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
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-ink-mid">{body}</p>
            </div>

            {pillar.linkHref && linkLabel && (
              <Link
                href={pillar.linkHref as never}
                className="mt-auto text-sm font-semibold text-terracotta transition-colors hover:text-terracotta-deep"
              >
                {linkLabel}
              </Link>
            )}
          </GlassPanel>
        );
      })}
    </div>
  );
}
