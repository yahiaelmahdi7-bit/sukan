import { setRequestLocale, getTranslations } from "next-intl/server";
import AuthCard from "../_components/auth-card";
import ResetPasswordForm from "../_components/reset-password-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return { title: t("resetPasswordTitle") };
}

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "auth" });

  return (
    <AuthCard
      headline={t("resetPasswordTitle")}
      subtitle={t("resetPasswordSubtitle")}
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
