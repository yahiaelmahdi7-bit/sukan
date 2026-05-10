import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SavedClient from "./_components/saved-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "favorites" });
  return {
    title: `${t("title")} · Sukan`,
    description: t("subtitle"),
  };
}

export default async function SavedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("favorites");

  return (
    <>
      <Navbar />

      <main className="bg-earth min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          {/* Page header */}
          <header className="mb-10">
            <p className="text-xs uppercase tracking-widest text-gold mb-2 font-sans">
              {t("title")}
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-parchment leading-tight">
              {t("subtitle")}
            </h1>
            {/* Subtle gold rule under the title */}
            <div
              className="mt-4 h-px w-16"
              style={{
                background:
                  "linear-gradient(90deg, rgba(200,135,58,0.7) 0%, transparent 100%)",
              }}
              aria-hidden
            />
          </header>

          {/* Client component handles auth, data loading, and rendering */}
          <SavedClient />
        </div>
      </main>

      <Footer />
    </>
  );
}
