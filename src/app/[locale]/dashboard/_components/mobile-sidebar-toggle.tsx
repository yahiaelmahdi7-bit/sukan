"use client";

import { useState, useEffect, useRef } from "react";
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
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      {/* Glass pill hamburger button — only visible on small screens */}
      <button
        ref={triggerRef}
        type="button"
        aria-label="Open navigation"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(true)}
        className="smooth-fast lg:hidden w-9 h-9 flex items-center justify-center rounded-full border border-white/60 bg-white/40 text-ink-mid hover:border-gold/50 hover:text-ink hover:bg-gold/10 backdrop-blur-sm"
      >
        <svg
          width="18"
          height="18"
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
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          className="fixed inset-0 z-50 flex"
          onClick={() => { setOpen(false); triggerRef.current?.focus(); }}
        >
          {/* Frosted cream scrim */}
          <div className="absolute inset-0 bg-cream/60 backdrop-blur-sm" />

          {/* Drawer panel */}
          <div
            className="relative z-10 h-full ps-3 pt-4 pb-6"
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
