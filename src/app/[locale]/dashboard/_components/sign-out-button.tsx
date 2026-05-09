"use client";

interface SignOutButtonProps {
  label: string;
}

export default function SignOutButton({ label }: SignOutButtonProps) {
  return (
    <button
      type="button"
      onClick={() => console.log("sign-out stub")}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] text-sm text-mute-soft hover:text-parchment hover:bg-earth-soft transition-colors"
    >
      <span className="text-base leading-none" aria-hidden>↩</span>
      {label}
    </button>
  );
}
