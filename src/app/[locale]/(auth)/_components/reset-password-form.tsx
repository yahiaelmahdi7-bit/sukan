"use client";

import { useActionState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { resetPassword, type ActionResult } from "../actions";

const initialState: ActionResult = { error: null };

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

  const inputClass =
    "w-full rounded-md bg-earth border border-gold/20 px-4 py-3.5 text-base text-parchment placeholder:text-mute focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition";
  const labelClass = "block mb-2 text-xs uppercase tracking-wider text-gold/80";

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label htmlFor="reset-password" className={labelClass}>
          {t("password")}
        </label>
        <input
          id="reset-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className={inputClass}
          placeholder="••••••••"
        />
        <p className="mt-1.5 text-xs text-mute-soft">{t("passwordMin")}</p>
      </div>

      <div>
        <label htmlFor="reset-confirm" className={labelClass}>
          {t("confirmPassword")}
        </label>
        <input
          id="reset-confirm"
          name="confirm_password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className={inputClass}
          placeholder="••••••••"
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-md border border-terracotta/30 bg-terracotta/10 px-4 py-3 text-sm text-terracotta"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-pill bg-terracotta py-3.5 text-base font-semibold text-parchment transition hover:bg-terracotta-deep disabled:opacity-60"
      >
        {pending && (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-parchment/30 border-t-parchment" />
        )}
        {t("passwordReset")}
      </button>
    </form>
  );
}
