import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import JsonLd from "@/components/json-ld";
import { buildBreadcrumbLD } from "@/lib/json-ld";
import { regions } from "@/lib/regions";
import { getStateLabel, stateToUrlSlug } from "@/lib/state-labels";
import { sudanNeighborhoods } from "@/lib/sudan-neighborhoods";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sukansd.com"
).replace(/\/$/, "");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "en" | "ar" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  const title = isAr
    ? "العقارات حسب المدينة والولاية في السودان"
    : "Property by City & State in Sudan";
  const description = isAr
    ? "تصفح القوائم العقارية حسب الولاية والحي في جميع ولايات السودان الثمانية عشر — شقق ومنازل وفيلات وقطع أراضٍ."
    : "Browse property listings by state and neighborhood across all 18 Sudanese states — apartments, houses, villas, and land.";

  const path = `/${locale}/areas`;
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}${path}`,
      languages: {
        en: `${SITE_URL}/en/areas`,
        ar: `${SITE_URL}/ar/areas`,
        "x-default": `${SITE_URL}/en/areas`,
      },
    },
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function AreasIndexPage({
  params,
}: {
  params: Promise<{ locale: "en" | "ar" }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";

  const breadcrumbs = buildBreadcrumbLD({
    items: [
      {
        name: isAr ? "الرئيسية" : "Home",
        url: `${SITE_URL}/${locale}`,
      },
      {
        name: isAr ? "المناطق" : "Areas",
        url: `${SITE_URL}/${locale}/areas`,
      },
    ],
  });

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-parchment/60">
            {isAr ? "تصفح حسب المنطقة" : "Browse by region"}
          </p>
          <h1 className="mt-2 font-serif text-4xl md:text-5xl text-parchment">
            {isAr
              ? "العقارات في السودان حسب الولاية والحي"
              : "Sudan property by state & neighborhood"}
          </h1>
          <p className="mt-4 max-w-2xl text-parchment/80">
            {isAr
              ? "تغطي Sukan جميع الولايات الثمانية عشر، من الخرطوم الكبرى إلى دارفور ومن البحر الأحمر إلى كردفان. اختر ولاية لاستعراض أحيائها وقوائمها الحية."
              : "Sukan covers all 18 Sudanese states, from Greater Khartoum to Darfur and from the Red Sea to Kordofan. Pick a state to explore its neighborhoods and live listings."}
          </p>
        </header>

        <div className="space-y-12">
          {regions.map((region) => (
            <section key={region.key}>
              <h2 className="font-serif text-2xl text-parchment mb-4">
                {isAr ? region.nameAr : region.nameEn}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {region.states.map((state) => {
                  const nbCount = sudanNeighborhoods[state]?.length ?? 0;
                  return (
                    <Link
                      key={state}
                      href={`/areas/${stateToUrlSlug(state)}`}
                      className="block rounded-lg border border-parchment/15 bg-earth/60 px-5 py-4 hover:border-parchment/40 hover:bg-earth/80 transition"
                    >
                      <div className="font-serif text-lg text-parchment">
                        {getStateLabel(state, locale)}
                      </div>
                      <div className="text-xs text-parchment/60 mt-1">
                        {nbCount}{" "}
                        {isAr
                          ? "حي"
                          : nbCount === 1
                            ? "neighborhood"
                            : "neighborhoods"}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
