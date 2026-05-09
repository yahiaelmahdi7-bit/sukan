"use client";

import { useState, lazy, Suspense } from "react";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

// Lazily import the modal so the AI SDK bundle is not pulled into the
// initial page load — only loaded on first button click.
const AIMatchModal = lazy(() => import("@/components/ai-match-modal"));

interface AIMatchButtonProps {
  children?: React.ReactNode;
  className?: string;
}

export default function AIMatchButton({
  children,
  className,
}: AIMatchButtonProps) {
  const t = useTranslations("aiMatch");
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const handleOpen = () => {
    setMounted(true);
    setOpen(true);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className={
          className ??
          "inline-flex items-center gap-2 rounded-pill border border-gold/40 px-5 py-2.5 text-sm font-medium text-gold transition hover:border-gold hover:bg-gold/10"
        }
      >
        <Sparkles size={16} />
        {children ?? t("openButton")}
      </button>

      {mounted && (
        <Suspense fallback={null}>
          <AIMatchModal open={open} onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
