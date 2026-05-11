// TODO: i18n later — strings are hardcoded while payments.* namespace is pending

import { StatusPoller } from "./_components/status-poller";
import GlassPanel from "@/components/glass-panel";

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string; listingId?: string }>;
}

export default async function StripeSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { session_id, listingId } = await searchParams;

  if (!session_id) {
    console.warn("[stripe-success] session_id missing from search params");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: "var(--color-cream, #FDF8F0)" }}
    >
      <GlassPanel
        variant="warm"
        radius="glass"
        highlight
        shadow="lg"
        className="border border-white/55 p-8 sm:p-12 max-w-md w-full text-center"
      >
        {/* Gold checkmark icon */}
        <div
          className="mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(200,135,58,0.12)",
            boxShadow: "0 0 32px rgba(200,135,58,0.35)",
            border: "2px solid rgba(200,135,58,0.45)",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="40"
            height="40"
            fill="none"
            aria-hidden
          >
            <path
              d="M5 12l5 5L20 7"
              stroke="#C8873A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="font-display text-3xl text-ink mb-2">
          Payment received
        </h1>
        <p className="text-ink-mid text-sm mb-6 leading-relaxed">
          Your listing is going live — this usually takes just a few seconds.
        </p>

        {listingId ? (
          <StatusPoller listingId={listingId} />
        ) : (
          <p className="text-xs text-ink-mid mt-4">
            Your listing will be activated shortly. Visit your dashboard to
            check the status.
          </p>
        )}
      </GlassPanel>
    </main>
  );
}
