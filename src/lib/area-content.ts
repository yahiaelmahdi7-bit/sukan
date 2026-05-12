// Editorial copy generator for /areas/* SEO landing pages.
// Uses curated blurbs from `neighborhoods.ts` when available; otherwise
// generates a substantive, non-spammy fallback so every page still ships
// with ~80–120 words of unique-ish text Google can index.

import { neighborhoods } from "@/lib/neighborhoods";
import { getStateLabel } from "@/lib/state-labels";

type Locale = "en" | "ar";

export type AreaCopy = {
  intro: string;
  context: string;
  faqs: { q: string; a: string }[];
};

export function getStateCopy(state: string, locale: Locale): AreaCopy {
  // Curated blurb keyed by state slug if one exists in neighborhoods.ts.
  const curated = neighborhoods[state];
  const stateName = getStateLabel(state, locale);

  if (curated) {
    const body = locale === "ar" ? curated.bodyAr : curated.bodyEn;
    return {
      intro: body,
      context: contextLine(stateName, locale),
      faqs: stateFaqs(stateName, locale),
    };
  }

  return {
    intro:
      locale === "ar"
        ? `استعرض العقارات المتاحة في ولاية ${stateName} للإيجار والبيع. تشمل القائمة شققاً ومنازل وفيلات وقطع أراضٍ موثقة من مالكيها مباشرة، مع تغطية كاملة لأهم مدن الولاية وأحيائها.`
        : `Browse verified property listings across ${stateName} state — apartments, houses, villas, and land for rent and for sale. Every listing is posted directly by the owner or a verified agent, with locations pinned across all major cities and neighborhoods in ${stateName}.`,
    context: contextLine(stateName, locale),
    faqs: stateFaqs(stateName, locale),
  };
}

export function getNeighborhoodCopy(
  state: string,
  neighborhoodNameEn: string,
  neighborhoodNameAr: string,
  locale: Locale,
): AreaCopy {
  const stateName = getStateLabel(state, locale);
  const nbName = locale === "ar" ? neighborhoodNameAr : neighborhoodNameEn;

  return {
    intro:
      locale === "ar"
        ? `شقق ومنازل وفيلات للإيجار والبيع في ${nbName}، ${stateName}. تصفح القوائم النشطة المنشورة مباشرة من الملاك، مع صور حقيقية ومواقع جغرافية دقيقة وأسعار بالدولار أو الجنيه السوداني.`
        : `Apartments, houses, and villas for rent and for sale in ${nbName}, ${stateName}. Browse active listings posted directly by owners with real photos, accurate map pins, and prices in USD or SDG.`,
    context:
      locale === "ar"
        ? `${nbName} من أحياء ${stateName} المعروفة لدى السكان والمغتربين على حد سواء، وتتباين فيه الأسعار حسب نوع العقار وحالته وقربه من الطرق الرئيسية والخدمات.`
        : `${nbName} is one of ${stateName}'s recognized residential areas, with prices varying by property type, condition, and proximity to main roads and services. Most properties here are family-owned and posted by the diaspora or local owners directly.`,
    faqs: neighborhoodFaqs(nbName, stateName, locale),
  };
}

function contextLine(stateName: string, locale: Locale): string {
  return locale === "ar"
    ? `تشمل القوائم خياراتٍ تناسب الأسر، الأفراد، والمستثمرين من المغتربين، وتُحدّث يومياً.`
    : `Listings cover options for families, individuals, and diaspora investors, and refresh daily as new properties go live.`;
}

function stateFaqs(stateName: string, locale: Locale): { q: string; a: string }[] {
  if (locale === "ar") {
    return [
      {
        q: `كيف أبحث عن شقة للإيجار في ${stateName}؟`,
        a: `استخدم خانة البحث للتصفية حسب الحي وعدد الغرف وميزانيتك، أو تواصل مباشرة مع المالك من خلال زر واتساب على كل قائمة.`,
      },
      {
        q: `هل القوائم في ${stateName} موثوقة؟`,
        a: `كل قائمة منشورة من حساب مسجّل، والقوائم ذات الشارة الموثّقة مرّت بتحقّق إضافي من فريق Sukan.`,
      },
      {
        q: `ما متوسط الإيجار الشهري في ${stateName}؟`,
        a: `يتفاوت السعر بحسب الحي والمساحة وعدد الغرف. تصفح القوائم أدناه للاطلاع على نطاق الأسعار الحالي.`,
      },
    ];
  }
  return [
    {
      q: `How do I find an apartment for rent in ${stateName}?`,
      a: `Use the search bar to filter by neighborhood, bedrooms, and budget, or contact the owner directly via the WhatsApp button on each listing.`,
    },
    {
      q: `Are ${stateName} listings on Sukan verified?`,
      a: `Every listing is posted by a registered account, and listings carrying the Verified badge have passed an additional review by the Sukan team.`,
    },
    {
      q: `What's a typical monthly rent in ${stateName}?`,
      a: `Prices vary by neighborhood, size, and bedroom count. Browse the live listings below to see the current range.`,
    },
  ];
}

function neighborhoodFaqs(
  nb: string,
  state: string,
  locale: Locale,
): { q: string; a: string }[] {
  if (locale === "ar") {
    return [
      {
        q: `كيف أتواصل مع مالك العقار في ${nb}؟`,
        a: `كل قائمة بها زر واتساب يوصلك مباشرة بالمالك أو الوكيل، دون وسطاء.`,
      },
      {
        q: `هل تتوفر فيلات للبيع في ${nb}؟`,
        a: `نعم — استخدم فلاتر "للبيع" و"فيلا" أعلى الصفحة لعرض الفيلات المتاحة حالياً في ${nb}.`,
      },
    ];
  }
  return [
    {
      q: `How do I contact an owner in ${nb}?`,
      a: `Every listing includes a WhatsApp button that connects you directly to the owner or agent — no middlemen.`,
    },
    {
      q: `Are there villas for sale in ${nb}?`,
      a: `Yes — use the "For sale" and "Villa" filters at the top of the page to view villas currently available in ${nb}, ${state}.`,
    },
  ];
}
