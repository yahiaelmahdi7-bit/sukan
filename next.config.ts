import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Security + cache response headers applied to every route.
// These are server-side defaults; CDN/reverse-proxy headers take precedence in prod.
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  turbopack: {
    root: __dirname,
  },
  images: {
    // Prefer AVIF (smaller), fall back to WebP, then original format.
    formats: ["image/avif", "image/webp"],
    // Cache optimised images for 24 h (default is 60 s — too short for our
    // largely static listing photos).
    minimumCacheTTL: 86400,
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "tile.openstreetmap.org" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "d8j0ntlcm91z4.cloudfront.net" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },
  experimental: {
    // Reduce client-side bundle size by tree-shaking icon libraries and
    // next-intl at the import level instead of shipping the full package.
    optimizePackageImports: ["lucide-react", "next-intl"],
  },
};

export default withNextIntl(nextConfig);
