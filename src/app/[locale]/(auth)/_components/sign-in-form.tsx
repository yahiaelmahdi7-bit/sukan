"use client";

import { useActionState, useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { GlassInput } from "@/components/ui/glass-input";
import { GlassButton } from "@/components/ui/glass-button";
import { signIn, signInWithMagicLink, type ActionResult } from "../actions";

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

function ErrorPill({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="rounded-[var(--radius-glass)] border border-terracotta/20 bg-terracotta/8 px-4 py-2.5 text-sm text-terracotta-deep"
    >
      {message}
    </p>
  );
}

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

  return (
    <div className="flex flex-col gap-6">
      {/* Password sign-in */}
      <form action={formAction} className="flex flex-col gap-5">
        <input type="hidden" name="locale" value={locale} />

        <div>
          <label htmlFor="signin-email" className={labelClass}>
            {t("email")}
          </label>
          <GlassInput
            id="signin-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            tone="light"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="signin-password" className={labelClass}>
            {t("password")}
          </label>
          <GlassInput
            id="signin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            tone="light"
            placeholder="••••••••"
          />
        </div>

        {state.error && (
          <ErrorPill
            message={
              state.error === "Invalid login credentials"
                ? t("signInFailed")
                : state.error
            }
          />
        )}

        <div className="flex justify-end rtl:justify-start">
          <Link
            href="/forgot-password"
            className="text-xs text-terracotta/70 transition hover:text-terracotta"
          >
            {t("forgotPassword")}
          </Link>
        </div>

        <GlassButton
          type="submit"
          variant="terracotta"
          size="lg"
          full
          disabled={pending}
          leading={pending ? <Spinner /> : undefined}
        >
          {t("signIn")}
        </GlassButton>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <span className="flex-1 border-t border-gold/20" />
        <span className="rounded-full bg-cream px-3 py-0.5 text-xs text-ink-mid">
          {t("or")}
        </span>
        <span className="flex-1 border-t border-gold/20" />
      </div>

      {/* Magic link */}
      {magicSent ? (
        <div className="rounded-[var(--radius-glass)] border border-gold/25 bg-gold/6 px-5 py-4 text-center">
          <p className="text-sm font-medium text-gold-dk">{t("magicLinkSent")}</p>
        </div>
      ) : (
        <form action={handleMagicAction} className="flex flex-col gap-4">
          <div>
            <label htmlFor="magic-email" className={labelClass}>
              {t("continueWithEmail")}
            </label>
            <GlassInput
              id="magic-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              tone="light"
              placeholder="you@example.com"
            />
          </div>

          {magicState.error && <ErrorPill message={magicState.error} />}

          <GlassButton
            type="submit"
            variant="ghost-light"
            size="lg"
            full
            disabled={magicPending}
            leading={magicPending ? <Spinner /> : undefined}
          >
            {t("useMagicLink")}
          </GlassButton>
        </form>
      )}
    </div>
  );
}
