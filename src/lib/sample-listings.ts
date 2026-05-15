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
  // Essentials
  | "ac"
  | "heating"
  | "generator"
  | "water_tank"
  | "solar"
  | "wifi"
  | "hot_water"
  | "furnished"
  | "semi_furnished"
  | "unfurnished"
  // Kitchen
  | "fitted_kitchen"
  | "refrigerator"
  | "oven"
  | "microwave"
  | "dishwasher"
  | "washing_machine"
  // Comfort & indoor
  | "balcony"
  | "builtin_wardrobes"
  | "storage_room"
  | "maid_room"
  | "driver_room"
  | "majlis"
  | "dining_room"
  | "study_room"
  // Outdoor
  | "private_garden"
  | "shared_garden"
  | "private_pool"
  | "shared_pool"
  | "rooftop"
  | "bbq"
  | "yard"
  | "garden"
  // Security & building
  | "security"
  | "cctv"
  | "intercom"
  | "gated_community"
  | "elevator"
  // Parking
  | "parking"
  | "covered_parking"
  | "garage"
  // Community
  | "gym"
  | "playground"
  | "mosque_nearby";

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
  imageUrl?: string;
  ownerVerified?: boolean;
  ownerCity?: string;
  averageRating?: number;
  reviewCount?: number;
  // ── New optional fields added in round 2 ──────────────────────────────────
  createdAt?: string;
  photos?: string[];
  weeklyViews?: number;
  previousPriceUsd?: number;
  ownerAvatar?: string;
  ownerOnline?: boolean;
  ownerReplyTime?: number;
  // ── Verification + demo flags ──────────────────────────────────────────────
  verificationTier?: "landlord-verified" | "property-verified" | "visited";
  isDemo?: boolean;
  // ── Video tour ─────────────────────────────────────────────────────────────
  videoTourUrl?: string;
  // ── Price history (newest first) ──────────────────────────────────────────
  priceHistory?: { price: number; date: string; currency: "USD" | "SDG" }[];
};

// Curated Unsplash images per property type. Hand-picked to avoid generic
// Western suburbia and lean toward warm-toned, MENA-friendly aesthetics.
// Replace with real photos uploaded to Supabase Storage when listings go live.
const STOCK_IMAGES: Record<PropertyType, string[]> = {
  apartment: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=1200&auto=format&fit=crop&q=80",
  ],
  house: [
    "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&auto=format&fit=crop&q=80",
  ],
  villa: [
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80",
  ],
  studio: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&auto=format&fit=crop&q=80",
  ],
  shop: [
    "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=1200&auto=format&fit=crop&q=80",
  ],
  office: [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&auto=format&fit=crop&q=80",
  ],
  land: [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1565098772267-60af42b81ef2?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80",
  ],
  warehouse: [
    "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1200&auto=format&fit=crop&q=80",
  ],
};

export function getListingImage(listing: Listing): string {
  if (listing.imageUrl) return listing.imageUrl;
  const pool = STOCK_IMAGES[listing.propertyType];
  if (!pool || pool.length === 0) return STOCK_IMAGES.apartment[0];
  const seed = Array.from(listing.id).reduce(
    (s, c) => s + c.charCodeAt(0),
    0,
  );
  return pool[seed % pool.length];
}

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
    // ── Round 2 fields ──────────────────────────────────────────────────────
    createdAt: "2026-05-09T10:00:00Z",          // 2 days ago → NEW ribbon
    photos: [
      "https://d8j0ntlcm91z4.cloudfront.net/user_3CTdrgC2CdR16Mhg8ltaktkLuTj/hf_20260510_215635_b81bf5d9-d747-4d1a-81a3-f7578b8703d8.png",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=80",
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1600&q=80",
    ],
    weeklyViews: 247,
    previousPriceUsd: 950,                      // Price reduced
    ownerAvatar: "https://i.pravatar.cc/120?img=12",
    ownerOnline: true,
    ownerReplyTime: 1,
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
    // ── Round 2 fields ──────────────────────────────────────────────────────
    createdAt: "2026-04-28T08:30:00Z",          // 13 days ago
    photos: [
      "https://d8j0ntlcm91z4.cloudfront.net/user_3CTdrgC2CdR16Mhg8ltaktkLuTj/hf_20260510_215639_2a593a50-f658-4fc2-a763-b47f4821458c.png",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1600&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80",
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=1600&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&q=80",
    ],
    weeklyViews: 198,
    ownerAvatar: "https://i.pravatar.cc/120?img=5",
    ownerOnline: true,
    ownerReplyTime: 2,
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
    // ── Round 2 fields ──────────────────────────────────────────────────────
    createdAt: "2026-05-07T14:00:00Z",          // 4 days ago → NEW ribbon
    photos: [
      "https://d8j0ntlcm91z4.cloudfront.net/user_3CTdrgC2CdR16Mhg8ltaktkLuTj/hf_20260510_220838_d0fd3cf5-3401-467c-8866-b0ad8d82cd12.png",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1600&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80",
      "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=1600&q=80",
    ],
    weeklyViews: 54,
    ownerOnline: false,
    ownerReplyTime: 6,
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
    neighborhood: "Shendi",
    neighborhoodAr: "شندي",
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
    // ── Round 2 fields ──────────────────────────────────────────────────────
    createdAt: "2026-04-20T09:00:00Z",          // 21 days ago
    photos: [
      "https://d8j0ntlcm91z4.cloudfront.net/user_3CTdrgC2CdR16Mhg8ltaktkLuTj/hf_20260510_220841_c9d312df-eda1-4c10-b519-37a4db1b2521.png",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80",
      "https://images.unsplash.com/photo-1565098772267-60af42b81ef2?w=1600&q=80",
    ],
    weeklyViews: 38,
    previousPriceUsd: 108000,                   // Price reduced
    ownerAvatar: "https://i.pravatar.cc/120?img=33",
    ownerOnline: false,
    ownerReplyTime: 5,
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
    neighborhood: "Kassala",
    neighborhoodAr: "كسلا",
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
    // ── Round 2 fields ──────────────────────────────────────────────────────
    createdAt: "2026-05-05T11:00:00Z",          // 6 days ago → NEW ribbon
    photos: [
      "https://d8j0ntlcm91z4.cloudfront.net/user_3CTdrgC2CdR16Mhg8ltaktkLuTj/hf_20260510_220844_16fad8bb-aaa9-4b50-a3be-180498cc7ff9.png",
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1600&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=80",
    ],
    weeklyViews: 62,
    ownerOnline: true,
    ownerReplyTime: 3,
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
    neighborhood: "Wad Madani",
    neighborhoodAr: "ود مدني",
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
    // ── Round 2 fields ──────────────────────────────────────────────────────
    createdAt: "2026-04-15T08:00:00Z",          // 26 days ago
    photos: [
      "https://d8j0ntlcm91z4.cloudfront.net/user_3CTdrgC2CdR16Mhg8ltaktkLuTj/hf_20260510_215642_41a8ff65-1799-4ed4-84b1-69c25d727745.png",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80",
    ],
    weeklyViews: 165,
    previousPriceUsd: 80000,                    // Price reduced
    ownerAvatar: "https://i.pravatar.cc/120?img=18",
    ownerOnline: true,
    ownerReplyTime: 2,
  },
  {
    id: "khartoum-bahri-2br",
    titleEn: "Two-bedroom apartment, Khartoum Bahri",
    titleAr: "شقة غرفتين، الخرطوم بحري",
    descriptionEn:
      "Spacious second-floor flat in Al-Halfaya, Bahri. Two bedrooms, balcony overlooking the Blue Nile, generator-backed building, and a covered parking spot. 10 minutes to downtown Khartoum.",
    descriptionAr:
      "شقة واسعة في الطابق الثاني بالحلفايا، بحري. غرفتا نوم، شرفة تطل على النيل الأزرق، مبنى مزود بمولد، وموقف سيارة مغطى. 10 دقائق إلى وسط الخرطوم.",
    propertyType: "apartment",
    purpose: "rent",
    state: "khartoum",
    city: "Bahri",
    cityAr: "بحري",
    neighborhood: "Al-Halfaya",
    neighborhoodAr: "الحلفايا",
    latitude: 15.6533,
    longitude: 32.5333,
    bedrooms: 2,
    bathrooms: 2,
    areaSqm: 110,
    priceUsd: 520,
    priceSdg: 312000,
    period: "month",
    amenities: ["generator", "water_tank", "parking", "balcony", "ac"],
    tier: "standard",
    whatsappContact: "+249912000007",
    ownerName: "Khalid Mahmoud",
    ownerNameAr: "خالد محمود",
    ownerJoinedYear: 2025,
    photoSlots: 4,
    // ── Round 2 fields ──────────────────────────────────────────────────────
    createdAt: "2026-04-25T16:00:00Z",          // 16 days ago
    photos: [
      "https://d8j0ntlcm91z4.cloudfront.net/user_3CTdrgC2CdR16Mhg8ltaktkLuTj/hf_20260510_220847_0817d59e-2ee7-4ac1-9f6c-155c1cb16e80.png",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80",
      "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=1600&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=80",
    ],
    weeklyViews: 88,
    ownerOnline: false,
    ownerReplyTime: 4,
  },
  {
    id: "damazin-family-home",
    titleEn: "Family home, Damazin",
    titleAr: "منزل عائلي، الدمازين",
    descriptionEn:
      "Three-bedroom home on a quiet street in central Damazin. Brick construction, walled compound, generator, and well water. Close to the Blue Nile waterfront and the central market.",
    descriptionAr:
      "منزل بثلاث غرف في شارع هادئ بوسط الدمازين. بناء طوب، فناء مسوّر، مولد كهرباء، وبئر مياه. قرب كورنيش النيل الأزرق والسوق المركزي.",
    propertyType: "house",
    purpose: "rent",
    state: "blue_nile",
    city: "Damazin",
    cityAr: "الدمازين",
    neighborhood: "Ad Damazin",
    neighborhoodAr: "الدمازين",
    latitude: 11.7891,
    longitude: 34.3599,
    bedrooms: 3,
    bathrooms: 1,
    areaSqm: 180,
    priceUsd: 240,
    priceSdg: 144000,
    period: "month",
    amenities: ["generator", "water_tank", "parking", "garden"],
    tier: "standard",
    whatsappContact: "+249912000008",
    ownerName: "Abdelrahman Idris",
    ownerNameAr: "عبدالرحمن إدريس",
    ownerJoinedYear: 2025,
    photoSlots: 3,
    // ── Round 2 fields ──────────────────────────────────────────────────────
    createdAt: "2026-04-18T07:30:00Z",          // 23 days ago
    photos: [
      "https://d8j0ntlcm91z4.cloudfront.net/user_3CTdrgC2CdR16Mhg8ltaktkLuTj/hf_20260510_220937_dbc37028-0102-4f31-8012-6601a01825e4.png",
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1600&q=80",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1600&q=80",
    ],
    weeklyViews: 29,
    ownerAvatar: "https://i.pravatar.cc/120?img=47",
    ownerOnline: false,
    ownerReplyTime: 7,
  },
  {
    id: "sennar-courtyard-house",
    titleEn: "Courtyard house, Sennar",
    titleAr: "بيت بفناء داخلي، سنار",
    descriptionEn:
      "Traditional Sudanese courtyard house in Singa, Sennar. Three bedrooms around an open hosh, mango and lemon trees, dedicated kitchen building, and a guest majlis. Title deed clear.",
    descriptionAr:
      "بيت سوداني تقليدي بفناء داخلي في سنجة، سنار. ثلاث غرف حول الحوش المفتوح، أشجار مانجو وليمون، مطبخ مستقل، ومجلس ضيوف. صك ملكية كامل.",
    propertyType: "house",
    purpose: "sale",
    state: "sennar",
    city: "Singa",
    cityAr: "سنجة",
    neighborhood: "Singa",
    neighborhoodAr: "سنجة",
    latitude: 13.1483,
    longitude: 33.9312,
    bedrooms: 3,
    bathrooms: 2,
    areaSqm: 250,
    priceUsd: 48000,
    period: "total",
    amenities: ["garden", "water_tank", "generator"],
    tier: "standard",
    whatsappContact: "+249912000009",
    ownerName: "Awad El-Karim",
    ownerNameAr: "عوض الكريم",
    ownerJoinedYear: 2024,
    photoSlots: 5,
    // ── Round 2 fields ──────────────────────────────────────────────────────
    createdAt: "2026-05-04T12:00:00Z",          // 7 days ago → NEW ribbon
    photos: [
      "https://d8j0ntlcm91z4.cloudfront.net/user_3CTdrgC2CdR16Mhg8ltaktkLuTj/hf_20260510_220940_b2915f47-095b-4276-9c01-329786715043.png",
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=1600&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=80",
      "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=1600&q=80",
    ],
    weeklyViews: 45,
    ownerAvatar: "https://i.pravatar.cc/120?img=60",
    ownerOnline: false,
    ownerReplyTime: 5,
  },
  {
    id: "kosti-riverside-flat",
    titleEn: "Riverside one-bedroom flat, Kosti",
    titleAr: "شقة غرفة واحدة على النيل، كوستي",
    descriptionEn:
      "Compact furnished flat in Rabak, White Nile state. River-facing window, AC, and a small kitchenette. Walking distance to the Kosti–Rabak bridge and the central transport hub.",
    descriptionAr:
      "شقة مفروشة مدمجة في ربك، ولاية النيل الأبيض. نافذة تطل على النهر، تكييف، ومطبخ صغير. على مسافة مشي من جسر كوستي–ربك ومحطة المواصلات.",
    propertyType: "apartment",
    purpose: "rent",
    state: "white_nile",
    city: "Kosti",
    cityAr: "كوستي",
    neighborhood: "Rabak",
    neighborhoodAr: "ربك",
    latitude: 13.1809,
    longitude: 32.7399,
    bedrooms: 1,
    bathrooms: 1,
    areaSqm: 55,
    priceUsd: 190,
    priceSdg: 114000,
    period: "month",
    amenities: ["furnished", "ac", "water_tank", "wifi"],
    tier: "standard",
    whatsappContact: "+249912000010",
    ownerName: "Nour El-Houda",
    ownerNameAr: "نور الهدى",
    ownerJoinedYear: 2025,
    photoSlots: 3,
    // ── Round 2 fields ──────────────────────────────────────────────────────
    createdAt: "2026-04-30T10:00:00Z",          // 11 days ago
    photos: [
      "https://d8j0ntlcm91z4.cloudfront.net/user_3CTdrgC2CdR16Mhg8ltaktkLuTj/hf_20260510_220944_105a36e6-52d3-48f9-8cb7-ee97ffaf37ce.png",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80",
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1600&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600&q=80",
    ],
    weeklyViews: 73,
    ownerOnline: true,
    ownerReplyTime: 2,
  },
  {
    id: "el-obeid-family-house",
    titleEn: "Four-bedroom house, El-Obeid",
    titleAr: "منزل أربع غرف، الأبيض",
    descriptionEn:
      "Family house in central El-Obeid, North Kordofan. Four bedrooms, two bathrooms, large hosh with mature trees, separate kitchen, and a generator-ready power line. Walking distance to the gum arabic souq.",
    descriptionAr:
      "منزل عائلي في وسط الأبيض، شمال كردفان. أربع غرف نوم، حمامان، حوش كبير بأشجار، مطبخ منفصل، وخط كهرباء جاهز للمولد. قرب سوق الصمغ العربي.",
    propertyType: "house",
    purpose: "sale",
    state: "north_kordofan",
    city: "El-Obeid",
    cityAr: "الأبيض",
    neighborhood: "El Obeid",
    neighborhoodAr: "الأبيض",
    latitude: 13.1842,
    longitude: 30.2167,
    bedrooms: 4,
    bathrooms: 2,
    areaSqm: 300,
    priceUsd: 52000,
    period: "total",
    amenities: ["garden", "water_tank", "parking"],
    tier: "standard",
    whatsappContact: "+249912000011",
    ownerName: "Mubarak Saleh",
    ownerNameAr: "مبارك صالح",
    ownerJoinedYear: 2024,
    photoSlots: 4,
    // ── Round 2 fields ──────────────────────────────────────────────────────
    createdAt: "2026-04-22T09:00:00Z",          // 19 days ago
    photos: [
      "https://d8j0ntlcm91z4.cloudfront.net/user_3CTdrgC2CdR16Mhg8ltaktkLuTj/hf_20260510_225224_894fa9d6-0d7c-4dae-bf45-584444df7143.png",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1600&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=80",
    ],
    weeklyViews: 41,
    previousPriceUsd: 58000,                    // Price reduced
    ownerOnline: false,
    ownerReplyTime: 8,
  },
  {
    id: "kadugli-modest-house",
    titleEn: "Two-bedroom house, Kadugli",
    titleAr: "منزل غرفتين، كادقلي",
    descriptionEn:
      "Modest single-storey home in Kadugli, South Kordofan. Two bedrooms, fenced yard, water tank, and a small kitchen. Practical for a small family or remote worker.",
    descriptionAr:
      "منزل بسيط بطابق واحد في كادقلي، جنوب كردفان. غرفتا نوم، فناء مسوّر، خزان مياه، ومطبخ صغير. مناسب لعائلة صغيرة أو عامل عن بُعد.",
    propertyType: "house",
    purpose: "rent",
    state: "south_kordofan",
    city: "Kadugli",
    cityAr: "كادقلي",
    neighborhood: "Kadugli",
    neighborhoodAr: "كادقلي",
    latitude: 11.0167,
    longitude: 29.7167,
    bedrooms: 2,
    bathrooms: 1,
    areaSqm: 130,
    priceUsd: 170,
    priceSdg: 102000,
    period: "month",
    amenities: ["water_tank", "garden"],
    tier: "standard",
    whatsappContact: "+249912000012",
    ownerName: "Yousif Adam",
    ownerNameAr: "يوسف آدم",
    ownerJoinedYear: 2025,
    photoSlots: 3,
    // ── Round 2 fields ──────────────────────────────────────────────────────
    createdAt: "2026-04-12T13:00:00Z",          // 29 days ago
    photos: [
      "https://d8j0ntlcm91z4.cloudfront.net/user_3CTdrgC2CdR16Mhg8ltaktkLuTj/hf_20260510_225227_f5b855fd-1365-427e-b8d8-1ba724208135.png",
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1600&q=80",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1600&q=80",
    ],
    weeklyViews: 22,
    ownerAvatar: "https://i.pravatar.cc/120?img=25",
    ownerOnline: false,
    ownerReplyTime: 6,
  },
  {
    id: "el-fula-residential-plot",
    titleEn: "Residential land plot, El-Fula",
    titleAr: "قطعة أرض سكنية، الفولة",
    descriptionEn:
      "500 m² residential plot in West Kordofan. Cleared, fenced, and titled. Adjacent to a paved road and a primary school. Good for build-to-own.",
    descriptionAr:
      "قطعة أرض سكنية 500 م² في غرب كردفان. مسوّرة، نظيفة، ولها صك. بجوار طريق إسفلت ومدرسة ابتدائية. مناسبة للبناء الذاتي.",
    propertyType: "land",
    purpose: "sale",
    state: "west_kordofan",
    city: "El-Fula",
    cityAr: "الفولة",
    neighborhood: "Al Fula",
    neighborhoodAr: "الفولة",
    latitude: 11.7329,
    longitude: 28.3579,
    areaSqm: 500,
    priceUsd: 18000,
    period: "total",
    amenities: [],
    tier: "standard",
    whatsappContact: "+249912000013",
    ownerName: "Adam Hassan",
    ownerNameAr: "آدم حسن",
    ownerJoinedYear: 2024,
    photoSlots: 2,
    // ── Round 2 fields ──────────────────────────────────────────────────────
    createdAt: "2026-04-17T10:00:00Z",          // 24 days ago
    photos: [
      "https://d8j0ntlcm91z4.cloudfront.net/user_3CTdrgC2CdR16Mhg8ltaktkLuTj/hf_20260510_225230_d8ccfe5f-fdb9-4361-9e04-9224cb928d99.png",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80",
      "https://images.unsplash.com/photo-1565098772267-60af42b81ef2?w=1600&q=80",
    ],
    weeklyViews: 18,
    ownerOnline: false,
    ownerReplyTime: 8,
  },
  {
    id: "el-fasher-modest-home",
    titleEn: "Three-bedroom home, El-Fasher",
    titleAr: "منزل ثلاث غرف، الفاشر",
    descriptionEn:
      "Walled family compound near central El-Fasher, North Darfur. Three bedrooms, traditional kitchen, two water tanks, and solar panels for daily power. Owner is selling to relocate to Khartoum.",
    descriptionAr:
      "مجمع عائلي مسوّر قرب وسط الفاشر، شمال دارفور. ثلاث غرف نوم، مطبخ تقليدي، خزانا مياه، وألواح شمسية للكهرباء اليومية. المالك يبيع للانتقال إلى الخرطوم.",
    propertyType: "house",
    purpose: "sale",
    state: "north_darfur",
    city: "El-Fasher",
    cityAr: "الفاشر",
    neighborhood: "El Fasher",
    neighborhoodAr: "الفاشر",
    latitude: 13.6279,
    longitude: 25.3494,
    bedrooms: 3,
    bathrooms: 1,
    areaSqm: 220,
    priceUsd: 32000,
    period: "total",
    amenities: ["solar", "water_tank", "garden", "security"],
    tier: "standard",
    whatsappContact: "+249912000014",
    ownerName: "Ibrahim Suleiman",
    ownerNameAr: "إبراهيم سليمان",
    ownerJoinedYear: 2024,
    photoSlots: 3,
    // ── Round 2 fields ──────────────────────────────────────────────────────
    createdAt: "2026-04-19T08:00:00Z",          // 22 days ago
    photos: [
      "https://d8j0ntlcm91z4.cloudfront.net/user_3CTdrgC2CdR16Mhg8ltaktkLuTj/hf_20260510_225233_76125048-d79c-4a43-bbc8-8b5a04270578.png",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80",
    ],
    weeklyViews: 31,
    ownerAvatar: "https://i.pravatar.cc/120?img=52",
    ownerOnline: true,
    ownerReplyTime: 4,
  },
  {
    id: "nyala-villa-sale",
    titleEn: "Family villa, Nyala",
    titleAr: "فيلا عائلية، نيالا",
    descriptionEn:
      "Recently renovated villa in Al-Wahda district, Nyala, South Darfur. Five bedrooms, two living rooms, a paved driveway, and a generator room. Mature lemon and date trees in the garden.",
    descriptionAr:
      "فيلا حديثة التجديد في حي الوحدة، نيالا، جنوب دارفور. خمس غرف نوم، صالتان، مدخل مرصوف، وغرفة مولد. أشجار ليمون ونخيل في الحديقة.",
    propertyType: "villa",
    purpose: "sale",
    state: "south_darfur",
    city: "Nyala",
    cityAr: "نيالا",
    neighborhood: "Al-Wahda",
    neighborhoodAr: "الوحدة",
    latitude: 12.0489,
    longitude: 24.8807,
    bedrooms: 5,
    bathrooms: 3,
    areaSqm: 380,
    priceUsd: 78000,
    period: "total",
    amenities: ["generator", "water_tank", "garden", "security", "parking"],
    tier: "featured",
    whatsappContact: "+249912000015",
    ownerName: "Fatima Adam",
    ownerNameAr: "فاطمة آدم",
    ownerJoinedYear: 2024,
    photoSlots: 5,
    // ── Round 2 fields ──────────────────────────────────────────────────────
    createdAt: "2026-04-24T14:00:00Z",          // 17 days ago
    photos: [
      "https://d8j0ntlcm91z4.cloudfront.net/user_3CTdrgC2CdR16Mhg8ltaktkLuTj/hf_20260510_215646_eed081c1-2594-4fd6-826d-d84cfa8ce10a.png",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&q=80",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1600&q=80",
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=1600&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1600&q=80",
    ],
    weeklyViews: 152,
    ownerAvatar: "https://i.pravatar.cc/120?img=9",
    ownerOnline: true,
    ownerReplyTime: 2,
  },
  {
    id: "el-daein-farm-land",
    titleEn: "Agricultural land, El-Daein",
    titleAr: "أرض زراعية، الضعين",
    descriptionEn:
      "Five feddans of cleared agricultural land in East Darfur near El-Daein. Suitable for sorghum, millet, or seasonal vegetables. Existing well on the plot.",
    descriptionAr:
      "خمسة فدان أرض زراعية نظيفة في شرق دارفور قرب الضعين. مناسبة للذرة والدخن والخضروات الموسمية. بئر قائم في الأرض.",
    propertyType: "land",
    purpose: "sale",
    state: "east_darfur",
    city: "El-Daein",
    cityAr: "الضعين",
    neighborhood: "Ed Daein",
    neighborhoodAr: "الضعين",
    latitude: 11.4619,
    longitude: 26.1258,
    areaSqm: 21000,
    priceUsd: 24000,
    period: "total",
    amenities: ["water_tank"],
    tier: "standard",
    whatsappContact: "+249912000016",
    ownerName: "Bashir Mohamed",
    ownerNameAr: "بشير محمد",
    ownerJoinedYear: 2025,
    photoSlots: 2,
    // ── Round 2 fields ──────────────────────────────────────────────────────
    createdAt: "2026-04-23T11:00:00Z",          // 18 days ago
    photos: [
      "https://d8j0ntlcm91z4.cloudfront.net/user_3CTdrgC2CdR16Mhg8ltaktkLuTj/hf_20260510_225526_928bef76-2132-4247-8233-3634d287db8c.png",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80",
      "https://images.unsplash.com/photo-1565098772267-60af42b81ef2?w=1600&q=80",
    ],
    weeklyViews: 25,
    ownerOnline: false,
    ownerReplyTime: 7,
  },
  {
    id: "zalingei-small-home",
    titleEn: "Small family home, Zalingei",
    titleAr: "منزل عائلي صغير، زالنجي",
    descriptionEn:
      "Two-bedroom home in central Zalingei, Central Darfur. Brick construction, fenced yard, and a shared neighborhood well. Owner is open to a deferred-payment plan for diaspora buyers.",
    descriptionAr:
      "منزل بغرفتين في وسط زالنجي، وسط دارفور. بناء طوب، فناء مسوّر، وبئر مشترك مع الجيران. المالك مستعد لخطة دفع مؤجلة للمشترين المغتربين.",
    propertyType: "house",
    purpose: "sale",
    state: "central_darfur",
    city: "Zalingei",
    cityAr: "زالنجي",
    neighborhood: "Zalingei",
    neighborhoodAr: "زالنجي",
    latitude: 12.9095,
    longitude: 23.4706,
    bedrooms: 2,
    bathrooms: 1,
    areaSqm: 140,
    priceUsd: 22000,
    period: "total",
    amenities: ["water_tank", "garden"],
    tier: "standard",
    whatsappContact: "+249912000017",
    ownerName: "Hawa Yagoub",
    ownerNameAr: "حواء يعقوب",
    ownerJoinedYear: 2025,
    photoSlots: 3,
    // ── Round 2 fields ──────────────────────────────────────────────────────
    createdAt: "2026-04-14T09:00:00Z",          // 27 days ago
    photos: [
      "https://d8j0ntlcm91z4.cloudfront.net/user_3CTdrgC2CdR16Mhg8ltaktkLuTj/hf_20260510_225529_308298f9-4c84-465f-8b4c-e59735674228.png",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1600&q=80",
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1600&q=80",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1600&q=80",
    ],
    weeklyViews: 19,
    ownerAvatar: "https://i.pravatar.cc/120?img=38",
    ownerOnline: false,
    ownerReplyTime: 6,
  },
  {
    id: "el-geneina-compound",
    titleEn: "Family compound, El-Geneina",
    titleAr: "مجمع عائلي، الجنينة",
    descriptionEn:
      "Walled compound on the outskirts of El-Geneina, West Darfur. Main house with four bedrooms, two ancillary buildings, livestock pen, and a hand-pump well. Title deed verified.",
    descriptionAr:
      "مجمع مسوّر على أطراف الجنينة، غرب دارفور. منزل رئيسي بأربع غرف، مبنيان فرعيان، حظيرة مواشي، وبئر مع طلمبة يدوية. صك ملكية مؤكد.",
    propertyType: "house",
    purpose: "sale",
    state: "west_darfur",
    city: "El-Geneina",
    cityAr: "الجنينة",
    neighborhood: "El Geneina",
    neighborhoodAr: "الجنينة",
    latitude: 13.4526,
    longitude: 22.4472,
    bedrooms: 4,
    bathrooms: 2,
    areaSqm: 360,
    priceUsd: 38000,
    period: "total",
    amenities: ["water_tank", "garden", "security", "parking"],
    tier: "standard",
    whatsappContact: "+249912000018",
    ownerName: "Mariam Abakar",
    ownerNameAr: "مريم أبكر",
    ownerJoinedYear: 2024,
    photoSlots: 4,
    // ── Round 2 fields ──────────────────────────────────────────────────────
    createdAt: "2026-05-08T15:30:00Z",          // 3 days ago → NEW ribbon
    photos: [
      "https://d8j0ntlcm91z4.cloudfront.net/user_3CTdrgC2CdR16Mhg8ltaktkLuTj/hf_20260510_225531_e168e76a-eb88-4161-9897-43a6a04aa430.png",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80",
      "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=1600&q=80",
    ],
    weeklyViews: 37,
    previousPriceUsd: 43000,                    // Price reduced
    ownerOnline: true,
    ownerReplyTime: 3,
  },
  {
    id: "gedaref-farm",
    titleEn: "Mechanized sorghum farm, Gedaref",
    titleAr: "مزرعة ذرة ميكانيكية، القضارف",
    descriptionEn:
      "Twelve feddans of cleared mechanized farmland east of Gedaref city. Established access road, two boreholes, and a small storage shed. Strong yield region for sorghum and sesame.",
    descriptionAr:
      "اثنا عشر فدان أرض زراعية ميكانيكية شرق مدينة القضارف. طريق وصول قائم، بئران، ومخزن صغير. منطقة إنتاج عالية للذرة والسمسم.",
    propertyType: "land",
    purpose: "sale",
    state: "gedaref",
    city: "Gedaref",
    cityAr: "القضارف",
    neighborhood: "Gedaref",
    neighborhoodAr: "القضارف",
    latitude: 14.0349,
    longitude: 35.3834,
    areaSqm: 50400,
    priceUsd: 68000,
    period: "total",
    amenities: ["water_tank"],
    tier: "featured",
    whatsappContact: "+249912000019",
    ownerName: "Salah El-Tigani",
    ownerNameAr: "صلاح التجاني",
    ownerJoinedYear: 2024,
    photoSlots: 4,
    // ── Round 2 fields ──────────────────────────────────────────────────────
    createdAt: "2026-04-21T10:00:00Z",          // 20 days ago
    photos: [
      "https://d8j0ntlcm91z4.cloudfront.net/user_3CTdrgC2CdR16Mhg8ltaktkLuTj/hf_20260510_215733_645c6272-abab-4872-9928-a8c9199c2e97.png",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80",
      "https://images.unsplash.com/photo-1565098772267-60af42b81ef2?w=1600&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80",
    ],
    weeklyViews: 127,
    ownerAvatar: "https://i.pravatar.cc/120?img=65",
    ownerOnline: true,
    ownerReplyTime: 1,
  },
  {
    id: "dongola-date-farm",
    titleEn: "Date palm farm, Dongola",
    titleAr: "مزرعة نخيل، دنقلا",
    descriptionEn:
      "Three feddans along the Nile near Dongola, Northern state. ~80 mature medjool date palms in production, riverside well, and a small caretaker's house. Strong rental income from the harvest.",
    descriptionAr:
      "ثلاثة فدان على ضفاف النيل قرب دنقلا، الولاية الشمالية. حوالي 80 نخلة مجدول مثمرة، بئر على النهر، وغرفة صغيرة للمزارع. دخل قوي من موسم الحصاد.",
    propertyType: "land",
    purpose: "sale",
    state: "northern",
    city: "Dongola",
    cityAr: "دنقلا",
    neighborhood: "Dongola",
    neighborhoodAr: "دنقلا",
    latitude: 19.1816,
    longitude: 30.4749,
    areaSqm: 12600,
    priceUsd: 78000,
    period: "total",
    amenities: ["water_tank", "garden"],
    tier: "featured",
    whatsappContact: "+249912000020",
    ownerName: "Osman Hamad",
    ownerNameAr: "عثمان حمد",
    ownerJoinedYear: 2024,
    photoSlots: 5,
    // ── Round 2 fields ──────────────────────────────────────────────────────
    createdAt: "2026-04-29T08:00:00Z",          // 12 days ago
    photos: [
      "https://d8j0ntlcm91z4.cloudfront.net/user_3CTdrgC2CdR16Mhg8ltaktkLuTj/hf_20260510_215736_3e1af96e-2388-48e8-8cfc-3a72e1177e8f.png",
      "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=1600&q=80",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80",
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=1600&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80",
    ],
    weeklyViews: 183,
    previousPriceUsd: 88000,                    // Price reduced
    ownerAvatar: "https://i.pravatar.cc/120?img=41",
    ownerOnline: true,
    ownerReplyTime: 2,
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
