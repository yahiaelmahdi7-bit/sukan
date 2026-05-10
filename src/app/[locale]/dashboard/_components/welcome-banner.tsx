// Server Component
import { Link } from "@/i18n/navigation";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import GlassPanel from "@/components/glass-panel";
import type { OverviewData } from "../_data/overview";

interface WelcomeBannerProps {
  data: Pick<
    OverviewData,
    "firstName" | "lastSeenDaysAgo" | "newInquiriesCount" | "isVerified"
  >;
  locale: string;
  labels: {
    greeting: string;
    sinceLastVisit: string;
    weekAtGlance: string;
    newInquiries: string;
    verified: string;
    pendingVerification: string;
    verifyNow: string;
  };
}

export default function WelcomeBanner({ data, locale, labels }: WelcomeBannerProps) {
  const { firstName, lastSeenDaysAgo, newInquiriesCount, isVerified } = data;

  let subLine: string;
  if (lastSeenDaysAgo === null) {
    subLine = labels.weekAtGlance;
  } else if (lastSeenDaysAgo === 0) {
    subLine = labels.sinceLastVisit.replace("{when}", locale === "ar" ? "اليوم" : "today");
  } else {
    const when =
      locale === "ar"
        ? `${lastSeenDaysAgo} أيام`
        : lastSeenDaysAgo === 1
        ? "yesterday"
        : `${lastSeenDaysAgo} days ago`;
    subLine = labels.sinceLastVisit.replace("{when}", when);
  }

  return (
    <GlassPanel
      variant="warm"
      radius="glass"
      highlight
      shadow="lg"
      className="p-7 md:p-9"
    >
      {/* Subtle background watermark arc */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      >
        <div
          className="absolute -top-10 -end-16 h-56 w-56 rounded-full opacity-[0.07]"
          style={{
            background:
              "radial-gradient(circle, #C8401A 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: greeting + sub-line */}
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-dk">
            {locale === "ar" ? "لوحة التحكم" : "Dashboard"}
          </p>
          <h1 className="font-display text-3xl md:text-4xl text-ink leading-tight">
            {labels.greeting.replace("{firstName}", firstName)}
          </h1>
          <p className="text-sm text-ink-mid leading-relaxed">{subLine}</p>

          {/* New-inquiries pill */}
          {newInquiriesCount > 0 && (
            <Link
              href="/dashboard/inquiries"
              className="smooth self-start mt-1 inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-3.5 py-1 text-xs font-semibold text-cream"
              style={{
                background: "linear-gradient(135deg, #c8401a 0%, #9d2f0f 100%)",
                boxShadow:
                  "0 4px 14px rgba(200,64,26,0.28), inset 0 1px 0 rgba(255,255,255,0.18)",
              }}
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-400"
                aria-hidden
              />
              {labels.newInquiries.replace("{n}", String(newInquiriesCount))}
            </Link>
          )}
        </div>

        {/* Right: verification status */}
        <div className="flex items-center gap-2 rounded-[var(--radius-pill)] border border-white/50 bg-white/40 px-4 py-2 backdrop-blur-sm self-start shrink-0">
          {isVerified ? (
            <>
              <CheckCircle size={14} className="text-green-600 shrink-0" />
              <span className="text-xs font-medium text-green-700">
                {labels.verified}
              </span>
            </>
          ) : (
            <>
              <AlertCircle size={14} className="text-amber-500 shrink-0" />
              <Link
                href="/dashboard/profile"
                className="smooth text-xs font-medium text-amber-700 hover:text-terracotta"
              >
                {labels.pendingVerification}
              </Link>
            </>
          )}
        </div>
      </div>
    </GlassPanel>
  );
}
