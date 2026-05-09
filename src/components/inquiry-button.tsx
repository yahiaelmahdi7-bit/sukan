"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import type { Listing } from "@/lib/sample-listings";

// Lazy-load the modal so it is never bundled on first paint.
// The component is only mounted on the first click.
const InquiryModal = dynamic(() => import("@/components/inquiry-modal"), {
  ssr: false,
});

interface InquiryButtonProps {
  listing: Listing;
  className?: string;
  children?: React.ReactNode;
}

export default function InquiryButton({
  listing,
  className,
  children,
}: InquiryButtonProps) {
  const t = useTranslations("inquiry");
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const handleOpen = useCallback(() => {
    setHasOpened(true);
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={
          className ??
          "flex items-center justify-center rounded-[var(--radius-pill)] bg-terracotta hover:bg-terracotta-deep text-parchment font-semibold px-5 py-3.5 text-sm transition-colors w-full"
        }
      >
        {children ?? t("contactCta")}
      </button>

      {/* Render modal once it has been opened for the first time; keep it
          mounted (but hidden) after that so the form state is preserved
          if the user accidentally closes and re-opens during a session. */}
      {hasOpened && isOpen && (
        <InquiryModal listing={listing} onClose={handleClose} />
      )}
    </>
  );
}
