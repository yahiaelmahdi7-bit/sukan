import { setRequestLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PostWizard from "./_components/post-wizard";

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("post");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id ?? null;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-earth pb-24">
        {/* Hero band — no step indicator here; wizard owns the live one. */}
        <div className="relative overflow-hidden">
          {/* Ambient gold radial haze */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 end-0 h-[500px] w-[500px] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at 70% 30%, rgba(200,135,58,0.16) 0%, transparent 65%)",
            }}
          />
          {/* Terracotta soft corner haze */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 start-0 h-[300px] w-[300px] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at 20% 80%, rgba(200,64,26,0.08) 0%, transparent 70%)",
            }}
          />

          <div className="relative mx-auto max-w-3xl px-4 pb-12 pt-14 sm:px-6">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
              {t("title")}
            </p>
            <h1 className="mb-3 font-display text-4xl leading-tight text-parchment sm:text-5xl">
              {t("title")}
            </h1>
            <p className="mb-2 max-w-xl text-base text-mute-soft">
              {t("subtitle")}
            </p>
          </div>
        </div>

        {/* Thin gold wave divider */}
        <div className="wave-divider opacity-30" />

        {/* Wizard — owns its own step indicator */}
        <div className="mx-auto mt-10 max-w-3xl px-4 sm:px-6">
          <PostWizard userId={userId} />
        </div>
      </main>

      <Footer />
    </>
  );
}
