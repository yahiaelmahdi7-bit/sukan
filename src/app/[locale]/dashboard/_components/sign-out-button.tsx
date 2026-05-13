"use client";

import { signOut } from "@/app/[locale]/(auth)/actions";

interface SignOutButtonProps {
  label: string;
}

export default function SignOutButton({ label }: SignOutButtonProps) {
  return (
    <button
      type="button"
      onClick={() => signOut()}
      className="smooth-fast w-full flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-pill)] text-sm text-ink-mid hover:text-terracotta hover:bg-white/50 border border-transparent hover:border-terracotta/20"
    >
      <span className="text-base leading-none" aria-hidden>
        ↩
      </span>
      {label}
    </button>
  );
}
