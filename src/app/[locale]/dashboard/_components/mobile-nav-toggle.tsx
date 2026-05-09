"use client";

import { useState } from "react";
import { usePathname } from "@/i18n/navigation";
import DashboardSidebar, { type NavKey } from "./dashboard-sidebar";

const ROUTE_TO_KEY: Record<string, NavKey> = {
  "/dashboard/inquiries": "inquiries",
  "/dashboard/analytics": "analytics",
  "/dashboard/profile": "profile",
  "/dashboard/settings": "settings",
  "/dashboard/listings": "myListings",
};

interface MobileNavToggleProps {
  userName: string;
  signOutLabel: string;
}

export default function MobileNavToggle({
  userName,
  signOutLabel,
}: MobileNavToggleProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  let active: NavKey = "myListings";
  for (const [route, key] of Object.entries(ROUTE_TO_KEY)) {
    if (pathname.includes(route.replace("/dashboard", ""))) {
      active = key;
      break;
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label="Open navigation"
        onClick={() => setOpen(true)}
        className="lg:hidden p-2 rounded-lg text-mute-soft hover:text-parchment hover:bg-earth-soft transition-colors"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
          <rect x="2" y="5" width="18" height="2" rx="1" fill="currentColor" />
          <rect x="2" y="10" width="18" height="2" rx="1" fill="currentColor" />
          <rect x="2" y="15" width="18" height="2" rx="1" fill="currentColor" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-earth/70 backdrop-blur-sm" />
          <div
            className="relative z-10 h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <DashboardSidebar
              active={active}
              userName={userName}
              signOutLabel={signOutLabel}
            />
          </div>
        </div>
      )}
    </>
  );
}
