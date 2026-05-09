import type { SudanState } from "@/lib/sample-listings";

export type DashboardStats = {
  totalListings: number;
  activeListings: number;
  viewsThisWeek: number;
  inquiriesCount: number;
  /** 30 numbers — one per day (oldest first) */
  viewsLast30Days: number[];
  /** views per state (all 18) */
  viewsByState: Record<SudanState, number>;
};

export function getMockStats(): DashboardStats {
  return {
    totalListings: 4,
    activeListings: 3,
    viewsThisWeek: 142,
    inquiriesCount: 6,
    viewsLast30Days: [
      8, 12, 5, 18, 22, 14, 9, 11, 25, 30, 17, 7, 21, 19, 13, 28, 35, 24, 16,
      10, 32, 27, 20, 15, 38, 42, 29, 18, 44, 37,
    ],
    viewsByState: {
      khartoum: 98,
      al_jazirah: 24,
      blue_nile: 6,
      sennar: 4,
      white_nile: 9,
      north_kordofan: 5,
      south_kordofan: 3,
      west_kordofan: 2,
      north_darfur: 4,
      south_darfur: 3,
      east_darfur: 1,
      central_darfur: 2,
      west_darfur: 1,
      kassala: 11,
      red_sea: 28,
      gedaref: 7,
      river_nile: 15,
      northern: 8,
    },
  };
}
