import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Phone, FileImage, MapPin } from "lucide-react";
import GlassPanel from "@/components/glass-panel";

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
    ? "كيف نوثّق الإعلانات · سُكان"
    : "How we verify listings · Sukan";
  const description = isAr
    ? "ثلاث خطوات نسلكها قبل نشر أي عقار على سُكان: الاتصال بالمالك، فحص سند الملكية، وتأكيد الموقع ميدانياً."
    : "Three steps we take before publishing any property on Sukan: calling the landlord, checking the deed, and confirming the location on the ground.";
  const canonicalUrl = `${SITE_URL}/${locale}/verification`;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/verification`,
        ar: `${SITE_URL}/ar/verification`,
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
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function VerificationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";

  const eyebrow = isAr ? "ثقتنا في الإعلانات" : "Trust on Sukan";
  const heroTitle = isAr ? "كيف نوثّق الإعلانات" : "How we verify listings";
  const heroBody = isAr
    ? "كل عقار يُنشر على سُكان يمرّ بثلاث خطوات قبل ظهوره علناً. الهدف بسيط: لا نضيّع وقتك على إعلان وهمي."
    : "Every listing on Sukan goes through three steps before going public. The goal is simple: we don't waste your time on a fake listing.";

  const steps = [
    {
      icon: <Phone size={36} strokeWidth={1.5} aria-hidden />,
      title: isAr ? "نتصل بالمالك" : "We call the landlord",
      body: isAr
        ? "نُجري مكالمة هاتفية مع صاحب العقار ونؤكد أنه يملك الحق في تأجيره أو بيعه."
        : "We make a phone call with the property owner and confirm they have the right to rent or sell it.",
    },
    {
      icon: <FileImage size={36} strokeWidth={1.5} aria-hidden />,
      title: isAr ? "نراجع سند الملكية" : "We check the property deed",
      body: isAr
        ? "نطلب صورة من سند ملكية العقار ونقارنها بالاسم في الإعلان قبل النشر."
        : "We request a photo of the property deed and match it against the listing name before publishing.",
    },
    {
      icon: <MapPin size={36} strokeWidth={1.5} aria-hidden />,
      title: isAr ? "شريك محلي يؤكد الموقع" : "A local partner confirms the location",
      body: isAr
        ? "يزور شريك محلي العنوان شخصياً ويؤكد أن العقار في المكان الذي يدّعي صاحبه."
        : "A local Sukan partner visits the address in person and confirms the property exists where the owner claims.",
    },
  ];

  return (
    <>
      {/* ─── Hero ─── */}
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
            {heroTitle}
          </h1>
          <p className="max-w-2xl text-lg leading-[1.8] text-ink-mid">{heroBody}</p>
        </div>
      </section>

      {/* ─── Three steps ─── */}
      <section className="bg-cream-deep py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <GlassPanel
                key={step.title}
                variant="warm"
                radius="glass"
                shadow
                className="smooth lift flex flex-col gap-5 p-8 overflow-hidden relative"
              >
                <span
                  aria-hidden
                  className="absolute top-3 end-4 font-display text-7xl text-gold/10 leading-none font-bold select-none"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex h-11 w-11 items-center justify-center text-gold-dk">
                  {step.icon}
                </div>
                <h2 className="font-display text-xl font-semibold text-ink">
                  {step.title}
                </h2>
                <p className="text-sm leading-relaxed text-ink-mid">{step.body}</p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
