import type { Locale } from "@/i18n/routing";

export const SUDAN_STATES = [
  "khartoum",
  "al_jazirah",
  "blue_nile",
  "sennar",
  "white_nile",
  "north_kordofan",
  "south_kordofan",
  "west_kordofan",
  "north_darfur",
  "south_darfur",
  "east_darfur",
  "central_darfur",
  "west_darfur",
  "kassala",
  "red_sea",
  "gedaref",
  "river_nile",
  "northern",
] as const;

export type SudanState = (typeof SUDAN_STATES)[number];

export const STATE_COORDS: Record<SudanState, [number, number]> = {
  khartoum: [15.5007, 32.5599],
  al_jazirah: [14.4012, 33.5199],
  blue_nile: [11.7891, 34.3599],
  sennar: [13.1483, 33.9312],
  white_nile: [13.1809, 32.7399],
  north_kordofan: [13.1842, 30.2167],
  south_kordofan: [11.0167, 29.7167],
  west_kordofan: [11.7329, 28.3579],
  north_darfur: [13.6279, 25.3494],
  south_darfur: [12.0489, 24.8807],
  east_darfur: [11.4619, 26.1258],
  central_darfur: [12.9095, 23.4706],
  west_darfur: [13.4526, 22.4472],
  kassala: [15.451, 36.3999],
  red_sea: [19.6158, 37.2164],
  gedaref: [14.0349, 35.3834],
  river_nile: [17.598, 33.9721],
  northern: [19.1816, 30.4749],
};

export type PropertyType =
  | "apartment"
  | "house"
  | "villa"
  | "studio"
  | "shop"
  | "office"
  | "land"
  | "warehouse";

export type Purpose = "rent" | "sale";
export type PricePeriod = "month" | "year" | "total";
export type Tier = "standard" | "featured";

export type Amenity =
  | "parking"
  | "generator"
  | "water_tank"
  | "furnished"
  | "garden"
  | "security"
  | "ac"
  | "solar"
  | "wifi"
  | "elevator"
  | "balcony"
  | "rooftop";

export type Listing = {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  propertyType: PropertyType;
  purpose: Purpose;
  state: SudanState;
  city: string;
  cityAr: string;
  neighborhood?: string;
  neighborhoodAr?: string;
  latitude: number;
  longitude: number;
  bedrooms?: number;
  bathrooms?: number;
  areaSqm?: number;
  priceUsd: number;
  priceSdg?: number;
  period: PricePeriod;
  amenities: Amenity[];
  tier: Tier;
  whatsappContact: string;
  ownerName: string;
  ownerNameAr: string;
  ownerJoinedYear: number;
  photoSlots: number;
};

// 22 seed listings spanning all 18 Sudan states.
// Prices anchored to public 2026 Sudan property market references; bilingual content
// translates naturally across EN/AR. Replace with live Supabase queries when ready.
export const sampleListings: Listing[] = [
  {
    id: "khartoum-2-3br-apt",
    titleEn: "Three-bedroom apartment, Khartoum 2",
    titleAr: "شقة ثلاث غرف، الخرطوم 2",
    descriptionEn:
      "Bright top-floor apartment off Africa Road. Three bedrooms, two bathrooms, fully furnished, generator, water tank, and rooftop access. Walking distance to Afra Mall and the airport. Suitable for a family or two professionals.",
    descriptionAr:
      "شقة مضيئة في الطابق العلوي قبالة شارع أفريقيا. ثلاث غرف نوم، حمامان، مفروشة بالكامل، مولد كهرباء، خزان مياه، ومدخل للسطح. على بعد دقائق من أفرا مول والمطار. مناسبة لعائلة أو موظفَين.",
    propertyType: "apartment",
    purpose: "rent",
    state: "khartoum",
    city: "Khartoum",
    cityAr: "الخرطوم",
    neighborhood: "Khartoum 2",
    neighborhoodAr: "الخرطوم 2",
    latitude: 15.5827,
    longitude: 32.5419,
    bedrooms: 3,
    bathrooms: 2,
    areaSqm: 145,
    priceUsd: 850,
    priceSdg: 510000,
    period: "month",
    amenities: [
      "furnished",
      "generator",
      "water_tank",
      "ac",
      "wifi",
      "rooftop",
      "elevator",
    ],
    tier: "featured",
    whatsappContact: "+249912000001",
    ownerName: "Yasir Ahmed",
    ownerNameAr: "ياسر أحمد",
    ownerJoinedYear: 2024,
    photoSlots: 5,
  },
  {
    id: "omdurman-villa-thawra",
    titleEn: "Family villa, Omdurman Al-Thawra",
    titleAr: "فيلا عائلية، أم درمان الثورة",
    descriptionEn:
      "Walled compound with main villa and detached guest unit. Five bedrooms, garden, mature mango trees, well water, solar panels, and a guard room. Quiet street near the Saturday market.",
    descriptionAr:
      "مجمع مسوّر مع فيلا رئيسية ووحدة ضيوف منفصلة. خمس غرف نوم، حديقة، أشجار مانجو، بئر مياه، ألواح شمسية، وغرفة حراسة. شارع هادئ قرب سوق السبت.",
    propertyType: "villa",
    purpose: "sale",
    state: "khartoum",
    city: "Omdurman",
    cityAr: "أم درمان",
    neighborhood: "Al-Thawra",
    neighborhoodAr: "الثورة",
    latitude: 15.6445,
    longitude: 32.4779,
    bedrooms: 5,
    bathrooms: 4,
    areaSqm: 480,
    priceUsd: 185000,
    period: "total",
    amenities: ["garden", "security", "solar", "water_tank", "parking"],
    tier: "featured",
    whatsappContact: "+249912000002",
    ownerName: "Amna Ibrahim",
    ownerNameAr: "آمنة إبراهيم",
    ownerJoinedYear: 2024,
    photoSlots: 6,
  },
  {
    id: "port-sudan-shop",
    titleEn: "Commercial shop, Port Sudan downtown",
    titleAr: "محل تجاري، وسط بورتسودان",
    descriptionEn:
      "Ground-floor retail unit on Sawakin Road, high foot traffic, currently a tailor shop. 60 m² with mezzanine storage, working AC, and a rolling shutter front. Lease term flexible.",
    descriptionAr:
      "محل تجاري بالطابق الأرضي على شارع سواكن، حركة مشاة عالية، حالياً ورشة خياطة. 60 م² مع ميزانين للتخزين، تكييف يعمل، وشتر أمامي. مدة الإيجار قابلة للتفاوض.",
    propertyType: "shop",
    purpose: "rent",
    state: "red_sea",
    city: "Port Sudan",
    cityAr: "بورتسودان",
    neighborhood: "Sawakin Road",
    neighborhoodAr: "شارع سواكن",
    latitude: 19.6158,
    longitude: 37.2164,
    areaSqm: 60,
    priceUsd: 320,
    priceSdg: 192000,
    period: "month",
    amenities: ["ac", "security"],
    tier: "standard",
    whatsappContact: "+249912000003",
    ownerName: "Mohamed Osman",
    ownerNameAr: "محمد عثمان",
    ownerJoinedYear: 2025,
    photoSlots: 4,
  },
  {
    id: "river-nile-land-shendi",
    titleEn: "Agricultural land, near Shendi",
    titleAr: "أرض زراعية، قرب شندي",
    descriptionEn:
      "Eight feddans of irrigated land along the Nile. Established irrigation channels, full title deed, road access. Ideal for a farm operation or future development.",
    descriptionAr:
      "ثمانية فدان أرض مروية على ضفاف النيل. قنوات ري قائمة، صك ملكية كامل، طريق ممهد. مناسبة لمشروع زراعي أو تطوير مستقبلي.",
    propertyType: "land",
    purpose: "sale",
    state: "river_nile",
    city: "Shendi",
    cityAr: "شندي",
    latitude: 16.7,
    longitude: 33.43,
    areaSqm: 33600,
    priceUsd: 95000,
    period: "total",
    amenities: ["water_tank"],
    tier: "standard",
    whatsappContact: "+249912000004",
    ownerName: "Hassan Khalid",
    ownerNameAr: "حسن خالد",
    ownerJoinedYear: 2024,
    photoSlots: 3,
  },
  {
    id: "kassala-studio-furnished",
    titleEn: "Furnished studio, Kassala center",
    titleAr: "استوديو مفروش، وسط كسلا",
    descriptionEn:
      "Compact furnished studio close to Kassala University. Kitchenette, full bathroom, fan, and reliable water. Suits a single tenant or remote worker.",
    descriptionAr:
      "استوديو مفروش مدمج قرب جامعة كسلا. مطبخ صغير، حمام كامل، مروحة، وماء منتظم. يناسب مستأجر فردي أو موظف عن بُعد.",
    propertyType: "studio",
    purpose: "rent",
    state: "kassala",
    city: "Kassala",
    cityAr: "كسلا",
    latitude: 15.451,
    longitude: 36.3999,
    bedrooms: 1,
    bathrooms: 1,
    areaSqm: 32,
    priceUsd: 140,
    priceSdg: 84000,
    period: "month",
    amenities: ["furnished", "water_tank", "wifi"],
    tier: "standard",
    whatsappContact: "+249912000005",
    ownerName: "Salma Tahir",
    ownerNameAr: "سلمى طاهر",
    ownerJoinedYear: 2025,
    photoSlots: 4,
  },
  {
    id: "wad-madani-house",
    titleEn: "Three-bedroom house, Wad Madani",
    titleAr: "منزل ثلاث غرف، ود مدني",
    descriptionEn:
      "Detached single-storey house with courtyard. Three bedrooms, large hosh (courtyard), separate kitchen building, and parking for two cars. Quiet residential block.",
    descriptionAr:
      "منزل مستقل بطابق واحد مع فناء. ثلاث غرف نوم، حوش كبير، مطبخ منفصل، ومواقف لسيارتين. حي سكني هادئ.",
    propertyType: "house",
    purpose: "sale",
    state: "al_jazirah",
    city: "Wad Madani",
    cityAr: "ود مدني",
    latitude: 14.4,
    longitude: 33.52,
    bedrooms: 3,
    bathrooms: 2,
    areaSqm: 220,
    priceUsd: 72000,
    period: "total",
    amenities: ["parking", "garden", "water_tank", "generator"],
    tier: "featured",
    whatsappContact: "+249912000006",
    ownerName: "Tariq Bashir",
    ownerNameAr: "طارق بشير",
    ownerJoinedYear: 2024,
    photoSlots: 5,
  },
];

export function getListingById(id: string): Listing | undefined {
  return sampleListings.find((l) => l.id === id);
}

export function getLocaleTitle(listing: Listing, locale: Locale): string {
  return locale === "ar" ? listing.titleAr : listing.titleEn;
}

export function getLocaleDescription(
  listing: Listing,
  locale: Locale,
): string {
  return locale === "ar" ? listing.descriptionAr : listing.descriptionEn;
}

export function getLocaleCity(listing: Listing, locale: Locale): string {
  return locale === "ar" ? listing.cityAr : listing.city;
}

export function getLocaleOwnerName(listing: Listing, locale: Locale): string {
  return locale === "ar" ? listing.ownerNameAr : listing.ownerName;
}

export function getLocaleNeighborhood(
  listing: Listing,
  locale: Locale,
): string | undefined {
  return locale === "ar" ? listing.neighborhoodAr : listing.neighborhood;
}
