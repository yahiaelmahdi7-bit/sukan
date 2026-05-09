import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/**
 * StaySafeCard — trust / safety tips shown on every listing detail page.
 * Server Component. Bilingual via next-intl getTranslations.
 */
export default async function StaySafeCard() {
  const t = await getTranslations("safety");

  const tips = [
    t("tip1"),
    t("tip2"),
    t("tip3"),
    t("tip4"),
  ] as const;

  return (
    <div className="rounded-[var(--radius-card)] bg-gold/[0.08] border border-gold/25 p-6">
      {/* Heading */}
      <div className="flex items-center gap-2.5 mb-5">
        <ShieldCheck
          size={20}
          className="text-gold flex-none"
          strokeWidth={1.8}
          aria-hidden
        />
        <h3 className="font-display text-xl text-parchment leading-tight">
          {t("title")}
        </h3>
      </div>

      {/* Tips */}
      <ul className="flex flex-col gap-3.5" role="list">
        {tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle2
              size={16}
              className="text-gold flex-none mt-0.5"
              strokeWidth={1.8}
              aria-hidden
            />
            <span className="text-sm text-parchment/85 leading-snug">
              {tip}
            </span>
          </li>
        ))}
      </ul>

      {/* Report link */}
      <div className="mt-5 pt-4 border-t border-gold/15">
        <Link
          href="/contact"
          className="text-xs text-mute-soft hover:text-gold transition-colors"
        >
          {t("report")}
        </Link>
      </div>
    </div>
  );
}
