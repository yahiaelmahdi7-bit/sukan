"use client";

// Client component that wraps DashboardSidebar and infers active from pathname.
// This is a thin client boundary — logic is trivial, rendering stays in the server sidebar.
import { usePathname } from "@/i18n/navigation";
import DashboardSidebar, { type NavKey } from "./dashboard-sidebar";

const ROUTE_TO_KEY: Record<string, NavKey> = {
  "/dashboard/saved-searches": "savedSearches",
  "/dashboard/viewings": "viewings",
  "/dashboard/reports": "reports",
  "/dashboard/inquiries": "inquiries",
  "/dashboard/analytics": "analytics",
  "/dashboard/profile": "profile",
  "/dashboard/settings": "settings",
  "/dashboard/listings": "myListings",
};

interface SidebarNavProps {
  userName: string;
  signOutLabel: string;
  isAdmin?: boolean;
}

export default function SidebarNav({ userName, signOutLabel, isAdmin }: SidebarNavProps) {
  const pathname = usePathname();

  // Find the deepest matching route key (longest match wins)
  let active: NavKey = "myListings";
  let longestMatch = 0;
  for (const [route, key] of Object.entries(ROUTE_TO_KEY)) {
    const segment = route.replace("/dashboard", "");
    if (pathname.includes(segment) && segment.length > longestMatch) {
      active = key;
      longestMatch = segment.length;
    }
  }

  return (
    <DashboardSidebar
      active={active}
      userName={userName}
      signOutLabel={signOutLabel}
      isAdmin={isAdmin}
    />
  );
}
