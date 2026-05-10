"use client";

import { useEffect, useState, useCallback } from "react";
import { useLocale } from "next-intl";
import {
  Home,
  Heart,
  MessageCircle,
  Sparkles,
  Globe,
  MapPin,
  ShieldCheck,
  X,
} from "lucide-react";

interface ActivityItem {
  icon: React.ReactNode;
  iconBg: string;
  en: { primary: string; secondary: string };
  ar: { primary: string; secondary: string };
}

const ACTIVITIES: ActivityItem[] = [
  {
    icon: <Home size={16} strokeWidth={1.8} />,
    iconBg: "rgba(200,64,26,0.12)",
    en: { primary: "New villa just listed in Khartoum 2", secondary: "2 minutes ago" },
    ar: { primary: "فيلا جديدة في الخرطوم ٢", secondary: "منذ ٢ دقيقتين" },
  },
  {
    icon: <Heart size={16} strokeWidth={1.8} />,
    iconBg: "rgba(200,135,58,0.14)",
    en: { primary: "Someone in Toronto saved a 3BR in Bahri", secondary: "5 minutes ago" },
    ar: { primary: "شخص في تورنتو حفظ شقة من ٣ غرف في بحري", secondary: "منذ ٥ دقائق" },
  },
  {
    icon: <MessageCircle size={16} strokeWidth={1.8} />,
    iconBg: "rgba(200,64,26,0.10)",
    en: { primary: "Mohammed asked about a property in Omdurman", secondary: "8 minutes ago" },
    ar: { primary: "محمد سأل عن عقار في أم درمان", secondary: "منذ ٨ دقائق" },
  },
  {
    icon: <Sparkles size={16} strokeWidth={1.8} />,
    iconBg: "rgba(200,135,58,0.16)",
    en: { primary: "Price reduced on a Khartoum 3 apartment", secondary: "12 minutes ago" },
    ar: { primary: "تم تخفيض سعر شقة في الخرطوم ٣", secondary: "منذ ١٢ دقيقة" },
  },
  {
    icon: <Globe size={16} strokeWidth={1.8} />,
    iconBg: "rgba(200,64,26,0.10)",
    en: { primary: "New diaspora user joined from London", secondary: "15 minutes ago" },
    ar: { primary: "مستخدم جديد من المهجر انضم من لندن", secondary: "منذ ١٥ دقيقة" },
  },
  {
    icon: <MapPin size={16} strokeWidth={1.8} />,
    iconBg: "rgba(200,135,58,0.14)",
    en: { primary: "3 new listings posted in Wad Madani this week", secondary: "1 hour ago" },
    ar: { primary: "٣ عقارات جديدة في ودمدني هذا الأسبوع", secondary: "منذ ساعة واحدة" },
  },
  {
    icon: <ShieldCheck size={16} strokeWidth={1.8} />,
    iconBg: "rgba(200,64,26,0.10)",
    en: { primary: "Verified landlord added in Port Sudan", secondary: "2 hours ago" },
    ar: { primary: "مالك موثّق جديد في بورتسودان", secondary: "منذ ساعتين" },
  },
  {
    icon: <Home size={16} strokeWidth={1.8} />,
    iconBg: "rgba(200,135,58,0.14)",
    en: { primary: "Featured villa listed in Khartoum Amarat", secondary: "2 hours ago" },
    ar: { primary: "فيلا مميزة في الخرطوم العمارات", secondary: "منذ ساعتين" },
  },
  {
    icon: <Heart size={16} strokeWidth={1.8} />,
    iconBg: "rgba(200,64,26,0.12)",
    en: { primary: "Sara from Dubai saved a Kassala studio", secondary: "3 hours ago" },
    ar: { primary: "سارة من دبي حفظت استوديو في كسلا", secondary: "منذ ٣ ساعات" },
  },
  {
    icon: <MapPin size={16} strokeWidth={1.8} />,
    iconBg: "rgba(200,135,58,0.14)",
    en: { primary: "5 minutes ago someone messaged a Bahri landlord", secondary: "4 hours ago" },
    ar: { primary: "قبل ٥ دقائق راسل شخص مالكاً في بحري", secondary: "منذ ٤ ساعات" },
  },
];

const ROTATION_MS = 4500;
const SESSION_KEY = "sukan-ticker-dismissed";

export default function ActivityTicker() {
  const locale = useLocale();
  const isAr = locale === "ar";

  const [dismissed, setDismissed] = useState(true); // start hidden; hydrate below
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true); // controls opacity for fade

  // Hydrate after mount — avoids SSR/session-storage mismatch
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDismissed = sessionStorage.getItem(SESSION_KEY) === "1";
      setDismissed(isDismissed);
    }
  }, []);

  const handleDismiss = useCallback(() => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setDismissed(true);
  }, []);

  // Rotate items with a fade-out → swap → fade-in cycle
  useEffect(() => {
    if (dismissed) return;

    const timer = setInterval(() => {
      // Fade out
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % ACTIVITIES.length);
        // Fade back in
        setVisible(true);
      }, 280); // duration of fade-out
    }, ROTATION_MS);

    return () => clearInterval(timer);
  }, [dismissed]);

  if (dismissed) return null;

  const item = ACTIVITIES[index];
  const { primary, secondary } = isAr ? item.ar : item.en;

  return (
    <>
      <style>{`
        .ticker-card {
          background: rgba(253, 248, 240, 0.82);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: var(--shadow-warm, 0 4px 24px rgba(18,16,12,0.10));
          border: 1px solid rgba(200,135,58,0.18);
        }
        .ticker-item {
          transition: opacity 280ms cubic-bezier(0.16,1,0.3,1),
                      transform 280ms cubic-bezier(0.16,1,0.3,1);
        }
        .ticker-item-hidden {
          opacity: 0;
          transform: translateY(6px);
        }
        .ticker-item-visible {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-item {
            transition: none !important;
          }
        }
      `}</style>

      <div
        role="status"
        aria-live="polite"
        aria-label={isAr ? "نشاط السوق المباشر" : "Live marketplace activity"}
        className="ticker-card fixed bottom-6 left-6 rtl:right-6 rtl:left-auto z-50 w-[min(360px,calc(100vw-3rem))] rounded-[var(--radius-glass,22px)] p-3.5"
        dir={isAr ? "rtl" : "ltr"}
      >
        {/* Dismiss button — always sits at the logical end (right in LTR, left in RTL) */}
        <button
          onClick={handleDismiss}
          aria-label={isAr ? "إغلاق تغذية النشاط" : "Dismiss activity feed"}
          className="absolute end-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full text-[#12100C]/40 transition-colors hover:bg-[#12100C]/8 hover:text-[#12100C]/70"
        >
          <X size={11} strokeWidth={2.5} />
        </button>

        {/* Content */}
        <div
          className={`ticker-item pe-5 ${visible ? "ticker-item-visible" : "ticker-item-hidden"}`}
        >
          <div className="flex items-start gap-3">
            {/* Icon bubble */}
            <span
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{ background: item.iconBg, color: "#C8401A" }}
              aria-hidden
            >
              {item.icon}
            </span>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium leading-snug text-[#12100C]">
                {primary}
              </p>
              <p className="mt-0.5 text-[11px] leading-none text-[#12100C]/50">
                {secondary}
              </p>
            </div>
          </div>
        </div>

        {/* Progress dots */}
        <div className="mt-2.5 flex justify-center gap-1" aria-hidden>
          {ACTIVITIES.map((_, i) => (
            <span
              key={i}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: i === index ? "16px" : "4px",
                background:
                  i === index ? "#C8401A" : "rgba(18,16,12,0.15)",
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
