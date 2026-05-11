import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import GlassPanel from "@/components/glass-panel";
import { MessageCircle, Mail, Send, MapPin, Briefcase } from "lucide-react";

const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sukansd.com").replace(/\/$/, "");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  const title = isAr ? "تواصل معنا · سوكان" : "Contact Us · Sukan";
  const description = isAr
    ? "تواصل مع فريق سوكان عبر واتساب أو البريد الإلكتروني أو تيليغرام"
    : "Get in touch with the Sukan team via WhatsApp, email, or Telegram";
  const canonicalUrl = `${SITE_URL}/${locale}/contact`;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/contact`,
        ar: `${SITE_URL}/ar/contact`,
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonicalUrl,
      siteName: "Sukan — سوكان",
      locale: isAr ? "ar_SD" : "en_US",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("contact");

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-cream py-24 lg:py-32">
        {/* Warm gold halo */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 end-0 h-[560px] w-[560px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at 70% 30%, rgba(200,135,58,0.13) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold-dk">
            {t("eyebrow")}
          </p>
          <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl mb-6">
            {t("title")}
          </h1>
          <p className="max-w-2xl text-lg leading-[1.8] text-ink-mid">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* ─── Contact methods ─── */}
      <section className="bg-cream-deep py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* WhatsApp */}
            <GlassPanel
              variant="warm"
              radius="glass"
              shadow
              className="smooth lift relative flex flex-col gap-5 overflow-hidden p-8"
            >
              <span
                aria-hidden
                className="absolute top-3 end-4 font-display text-7xl text-gold/10 leading-none font-bold select-none"
              >
                01
              </span>
              <div className="flex h-11 w-11 items-center justify-center text-gold-dk">
                <MessageCircle size={40} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl font-semibold text-ink">
                {t("whatsappTitle")}
              </h3>
              <p className="flex-1 text-sm leading-relaxed text-ink-mid">
                {t("whatsappBody")}
              </p>
              <a
                href="https://wa.me/249912345678"
                target="_blank"
                rel="noopener noreferrer"
                className="smooth inline-flex w-fit items-center gap-2 rounded-[var(--radius-pill)] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-[1.08]"
                style={{ backgroundColor: "#25d366" }}
              >
                <MessageCircle size={14} aria-hidden />
                {t("whatsappCta")}
              </a>
            </GlassPanel>

            {/* Email */}
            <GlassPanel
              variant="warm"
              radius="glass"
              shadow
              className="smooth lift relative flex flex-col gap-5 overflow-hidden p-8"
            >
              <span
                aria-hidden
                className="absolute top-3 end-4 font-display text-7xl text-gold/10 leading-none font-bold select-none"
              >
                02
              </span>
              <div className="flex h-11 w-11 items-center justify-center text-gold-dk">
                <Mail size={40} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl font-semibold text-ink">
                {t("emailTitle")}
              </h3>
              <p className="flex-1 text-sm leading-relaxed text-ink-mid">
                {t("emailBody")}
              </p>
              <a
                href="mailto:hello@sukansd.com"
                className="smooth inline-flex w-fit items-center gap-2 rounded-[var(--radius-pill)] border border-gold/40 bg-white/45 px-5 py-2.5 text-sm font-semibold text-gold-dk backdrop-blur-md hover:border-gold/70 hover:bg-gold/10"
              >
                <Mail size={14} aria-hidden />
                {t("emailCta")}
              </a>
            </GlassPanel>

            {/* Telegram */}
            <GlassPanel
              variant="warm"
              radius="glass"
              shadow
              className="smooth lift relative flex flex-col gap-5 overflow-hidden p-8"
            >
              <span
                aria-hidden
                className="absolute top-3 end-4 font-display text-7xl text-gold/10 leading-none font-bold select-none"
              >
                03
              </span>
              <div className="flex h-11 w-11 items-center justify-center text-gold-dk">
                <Send size={40} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl font-semibold text-ink">
                {t("telegramTitle")}
              </h3>
              <p className="flex-1 text-sm leading-relaxed text-ink-mid">
                {t("telegramBody")}
              </p>
              <span className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-pill)] border border-gold/20 bg-white/30 px-5 py-2.5 text-sm font-semibold text-ink-mid cursor-default">
                <Send size={14} aria-hidden />
                {t("telegramCta")}
              </span>
            </GlassPanel>
          </div>
        </div>
      </section>

      {/* ─── We're hiring ─── */}
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <GlassPanel variant="warm" radius="glass" shadow className="p-10 md:p-12">
            <div className="mb-6 flex items-start gap-5">
              <Briefcase
                size={32}
                className="mt-1 shrink-0 text-gold-dk"
                strokeWidth={1.5}
              />
              <h2 className="font-display text-3xl leading-tight text-ink md:text-4xl">
                {t("hiringTitle")}
              </h2>
            </div>
            <p className="text-base leading-[1.9] text-ink-mid">
              {t("hiringBody")}
            </p>
          </GlassPanel>
        </div>
      </section>

      {/* ─── Office address ─── */}
      <section className="bg-cream-deep py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <GlassPanel variant="warm" radius="glass" shadow className="p-10 md:p-12">
            <div className="mb-6 flex items-start gap-5">
              <MapPin
                size={32}
                className="mt-1 shrink-0 text-gold-dk"
                strokeWidth={1.5}
              />
              <h2 className="font-display text-3xl leading-tight text-ink md:text-4xl">
                {t("officeTitle")}
              </h2>
            </div>
            <p className="text-base leading-[1.9] text-ink-mid">
              {t("officeBody")}
            </p>
          </GlassPanel>
        </div>
      </section>
    </>
  );
}
