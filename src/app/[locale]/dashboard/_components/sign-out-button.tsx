"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/app/[locale]/(auth)/actions";

interface SignOutButtonProps {
  label: string;
}

export default function SignOutButton({ label }: SignOutButtonProps) {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errored, setErrored] = useState(false);

  function handleClick() {
    if (isPending) return;
    setErrored(false);
    startTransition(async () => {
      try {
        // 1. Clear browser-side auth: localStorage tokens + cookies the
        //    JS client can see. Belt-and-suspenders alongside the server
        //    action so no stale token survives in the tab.
        const supabase = createClient();
        await supabase.auth.signOut();

        // 2. Server action clears server-readable auth cookies via Set-Cookie
        //    response headers and revalidates the route cache. Returns an
        //    ActionResult instead of redirecting — more reliable than catching
        //    NEXT_REDIRECT from an onClick-invoked server action.
        const result = await signOut();
        if (result.error) throw new Error(result.error);

        // 3. Drive the navigation client-side. router.refresh() re-runs the
        //    server tree so the dashboard layout's auth guard sees the
        //    cleared session and any cached layout is rebuilt.
        router.replace("/");
        router.refresh();
      } catch {
        setErrored(true);
        setTimeout(() => setErrored(false), 3500);
      }
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-busy={isPending}
        className="smooth-fast w-full flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-pill)] text-sm text-ink-mid hover:text-terracotta hover:bg-white/50 border border-transparent hover:border-terracotta/20 disabled:opacity-60 disabled:cursor-wait"
      >
        <span className="text-base leading-none" aria-hidden>
          ↩
        </span>
        {isPending ? t("signingOut") : label}
      </button>
      {errored && (
        <p role="alert" className="mt-2 px-4 text-xs text-terracotta">
          {t("signOutError")}
        </p>
      )}
    </div>
  );
}
