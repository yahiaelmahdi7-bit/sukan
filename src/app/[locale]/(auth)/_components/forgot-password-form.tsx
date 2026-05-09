"use client";

import { useActionState, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { requestPasswordReset, type ActionResult } from "../actions";

const initialState: ActionResult = { error: null };

export default function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [sent, setSent] = useState(false);

  const [state, formAction, pending] = useActionState(
    async (prevState: ActionResult, formData: FormData): Promise<ActionResult> => {
      formData.set("locale", locale);
      const result = await requestPasswordReset(prevState, formData);
      if (!result.error) setSent(true);
      return result;
    },
    initialState,
  );

  const inputClass =
    "w-full rounded-md bg-earth border border-gold/20 px-4 py-3.5 text-base text-parchment placeholder:text-mute focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition";
  const labelClass = "block mb-2 text-xs uppercase tracking-wider text-gold/80";

  if (sent) {
    return (
      <div className="rounded-md border border-gold/20 bg-gold/5 px-6 py-8 text-center">
        <p className="font-display text-xl text-parchment mb-2">{t("checkEmail")}</p>
        <p className="text-sm text-mute-soft">{t("passwordResetSent")}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label htmlFor="forgot-email" className={labelClass}>
          {t("email")}
        </label>
        <input
          id="forgot-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputClass}
          placeholder="you@example.com"
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
        {t("forgotPassword")}
      </button>
    </form>
  );
}
