import {
  Snowflake,
  Thermometer,
  Zap,
  Droplet,
  Sun,
  Wifi,
  Flame,
  Sofa,
  Package,
  ChefHat,
  Refrigerator,
  Microwave,
  WashingMachine,
  Utensils,
  Layout,
  Archive,
  UserRound,
  Car,
  Sparkles,
  BookOpen,
  Trees,
  Leaf,
  Waves,
  Building2,
  Home,
  Square,
  Shield,
  Video,
  Phone,
  Fence,
  Move3D,
  ParkingMeter,
  Warehouse,
  Dumbbell,
  Baby,
  type LucideIcon,
} from "lucide-react";

import type { Amenity } from "@/lib/sample-listings";

export type AmenityCategoryKey =
  | "essentials"
  | "kitchen"
  | "indoor"
  | "outdoor"
  | "security"
  | "parking"
  | "community";

export interface AmenityDef {
  slug: Amenity;
  icon: LucideIcon;
}

export interface AmenityCategory {
  key: AmenityCategoryKey;
  items: AmenityDef[];
}

export const AMENITY_CATEGORIES: AmenityCategory[] = [
  {
    key: "essentials",
    items: [
      { slug: "ac", icon: Snowflake },
      { slug: "heating", icon: Thermometer },
      { slug: "generator", icon: Zap },
      { slug: "water_tank", icon: Droplet },
      { slug: "solar", icon: Sun },
      { slug: "wifi", icon: Wifi },
      { slug: "hot_water", icon: Flame },
      { slug: "furnished", icon: Sofa },
      { slug: "semi_furnished", icon: Package },
      { slug: "unfurnished", icon: Home },
    ],
  },
  {
    key: "kitchen",
    items: [
      { slug: "fitted_kitchen", icon: ChefHat },
      { slug: "refrigerator", icon: Refrigerator },
      { slug: "oven", icon: Flame },
      { slug: "microwave", icon: Microwave },
      { slug: "dishwasher", icon: Utensils },
      { slug: "washing_machine", icon: WashingMachine },
    ],
  },
  {
    key: "indoor",
    items: [
      { slug: "balcony", icon: Layout },
      { slug: "builtin_wardrobes", icon: Archive },
      { slug: "storage_room", icon: Package },
      { slug: "maid_room", icon: UserRound },
      { slug: "driver_room", icon: Car },
      { slug: "majlis", icon: Sparkles },
      { slug: "dining_room", icon: Utensils },
      { slug: "study_room", icon: BookOpen },
    ],
  },
  {
    key: "outdoor",
    items: [
      { slug: "private_garden", icon: Trees },
      { slug: "shared_garden", icon: Leaf },
      { slug: "private_pool", icon: Waves },
      { slug: "shared_pool", icon: Waves },
      { slug: "rooftop", icon: Building2 },
      { slug: "bbq", icon: Flame },
      { slug: "yard", icon: Square },
      { slug: "garden", icon: Trees },
    ],
  },
  {
    key: "security",
    items: [
      { slug: "security", icon: Shield },
      { slug: "cctv", icon: Video },
      { slug: "intercom", icon: Phone },
      { slug: "gated_community", icon: Fence },
      { slug: "elevator", icon: Move3D },
    ],
  },
  {
    key: "parking",
    items: [
      { slug: "parking", icon: ParkingMeter },
      { slug: "covered_parking", icon: Car },
      { slug: "garage", icon: Warehouse },
    ],
  },
  {
    key: "community",
    items: [
      { slug: "gym", icon: Dumbbell },
      { slug: "playground", icon: Baby },
      { slug: "mosque_nearby", icon: Building2 },
    ],
  },
];

export const ALL_AMENITY_SLUGS: Amenity[] = AMENITY_CATEGORIES.flatMap((c) =>
  c.items.map((i) => i.slug),
);
