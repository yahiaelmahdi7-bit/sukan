import { setRequestLocale, getTranslations } from "next-intl/server";
import ProfileForm from "./_profile-form";
import { getMockUser } from "../_data/mock-user";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");

  const user = getMockUser();

  return (
    <div className="px-6 py-10 max-w-2xl mx-auto">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-2">
          {t("title")}
        </p>
        <h1 className="font-display text-4xl text-parchment">{t("profile")}</h1>
      </div>

      <ProfileForm
        user={user}
        locale={locale}
        labels={{
          fullName: t("profile.fullName"),
          phone: t("profile.phone"),
          whatsapp: t("profile.whatsapp"),
          city: t("profile.city"),
          role: t("profile.role"),
          roleTenant: t("profile.roleTenant"),
          roleLandlord: t("profile.roleLandlord"),
          roleAgent: t("profile.roleAgent"),
          saveChanges: t("saveChanges"),
        }}
      />
    </div>
  );
}
