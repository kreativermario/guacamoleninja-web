@AGENTS.md

## Commands

```bash
pnpm dev          # dev server (port 3000)
pnpm build        # production build
pnpm start        # serve production build
pnpm typecheck    # type-check without emitting
pnpm lint         # ESLint
```

## Architecture

Three repos under `kreativermario/` on GitHub:

```
Browser → Cloudflare CDN → guacamoleninja-web  (Next.js 16, port 3000)
                                    │
                                    ├── Auth DB (Postgres) — NextAuth sessions
                                    └── Bot API (HTTP) → guacamoleninja-bot (port 3002)
                                                └── Bot DB (Postgres)
```

- Web and bot have **isolated databases** — web never touches bot DB directly.
- All bot state is accessed via the HTTP API (`BOT_API_URL`, `BOT_API_SECRET` bearer token).
- `guacamoleninja-docs` is a separate repo (Docusaurus), deployed to Cloudflare Pages.

## Branch → Environment

| Branch | Environment | Deploy target |
|--------|-------------|---------------|
| `main` | production | Portainer stack (prod) |
| `dev`  | development | Portainer stack (staging) |

Push to branch → CI type-check → Harbor push → Portainer deploy → CF cache purge.

## Key Files

- `auth.ts` — NextAuth config, Discord OAuth, PrismaAdapter; session callback adds `discordId`
- `lib/discord.ts` — `getUserGuilds` (cached 60s/user), `maybeRefreshToken`
- `lib/bot-api.ts` — all bot API calls (guilds, config, welcome, channels, stats, audit)
- `app/page.tsx` — landing page (`force-dynamic` — reads `DISCORD_CLIENT_ID` at runtime)
- `app/dashboard/[guildId]/_components/GuildLayout.tsx` — client component: sidebar nav + section switching
- `app/dashboard/[guildId]/actions.ts` — server actions for config, commands, welcome
- `next.config.ts` — security headers (HSTS, CSP, COOP, CORP), CORS for `*.guacamoleninja.com`, CDN cache headers

## Design System

- **Palette:** `--bg: #1e2030`, `--bg-feat: #191c2e`, `--bg-card: #252839`
- **Accent:** `--primary: #78a86a`, `--primary-dk: #4a7c59`
- **Discord blue:** `--discord: #5865f2` (use for CTAs)
- **Fonts:** Inter (headlines/UI via `next/font/google`), Open Sans (body)
- Full spec: `docs/design-guidelines.md`

## Secrets / Vault

All secrets fetched at CI time via `hashicorp/vault-action`. `VAULT_PATH` must be set as a GitHub environment variable per environment (development/production).

Key web secrets: `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `AUTH_SECRET`, `AUTH_URL`, `POSTGRES_*`, `BOT_API_URL`, `BOT_API_SECRET`

## Gotchas

- `app/page.tsx` is `force-dynamic` so it reads `DISCORD_CLIENT_ID` from runtime env, not build-time.
- Harbor repos (`guacamoleninja-web`, `guacamoleninja-web-migrator`) must exist in Harbor before first deploy — 401 otherwise.
- `pnpm` version is pinned in `packageManager` field; `pnpm/action-setup@v4` reads it automatically (no `version:` key needed in CI).
- Docker runner uses `gcr.io/distroless/nodejs24-debian13:nonroot` (uid 65532). Migrator runs `prisma migrate deploy` before runner starts.

## Discord Logo SVG

Use this exact SVG for every Discord button/icon in the app. viewBox must be `0 0 127.14 96.36`.

```svg
<svg viewBox="0 0 127.14 96.36" fill="currentColor" aria-hidden="true">
  <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
</svg>
```

## Design Rules (see docs/design-guidelines.md for full spec)
