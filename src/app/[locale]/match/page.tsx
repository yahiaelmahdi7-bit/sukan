import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Sparkles } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AIMatchButton from "@/components/ai-match-button";

const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sukansd.com").replace(/\/$/, "");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  const title = isAr
    ? "البحث الذكي · سُكان"
    : "AI property match · Sukan";
  const description = isAr
    ? "صِف منزلك المثالي بالعربية أو الإنجليزية، ونوصلك بأنسب العقارات في السودان."
    : "Describe your ideal home in plain English or Arabic — we'll match you with the best properties in Sudan.";
  const canonicalUrl = `${SITE_URL}/${locale}/match`;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/match`,
        ar: `${SITE_URL}/ar/match`,
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonicalUrl,
      siteName: "Sukan — سُكان",
      locale: isAr ? "ar_SD" : "en_US",
    },
  };
}

export default async function MatchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";

  const eyebrow = isAr ? "البحث الذكي" : "AI match";
  const title = isAr
    ? "صِف منزلك المثالي — وسنوصلك به"
    : "Describe your ideal home — we'll match you";
  const body = isAr
    ? "أخبرنا بما تبحث عنه بلغتك الطبيعية: المدينة، الميزانية، عدد الغرف، القرب من العمل أو من العائلة. سيقترح عليك سُكان أنسب العقارات من بين الإعلانات الموثّقة."
    : "Tell us what you're looking for in your own words: city, budget, bedrooms, distance from work or family. Sukan will surface the best matches from our verified listings.";
  const cta = isAr ? "ابدأ المحادثة" : "Start the chat";

  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-cream py-24 lg:py-32">
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
              {eyebrow}
            </p>
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl mb-6">
              {title}
            </h1>
            <p className="max-w-2xl text-lg leading-[1.8] text-ink-mid mb-10">
              {body}
            </p>

            <AIMatchButton className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-terracotta px-6 py-3 text-sm font-semibold text-white shadow-md hover:brightness-[1.05]">
              <Sparkles size={16} aria-hidden />
              {cta}
            </AIMatchButton>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
