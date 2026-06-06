import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV !== "production" ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://cdn.discordapp.com",
      "connect-src 'self' https://discord.com",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["@prisma/client", "prisma"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.discordapp.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      // Dashboard — never cache (auth-gated, always fresh)
      {
        source: "/dashboard/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, proxy-revalidate" },
          { key: "CDN-Cache-Control", value: "no-store" },
          { key: "Surrogate-Control", value: "no-store" },
        ],
      },
      // Homepage — browser 5 min, CDN 1 day + SWR; purged on every deploy
      {
        source: "/",
        headers: [
          { key: "Cache-Control",     value: "public, max-age=300, stale-while-revalidate=86400" },
          { key: "CDN-Cache-Control", value: "public, max-age=86400, stale-while-revalidate=86400" },
          { key: "Cache-Tag",         value: "page-home,deploy" },
        ],
      },
      // Login page — browser 1 h, CDN 1 day; purged on every deploy
      {
        source: "/login",
        headers: [
          { key: "Cache-Control",     value: "public, max-age=3600, stale-while-revalidate=86400" },
          { key: "CDN-Cache-Control", value: "public, max-age=86400" },
          { key: "Cache-Tag",         value: "page-login,deploy" },
        ],
      },
      // Sitemap — browser 1 day, CDN 1 day + 7-day SWR; ISR regenerates daily; purged on deploy
      {
        source: "/sitemap.xml",
        headers: [
          { key: "Cache-Control",     value: "public, max-age=86400, stale-while-revalidate=604800" },
          { key: "CDN-Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
          { key: "Cache-Tag",         value: "sitemap,deploy" },
        ],
      },
      // robots.txt — changes only on deploy; 7-day browser + CDN cache
      {
        source: "/robots.txt",
        headers: [
          { key: "Cache-Control",     value: "public, max-age=604800" },
          { key: "CDN-Cache-Control", value: "public, max-age=604800" },
          { key: "Cache-Tag",         value: "robots,deploy" },
        ],
      },
      // Public static assets — 1 year immutable (content never changes between deploys)
      {
        source: "/:file((?!_next).+\\.(?:ico|png|jpg|jpeg|svg|webp))",
        headers: [
          { key: "Cache-Control",     value: "public, max-age=31536000, immutable" },
          { key: "CDN-Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Cache-Tag",         value: "static-assets" },
        ],
      },
    ];
  },
};

export default nextConfig;
