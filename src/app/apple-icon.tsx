import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#12100C",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 36,
        }}
      >
        <svg
          width={130}
          height={130}
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
          {/* Wave 1 */}
          <path
            d="M8 15 C16 9,26 9,32 14 C38 19,48 22,56 17 C54 19,48 24.5,40 21.5 C32 18.5,22 18,14 21 C10 22.5,8 20,8 18 Z"
            fill="url(#g)"
          />
          {/* Wave 2 */}
          <path
            d="M8 27 C16 22,26 21,32 26 C38 31,49 33,56 28.5 C54 30.5,48 35.5,40 33 C32 30.5,22 30,14 33 C10 34.5,8 32,8 30 Z"
            fill="url(#g)"
          />
          {/* Wave 3 */}
          <path
            d="M8 39 C16 34,26 33.5,32 38 C38 42.5,49 44.5,56 40.5 C54.5 42.5,48 46.5,40 44.5 C32 42.5,22 42,14 44.5 C10 45.5,8 43.5,8 42 Z"
            fill="url(#g)"
          />
          {/* Three dots */}
          <circle cx="24" cy="52" r="2" fill="#D4943F" />
          <circle cx="32" cy="52" r="2" fill="#D4943F" />
          <circle cx="40" cy="52" r="2" fill="#D4943F" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
