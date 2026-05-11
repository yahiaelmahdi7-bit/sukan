import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#12100C",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Radial gold haze — top-right */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 560,
            height: 560,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(200,135,58,0.18) 0%, rgba(200,135,58,0.06) 40%, transparent 70%)",
          }}
        />
        {/* Subtle bottom-left haze */}
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(200,135,58,0.08) 0%, transparent 65%)",
          }}
        />

        {/* Mark */}
        <svg
          width={120}
          height={120}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="g"
              x1="8"
              y1="8"
              x2="56"
              y2="56"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#C8873A" />
              <stop offset="100%" stopColor="#E0A857" />
            </linearGradient>
          </defs>
          <path
            d="M8 15 C16 9,26 9,32 14 C38 19,48 22,56 17 C54 19,48 24.5,40 21.5 C32 18.5,22 18,14 21 C10 22.5,8 20,8 18 Z"
            fill="url(#g)"
          />
          <path
            d="M8 27 C16 22,26 21,32 26 C38 31,49 33,56 28.5 C54 30.5,48 35.5,40 33 C32 30.5,22 30,14 33 C10 34.5,8 32,8 30 Z"
            fill="url(#g)"
          />
          <path
            d="M8 39 C16 34,26 33.5,32 38 C38 42.5,49 44.5,56 40.5 C54.5 42.5,48 46.5,40 44.5 C32 42.5,22 42,14 44.5 C10 45.5,8 43.5,8 42 Z"
            fill="url(#g)"
          />
          <circle cx="24" cy="52" r="2" fill="#D4943F" />
          <circle cx="32" cy="52" r="2" fill="#D4943F" />
          <circle cx="40" cy="52" r="2" fill="#D4943F" />
        </svg>

        {/* Title */}
        <div
          style={{
            marginTop: 32,
            fontSize: 72,
            fontFamily: "Georgia, 'Times New Roman', serif",
            color: "#FDF8F0",
            letterSpacing: "-0.5px",
            lineHeight: 1,
            textAlign: "center",
          }}
        >
          سُكَن · Sukan
        </div>

        {/* Tagline */}
        <div
          style={{
            marginTop: 20,
            fontSize: 26,
            fontFamily: "Georgia, 'Times New Roman', serif",
            color: "rgba(253,248,240,0.65)",
            letterSpacing: "0.5px",
            textAlign: "center",
          }}
        >
          Sudan&apos;s home for housing
        </div>

        {/* Wave accent */}
        <div
          style={{
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                width: 40,
                height: 2,
                borderRadius: 2,
                background: `rgba(200,135,58,${0.2 + i * 0.12})`,
              }}
            />
          ))}
        </div>

        {/* Bottom-right corner accent */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 56,
            fontSize: 13,
            fontFamily: "Georgia, serif",
            color: "rgba(200,135,58,0.5)",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          sukansd.com
        </div>
      </div>
    ),
    { ...size },
  );
}
