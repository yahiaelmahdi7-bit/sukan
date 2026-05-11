import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
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
