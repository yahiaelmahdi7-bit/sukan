// Region groupings for Sudan's 18 states.
// Diaspora users think regionally; locals think neighborhood-first.
// State slugs must exactly match SUDAN_STATES in sample-listings.ts.

export type RegionKey =
  | "greater_khartoum"
  | "northern"
  | "eastern"
  | "central"
  | "kordofan"
  | "darfur";

export type Region = {
  key: RegionKey;
  nameEn: string;
  nameAr: string;
  states: string[]; // state slugs matching SudanState
};

export const regions: Region[] = [
  {
    key: "greater_khartoum",
    nameEn: "Greater Khartoum",
    nameAr: "الخرطوم الكبرى",
    states: ["khartoum"],
  },
  {
    key: "northern",
    nameEn: "Northern",
    nameAr: "الشمالية",
    states: ["northern", "river_nile"],
  },
  {
    key: "eastern",
    nameEn: "Eastern",
    nameAr: "الشرق",
    states: ["red_sea", "kassala", "gedaref"],
  },
  {
    key: "central",
    nameEn: "Central",
    nameAr: "الوسط",
    states: ["al_jazirah", "white_nile", "sennar", "blue_nile"],
  },
  {
    key: "kordofan",
    nameEn: "Kordofan",
    nameAr: "كردفان",
    states: ["north_kordofan", "south_kordofan", "west_kordofan"],
  },
  {
    key: "darfur",
    nameEn: "Darfur",
    nameAr: "دارفور",
    states: [
      "north_darfur",
      "south_darfur",
      "east_darfur",
      "west_darfur",
      "central_darfur",
    ],
  },
];

/** Returns the region that contains a given state slug, or null. */
export function getRegionByState(state: string): Region | null {
  return regions.find((r) => r.states.includes(state)) ?? null;
}

/** Returns the state slugs for a given region key. */
export function getStatesInRegion(regionKey: RegionKey): string[] {
  return regions.find((r) => r.key === regionKey)?.states ?? [];
}

/** Returns the region that matches a given region key, or null. */
export function getRegionByKey(regionKey: string): Region | null {
  return regions.find((r) => r.key === regionKey) ?? null;
}
