import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import AuthCard from "../_components/auth-card";
import ForgotPasswordForm from "../_components/forgot-password-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return { title: t("forgotPasswordTitle") };
}

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "auth" });

  return (
    <AuthCard
      headline={t("forgotPasswordTitle")}
      subtitle={t("forgotPasswordSubtitle")}
      footer={
        <>
          {t("haveAccount")}{" "}
          <Link
            href="/sign-in"
            className="font-medium text-terracotta transition hover:text-terracotta-deep"
          >
            {t("signIn")}
          </Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
