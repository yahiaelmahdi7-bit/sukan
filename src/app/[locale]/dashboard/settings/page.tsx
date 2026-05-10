import { setRequestLocale, getTranslations } from "next-intl/server";
import SettingsForm from "./_settings-form";
import DangerZone from "../_components/danger-zone";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");

  return (
    <div className="px-6 py-10 max-w-2xl mx-auto">
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-dk mb-2">
          {t("title")}
        </p>
        <h1 className="font-display text-4xl text-ink">{t("settings")}</h1>
      </div>

      <div className="flex flex-col gap-8">
        {/* Notifications */}
        <SettingsForm
          locale={locale}
          labels={{
            notificationsTitle: t("notificationsTitle"),
            notificationsBody: t("notificationsBody"),
            emailOnInquiry: t("emailOnInquiry"),
            weeklyDigest: t("weeklyDigest"),
            languagePreference: t("languagePreference"),
            saveChanges: t("saveChanges"),
          }}
        />

        {/* Danger zone */}
        <DangerZone
          title={t("dangerZone")}
          description={t("dangerZoneCopy")}
          buttonLabel={t("deleteAccount")}
        />
      </div>
    </div>
  );
}
