/**
 * Canonical neighborhood dictionary for Sudan, organized by state slug.
 *
 * Source: provided by Yahia (May 2026), curated from local knowledge of each
 * state. Both English and Arabic names per neighborhood. State slugs match the
 * `SUDAN_STATES` enum used elsewhere in the codebase.
 *
 * Use these helpers in the listings filter UI so users can narrow by
 * neighborhood even if no listing has been posted there yet.
 */

export type NeighborhoodName = {
  /** Stable slug used in URL params. ASCII, lowercase, hyphen-separated. */
  slug: string;
  /** Romanized name as shown to English-locale users. */
  en: string;
  /** Native Arabic name as shown to Arabic-locale users. */
  ar: string;
};

export const sudanNeighborhoods: Record<string, NeighborhoodName[]> = {
  khartoum: [
    { slug: "riyadh", en: "Riyadh", ar: "الرياض" },
    { slug: "al-amarat", en: "Al Amarat", ar: "العمارات" },
    { slug: "burri", en: "Burri", ar: "بري" },
    { slug: "manshiya", en: "Manshiya", ar: "المنشية" },
    { slug: "taif", en: "Taif", ar: "الطائف" },
    { slug: "arkaweet", en: "Arkaweet", ar: "أركويت" },
    { slug: "jabra", en: "Jabra", ar: "جبرة" },
    { slug: "sahafa", en: "Sahafa", ar: "الصحافة" },
    { slug: "kalakla", en: "Kalakla", ar: "الكلاكلة" },
    { slug: "kafouri", en: "Kafouri", ar: "كافوري" },
    { slug: "shambat", en: "Shambat", ar: "شمبات" },
    { slug: "halfaya", en: "Halfaya", ar: "الحلفايا" },
    { slug: "haj-yousif", en: "Haj Yousif", ar: "الحاج يوسف" },
    { slug: "wad-nubawi", en: "Wad Nubawi", ar: "ودنوباوي" },
    { slug: "banat", en: "Banat", ar: "بنات" },
    { slug: "mulazmeen", en: "Mulazmeen", ar: "الملازمين" },
    { slug: "al-thawra", en: "Al Thawra", ar: "الثورة" },
    { slug: "ombada", en: "Ombada", ar: "أمبدة" },
  ],
  al_jazirah: [
    { slug: "wad-madani", en: "Wad Madani", ar: "ود مدني" },
    { slug: "hasaheisa", en: "Hasaheisa", ar: "الحصاحيصا" },
    { slug: "managil", en: "Managil", ar: "المناقل" },
    { slug: "rufaa", en: "Rufaa", ar: "رفاعة" },
    { slug: "tamboul", en: "Tamboul", ar: "تمبول" },
    { slug: "abu-ushar", en: "Abu Ushar", ar: "أبو عشر" },
    { slug: "al-kamlin", en: "Al Kamlin", ar: "الكاملين" },
  ],
  white_nile: [
    { slug: "kosti", en: "Kosti", ar: "كوستي" },
    { slug: "rabak", en: "Rabak", ar: "ربك" },
    { slug: "al-douiem", en: "Al Douiem", ar: "الدويم" },
    { slug: "tendelti", en: "Tendelti", ar: "تندلتي" },
    { slug: "al-gitaina", en: "Al Gitaina", ar: "القطينة" },
    { slug: "umm-rimta", en: "Umm Rimta", ar: "أم رمتة" },
  ],
  blue_nile: [
    { slug: "ad-damazin", en: "Ad Damazin", ar: "الدمازين" },
    { slug: "ar-roseires", en: "Ar Roseires", ar: "الروصيرص" },
    { slug: "kurmuk", en: "Kurmuk", ar: "الكرمك" },
    { slug: "bout", en: "Bout", ar: "بوط" },
    { slug: "tadamon", en: "Tadamon", ar: "التضامن" },
  ],
  sennar: [
    { slug: "singa", en: "Singa", ar: "سنجة" },
    { slug: "sennar", en: "Sennar", ar: "سنار" },
    { slug: "dinder", en: "Dinder", ar: "الدندر" },
    { slug: "abu-hujar", en: "Abu Hujar", ar: "أبو حجار" },
    { slug: "al-souki", en: "Al Souki", ar: "السوكي" },
  ],
  gedaref: [
    { slug: "gedaref", en: "Gedaref", ar: "القضارف" },
    { slug: "gallabat", en: "Gallabat", ar: "القلابات" },
    { slug: "doka", en: "Doka", ar: "الدوكة" },
    { slug: "rahad", en: "Rahad", ar: "الرهد" },
    { slug: "al-qureisha", en: "Al Qureisha", ar: "القريشة" },
  ],
  kassala: [
    { slug: "kassala", en: "Kassala", ar: "كسلا" },
    { slug: "new-halfa", en: "New Halfa", ar: "حلفا الجديدة" },
    { slug: "aroma", en: "Aroma", ar: "أروما" },
    { slug: "khashm-el-girba", en: "Khashm El Girba", ar: "خشم القربة" },
    { slug: "wad-al-helew", en: "Wad Al Helew", ar: "ود الحليو" },
  ],
  red_sea: [
    { slug: "port-sudan", en: "Port Sudan", ar: "بورتسودان" },
    { slug: "suakin", en: "Suakin", ar: "سواكن" },
    { slug: "tokar", en: "Tokar", ar: "طوكر" },
    { slug: "sinkat", en: "Sinkat", ar: "سنكات" },
    { slug: "haya", en: "Haya", ar: "هيا" },
  ],
  northern: [
    { slug: "dongola", en: "Dongola", ar: "دنقلا" },
    { slug: "wadi-halfa", en: "Wadi Halfa", ar: "وادي حلفا" },
    { slug: "merowe", en: "Merowe", ar: "مروي" },
    { slug: "delgo", en: "Delgo", ar: "دلقو" },
    { slug: "al-dabbah", en: "Al Dabbah", ar: "الدبة" },
  ],
  river_nile: [
    { slug: "atbara", en: "Atbara", ar: "عطبرة" },
    { slug: "shendi", en: "Shendi", ar: "شندي" },
    { slug: "ad-damer", en: "Ad Damer", ar: "الدامر" },
    { slug: "berber", en: "Berber", ar: "بربر" },
    { slug: "abu-hamad", en: "Abu Hamad", ar: "أبو حمد" },
  ],
  north_kordofan: [
    { slug: "el-obeid", en: "El Obeid", ar: "الأبيض" },
    { slug: "bara", en: "Bara", ar: "بارا" },
    { slug: "um-rawaba", en: "Um Rawaba", ar: "أم روابة" },
    { slug: "sodari", en: "Sodari", ar: "سودري" },
    { slug: "en-nahud", en: "En Nahud", ar: "النهود" },
  ],
  south_kordofan: [
    { slug: "kadugli", en: "Kadugli", ar: "كادقلي" },
    { slug: "dilling", en: "Dilling", ar: "الدلنج" },
    { slug: "talodi", en: "Talodi", ar: "تلودي" },
    { slug: "rashad", en: "Rashad", ar: "رشاد" },
    { slug: "kauda", en: "Kauda", ar: "كاودا" },
  ],
  west_kordofan: [
    { slug: "al-fula", en: "Al Fula", ar: "الفولة" },
    { slug: "babanusa", en: "Babanusa", ar: "بابنوسة" },
    { slug: "muglad", en: "Muglad", ar: "المجلد" },
    { slug: "abyei", en: "Abyei", ar: "أبيي" },
    { slug: "el-meiram", en: "El Meiram", ar: "المرام" },
  ],
  north_darfur: [
    { slug: "el-fasher", en: "El Fasher", ar: "الفاشر" },
    { slug: "kutum", en: "Kutum", ar: "كتم" },
    { slug: "kabkabiya", en: "Kabkabiya", ar: "كبكابية" },
    { slug: "mellit", en: "Mellit", ar: "مليط" },
    { slug: "tawila", en: "Tawila", ar: "طويلة" },
  ],
  south_darfur: [
    { slug: "nyala", en: "Nyala", ar: "نيالا" },
    { slug: "kass", en: "Kass", ar: "كاس" },
    { slug: "buram", en: "Buram", ar: "برام" },
    { slug: "tulus", en: "Tulus", ar: "تلس" },
    { slug: "ed-al-fursan", en: "Ed Al Fursan", ar: "عد الفرسان" },
  ],
  east_darfur: [
    { slug: "ed-daein", en: "Ed Daein", ar: "الضعين" },
    { slug: "abu-karinka", en: "Abu Karinka", ar: "أبو كارنكا" },
    { slug: "adila", en: "Adila", ar: "عديلة" },
    { slug: "yassin", en: "Yassin", ar: "ياسين" },
    { slug: "bahr-al-arab", en: "Bahr Al Arab", ar: "بحر العرب" },
  ],
  central_darfur: [
    { slug: "zalingei", en: "Zalingei", ar: "زالنجي" },
    { slug: "mukjar", en: "Mukjar", ar: "مكجر" },
    { slug: "nertiti", en: "Nertiti", ar: "نرتتي" },
    { slug: "azum", en: "Azum", ar: "عزوم" },
    { slug: "wadi-salih", en: "Wadi Salih", ar: "وادي صالح" },
  ],
  west_darfur: [
    { slug: "el-geneina", en: "El Geneina", ar: "الجنينة" },
    { slug: "kulbus", en: "Kulbus", ar: "كلبس" },
    { slug: "habila", en: "Habila", ar: "هبيلة" },
    { slug: "foro-baranga", en: "Foro Baranga", ar: "فور برنقا" },
    { slug: "misterei", en: "Misterei", ar: "مسترهي" },
  ],
};

/** All neighborhoods for a given state slug, in display order. */
export function getNeighborhoodsForState(state: string): NeighborhoodName[] {
  return sudanNeighborhoods[state] ?? [];
}

/** Locate a specific neighborhood by state + slug. */
export function getNeighborhood(
  state: string,
  slug: string,
): NeighborhoodName | null {
  return (
    sudanNeighborhoods[state]?.find((n) => n.slug === slug) ?? null
  );
}

/**
 * Map a free-text neighborhood string (e.g. saved on a Listing) back to its
 * canonical slug. Tolerant: matches against slug, en, or ar fields. Returns
 * null if no canonical neighborhood matches.
 */
export function findNeighborhoodSlug(
  state: string,
  value: string,
): string | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  const list = sudanNeighborhoods[state] ?? [];
  for (const n of list) {
    if (
      n.slug === normalized ||
      n.en.toLowerCase() === normalized ||
      n.ar === value.trim()
    ) {
      return n.slug;
    }
  }
  return null;
}
