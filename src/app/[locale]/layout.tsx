import type { Metadata } from "next";
import { Cormorant_Garamond, Lato, Noto_Naskh_Arabic } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import { routing, localeDirection, type Locale } from "@/i18n/routing";
import Atmosphere from "@/components/atmosphere";
import BackToDashboardPill from "@/components/back-to-dashboard-pill";
import { UserLocationProvider } from "@/components/user-location-provider";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
});

const notoNaskh = Noto_Naskh_Arabic({
  variable: "--font-noto-naskh",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sukan — Sudan's home for housing",
    template: "%s · Sukan",
  },
  description:
    "Sudan's first AI-powered property listing platform. Verified rentals and sales across all 18 states, built bilingual EN/AR for tenants, landlords, and the diaspora.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://sukan.app",
  ),
  applicationName: "Sukan",
  authors: [{ name: "Sukan" }],
  creator: "Sukan",
  publisher: "Sukan",
  // Localised keyword set — covers EN and AR search intent for Sudan real estate
  keywords: [
    "Sudan property",
    "Sudan real estate",
    "rent apartment Khartoum",
    "buy villa Bahri",
    "Sudan housing",
    "Khartoum apartments",
    "Sudan diaspora property",
    "عقارات السودان",
    "شقق للإيجار الخرطوم",
    "فيلات للبيع السودان",
    "عقارات المغتربين السودانيين",
    "سكن السودان",
    "إيجار شقة الخرطوم",
    "بيع عقار السودان",
  ],
  // Prevent iOS Safari auto-linking phone numbers / addresses in meta description
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  manifest: "/manifest.webmanifest",
  themeColor: "#12100C",
  appleWebApp: {
    capable: true,
    title: "Sukan",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    siteName: "Sukan — سُكَن",
    title: {
      default: "Sukan — Sudan's home for housing",
      template: "%s · Sukan",
    },
    description:
      "Verified property listings across all 18 states. Bilingual EN / AR. Built for tenants, landlords, and the diaspora.",
    locale: "en_US",
    alternateLocale: "ar_SD",
  },
  twitter: {
    card: "summary_large_image",
    site: "@sukanapp",
    creator: "@sukanapp",
    title: {
      default: "Sukan — Sudan's home for housing",
      template: "%s · Sukan",
    },
    description:
      "Verified property listings across all 18 states. Bilingual EN / AR. Built for tenants, landlords, and the diaspora.",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const dir = localeDirection[locale as Locale];

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${cormorant.variable} ${lato.variable} ${notoNaskh.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col bg-earth text-parchment">
        {/* Skip-to-content — first focusable element on every page */}
        <a href="#main" className="skip-link">
          {locale === "ar" ? "انتقل إلى المحتوى الرئيسي" : "Skip to main content"}
        </a>
        <Atmosphere />
        <NextIntlClientProvider>
          <UserLocationProvider>
            <div id="main">
              {children}
            </div>
            <BackToDashboardPill />
          </UserLocationProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
