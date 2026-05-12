// Shared bilingual labels for Sudan's 18 states. Single source of truth so
// route segments, autocomplete, and SEO copy don't drift apart.

export const STATE_LABELS_EN: Record<string, string> = {
  khartoum: "Khartoum",
  al_jazirah: "Al Jazirah",
  blue_nile: "Blue Nile",
  sennar: "Sennar",
  white_nile: "White Nile",
  north_kordofan: "North Kordofan",
  south_kordofan: "South Kordofan",
  west_kordofan: "West Kordofan",
  north_darfur: "North Darfur",
  south_darfur: "South Darfur",
  east_darfur: "East Darfur",
  central_darfur: "Central Darfur",
  west_darfur: "West Darfur",
  kassala: "Kassala",
  red_sea: "Red Sea",
  gedaref: "Gedaref",
  river_nile: "River Nile",
  northern: "Northern",
};

export const STATE_LABELS_AR: Record<string, string> = {
  khartoum: "الخرطوم",
  al_jazirah: "الجزيرة",
  blue_nile: "النيل الأزرق",
  sennar: "سنار",
  white_nile: "النيل الأبيض",
  north_kordofan: "شمال كردفان",
  south_kordofan: "جنوب كردفان",
  west_kordofan: "غرب كردفان",
  north_darfur: "شمال دارفور",
  south_darfur: "جنوب دارفور",
  east_darfur: "شرق دارفور",
  central_darfur: "وسط دارفور",
  west_darfur: "غرب دارفور",
  kassala: "كسلا",
  red_sea: "البحر الأحمر",
  gedaref: "القضارف",
  river_nile: "نهر النيل",
  northern: "الشمالية",
};

export function getStateLabel(state: string, locale: "en" | "ar"): string {
  const map = locale === "ar" ? STATE_LABELS_AR : STATE_LABELS_EN;
  return map[state] ?? state.replace(/_/g, " ");
}

// URL-safe state slug: db uses snake_case ("al_jazirah"), URLs use kebab-case
// ("al-jazirah"). These helpers handle the round-trip.
export function stateToUrlSlug(state: string): string {
  return state.replace(/_/g, "-");
}

export function urlSlugToState(slug: string): string {
  return slug.replace(/-/g, "_");
}
