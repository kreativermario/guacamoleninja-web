# Design: Security Hardening, Config Centralization & SEO

**Date:** 2026-06-07  
**Repos affected:** `guacamoleninja-web`, `homelab-ansible` (HAProxy role)

---

## Scope

Four independent areas, to be implemented in a single branch:

1. HAProxy security header fixes
2. Next.js code-level security hardening
3. Config centralization (`lib/config.ts`)
4. SEO — name, icons, metadata, OG image

---

## 1. HAProxy Header Fixes

**File:** `homelab-ansible/roles/setup_haproxy/templates/frontend/frontend.cfg.j2`

The frontend template currently sets four headers that conflict with the app's intent:

| Line | Current | Change |
|---|---|---|
| `X-XSS-Protection` | `1; mode=block` | **Remove** — deprecated, removed from Chrome, can cause IE rendering bugs |
| `X-Frame-Options` | `SAMEORIGIN` | `DENY` — matches CSP `frame-ancestors 'none'` |
| `Referrer-Policy` | `strict-origin` | `strict-origin-when-cross-origin` — matches Next.js config |
| `Permissions-Policy` | `geolocation=(self)` | `camera=(), microphone=(), geolocation=(), interest-cohort=()` — restores restrictive policy |

No other HAProxy changes. SSL/TLS cipher hardening is out of scope (Cloudflare terminates TLS externally; HAProxy only handles internal traffic).

---

## 2. Next.js Security Fixes

### 2a. Edge Auth Middleware

**New file:** `middleware.ts` (project root)

Redirects unauthenticated requests to `/login?callbackUrl=<path>` before any server component runs. Provides defense-in-depth: if a future page under `/dashboard/` omits the `auth()` check, it is still protected.

```ts
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith("/dashboard")) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
})

export const config = { matcher: ["/dashboard/:path*"] }
```

### 2b. `callbackUrl` Open Redirect Fix

**File:** `app/login/page.tsx`

`callbackUrl` from search params is passed directly to `signIn`. Sanitize to relative paths only before use:

```ts
const raw = (await searchParams).callbackUrl ?? "/dashboard"
const callbackUrl = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/dashboard"
```

### 2c. Bot API Error Message Sanitization

**File:** `lib/bot-api.ts` — two functions: `patchBotGuildConfig` (line ~138) and `patchBotWelcomeConfig` (line ~228)

Current behavior: raw bot API error body is forwarded to the client via `throw new Error(`Bot API error: ${msg}`)`.

Fix: log full error server-side, throw generic message:

```ts
const msg = await res.text().catch(() => res.status.toString())
logger.error("bot-api", "patchBotGuildConfig failed", { guildId, status: res.status, err: msg, ms })
throw new Error("Failed to save configuration. Please try again.")
```

Same pattern for `patchBotWelcomeConfig`.

### 2d. Server Action Rate Limiting

**New file:** `lib/rate-limit.ts`

Per-user in-memory rate limiter using a plain `Map` with a sliding window. No external dependency. Appropriate for single-container deployment; swap backing store to Redis if multi-instance is needed later.

```ts
// 10 mutations per user per 60 seconds
export function checkRateLimit(userId: string): void  // throws if exceeded
```

Implementation: `Map<string, number[]>` keyed by userId, storing an array of request timestamps. On each call, filter timestamps older than the window, check count, append current timestamp. Map entries are cleaned up when their window expires (no unbounded growth for a low-traffic config panel).

Applied in `app/dashboard/[guildId]/actions.ts` — all three mutation actions (`updateGuildConfig`, `updateCommandsConfig`, `updateWelcomeConfig`) call `checkRateLimit(session.user.id)` after the auth check, before the bot API call.

No new packages needed.

---

## 3. Config Centralization

**New file:** `lib/config.ts`

All external URLs and shared constants in one place. All values are server-side only — no `NEXT_PUBLIC_` prefix needed, no Dockerfile build args, no CI changes.

```ts
export const APP_URL     = process.env.APP_URL ?? "https://app.guacamoleninja.com"
export const DOCS_URL    = process.env.DOCS_URL ?? "https://docs.guacamoleninja.com"
export const GITHUB_URL  = "https://github.com/kreativermario/guacamoleninja-bot"
export const BOT_INVITE_BASE =
  `https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID ?? ""}&permissions=66448710&scope=bot+applications.commands`
```

`BOT_INVITE_BASE` is moved here from `app/dashboard/page.tsx` where it was a module-level const.

**Files updated to import from `lib/config.ts`:**

| File | Current hardcoded value | Import |
|---|---|---|
| `app/layout.tsx` | `"https://app.guacamoleninja.com"` (×2) | `APP_URL` |
| `app/sitemap.ts` | `const BASE_URL = "https://app.guacamoleninja.com"` | `APP_URL` |
| `app/robots.ts` | `"https://app.guacamoleninja.com/sitemap.xml"` | `APP_URL` |
| `app/page.tsx` | `DOCS_URL`, `GITHUB_URL` | both |
| `app/dashboard/page.tsx` | `DOCS_URL`, `INVITE_BASE` | both |

`APP_URL` and `DOCS_URL` can be added to Vault per environment (dev/prod) to resolve differently for staging without rebuilding.

---

## 4. SEO

### 4a. Name Change

Replace all instances of `"guacamoleninja-bot"` (slug) with `"Guacamole Ninja Bot"` (proper name) in:
- Metadata (`layout.tsx`, `page.tsx`)
- Nav logo text (`app/page.tsx`, `app/dashboard/page.tsx`, `app/dashboard/[guildId]/_components/GuildLayout.tsx`)
- Login card heading (`app/login/page.tsx`)
- Footer (`app/page.tsx`)
- OG metadata

### 4b. Metadata Improvements (`app/layout.tsx`)

```ts
export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: { default: "Guacamole Ninja Bot", template: "%s | Guacamole Ninja Bot" },
  description: "Manage your Discord server effortlessly — weather, polls, reminders, and more.",
  openGraph: {
    title: "Guacamole Ninja Bot",
    description: "Manage your Discord server effortlessly — weather, polls, reminders, and more.",
    url: APP_URL,
    siteName: "Guacamole Ninja Bot",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
}
```

Remove manual `images` from OG — Next.js auto-discovers `app/opengraph-image.tsx`.

### 4c. Per-Page Titles

Add `export const metadata` to pages that currently have none:

- `app/page.tsx` — `title: "Guacamole Ninja Bot"` (home, use default)
- `app/login/page.tsx` — `title: "Sign In"`  → renders as `"Sign In | Guacamole Ninja Bot"`

Dashboard pages stay without metadata (auth-gated, not indexed).

### 4d. OG Image (`app/opengraph-image.tsx`)

New file. Generates a 1200×630 branded card via Next.js `ImageResponse`:
- Background: `#1e2030`
- Centered mascot (`public/mascot.jpg`) at ~200×200, circular clip
- "Guacamole Ninja Bot" heading below in Inter, white
- Subtle tagline in muted color

Next.js auto-serves this as `/opengraph-image` and links it in `<head>`. No manual OG image metadata needed.

### 4e. Apple Touch Icon (`app/apple-icon.tsx`)

New file. 180×180, same treatment as OG image (dark bg + circular mascot). Auto-discovered by Next.js — no manual `<link>` tags.

### 4f. Favicon (`app/icon.tsx`)

Minor tweak: change from circular clip to a square with rounded corners (8px radius) and the dark bg `#1e2030`. Keeps the mascot centered.

---

## Out of Scope

- Cloudflare Speculation Rules injection (controlled by CF dashboard)
- Cloudflare security header overrides (HAProxy fix makes these redundant for the internal path)
- SSL/TLS cipher changes to HAProxy (Cloudflare handles external TLS)
- Redis-backed rate limiting (single-container deployment; document upgrade path in code comment)
- `@everyone` mention filtering in welcome messages (policy decision, not a web app vulnerability)

---

## File Change Summary

| Repo | File | Action |
|---|---|---|
| `homelab-ansible` | `roles/setup_haproxy/templates/frontend/frontend.cfg.j2` | Edit 4 headers |
| `guacamoleninja-web` | `middleware.ts` | New |
| `guacamoleninja-web` | `lib/config.ts` | New |
| `guacamoleninja-web` | `lib/rate-limit.ts` | New |
| `guacamoleninja-web` | `lib/bot-api.ts` | Edit 2 error throws |
| `guacamoleninja-web` | `app/layout.tsx` | Edit metadata |
| `guacamoleninja-web` | `app/sitemap.ts` | Edit import |
| `guacamoleninja-web` | `app/robots.ts` | Edit import |
| `guacamoleninja-web` | `app/page.tsx` | Edit imports + name strings + metadata |
| `guacamoleninja-web` | `app/login/page.tsx` | Edit callbackUrl + metadata + name |
| `guacamoleninja-web` | `app/dashboard/page.tsx` | Edit imports + name strings |
| `guacamoleninja-web` | `app/dashboard/[guildId]/_components/GuildLayout.tsx` | Edit name string |
| `guacamoleninja-web` | `app/dashboard/[guildId]/actions.ts` | Edit rate limiting |
| `guacamoleninja-web` | `app/opengraph-image.tsx` | New |
| `guacamoleninja-web` | `app/apple-icon.tsx` | New |
| `guacamoleninja-web` | `app/icon.tsx` | Edit |
