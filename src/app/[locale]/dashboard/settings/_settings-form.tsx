"use client";

import { useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { GlassButton } from "@/components/ui/glass-button";
import type { Locale } from "@/i18n/routing";

interface SettingsFormProps {
  locale: string;
  labels: {
    notificationsTitle: string;
    notificationsBody: string;
    emailOnInquiry: string;
    weeklyDigest: string;
    languagePreference: string;
    saveChanges: string;
  };
}

function Toggle({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center justify-between gap-4 cursor-pointer py-3 border-b border-white/30 last:border-0"
    >
      <span className="text-sm text-ink">{label}</span>
      <div className="relative shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={[
            "smooth w-10 h-6 rounded-full",
            checked ? "bg-terracotta" : "bg-sand-dk/60",
          ].join(" ")}
        />
        <div
          className={[
            "smooth absolute top-1 w-4 h-4 rounded-full bg-cream shadow",
            checked ? "ltr:translate-x-5 rtl:-translate-x-5" : "ltr:translate-x-1 rtl:-translate-x-1",
          ].join(" ")}
        />
      </div>
    </label>
  );
}

export default function SettingsForm({ locale: _locale, labels }: SettingsFormProps) {
  const [emailOnInquiry, setEmailOnInquiry] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [saved, setSaved] = useState(false);
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  function flipLocale() {
    const next: Locale = currentLocale === "en" ? "ar" : "en";
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    console.log("save-settings stub", { emailOnInquiry, weeklyDigest });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <form
      onSubmit={handleSave}
      className="glass-warm glass-highlight rounded-[var(--radius-card)] border border-white/55 p-7 flex flex-col gap-6"
      style={{ boxShadow: "var(--shadow-glass)" }}
    >
      {/* Notifications */}
      <div>
        <h2 className="font-display text-xl text-ink mb-1">
          {labels.notificationsTitle}
        </h2>
        <p className="text-sm text-ink-mid mb-5">{labels.notificationsBody}</p>

        <Toggle
          id="email-inquiry"
          label={labels.emailOnInquiry}
          checked={emailOnInquiry}
          onChange={setEmailOnInquiry}
        />
        <Toggle
          id="weekly-digest"
          label={labels.weeklyDigest}
          checked={weeklyDigest}
          onChange={setWeeklyDigest}
        />
      </div>

      {/* Language preference */}
      <div className="border-t border-white/30 pt-6">
        <h3 className="text-sm font-semibold text-ink mb-4">
          {labels.languagePreference}
        </h3>
        <div className="flex gap-3">
          {(["en", "ar"] as Locale[]).map((loc) => (
            <button
              key={loc}
              type="button"
              disabled={pending}
              onClick={flipLocale}
              className={[
                "smooth-fast px-5 py-2.5 rounded-[var(--radius-pill)] border text-sm font-medium backdrop-blur-sm",
                currentLocale === loc
                  ? "border-white/70 bg-white/70 text-ink"
                  : "border-white/55 bg-white/40 text-ink-mid hover:border-gold/40 hover:text-ink",
              ].join(" ")}
              style={
                currentLocale === loc
                  ? { boxShadow: "var(--shadow-gold-glow)" }
                  : undefined
              }
            >
              {loc === "en" ? "English" : "العربية"}
            </button>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-4 pt-2">
        <GlassButton type="submit" variant="terracotta" size="md">
          {labels.saveChanges}
        </GlassButton>
        {saved && (
          <span className="text-sm text-gold animate-pulse">✓ Saved</span>
        )}
      </div>
    </form>
  );
}
