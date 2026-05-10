"use client";

import { useActionState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { GlassInput } from "@/components/ui/glass-input";
import { GlassButton } from "@/components/ui/glass-button";
import { resetPassword, type ActionResult } from "../actions";

const initialState: ActionResult = { error: null };

const labelClass =
  "block mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-dk";

function Spinner() {
  return (
    <span
      aria-hidden
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-cream/30 border-t-cream"
    />
  );
}

export default function ResetPasswordForm() {
  const t = useTranslations("auth");
  const [state, formAction, pending] = useActionState(resetPassword, initialState);

  // Exchange the hash token for a session as soon as the component mounts.
  // Supabase puts the token in the URL hash fragment (#access_token=...) after
  // the user clicks the reset email link. @supabase/supabase-js detects this
  // automatically via onAuthStateChange and exchanges it for a session.
  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, _session) => {
      // Session is now active — the form can now call resetPassword (updateUser).
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label htmlFor="reset-password" className={labelClass}>
          {t("password")}
        </label>
        <GlassInput
          id="reset-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          tone="light"
          placeholder="••••••••"
        />
        <p className="mt-1.5 text-xs text-ink-mid">{t("passwordMin")}</p>
      </div>

      <div>
        <label htmlFor="reset-confirm" className={labelClass}>
          {t("confirmPassword")}
        </label>
        <GlassInput
          id="reset-confirm"
          name="confirm_password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          tone="light"
          placeholder="••••••••"
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-[var(--radius-glass)] border border-terracotta/20 bg-terracotta/8 px-4 py-2.5 text-sm text-terracotta-deep"
        >
          {state.error}
        </p>
      )}

      <GlassButton
        type="submit"
        variant="terracotta"
        size="lg"
        full
        disabled={pending}
        leading={pending ? <Spinner /> : undefined}
      >
        {t("passwordReset")}
      </GlassButton>
    </form>
  );
}
