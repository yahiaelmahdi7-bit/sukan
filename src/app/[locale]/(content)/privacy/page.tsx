import { setRequestLocale, getTranslations } from "next-intl/server";
import WaveDivider from "@/components/wave-divider";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("privacy");

  return (
    <>
      <section className="bg-earth py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-mute-soft mb-8 uppercase tracking-widest">
            {t("lastUpdated", { date: "2026-05-10" })}
          </p>

          <h1 className="font-display text-5xl md:text-6xl text-parchment leading-tight mb-16">
            {t("title")}
          </h1>

          <WaveDivider intensity="subtle" />

          <div className="mt-12 space-y-2">
            {/* Introduction */}
            <div className="mt-12">
              <h2 className="font-display text-3xl text-parchment leading-snug">
                {t("introTitle")}
              </h2>
              <div className="mt-6 space-y-4 text-mute-soft text-base leading-[1.9]">
                <p>{t("introBody")}</p>
              </div>
            </div>

            {/* What we collect */}
            <div className="mt-12">
              <h2 className="font-display text-3xl text-parchment leading-snug">
                {t("collectTitle")}
              </h2>
              <div className="mt-6 space-y-4 text-mute-soft text-base leading-[1.9]">
                <p>{t("collectBody")}</p>
              </div>
            </div>

            {/* How we use it */}
            <div className="mt-12">
              <h2 className="font-display text-3xl text-parchment leading-snug">
                {t("useTitle")}
              </h2>
              <div className="mt-6 space-y-4 text-mute-soft text-base leading-[1.9]">
                <p>{t("useBody")}</p>
              </div>
            </div>

            {/* Sharing */}
            <div className="mt-12">
              <h2 className="font-display text-3xl text-parchment leading-snug">
                {t("sharingTitle")}
              </h2>
              <div className="mt-6 space-y-4 text-mute-soft text-base leading-[1.9]">
                <p>{t("sharingBody")}</p>
              </div>
            </div>

            {/* Storage and retention */}
            <div className="mt-12">
              <h2 className="font-display text-3xl text-parchment leading-snug">
                {t("retentionTitle")}
              </h2>
              <div className="mt-6 space-y-4 text-mute-soft text-base leading-[1.9]">
                <p>{t("retentionBody")}</p>
              </div>
            </div>

            {/* Your rights */}
            <div className="mt-12">
              <h2 className="font-display text-3xl text-parchment leading-snug">
                {t("rightsTitle")}
              </h2>
              <div className="mt-6 space-y-4 text-mute-soft text-base leading-[1.9]">
                <p>{t("rightsBody")}</p>
              </div>
            </div>

            {/* Cookies */}
            <div className="mt-12">
              <h2 className="font-display text-3xl text-parchment leading-snug">
                {t("cookiesTitle")}
              </h2>
              <div className="mt-6 space-y-4 text-mute-soft text-base leading-[1.9]">
                <p>{t("cookiesBody")}</p>
              </div>
            </div>

            {/* Changes */}
            <div className="mt-12">
              <h2 className="font-display text-3xl text-parchment leading-snug">
                {t("changesTitle")}
              </h2>
              <div className="mt-6 space-y-4 text-mute-soft text-base leading-[1.9]">
                <p>{t("changesBody")}</p>
              </div>
            </div>

            {/* Contact */}
            <div className="mt-12">
              <h2 className="font-display text-3xl text-parchment leading-snug">
                {t("contactTitle")}
              </h2>
              <div className="mt-6 space-y-4 text-mute-soft text-base leading-[1.9]">
                <p>{t("contactBody")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
