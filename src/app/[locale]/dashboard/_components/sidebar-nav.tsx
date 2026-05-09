"use client";

// Client component that wraps DashboardSidebar and infers active from pathname.
// This is a thin client boundary — logic is trivial, rendering stays in the server sidebar.
import { usePathname } from "@/i18n/navigation";
import DashboardSidebar, { type NavKey } from "./dashboard-sidebar";

const ROUTE_TO_KEY: Record<string, NavKey> = {
  "/dashboard/inquiries": "inquiries",
  "/dashboard/analytics": "analytics",
  "/dashboard/profile": "profile",
  "/dashboard/settings": "settings",
  "/dashboard/listings": "myListings",
};

interface SidebarNavProps {
  userName: string;
  signOutLabel: string;
}

export default function SidebarNav({ userName, signOutLabel }: SidebarNavProps) {
  const pathname = usePathname();

  // Find the deepest matching route key
  let active: NavKey = "myListings";
  for (const [route, key] of Object.entries(ROUTE_TO_KEY)) {
    if (pathname.includes(route.replace("/dashboard", ""))) {
      active = key;
      break;
    }
  }

  return (
    <DashboardSidebar
      active={active}
      userName={userName}
      signOutLabel={signOutLabel}
    />
  );
}
