"use client";

import { useState } from "react";
import DashboardSidebar, { type NavKey } from "./dashboard-sidebar";

interface MobileSidebarToggleProps {
  active: NavKey;
  userName: string;
  signOutLabel: string;
}

export default function MobileSidebarToggle({
  active,
  userName,
  signOutLabel,
}: MobileSidebarToggleProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button — only visible on small screens */}
      <button
        type="button"
        aria-label="Open navigation"
        onClick={() => setOpen(true)}
        className="lg:hidden p-2 rounded-lg text-mute-soft hover:text-parchment hover:bg-earth-soft transition-colors"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          aria-hidden
        >
          <rect x="2" y="5" width="18" height="2" rx="1" fill="currentColor" />
          <rect x="2" y="10" width="18" height="2" rx="1" fill="currentColor" />
          <rect x="2" y="15" width="18" height="2" rx="1" fill="currentColor" />
        </svg>
      </button>

      {/* Drawer overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex"
          onClick={() => setOpen(false)}
        >
          {/* Scrim */}
          <div className="absolute inset-0 bg-earth/70 backdrop-blur-sm" />

          {/* Drawer panel */}
          <div
            className="relative z-10 h-full ltr:ml-0 rtl:mr-0"
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
