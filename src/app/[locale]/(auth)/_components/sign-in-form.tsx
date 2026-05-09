"use client";

import { useActionState, useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { signIn, signInWithMagicLink, type ActionResult } from "../actions";

const initialState: ActionResult = { error: null };

export default function SignInForm() {
  const t = useTranslations("auth");
  const locale = useLocale();

  // Password sign-in
  const [state, formAction, pending] = useActionState(signIn, initialState);

  // Magic link — call the server action directly, track state locally
  const [magicState, setMagicState] = useState<ActionResult>(initialState);
  const [magicSent, setMagicSent] = useState(false);
  const [magicPending, startMagicTransition] = useTransition();

  function handleMagicAction(formData: FormData) {
    startMagicTransition(async () => {
      formData.set("locale", locale);
      const result = await signInWithMagicLink(magicState, formData);
      setMagicState(result);
      if (!result.error) setMagicSent(true);
    });
  }

  const inputClass =
    "w-full rounded-md bg-earth border border-gold/20 px-4 py-3.5 text-base text-parchment placeholder:text-mute focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition";
  const labelClass = "block mb-2 text-xs uppercase tracking-wider text-gold/80";

  return (
    <div className="flex flex-col gap-6">
      {/* Password sign-in */}
      <form action={formAction} className="flex flex-col gap-5">
        <input type="hidden" name="locale" value={locale} />

        <div>
          <label htmlFor="signin-email" className={labelClass}>
            {t("email")}
          </label>
          <input
            id="signin-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="signin-password" className={labelClass}>
            {t("password")}
          </label>
          <input
            id="signin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={inputClass}
            placeholder="••••••••"
          />
        </div>

        {state.error && (
          <p
            role="alert"
            className="rounded-md border border-terracotta/30 bg-terracotta/10 px-4 py-3 text-sm text-terracotta"
          >
            {state.error === "Invalid login credentials"
              ? t("signInFailed")
              : state.error}
          </p>
        )}

        <div className="flex justify-end">
          <a
            href={`/${locale}/forgot-password`}
            className="text-xs text-gold/70 hover:text-gold transition"
          >
            {t("forgotPassword")}
          </a>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="flex w-full items-center justify-center gap-2 rounded-pill bg-terracotta py-3.5 text-base font-semibold text-parchment transition hover:bg-terracotta-deep disabled:opacity-60"
        >
          {pending && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-parchment/30 border-t-parchment" />
          )}
          {t("signIn")}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <span className="flex-1 border-t border-gold/10" />
        <span className="text-xs text-mute-soft">{t("or")}</span>
        <span className="flex-1 border-t border-gold/10" />
      </div>

      {/* Magic link */}
      {magicSent ? (
        <p className="rounded-md border border-gold/20 bg-gold/5 px-4 py-3 text-sm text-parchment-warm text-center">
          {t("magicLinkSent")}
        </p>
      ) : (
        <form action={handleMagicAction} className="flex flex-col gap-4">
          <div>
            <label htmlFor="magic-email" className={labelClass}>
              {t("continueWithEmail")}
            </label>
            <input
              id="magic-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>

          {magicState.error && (
            <p
              role="alert"
              className="rounded-md border border-terracotta/30 bg-terracotta/10 px-4 py-3 text-sm text-terracotta"
            >
              {magicState.error}
            </p>
          )}

          <button
            type="submit"
            disabled={magicPending}
            className="flex w-full items-center justify-center gap-2 rounded-pill border border-gold/30 py-3.5 text-base font-medium text-parchment transition hover:border-gold/60 hover:bg-gold/5 disabled:opacity-60"
          >
            {magicPending && (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-parchment/30 border-t-parchment" />
            )}
            {t("useMagicLink")}
          </button>
        </form>
      )}
    </div>
  );
}
