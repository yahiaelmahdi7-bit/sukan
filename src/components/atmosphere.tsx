// Server Component
//
// Layered ambient lighting for the whole page. Sits behind everything.
// Uses the brand palette only — gold, terracotta, sand — drifting slowly.
// Reduced-motion users get static blobs (animation disabled in CSS).
export interface AtmosphereProps {
  /** "soft" = subtle (default), "rich" = stronger for hero pages */
  intensity?: "soft" | "rich";
}

export default function Atmosphere({ intensity = "soft" }: AtmosphereProps) {
  const opacityGold = intensity === "rich" ? 0.55 : 0.42;
  const opacityTerracotta = intensity === "rich" ? 0.42 : 0.28;
  const opacitySand = intensity === "rich" ? 0.6 : 0.45;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Gold haze — top end (RTL-safe via 'end') */}
      <div
        className="animate-drift-1 absolute -top-[20%] -end-[15%] h-[60vw] w-[60vw] max-h-[900px] max-w-[900px] rounded-full blur-3xl"
        style={{
          opacity: opacityGold,
          background:
            "radial-gradient(closest-side, rgba(224,168,87,0.55), rgba(200,135,58,0.18) 38%, transparent 72%)",
        }}
      />

      {/* Terracotta glow — mid start side */}
      <div
        className="animate-drift-2 absolute top-[30%] -start-[18%] h-[55vw] w-[55vw] max-h-[820px] max-w-[820px] rounded-full blur-3xl"
        style={{
          opacity: opacityTerracotta,
          background:
            "radial-gradient(closest-side, rgba(200,64,26,0.32), rgba(157,47,15,0.10) 40%, transparent 72%)",
        }}
      />

      {/* Sand bloom — bottom right */}
      <div
        className="animate-drift-3 absolute -bottom-[10%] end-[10%] h-[50vw] w-[50vw] max-h-[760px] max-w-[760px] rounded-full blur-3xl"
        style={{
          opacity: opacitySand,
          background:
            "radial-gradient(closest-side, rgba(244,234,215,0.85), rgba(214,196,160,0.28) 40%, transparent 72%)",
        }}
      />

      {/* Faint warm grain — adds tactile noise without color shift */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(90,79,66,0.55) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />
    </div>
  );
}
