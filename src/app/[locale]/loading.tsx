import { getTranslations } from "next-intl/server";
import Navbar from "@/components/navbar";
import SukanMark from "@/components/sukan-mark";

export default async function Loading() {
  const t = await getTranslations("loading");

  return (
    <>
      <Navbar />

      <main className="flex flex-1 flex-col items-center justify-center py-32 gap-8">
        {/* Pulsing mark */}
        <div className="animate-pulse">
          <SukanMark size={72} />
        </div>

        <p className="text-sm text-mute-soft tracking-wide">
          {t("message")}
        </p>
      </main>
    </>
  );
}
