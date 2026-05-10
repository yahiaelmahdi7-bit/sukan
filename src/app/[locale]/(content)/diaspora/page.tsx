// TODO: i18n — hero, section titles, and CTA strings are hardcoded EN/AR inline.
// The `t()` calls from next-intl are removed; re-add when translation keys are ready.
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import GlassPanel from "@/components/glass-panel";
import SectionHeader from "@/components/section-header";
import WaveDivider from "@/components/wave-divider";
import Pill from "@/components/pill";
import ListingCard from "@/components/listing-card";
import CurrencySnapshot from "@/components/currency-snapshot";
import DiasporaTrustStrip from "@/components/diaspora-trust-strip";
import { Camera, Lock, FileCheck, Video } from "lucide-react";
import { sampleListings } from "@/lib/sample-listings";
import { guides } from "@/lib/guides";

// ── Data helpers ─────────────────────────────────────────────────────────────

/** States that have at least one diaspora-favored guide */
const DIASPORA_STATES = new Set(
  guides
    .filter((g) => g.vitals.diasporaFavored)
    .map((g) => g.state),
);

/** Up to 3 listings whose state is diaspora-favored */
const diasporaListings = sampleListings
  .filter((l) => DIASPORA_STATES.has(l.state as string))
  .slice(0, 3);

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function DiasporaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isAr = locale === "ar";

  return (
    <>
      {/* ─── Section 1: Hero ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-cream py-24 lg:py-32">
        {/* Gold halo — start side */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 end-0 h-[640px] w-[640px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at 70% 30%, rgba(200,135,58,0.16) 0%, transparent 70%)",
          }}
        />
        {/* Terracotta halo — start side */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 start-0 h-[400px] w-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at 30% 80%, rgba(200,64,26,0.07) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Eyebrow */}
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold-dk">
            {/* TODO: i18n */}
            {isAr ? "للمغتربين السودانيين" : "For the Sudanese diaspora"}
          </p>

          {/* Headline */}
          <h1 className="font-display mb-6 text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl lg:text-7xl">
            {/* TODO: i18n */}
            {isAr
              ? "اشترِ، استأجر، أو راقب عقارك في السودان من أي مكان."
              : "Buy, rent, or watch over property in Sudan from anywhere."}
          </h1>

          {/* Audience sub-line */}
          <p className="mb-8 max-w-2xl text-lg leading-[1.8] text-ink-mid">
            {/* TODO: i18n */}
            {isAr
              ? "بُني سُكَن للمغتربين السودانيين في القاهرة والرياض ودبي ولندن وتورونتو وما وراءها."
              : "Built for the Sudanese diaspora in Cairo, Riyadh, Dubai, London, Toronto, and beyond."}
          </p>

          {/* Currency accent inline */}
          <CurrencySnapshot size="sm" />
        </div>
      </section>

      <WaveDivider color="gold" intensity="subtle" />

      {/* ─── Section 2: Trust strip ─────────────────────────────────────── */}
      <section className="bg-cream-deep py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow={isAr ? "ما يتوفر الآن" : "What's real, right now"}
            title={
              isAr
                ? "ما الذي يقدمه سُكَن فعلاً"
                : "What Sukan actually delivers"
            }
            subtitle={
              isAr
                ? "لا وعود فارغة — فيما يلي ما تجده اليوم على المنصة."
                : "No empty promises — here is what you find on the platform today."
            }
            align="center"
          />
          <DiasporaTrustStrip locale={locale} />
        </div>
      </section>

      <WaveDivider color="gold" intensity="subtle" flip />

      {/* ─── Section 3: Currency awareness ──────────────────────────────── */}
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow={isAr ? "الوعي بالعملة" : "Currency awareness"}
            title={
              isAr
                ? "لماذا نعرض الدولار والجنيه جنباً إلى جنب"
                : "Why we show USD and SDG side by side"
            }
          />

          {/* Large currency card */}
          <CurrencySnapshot size="lg" />

          {/* Explanation */}
          <GlassPanel
            variant="warm"
            radius="glass"
            shadow
            className="mt-6 p-7 md:p-9"
          >
            <p className="text-base leading-[1.9] text-ink-mid">
              {/* TODO: i18n */}
              {isAr ? (
                <>
                  المغتربون يضعون ميزانياتهم بالدولار الأمريكي. السودانيون
                  المحليون يُسعِّرون بالجنيه السوداني. وسعر الصرف يتحرك. لهذا
                  نعرض كلا المبلغين على كل إعلان وفي كل أداة بحث — حتى لا تضطر
                  إلى إجراء أي حساب قبل التواصل. السعر الحالي المعتمد:{" "}
                  <strong className="text-ink">1 دولار = 600 جنيه</strong>، ويُحدَّث
                  يدوياً. نخطط لربط سعر البنك المركزي مباشرةً في الربع الثالث
                  من ٢٠٢٦.
                </>
              ) : (
                <>
                  Diaspora buyers budget in USD. Sudanese locals price in SDG.
                  The rate moves. So we show both amounts on every listing and in
                  every search tool — no mental arithmetic before you reach out.
                  The current working rate is{" "}
                  <strong className="text-ink">1 USD = 600 SDG</strong>, updated
                  manually. We plan to connect a live Central Bank feed in Q3
                  2026.
                </>
              )}
            </p>
          </GlassPanel>
        </div>
      </section>

      <WaveDivider color="gold" intensity="subtle" />

      {/* ─── Section 4: Diaspora-favored listings ───────────────────────── */}
      <section className="bg-cream-deep py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow={isAr ? "المختارة لهذا الشهر" : "Curated this month"}
            title={
              isAr
                ? "المفضلة لدى المغتربين"
                : "Diaspora favorites this month"
            }
            subtitle={
              isAr
                ? "عقارات في أحياء يُفضلها المغتربون وفق أدلة الأحياء لدينا — الخرطوم ٢، بحري، بورتسودان، والعمارات."
                : "Properties in neighborhoods our guides rate as diaspora-favored — Khartoum 2, Bahri, Port Sudan, and Amarat."
            }
            align="start"
            viewAll={{
              href: "/listings",
              label: isAr ? "تصفح كل الإعلانات" : "Browse all listings",
            }}
          />

          {diasporaListings.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {diasporaListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-mid">
              {isAr ? "لا توجد إعلانات في الوقت الحالي." : "No listings at this time."}
            </p>
          )}
        </div>
      </section>

      <WaveDivider color="gold" intensity="subtle" flip />

      {/* ─── Section 5: Honest "Coming Q3 2026" roadmap ──────────────────── */}
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow={isAr ? "الطريق إلى الأمام" : "What's coming next"}
            title={
              isAr
                ? "ما نبنيه الآن — القادم في الربع الثالث ٢٠٢٦"
                : "What we're building — Coming Q3 2026"
            }
            subtitle={
              isAr
                ? "هذه التزامات حقيقية، لا وعود تسويقية. لم تُشحَن بعد — وسنكون صادقين بشأن ذلك."
                : "These are real commitments, not marketing promises. Not shipped yet — and we're honest about that."
            }
          />

          <GlassPanel
            variant="warm"
            radius="glass"
            shadow="lg"
            className="p-8 md:p-10"
          >
            <ul className="flex flex-col divide-y divide-sand-dk/60">
              {/* Item 1 */}
              <li className="flex items-start gap-5 py-7 first:pt-0 last:pb-0">
                <div
                  className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "rgba(200,135,58,0.10)" }}
                >
                  <Camera size={20} className="text-gold-dk" strokeWidth={1.5} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-lg font-semibold text-ink">
                      {/* TODO: i18n */}
                      {isAr ? "فيديو جولة موثَّقة" : "Verified video walkthroughs"}
                    </h3>
                    <Pill variant="muted" size="sm">
                      {isAr ? "قريباً — الربع الثالث" : "Coming Q3"}
                    </Pill>
                  </div>
                  <p className="text-sm leading-relaxed text-ink-mid">
                    {/* TODO: i18n */}
                    {isAr
                      ? "وكيل يسجّل جولة مُختومة بالوقت والموقع الجغرافي. تشاهدها قبل أن تقرر."
                      : "An agent records a timestamped, geo-tagged walk-through. You watch it before deciding."}
                  </p>
                </div>
              </li>

              {/* Item 2 */}
              <li className="flex items-start gap-5 py-7 first:pt-0 last:pb-0">
                <div
                  className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "rgba(200,135,58,0.10)" }}
                >
                  <Lock size={20} className="text-gold-dk" strokeWidth={1.5} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-lg font-semibold text-ink">
                      {/* TODO: i18n */}
                      {isAr ? "ضمان محتجز قابل للاسترداد عبر Stripe" : "Stripe escrow holds"}
                    </h3>
                    <Pill variant="muted" size="sm">
                      {isAr ? "قريباً — الربع الثالث" : "Coming Q3"}
                    </Pill>
                  </div>
                  <p className="text-sm leading-relaxed text-ink-mid">
                    {/* TODO: i18n */}
                    {isAr
                      ? "وديعة قابلة للاسترداد تُحتجز حتى يتحقق شخص موثوق — أو أنت شخصياً — من العقار في الموقع."
                      : "Refundable deposit held until you (or a trusted local) verifies the property in person."}
                  </p>
                </div>
              </li>

              {/* Item 3 */}
              <li className="flex items-start gap-5 py-7 first:pt-0 last:pb-0">
                <div
                  className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "rgba(200,135,58,0.10)" }}
                >
                  <FileCheck size={20} className="text-gold-dk" strokeWidth={1.5} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-lg font-semibold text-ink">
                      {/* TODO: i18n */}
                      {isAr ? "التحقق من صك الملكية" : "Title-deed verification"}
                    </h3>
                    <Pill variant="muted" size="sm">
                      {isAr ? "قريباً — الربع الثالث" : "Coming Q3"}
                    </Pill>
                  </div>
                  <p className="text-sm leading-relaxed text-ink-mid">
                    {/* TODO: i18n */}
                    {isAr
                      ? "بالشراكة مع مكتب محاماة في الخرطوم. يتحققون من الملكية في سجل الأراضي؛ نحن نضع علامة «صك موثَّق» على الإعلان."
                      : "We partner with a Khartoum law firm. They verify ownership at the Land Registry; we mark the listing \"Title verified.\""}
                  </p>
                </div>
              </li>

              {/* Item 4 */}
              <li className="flex items-start gap-5 py-7 first:pt-0 last:pb-0">
                <div
                  className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "rgba(200,135,58,0.10)" }}
                >
                  <Video size={20} className="text-gold-dk" strokeWidth={1.5} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-lg font-semibold text-ink">
                      {/* TODO: i18n */}
                      {isAr ? "جلسات «سِر معي» المباشرة" : "Live walk-with-me calls"}
                    </h3>
                    <Pill variant="muted" size="sm">
                      {isAr ? "قريباً — الربع الثالث" : "Coming Q3"}
                    </Pill>
                  </div>
                  <p className="text-sm leading-relaxed text-ink-mid">
                    {/* TODO: i18n */}
                    {isAr
                      ? "جولة فيديو واتساب مباشرة مع وكيل سُكَن عند الطلب."
                      : "WhatsApp video tour with a Sukan agent on demand."}
                  </p>
                </div>
              </li>
            </ul>
          </GlassPanel>
        </div>
      </section>

      <WaveDivider color="gold" intensity="subtle" />

      {/* ─── Section 6: CTA row ──────────────────────────────────────────── */}
      <section className="bg-cream-deep py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="glass-warm glass-highlight relative mx-auto flex max-w-2xl flex-col items-center gap-6 overflow-hidden rounded-[var(--radius-glass-lg)] border border-white/60 px-6 py-16 text-center sm:px-12"
            style={{ boxShadow: "var(--shadow-warm-lg)" }}
          >
            {/* Gold halo */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[360px] w-[360px] -translate-x-1/2 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(224,168,87,0.28), transparent 70%)",
              }}
            />

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dk">
              {/* TODO: i18n */}
              {isAr ? "ابدأ الآن" : "Get started"}
            </p>

            <h2 className="font-display text-3xl leading-tight text-ink md:text-4xl">
              {/* TODO: i18n */}
              {isAr
                ? "جاهز للعثور على مكانك في السودان؟"
                : "Ready to find your place in Sudan?"}
            </h2>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:gap-4">
              {/* Primary — gold gradient */}
              <Link
                href="/listings"
                className="smooth inline-flex items-center justify-center rounded-[var(--radius-pill)] px-8 py-3.5 text-sm font-semibold text-earth hover:brightness-[1.05]"
                style={{
                  background: "linear-gradient(135deg, #c8873a 0%, #e0a857 100%)",
                  boxShadow:
                    "0 8px 24px rgba(200,135,58,0.32), inset 0 1px 0 rgba(255,255,255,0.35)",
                }}
              >
                {/* TODO: i18n */}
                {isAr ? "تصفح الإعلانات" : "Browse listings"}
              </Link>

              {/* Secondary — glass outline */}
              <Link
                href="/agents"
                className="smooth inline-flex items-center justify-center rounded-[var(--radius-pill)] border border-gold/40 bg-white/45 px-8 py-3.5 text-sm font-semibold text-gold-dk backdrop-blur-md hover:border-gold/70 hover:bg-gold/10"
              >
                {/* TODO: i18n */}
                {isAr ? "تحدث إلى وكيل" : "Talk to an agent"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
