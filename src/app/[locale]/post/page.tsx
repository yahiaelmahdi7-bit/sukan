import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PostWizard from "./_components/post-wizard";

// ─── Step progress metadata ──────────────────────────────────────────────────

function StepDot({
  index,
  label,
  total,
}: {
  index: number;
  label: string;
  total: number;
}) {
  // Static server-side "step 1 active" progress bar — client wizard takes over
  // after hydration. We render step 1 as the initial active state.
  const isFirst = index === 0;
  return (
    <div className="flex flex-col items-center gap-1.5 flex-1">
      {/* Dot + connector row */}
      <div className="flex items-center w-full">
        {/* Leading connector (not for first dot) */}
        {index > 0 && (
          <div className="h-px flex-1 bg-gold/20" />
        )}

        {/* Dot */}
        <div
          className={[
            "relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border-2",
            isFirst
              ? "bg-terracotta border-terracotta text-parchment"
              : "bg-transparent border-gold/30 text-mute",
          ].join(" ")}
        >
          {index + 1}
        </div>

        {/* Trailing connector (not for last dot) */}
        {index < total - 1 && (
          <div className="h-px flex-1 bg-gold/20" />
        )}
      </div>

      {/* Label — hidden on mobile except step 1 */}
      <span
        className={[
          "text-xs text-center leading-tight",
          isFirst ? "text-parchment font-semibold" : "text-mute hidden sm:block",
        ].join(" ")}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Hero band ───────────────────────────────────────────────────────────────

function PostHero() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const t = useTranslations("post");

  const steps = [
    t("step1"),
    t("step2"),
    t("step3"),
    t("step4"),
  ] as const;

  return (
    <div className="relative bg-earth overflow-hidden">
      {/* Ambient gold radial haze */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 end-0 w-[500px] h-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at 70% 30%, rgba(200,135,58,0.14) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 pt-14 pb-10">
        {/* Eyebrow */}
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          {t("title")}
        </p>

        {/* Headline */}
        <h1 className="font-display text-4xl sm:text-5xl text-parchment leading-tight mb-3">
          {t("title")}
        </h1>

        {/* Subtitle */}
        <p className="text-mute-soft text-base mb-10 max-w-xl">
          {t("subtitle")}
        </p>

        {/* 4-step progress — static SSR shell (client wizard re-renders this interactively) */}
        <div className="flex items-start gap-0 w-full" aria-label={t("title")} role="navigation">
          {steps.map((label, i) => (
            <StepDot key={i} index={i} label={label} total={steps.length} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-earth pb-24">
        <PostHero />

        {/* Wave divider */}
        <div className="wave-divider opacity-30 my-0" />

        {/* Wizard */}
        <div className="mx-auto max-w-3xl px-4 sm:px-6 mt-10">
          <PostWizard />
        </div>
      </main>

      <Footer />
    </>
  );
}
