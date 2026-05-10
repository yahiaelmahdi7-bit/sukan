import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PostWizard from "./_components/post-wizard";

// ─── Step pill (server-side SSR shell) ──────────────────────────────────────

function StepPill({
  index,
  label,
  total,
}: {
  index: number;
  label: string;
  total: number;
}) {
  const isFirst = index === 0;

  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      {/* Connector + badge row */}
      <div className="flex items-center w-full">
        {/* Leading connector */}
        {index > 0 && (
          <div
            className={[
              "h-px flex-1 transition-colors",
              isFirst ? "bg-gold/50" : "bg-gold/20",
            ].join(" ")}
          />
        )}

        {/* Badge */}
        <div
          className={[
            "relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border-2 smooth",
            isFirst
              ? "border-terracotta text-cream"
              : "border-gold/30 text-mute bg-earth-soft/60",
          ].join(" ")}
          style={
            isFirst
              ? {
                  background: "linear-gradient(135deg, #c8401a 0%, #9d2f0f 100%)",
                  boxShadow: "var(--shadow-terracotta-glow)",
                }
              : undefined
          }
          aria-current={isFirst ? "step" : undefined}
        >
          {index + 1}
        </div>

        {/* Trailing connector */}
        {index < total - 1 && (
          <div className="h-px flex-1 bg-gold/20" />
        )}
      </div>

      {/* Label */}
      <span
        className={[
          "text-xs text-center leading-tight",
          isFirst
            ? "text-parchment font-semibold"
            : "text-mute hidden sm:block",
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
            "radial-gradient(ellipse at 70% 30%, rgba(200,135,58,0.16) 0%, transparent 65%)",
        }}
      />
      {/* Terracotta soft corner haze */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 start-0 w-[300px] h-[300px] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at 20% 80%, rgba(200,64,26,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 pt-14 pb-10">
        {/* Eyebrow */}
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
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

        {/* 4-step progress — static SSR shell */}
        <div
          className="flex items-start gap-0 w-full"
          aria-label={t("title")}
          role="navigation"
        >
          {steps.map((label, i) => (
            <StepPill key={i} index={i} label={label} total={steps.length} />
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

        {/* Thin gold wave divider */}
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
