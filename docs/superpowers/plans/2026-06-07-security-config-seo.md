# Security Hardening, Config Centralization & SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden security headers in HAProxy and Next.js, centralize all external URLs into one config module, and improve SEO with proper naming and metadata.

**Architecture:** Changes span two repos (`guacamoleninja-web` and `homelab-ansible`). The web changes are independent of each other after Task 2 (config) is done — all consumers import from `lib/config.ts`. HAProxy changes are fully independent. Tasks 3–6 are security fixes; Tasks 7–11 are SEO.

**Tech Stack:** Next.js 16, NextAuth v5 beta, HAProxy (Jinja2 templates via Ansible), TypeScript

---

## File Map

**homelab-ansible repo:**
- Modify: `roles/setup_haproxy/templates/frontend/frontend.cfg.j2` — fix 4 security response headers

**guacamoleninja-web repo:**
- Create: `lib/config.ts` — single source of truth for all external URLs and env-driven constants
- Create: `lib/rate-limit.ts` — per-user sliding-window rate limiter
- Create: `middleware.ts` — NextAuth edge guard for `/dashboard/*`
- Create: `app/opengraph-image.tsx` — 1200×630 branded OG card
- Create: `app/apple-icon.tsx` — 180×180 Apple touch icon
- Modify: `lib/bot-api.ts` — sanitize error messages thrown to client (2 locations)
- Modify: `app/layout.tsx` — metadata improvements, import APP_URL
- Modify: `app/sitemap.ts` — import APP_URL
- Modify: `app/robots.ts` — import APP_URL
- Modify: `app/page.tsx` — import DOCS_URL/GITHUB_URL, rename brand strings, add metadata export
- Modify: `app/login/page.tsx` — sanitize callbackUrl, add metadata export, rename brand string
- Modify: `app/dashboard/page.tsx` — import DOCS_URL/BOT_INVITE_BASE, rename brand string
- Modify: `app/dashboard/[guildId]/_components/GuildLayout.tsx` — rename brand string
- Modify: `app/dashboard/[guildId]/actions.ts` — add rate limit calls
- Modify: `app/icon.tsx` — square with rounded corners instead of circle

---

## Task 1: HAProxy Security Header Fixes

**Repo:** `homelab-ansible`  
**Files:**
- Modify: `roles/setup_haproxy/templates/frontend/frontend.cfg.j2`

- [ ] **Open** `roles/setup_haproxy/templates/frontend/frontend.cfg.j2` and find the `# Headers` block (lines 67–74). It currently reads:

```
http-response set-header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
http-response set-header X-XSS-Protection "1; mode=block"
http-response set-header X-Frame-Options "SAMEORIGIN"
http-response set-header X-Content-Type-Options "nosniff"
http-response set-header Referrer-Policy "strict-origin"
http-response set-header Permissions-Policy "geolocation=(self)"
http-response del-header X-Powered-By
http-response del-header Server
http-response del-header Via
```

- [ ] **Replace** that entire `# Headers` block with:

```
    # Headers
    http-response set-header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    http-response set-header X-Frame-Options "DENY"
    http-response set-header X-Content-Type-Options "nosniff"
    http-response set-header Referrer-Policy "strict-origin-when-cross-origin"
    http-response set-header Permissions-Policy "camera=(), microphone=(), geolocation=(), interest-cohort=()"
    http-response del-header X-Powered-By
    http-response del-header Server
    http-response del-header Via
```

Changes: removed `X-XSS-Protection` (deprecated), changed `X-Frame-Options` to `DENY`, updated `Referrer-Policy` and `Permissions-Policy` to match Next.js config.

- [ ] **Verify** the template is valid by checking for syntax errors:

```bash
grep -n "http-response" roles/setup_haproxy/templates/frontend/frontend.cfg.j2
```

Expected: no `X-XSS-Protection` line, `X-Frame-Options` shows `DENY`, `Permissions-Policy` shows `camera=()`.

- [ ] **Commit:**

```bash
git add roles/setup_haproxy/templates/frontend/frontend.cfg.j2
git commit -m "fix: harden HAProxy response headers — remove X-XSS-Protection, set X-Frame-Options DENY, fix Permissions-Policy"
```

---

## Task 2: Config Centralization

**Repo:** `guacamoleninja-web`  
**Files:**
- Create: `lib/config.ts`
- Modify: `app/layout.tsx`
- Modify: `app/sitemap.ts`
- Modify: `app/robots.ts`
- Modify: `app/page.tsx` (imports only — brand string changes come in Task 7)
- Modify: `app/dashboard/page.tsx` (imports only — brand string changes come in Task 7)

- [ ] **Create** `lib/config.ts`:

```ts
export const APP_URL =
  (process.env.APP_URL ?? "https://app.guacamoleninja.com").replace(/\/$/, "")

export const DOCS_URL =
  process.env.DOCS_URL ?? "https://docs.guacamoleninja.com"

export const GITHUB_URL =
  "https://github.com/kreativermario/guacamoleninja-bot"

export const BOT_INVITE_BASE =
  `https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID ?? ""}&permissions=66448710&scope=bot+applications.commands`
```

- [ ] **Update** `app/layout.tsx` — replace the two hardcoded `"https://app.guacamoleninja.com"` strings with `APP_URL` from config:

```ts
import type { Metadata } from "next";
import { Inter, Open_Sans } from "next/font/google";
import { APP_URL } from "@/lib/config";
import "./globals.css";

// ... font declarations stay the same ...

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: "guacamoleninja-bot",
  description: "A utility Discord bot — weather, polls, reminders, and more.",
  openGraph: {
    title: "guacamoleninja-bot",
    description: "A utility Discord bot — weather, polls, reminders, and more.",
    url: APP_URL,
    images: [{ url: "/icon.png", width: 512, height: 512 }],
  },
};
```

(Metadata content will be improved in Task 8 — only replace the URL strings here.)

- [ ] **Update** `app/sitemap.ts` — remove the `BASE_URL` local const, import `APP_URL`:

```ts
import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/config";

export const revalidate = 86400;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: APP_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${APP_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
```

- [ ] **Update** `app/robots.ts` — replace hardcoded URL:

```ts
import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/api/"],
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
```

- [ ] **Update** `app/page.tsx` — replace the two module-level const declarations at the top of the file:

Find and remove:
```ts
const DOCS_URL = "https://docs.guacamoleninja.com";
const GITHUB_URL = "https://github.com/kreativermario/guacamoleninja-bot";
```

Add import (at the top, after any existing imports):
```ts
import { DOCS_URL, GITHUB_URL } from "@/lib/config";
```

- [ ] **Update** `app/dashboard/page.tsx` — replace the three module-level const declarations:

Find and remove:
```ts
const CLIENT_ID = process.env.DISCORD_CLIENT_ID ?? "";
const INVITE_BASE = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=66448710&scope=bot+applications.commands`;
const DOCS_URL = "https://docs.guacamoleninja.com";
```

Add import:
```ts
import { DOCS_URL, BOT_INVITE_BASE } from "@/lib/config";
```

Then replace all uses of `INVITE_BASE` in the file with `BOT_INVITE_BASE`.

- [ ] **Type-check:**

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Commit:**

```bash
git add lib/config.ts app/layout.tsx app/sitemap.ts app/robots.ts app/page.tsx app/dashboard/page.tsx
git commit -m "refactor: centralize external URLs and env constants in lib/config.ts"
```

---

## Task 3: Edge Auth Middleware

**Repo:** `guacamoleninja-web`  
**Files:**
- Create: `middleware.ts`

- [ ] **Create** `middleware.ts` at the project root (same level as `auth.ts`):

```ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith("/dashboard")) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

- [ ] **Type-check:**

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Verify manually** — start the dev server and open `http://localhost:3000/dashboard` without a session. Expected: redirected to `/login?callbackUrl=%2Fdashboard`.

```bash
pnpm dev
# In another terminal:
curl -sI http://localhost:3000/dashboard | grep -E "location|HTTP"
```

Expected output includes `307` and `location: http://localhost:3000/login?callbackUrl=%2Fdashboard`.

- [ ] **Commit:**

```bash
git add middleware.ts
git commit -m "feat: edge auth middleware — redirect unauthenticated /dashboard requests to login"
```

---

## Task 4: callbackUrl Open Redirect Fix

**Repo:** `guacamoleninja-web`  
**Files:**
- Modify: `app/login/page.tsx`

- [ ] **Open** `app/login/page.tsx`. Find the `searchParams` read and `signIn` call (lines 14, 133–135). Currently:

```ts
const { callbackUrl } = await searchParams;
// ...
await signIn("discord", { redirectTo: callbackUrl ?? "/dashboard" });
```

- [ ] **Replace** with:

```ts
const raw = (await searchParams).callbackUrl ?? "/dashboard";
const callbackUrl = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/dashboard";
// ...
await signIn("discord", { redirectTo: callbackUrl });
```

The full updated `searchParams` section at the top of the function body:

```ts
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session) redirect("/dashboard");

  const raw = (await searchParams).callbackUrl ?? "/dashboard";
  const callbackUrl = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/dashboard";
```

And the form action:

```ts
<form
  action={async () => {
    "use server";
    await signIn("discord", { redirectTo: callbackUrl });
  }}
>
```

- [ ] **Type-check:**

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Commit:**

```bash
git add app/login/page.tsx
git commit -m "fix: sanitize callbackUrl to relative paths only — prevent open redirect"
```

---

## Task 5: Bot API Error Message Sanitization

**Repo:** `guacamoleninja-web`  
**Files:**
- Modify: `lib/bot-api.ts`

- [ ] **Open** `lib/bot-api.ts`. Find `patchBotGuildConfig` (around line 130). The error block currently reads:

```ts
if (!res.ok) {
  const msg = await res.text().catch(() => res.status.toString());
  logger.error("bot-api", "patchBotGuildConfig failed", { guildId, status: res.status, err: msg, ms });
  throw new Error(`Bot API error: ${msg}`);
}
```

- [ ] **Replace** the `throw` in `patchBotGuildConfig` with a generic message (keep the `logger.error` line unchanged):

```ts
if (!res.ok) {
  const msg = await res.text().catch(() => res.status.toString());
  logger.error("bot-api", "patchBotGuildConfig failed", { guildId, status: res.status, err: msg, ms });
  throw new Error("Failed to save configuration. Please try again.");
}
```

- [ ] **Find** `patchBotWelcomeConfig` (around line 220). Same pattern — replace:

```ts
if (!res.ok) {
  const msg = await res.text().catch(() => res.status.toString());
  logger.error("bot-api", "patchBotWelcomeConfig failed", { guildId, status: res.status, err: msg, ms });
  throw new Error(`Bot API error: ${msg}`);
}
```

With:

```ts
if (!res.ok) {
  const msg = await res.text().catch(() => res.status.toString());
  logger.error("bot-api", "patchBotWelcomeConfig failed", { guildId, status: res.status, err: msg, ms });
  throw new Error("Failed to save configuration. Please try again.");
}
```

- [ ] **Verify** no other `throw new Error(\`Bot API` patterns remain:

```bash
grep -n "Bot API error" lib/bot-api.ts
```

Expected: no output.

- [ ] **Type-check:**

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Commit:**

```bash
git add lib/bot-api.ts
git commit -m "fix: sanitize bot API error messages — log full error server-side, send generic message to client"
```

---

## Task 6: Server Action Rate Limiter

**Repo:** `guacamoleninja-web`  
**Files:**
- Create: `lib/rate-limit.ts`
- Modify: `app/dashboard/[guildId]/actions.ts`

- [ ] **Create** `lib/rate-limit.ts`:

```ts
const requests = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const LIMIT = 10;

export function checkRateLimit(userId: string): void {
  const now = Date.now();
  const prev = requests.get(userId) ?? [];
  const recent = prev.filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) {
    throw new Error("Too many requests. Please wait before trying again.");
  }
  requests.set(userId, [...recent, now]);
}
```

- [ ] **Open** `app/dashboard/[guildId]/actions.ts`. Add the import at the top:

```ts
import { checkRateLimit } from "@/lib/rate-limit";
```

- [ ] **Add** `checkRateLimit(session.user.id)` in all three mutation actions, immediately after the `if (!session?.user?.id) throw new Error("Unauthorized")` guard.

`updateGuildConfig` (around line 59–65):
```ts
export async function updateGuildConfig(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  checkRateLimit(session.user.id);

  const parsed = SettingsSchema.safeParse({
```

`updateCommandsConfig` (around line 79–85):
```ts
export async function updateCommandsConfig(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  checkRateLimit(session.user.id);

  const guildId = formData.get("guildId");
```

`updateWelcomeConfig` (around line 97–103):
```ts
export async function updateWelcomeConfig(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  checkRateLimit(session.user.id);

  const parsed = WelcomeSchema.safeParse({
```

- [ ] **Type-check:**

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Commit:**

```bash
git add lib/rate-limit.ts app/dashboard/[guildId]/actions.ts
git commit -m "feat: per-user rate limiting on dashboard server actions (10 req/min)"
```

---

## Task 7: Brand Name Changes

**Repo:** `guacamoleninja-web`  
**Files:**
- Modify: `app/page.tsx`
- Modify: `app/login/page.tsx`
- Modify: `app/dashboard/page.tsx`
- Modify: `app/dashboard/[guildId]/_components/GuildLayout.tsx`

Rule: UI display text `"guacamoleninja"` / `"guacamoleninja-bot"` → `"Guacamole Ninja"` in nav/compact contexts, `"Guacamole Ninja Bot"` in headings/footer/metadata. Alt text on images stays as-is (describes the mascot, not the product).

- [ ] **Edit** `app/page.tsx` — three changes:

  1. Line 69 — nav logo text:
  ```ts
  // Before:
  <span className="nav-logo-name">guacamoleninja</span>
  // After:
  <span className="nav-logo-name">Guacamole Ninja</span>
  ```

  2. Line 474 — bot username inside the demo Discord chat mockup:
  ```ts
  // Before:
  <div style={{ fontSize: "0.8rem", fontWeight: 700 }}>guacamoleninja</div>
  // After:
  <div style={{ fontSize: "0.8rem", fontWeight: 700 }}>Guacamole Ninja</div>
  ```

  3. Line 531 — footer copyright:
  ```ts
  // Before:
  <span>© 2026 guacamoleninja-bot</span>
  // After:
  <span>© 2026 Guacamole Ninja Bot</span>
  ```

- [ ] **Edit** `app/login/page.tsx` — line 71, login card product name:

```ts
// Before:
guacamoleninja
// After:
Guacamole Ninja Bot
```

- [ ] **Edit** `app/dashboard/page.tsx` — line 53, nav logo text:

```ts
// Before:
<span className="nav-logo-name">guacamoleninja</span>
// After:
<span className="nav-logo-name">Guacamole Ninja</span>
```

- [ ] **Edit** `app/dashboard/[guildId]/_components/GuildLayout.tsx` — line 216, nav logo text:

```ts
// Before:
<span className="nav-logo-name">guacamoleninja</span>
// After:
<span className="nav-logo-name">Guacamole Ninja</span>
```

- [ ] **Verify** no remaining slugs in UI text (image alt attributes are excluded intentionally):

```bash
grep -rn '"guacamoleninja-bot"\|>guacamoleninja<\|>guacamoleninja-bot<' app/ --include="*.tsx" --include="*.ts"
```

Expected: no output.

- [ ] **Type-check:**

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Commit:**

```bash
git add app/page.tsx app/login/page.tsx app/dashboard/page.tsx "app/dashboard/[guildId]/_components/GuildLayout.tsx"
git commit -m "feat: rename brand display name to Guacamole Ninja Bot across all UI"
```

---

## Task 8: Root Metadata Improvements

**Repo:** `guacamoleninja-web`  
**Files:**
- Modify: `app/layout.tsx`

- [ ] **Replace** the entire `metadata` export in `app/layout.tsx`. The file currently imports `APP_URL` from Task 2. Update the metadata block to:

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
};
```

Note: the manual `images` array is removed — Next.js will auto-discover `app/opengraph-image.tsx` (added in Task 10).

- [ ] **Type-check:**

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Commit:**

```bash
git add app/layout.tsx
git commit -m "feat: improve root metadata — proper title template, OG tags, Twitter card"
```

---

## Task 9: Per-Page Metadata

**Repo:** `guacamoleninja-web`  
**Files:**
- Modify: `app/login/page.tsx`
- Modify: `app/page.tsx`

- [ ] **Add** a metadata export to `app/login/page.tsx`. Add the import with the existing imports at the top of the file, then add the export before `export default async function LoginPage`:

```ts
// add with existing imports at top:
import type { Metadata } from "next";

// add before export default:
export const metadata: Metadata = {
  title: "Sign In",
};
```

This renders as `"Sign In | Guacamole Ninja Bot"` in the browser tab via the root title template.

- [ ] **Add** a metadata export to `app/page.tsx`. Add the import with the existing imports at the top of the file, then add the export before `export default async function`:

```ts
// add with existing imports at top:
import type { Metadata } from "next";

// add before export default:
export const metadata: Metadata = {
  title: "Guacamole Ninja Bot",
  description: "A utility Discord bot — weather, polls, reminders, and more. Manage your server from the dashboard.",
};
```

- [ ] **Type-check:**

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Commit:**

```bash
git add app/login/page.tsx app/page.tsx
git commit -m "feat: add per-page metadata to landing and login pages"
```

---

## Task 10: OG Image

**Repo:** `guacamoleninja-web`  
**Files:**
- Create: `app/opengraph-image.tsx`

- [ ] **Create** `app/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const buf = await readFile(join(process.cwd(), "public/mascot.jpg"));
  const src = `data:image/jpeg;base64,${buf.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1e2030",
          gap: 32,
        }}
      >
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: "50%",
            overflow: "hidden",
            border: "4px solid rgba(120,168,106,0.5)",
            display: "flex",
          }}
        >
          <img src={src} width={160} height={160} style={{ objectFit: "cover" }} />
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.04em",
          }}
        >
          Guacamole Ninja Bot
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#9ca3af",
          }}
        >
          Manage your Discord server effortlessly
        </div>
      </div>
    ),
    { ...size },
  );
}
```

- [ ] **Verify** the route resolves. Start dev server and fetch:

```bash
pnpm dev
# In another terminal:
curl -sI http://localhost:3000/opengraph-image | grep content-type
```

Expected: `content-type: image/png`

- [ ] **Commit:**

```bash
git add app/opengraph-image.tsx
git commit -m "feat: add 1200x630 branded OG image for social sharing"
```

---

## Task 11: Apple Icon & Favicon Tweak

**Repo:** `guacamoleninja-web`  
**Files:**
- Create: `app/apple-icon.tsx`
- Modify: `app/icon.tsx`

- [ ] **Create** `app/apple-icon.tsx` (180×180 for iOS home screen):

```tsx
import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const buf = await readFile(join(process.cwd(), "public/mascot.jpg"));
  const src = `data:image/jpeg;base64,${buf.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1e2030",
          borderRadius: 40,
        }}
      >
        <img
          src={src}
          width={152}
          height={152}
          style={{ objectFit: "cover", borderRadius: "50%" }}
        />
      </div>
    ),
    { ...size },
  );
}
```

- [ ] **Update** `app/icon.tsx` — change from circular overflow clip to square with rounded corners (7px radius matches standard favicon treatment):

Replace the full file content with:

```tsx
import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const buf = await readFile(join(process.cwd(), "public/mascot.jpg"));
  const src = `data:image/jpeg;base64,${buf.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1e2030",
          borderRadius: 7,
        }}
      >
        <img
          src={src}
          width={28}
          height={28}
          style={{ objectFit: "cover", borderRadius: "50%" }}
        />
      </div>
    ),
    { ...size },
  );
}
```

- [ ] **Verify** both icon routes resolve:

```bash
# Ensure dev server is running
curl -sI http://localhost:3000/icon | grep content-type
curl -sI http://localhost:3000/apple-icon | grep content-type
```

Expected: both return `content-type: image/png`.

- [ ] **Type-check and build:**

```bash
pnpm typecheck && pnpm build
```

Expected: no type errors, build succeeds with no warnings about missing icons.

- [ ] **Commit:**

```bash
git add app/apple-icon.tsx app/icon.tsx
git commit -m "feat: add apple-touch-icon and tweak favicon to square with rounded corners"
```

---

## Final Verification

After all tasks are complete:

- [ ] **Full build:**

```bash
pnpm build
```

Expected: builds successfully, no type errors.

- [ ] **Check no slug names remain in UI text:**

```bash
grep -rn "guacamoleninja-bot" app/ lib/ --include="*.tsx" --include="*.ts"
```

Expected: no output (only in comments, git history, or config defaults is acceptable).

- [ ] **Check all config imports are from lib/config.ts:**

```bash
grep -rn '"https://app.guacamoleninja\|"https://docs.guacamoleninja\|"https://github.com/kreativermario' app/ lib/ --include="*.tsx" --include="*.ts"
```

Expected: no output.

- [ ] **Check no raw bot API error messages remain:**

```bash
grep -n "Bot API error" lib/bot-api.ts
```

Expected: no output.
