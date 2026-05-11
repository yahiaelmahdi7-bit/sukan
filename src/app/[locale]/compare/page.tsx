import type { Metadata } from "next";
import CompareClient from "./_components/compare-client";

const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sukansd.com").replace(/\/$/, "");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  return {
    title: isAr ? "مقارنة العقارات · سوكان" : "Compare Properties · Sukan",
    description: isAr
      ? "قارن بين العقارات جنباً إلى جنب"
      : "Compare properties side by side",
    // noindex — page is pure client state, has no SEO value
    robots: { index: false, follow: true },
    alternates: {
      canonical: `${SITE_URL}/${locale}/compare`,
      languages: {
        en: `${SITE_URL}/en/compare`,
        ar: `${SITE_URL}/ar/compare`,
      },
    },
  };
}

export default function ComparePage() {
  return <CompareClient />;
}
