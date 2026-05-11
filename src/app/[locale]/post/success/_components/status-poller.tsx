"use client";

// TODO: i18n later — strings are hardcoded while payments.* namespace is pending

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";

type PollerStatus = "polling" | "active" | "timeout" | "error";

const POLL_INTERVAL_MS = 2000;
const TIMEOUT_MS = 60000;

export function StatusPoller({ listingId }: { listingId: string }) {
  const locale = useLocale();
  const [pollerStatus, setPollerStatus] = useState<PollerStatus>("polling");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let stopped = false;

    async function poll() {
      try {
        const res = await fetch(`/api/listings/${listingId}/status`, {
          cache: "no-store",
        });
        if (!res.ok) {
          // Non-fatal — keep polling unless we time out
          return;
        }
        const data = (await res.json()) as { status?: string };
        if (data.status === "active" && !stopped) {
          stopped = true;
          clearInterval(intervalRef.current!);
          clearTimeout(timeoutRef.current!);
          setPollerStatus("active");
        }
      } catch {
        // Network error — keep polling
      }
    }

    // Poll immediately, then on interval
    poll();
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);

    // Hard timeout
    timeoutRef.current = setTimeout(() => {
      if (!stopped) {
        stopped = true;
        clearInterval(intervalRef.current!);
        setPollerStatus("timeout");
      }
    }, TIMEOUT_MS);

    return () => {
      stopped = true;
      clearInterval(intervalRef.current!);
      clearTimeout(timeoutRef.current!);
    };
  }, [listingId]);

  if (pollerStatus === "active") {
    return (
      <div className="flex flex-col items-center gap-4 mt-4">
        {/* Gold live badge */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
          style={{
            background: "linear-gradient(135deg, #c8873a 0%, #e0a857 100%)",
            color: "#12100C",
          }}
        >
          <svg
            viewBox="0 0 12 12"
            width="14"
            height="14"
            fill="none"
            aria-hidden
          >
            <path
              d="M2 6l3 3 5-5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Your listing is live!
        </div>
        <div className="flex gap-3">
          <Link
            href={`/${locale}/listings/${listingId}`}
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-cream smooth"
            style={{
              background: "linear-gradient(135deg, #c8401a 0%, #9d2f0f 100%)",
              boxShadow: "0 4px 16px rgba(200,64,26,0.35)",
            }}
          >
            View listing
          </Link>
          <Link
            href={`/${locale}/dashboard`}
            className="rounded-full border border-gold/55 px-5 py-2.5 text-sm font-semibold text-ink smooth hover:border-gold hover:bg-gold/10"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (pollerStatus === "timeout") {
    return (
      <div className="mt-4 text-center text-sm text-ink-mid max-w-xs mx-auto">
        Still processing — check back in a few minutes. Your payment was
        received and your listing will go live shortly.
        <div className="mt-3">
          <Link
            href={`/${locale}/dashboard`}
            className="text-gold-dk underline underline-offset-2 font-medium"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Polling state — pulsing dots
  return (
    <div className="flex flex-col items-center gap-3 mt-4">
      <div className="flex items-center gap-1.5" aria-live="polite" aria-label="Activating listing">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-gold/70 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
      <p className="text-xs text-ink-mid">Activating your listing…</p>
    </div>
  );
}
