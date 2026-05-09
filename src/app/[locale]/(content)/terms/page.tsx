import { setRequestLocale, getTranslations } from "next-intl/server";
import WaveDivider from "@/components/wave-divider";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("terms");

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
            {/* Acceptance */}
            <div className="mt-12">
              <h2 className="font-display text-3xl text-parchment leading-snug">
                {t("acceptanceTitle")}
              </h2>
              <div className="mt-6 space-y-4 text-mute-soft text-base leading-[1.9]">
                <p>{t("acceptanceBody")}</p>
              </div>
            </div>

            {/* Service description */}
            <div className="mt-12">
              <h2 className="font-display text-3xl text-parchment leading-snug">
                {t("serviceTitle")}
              </h2>
              <div className="mt-6 space-y-4 text-mute-soft text-base leading-[1.9]">
                <p>{t("serviceBody")}</p>
              </div>
            </div>

            {/* User obligations */}
            <div className="mt-12">
              <h2 className="font-display text-3xl text-parchment leading-snug">
                {t("obligationsTitle")}
              </h2>
              <div className="mt-6 space-y-4 text-mute-soft text-base leading-[1.9]">
                <p>{t("obligationsBody")}</p>
              </div>
            </div>

            {/* Listings policy */}
            <div className="mt-12">
              <h2 className="font-display text-3xl text-parchment leading-snug">
                {t("listingsPolicyTitle")}
              </h2>
              <div className="mt-6 space-y-4 text-mute-soft text-base leading-[1.9]">
                <p>{t("listingsPolicyBody")}</p>
              </div>
            </div>

            {/* Payments and refunds */}
            <div className="mt-12">
              <h2 className="font-display text-3xl text-parchment leading-snug">
                {t("paymentsTitle")}
              </h2>
              <div className="mt-6 space-y-4 text-mute-soft text-base leading-[1.9]">
                <p>{t("paymentsBody")}</p>
              </div>
            </div>

            {/* Intermediary disclaimer */}
            <div className="mt-12">
              <h2 className="font-display text-3xl text-parchment leading-snug">
                {t("disclaimerTitle")}
              </h2>
              <div className="mt-6 space-y-4 text-mute-soft text-base leading-[1.9]">
                <p>{t("disclaimerBody")}</p>
              </div>
            </div>

            {/* Privacy reference */}
            <div className="mt-12">
              <h2 className="font-display text-3xl text-parchment leading-snug">
                {t("privacyRefTitle")}
              </h2>
              <div className="mt-6 space-y-4 text-mute-soft text-base leading-[1.9]">
                <p>{t("privacyRefBody")}</p>
              </div>
            </div>

            {/* Suspension / termination */}
            <div className="mt-12">
              <h2 className="font-display text-3xl text-parchment leading-snug">
                {t("terminationTitle")}
              </h2>
              <div className="mt-6 space-y-4 text-mute-soft text-base leading-[1.9]">
                <p>{t("terminationBody")}</p>
              </div>
            </div>

            {/* Disputes */}
            <div className="mt-12">
              <h2 className="font-display text-3xl text-parchment leading-snug">
                {t("disputesTitle")}
              </h2>
              <div className="mt-6 space-y-4 text-mute-soft text-base leading-[1.9]">
                <p>{t("disputesBody")}</p>
              </div>
            </div>

            {/* Governing law */}
            <div className="mt-12">
              <h2 className="font-display text-3xl text-parchment leading-snug">
                {t("governingLawTitle")}
              </h2>
              <div className="mt-6 space-y-4 text-mute-soft text-base leading-[1.9]">
                {/* TODO: Replace governing law with real jurisdiction once the legal entity (ADGM or Sudanese company) is confirmed. */}
                <p>{t("governingLawBody")}</p>
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
