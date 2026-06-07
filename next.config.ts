import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Block framing from any origin
  { key: "X-Frame-Options", value: "DENY" },
  // Reduce referrer leakage
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restrict browser feature access
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  // HSTS — force HTTPS for 1 year, include subdomains
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  // Prevent other sites opening this in a popup and retaining opener access
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Prevent other origins embedding our resources
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  // Disable DNS prefetch to avoid leaking visited paths
  { key: "X-DNS-Prefetch-Control", value: "off" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // unsafe-inline required by Next.js; unsafe-eval dev-only
      `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV !== "production" ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      // Next.js self-hosts fonts via next/font — no external font domains needed
      "font-src 'self'",
      "img-src 'self' data: https://cdn.discordapp.com",
      "connect-src 'self' https://discord.com",
      // Restrict <form> submissions to same origin
      "form-action 'self'",
      // Restrict <base> tag to prevent base-tag injection
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false, // removes X-Powered-By: Next.js
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
      // CORS — reflect Origin back only for *.guacamoleninja.com requests.
      // Named capture in `has.value` lets us use :origin in the header value.
      {
        source: "/(.*)",
        has: [
          {
            type: "header",
            key: "origin",
            value: "(?<origin>https://([a-z0-9-]+\\.)?guacamoleninja\\.com)",
          },
        ],
        headers: [
          { key: "Access-Control-Allow-Origin",  value: ":origin" },
          { key: "Access-Control-Allow-Methods", value: "GET, HEAD, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Origin, Accept, Content-Type, Authorization" },
          { key: "Vary",                         value: "Origin" },
        ],
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
