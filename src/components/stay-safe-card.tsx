import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import GlassPanel from "@/components/glass-panel";

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
    <GlassPanel
      variant="warm"
      radius="glass"
      highlight
      className="border border-white/55 p-6"
    >
      {/* Heading */}
      <div className="mb-5 flex items-center gap-2.5">
        <ShieldCheck
          size={20}
          className="flex-none text-gold-dk"
          strokeWidth={1.8}
          aria-hidden
        />
        <h3 className="font-display text-xl leading-tight text-ink">
          {t("title")}
        </h3>
      </div>

      {/* Tips */}
      <ul className="flex flex-col gap-3.5" role="list">
        {tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle2
              size={16}
              className="mt-0.5 flex-none text-gold-dk"
              strokeWidth={1.8}
              aria-hidden
            />
            <span className="text-sm leading-snug text-ink-soft">
              {tip}
            </span>
          </li>
        ))}
      </ul>

      {/* Report link */}
      <div className="mt-5 border-t border-sand-dk pt-4">
        <Link
          href="/contact"
          className="smooth-fast text-xs text-ink-mid hover:text-terracotta"
        >
          {t("report")}
        </Link>
      </div>
    </GlassPanel>
  );
}
