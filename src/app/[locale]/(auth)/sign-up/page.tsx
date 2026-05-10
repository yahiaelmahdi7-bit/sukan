import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import AuthCard from "../_components/auth-card";
import SignUpForm from "../_components/sign-up-form";
import OAuthButtons from "../_components/oauth-buttons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return { title: t("signUpTitle") };
}

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "auth" });

  return (
    <AuthCard
      headline={t("signUpTitle")}
      subtitle={t("signUpSubtitle")}
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
      <div className="flex flex-col gap-6">
        <OAuthButtons />

        {/* Divider */}
        <div className="flex items-center gap-3">
          <span className="flex-1 border-t border-gold/20" />
          <span className="rounded-full bg-cream px-3 py-0.5 text-xs text-ink-mid">
            {t("or")}
          </span>
          <span className="flex-1 border-t border-gold/20" />
        </div>

        <SignUpForm />
      </div>
    </AuthCard>
  );
}
