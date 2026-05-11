"use client";

import { useTransition } from "react";
import { verifyProfile, revokeVerification } from "./actions";

interface VerifyRowProps {
  userId: string;
  isVerified: boolean;
  labels: {
    verify: string;
    revoke: string;
    revokeConfirm: string;
    verifying: string;
    revoking: string;
  };
}

export default function VerifyRow({
  userId,
  isVerified,
  labels,
}: VerifyRowProps) {
  const [isPending, startTransition] = useTransition();

  function handleVerify() {
    startTransition(async () => {
      await verifyProfile(userId);
    });
  }

  function handleRevoke() {
    if (!window.confirm(labels.revokeConfirm)) return;
    startTransition(async () => {
      await revokeVerification(userId);
    });
  }

  if (isVerified) {
    return (
      <button
        onClick={handleRevoke}
        disabled={isPending}
        className="smooth-fast inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-ink-light/30 bg-white/40 px-3 py-1.5 text-xs font-semibold text-ink-mid backdrop-blur-sm hover:border-terracotta/40 hover:bg-terracotta/8 hover:text-terracotta disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? labels.revoking : labels.revoke}
      </button>
    );
  }

  return (
    <button
      onClick={handleVerify}
      disabled={isPending}
      className="smooth-fast inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-terracotta px-3 py-1.5 text-xs font-semibold text-white hover:bg-terracotta/85 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ boxShadow: "0 1px 8px 0 rgba(185,74,52,0.22)" }}
    >
      {isPending ? labels.verifying : labels.verify}
    </button>
  );
}
