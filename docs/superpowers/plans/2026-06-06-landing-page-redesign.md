# Landing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current centered-hero/card-grid landing page with a mee6/Discord-style design: Discord-dark background, left-aligned hero with mascot, seamless full-bleed feature sections with UPPERCASE titles and Discord-chrome mockups, green CTA banner, and a multi-column footer.

**Architecture:** Three files change — `globals.css` (tokens + landing classes), `layout.tsx` (next/font/google), `page.tsx` (full rewrite). A new `app/_components/MobileNav.tsx` client component handles the hamburger toggle. All dashboard/login/guild-settings pages are untouched.

**Tech Stack:** Next.js 16.2.7 App Router, React 19, Tailwind CSS v4, next/font/google (Inter + Open_Sans), TypeScript.

---

### Task 1: Add .superpowers to .gitignore

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add entry**

Open `.gitignore` and append:
```
# brainstorming session files
.superpowers/
```

- [ ] **Step 2: Commit**
```bash
git add .gitignore
git commit -m "chore: ignore .superpowers brainstorm directory"
```

---

### Task 2: Create MobileNav client component

**Files:**
- Create: `app/_components/MobileNav.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";

const DiscordIcon = () => (
  <svg width="18" height="14" viewBox="0 0 127.14 96.36" fill="currentColor" aria-hidden="true">
    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
  </svg>
);

interface MobileNavProps {
  docsUrl: string;
}

export function MobileNav({ docsUrl }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="nav-hamburger"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <>
          <div
            className="nav-drawer-overlay"
            onClick={() => setOpen(false)}
          />
          <div className="nav-drawer open">
            <a className="nav-link" href={docsUrl} target="_blank" rel="noopener noreferrer">
              Docs
            </a>
            <Link className="nav-link" href="#features">
              Commands
            </Link>
            <Link className="nav-link" href="/dashboard">
              Dashboard
            </Link>
            <Link className="btn-nav-login" href="/login">
              <DiscordIcon />
              Login with Discord
            </Link>
          </div>
        </>
      )}
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**
```bash
pnpm tsc --noEmit
```
Expected: no errors related to this file.

---

### Task 3: Update globals.css

**Files:**
- Modify: `app/globals.css`

Replace the entire file with the content below. Key changes: remove Google Fonts `@import` (next/font handles it), update design tokens to Discord-dark palette, keep all existing component classes used by dashboard/login pages, add new landing page classes.

- [ ] **Step 1: Replace file**

```css
@import "tailwindcss";

/* ── CSS custom properties ───────────────────────── */
:root {
  /* Core backgrounds */
  --bg:           #1e2030;
  --bg-feat:      #191c2e;
  --bg-card:      #252839;
  --bg-surface:   #2e3248;
  --bg-input:     #1a1d2e;

  /* Borders */
  --border:       rgba(255, 255, 255, 0.07);
  --border-hover: rgba(255, 255, 255, 0.14);

  /* Text */
  --text:           #f2f3f5;
  --text-secondary: #b9bbbe;
  --muted:          #8e9297;

  /* Brand green */
  --primary:      #78a86a;
  --primary-dark: #4a7c59;
  --primary-dk:   #4a7c59;
  --primary-hover:#6a9a5c;
  --primary-dim:  rgba(120, 168, 106, 0.10);

  /* Discord blue — only for "Add/Login with Discord" buttons */
  --discord:      #5865f2;
  --discord-hover:#4752c4;

  /* Misc */
  --ring:         rgba(120, 168, 106, 0.35);
  --destructive:  #ed4245;
  --shadow-card:     0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04);
  --shadow-elevated: 0 4px 24px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05);
}

/* ── Reset ───────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
a, a:hover, a:visited, a:active, a:focus { text-decoration: none; color: inherit; }
button { cursor: pointer; }
input, button, textarea, select { font-family: inherit; }

:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
  border-radius: 4px;
}

/* ── Base body ───────────────────────────────────── */
body {
  background: var(--bg);
  color: var(--text);
  font-size: 16px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ── LANDING PAGE — Nav ─────────────────────────── */
.nav-logo-name {
  font-size: 1.375rem;
  font-weight: 900;
  letter-spacing: -0.03em;
}

.nav-link {
  padding: 0.5rem 1rem;
  border-radius: 7px;
  font-size: 1rem;
  font-weight: 500;
  color: var(--muted);
  transition: color 150ms;
}
.nav-link:hover { color: var(--text); }

.btn-nav-login {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.375rem;
  border-radius: 8px;
  background: var(--discord);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  transition: background 150ms;
}
.btn-nav-login:hover { background: var(--discord-hover); }

.nav-hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  padding: 8px;
  margin-left: auto;
  background: none;
  border: none;
}
.nav-hamburger span {
  width: 24px;
  height: 2.5px;
  background: var(--text);
  border-radius: 2px;
  display: block;
}

.nav-drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 98;
}
.nav-drawer {
  position: fixed;
  top: 76px;
  left: 0;
  right: 0;
  background: #1a1d2e;
  border-bottom: 1px solid var(--border);
  padding: 1.25rem 1.5rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  z-index: 99;
}
.nav-drawer .nav-link {
  font-size: 1.1rem;
  padding: 0.7rem 0.5rem;
  color: var(--text-secondary);
}
.nav-drawer .btn-nav-login {
  margin-top: 0.875rem;
  justify-content: center;
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
}

/* ── LANDING PAGE — Scroll chevron ──────────────── */
@keyframes chevBlink {
  0%, 100% { opacity: 0.15; }
  50%       { opacity: 1; }
}
.scroll-chevron { display: inline-flex; flex-direction: column; align-items: center; gap: 5px; }
.scroll-chevron span {
  display: block;
  width: 20px;
  height: 20px;
  border-right: 3.5px solid var(--primary);
  border-bottom: 3.5px solid var(--primary);
  transform: rotate(45deg);
  border-radius: 1px;
}
.scroll-chevron span:nth-child(1) { animation: chevBlink 1.4s ease-in-out infinite 0s; }
.scroll-chevron span:nth-child(2) { animation: chevBlink 1.4s ease-in-out infinite 0.2s; }
.scroll-chevron span:nth-child(3) { animation: chevBlink 1.4s ease-in-out infinite 0.4s; }

/* ── LANDING PAGE — Hero buttons ────────────────── */
.btn-hero-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--discord);
  color: #fff;
  padding: 0.9rem 1.75rem;
  border-radius: 9px;
  font-size: 1rem;
  font-weight: 700;
  transition: background 150ms;
  border: none;
}
.btn-hero-primary:hover { background: var(--discord-hover); }

.btn-hero-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.07);
  color: var(--text);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.9rem 1.75rem;
  border-radius: 9px;
  font-size: 1rem;
  font-weight: 600;
  transition: background 150ms;
}
.btn-hero-secondary:hover { background: rgba(255, 255, 255, 0.11); }

/* ── LANDING PAGE — Feature section ─────────────── */
.feat-eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--primary);
  margin-bottom: 1.125rem;
}
.feat-title {
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  line-height: 0.98;
  margin-bottom: 1.5rem;
}
.btn-feat {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--discord);
  color: #fff;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 700;
  align-self: flex-start;
  transition: background 150ms;
  border: none;
}
.btn-feat:hover { background: var(--discord-hover); }

/* ── LANDING PAGE — CTA banner button ───────────── */
.btn-cta-white {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #fff;
  color: #2d5038;
  padding: 1rem 2.25rem;
  border-radius: 10px;
  font-size: 1.05rem;
  font-weight: 800;
  transition: opacity 150ms;
  border: none;
}
.btn-cta-white:hover { opacity: 0.92; }

/* ── DASHBOARD + LOGIN — kept unchanged ─────────── */
.btn-primary {
  display: inline-flex; align-items: center; gap: 0.5rem;
  background: var(--primary-dark); color: #fff;
  padding: 0.75rem 1.5rem; border-radius: 8px;
  font-weight: 700; font-size: 0.9375rem;
  transition: background 200ms, transform 150ms;
  box-shadow: 0 2px 12px rgba(74,124,89,0.35);
  border: none;
}
.btn-primary:hover { background: var(--primary-hover); transform: translateY(-1px); }
.btn-primary:active { transform: translateY(0); }

.btn-outline {
  display: inline-flex; align-items: center; gap: 0.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border-hover);
  color: var(--text-secondary);
  padding: 0.75rem 1.5rem; border-radius: 8px;
  font-weight: 600; font-size: 0.9375rem;
  transition: border-color 200ms, color 200ms, transform 150ms;
}
.btn-outline:hover { border-color: var(--primary); color: var(--text); transform: translateY(-1px); }
.btn-outline:active { transform: translateY(0); }

.btn-ghost {
  display: inline-flex; align-items: center; gap: 0.5rem;
  color: var(--muted);
  padding: 0.75rem 1.25rem; border-radius: 8px;
  font-weight: 600; font-size: 0.9375rem;
  transition: color 200ms;
}
.btn-ghost:hover { color: var(--text); }

.btn-sm-primary {
  display: inline-flex; align-items: center; gap: 0.3rem;
  background: var(--primary-dark); color: #fff;
  padding: 0.3rem 0.75rem; border-radius: 6px;
  font-weight: 600; font-size: 0.78rem;
  transition: background 200ms;
  border: none;
  box-shadow: 0 1px 6px rgba(74,124,89,0.25);
}
.btn-sm-primary:hover { background: var(--primary-hover); }

.btn-sm-outline {
  display: inline-flex; align-items: center; gap: 0.3rem;
  border: 1px solid var(--border-hover); color: var(--muted);
  padding: 0.3rem 0.75rem; border-radius: 6px;
  font-weight: 600; font-size: 0.78rem;
  transition: border-color 200ms, color 200ms;
}
.btn-sm-outline:hover { border-color: var(--primary); color: var(--primary); }

.btn-discord {
  width: 100%;
  display: flex; align-items: center; justify-content: center; gap: 0.625rem;
  background: #5865F2; color: #fff;
  padding: 0.75rem 1.25rem; border-radius: 8px;
  border: none;
  font-weight: 700; font-size: 0.9375rem;
  transition: background 200ms, transform 150ms;
  box-shadow: 0 2px 12px rgba(88,101,242,0.35);
}
.btn-discord:hover { background: #4752C4; transform: translateY(-1px); }
.btn-discord:active { transform: translateY(0); }

.btn-save {
  display: inline-flex; align-items: center; gap: 0.4rem;
  background: var(--primary-dark); color: #fff;
  padding: 0.6rem 1.25rem; border-radius: 7px;
  border: none;
  font-weight: 700; font-size: 0.875rem;
  transition: background 200ms, transform 150ms;
  box-shadow: 0 2px 8px rgba(74,124,89,0.3);
}
.btn-save:hover { background: var(--primary-hover); transform: translateY(-1px); }
.btn-save:active { transform: translateY(0); }

.btn-signout {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--muted);
  padding: 0.3rem 0.7rem; border-radius: 6px;
  font-size: 0.8rem;
  transition: border-color 200ms, color 200ms;
}
.btn-signout:hover { border-color: var(--border-hover); color: var(--text); }

.nav-link-back {
  display: flex; align-items: center; gap: 0.3rem;
  color: var(--muted);
  font-size: 0.875rem;
  transition: color 200ms;
}
.nav-link-back:hover { color: var(--text); }

.nav-invite {
  background: var(--primary-dark); color: #fff;
  padding: 0.375rem 0.875rem; border-radius: 6px;
  font-size: 0.8rem; font-weight: 600;
  transition: background 200ms;
  margin-left: 0.25rem;
}
.nav-invite:hover { background: var(--primary-hover); }

.card-server {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.125rem;
  display: flex; align-items: center; gap: 0.875rem;
  transition: border-color 200ms;
}
.card-server:hover { border-color: var(--border-hover); }

.card-step {
  display: flex; gap: 1rem; align-items: flex-start;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px; padding: 1.125rem 1.25rem;
  transition: border-color 200ms;
}
.card-step:hover { border-color: var(--border-hover); }

.input-field {
  background: var(--bg);
  border: 1px solid var(--border-hover);
  border-radius: 8px;
  padding: 0.625rem 0.875rem;
  color: var(--text);
  font-size: 0.9375rem;
  width: 100%;
  transition: border-color 200ms;
}
.input-field:focus { border-color: var(--primary); outline: none; }
.input-field::placeholder { color: var(--muted); }

.link-muted { color: var(--muted); transition: color 200ms; }
.link-muted:hover { color: var(--text); }

.link-primary { color: var(--primary); font-weight: 600; transition: color 200ms; }
.link-primary:hover { color: var(--primary-hover); }

.footer-link { color: var(--muted); transition: color 200ms; }
.footer-link:hover { color: var(--text-secondary); }

/* ── Toggle (guild settings) ─────────────────────── */
.cmd-toggle { position: relative; display: inline-block; width: 40px; height: 22px; flex-shrink: 0; cursor: pointer; }
.cmd-toggle input { position: absolute; opacity: 0; width: 0; height: 0; }
.cmd-toggle-track { position: absolute; inset: 0; background: var(--border); border-radius: 999px; transition: background 200ms; }
.cmd-toggle input:checked + .cmd-toggle-track { background: var(--primary); }
.cmd-toggle-track::after { content: ''; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; background: #fff; border-radius: 50%; transition: transform 200ms; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
.cmd-toggle input:checked + .cmd-toggle-track::after { transform: translateX(18px); }
.cmd-toggle input:focus-visible + .cmd-toggle-track { outline: 2px solid var(--ring); outline-offset: 2px; }

/* ── Responsive ──────────────────────────────────── */
@media (max-width: 860px) {
  .nav-hamburger { display: flex; }
  .nav-center-links { display: none; }
  .nav-right-links  { display: none; }
  .hero-grid { grid-template-columns: 1fr !important; }
  .hero-mascot { order: -1; padding: 0.5rem 0 0 !important; }
  .mascot-ring { width: 180px !important; height: 180px !important; }
  .mascot-img  { width: 136px !important; height: 136px !important; }
  .hero-cta { flex-direction: column; width: 100%; }
  .hero-cta > * { width: 100%; }
  .feat-card-grid { grid-template-columns: 1fr !important; border-radius: 22px !important; min-height: unset !important; }
  .feat-card-grid.rev { direction: ltr !important; }
  .feat-visual { min-height: 300px !important; padding: 2rem 1.5rem !important; }
  .feat-text-pad { padding: 2.5rem 2rem !important; }
  .feat-title { font-size: 2.5rem !important; }
  .footer-top-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
  .footer-cols-grid { grid-template-columns: 1fr 1fr !important; gap: 2rem !important; }
}
@media (max-width: 480px) {
  .nav-drawer { top: 68px; }
  .footer-cols-grid { grid-template-columns: 1fr !important; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

- [ ] **Step 2: Verify build still compiles**
```bash
pnpm tsc --noEmit
```
Expected: no errors.

---

### Task 4: Update app/layout.tsx

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace file**

```tsx
import type { Metadata } from "next";
import { Inter, Open_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "guacamoleninja-bot",
  description: "A utility Discord bot — weather, polls, reminders, and more.",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "guacamoleninja-bot",
    description: "A utility Discord bot — weather, polls, reminders, and more.",
    url: "https://app.guacamoleninja.com",
    images: [{ url: "/icon.png", width: 512, height: 512 }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${openSans.variable}`}>
      <body style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
```

Add these two CSS custom properties to the `:root` block in `globals.css` (after `--destructive`):
```css
  --font-inter:      'Inter', system-ui, sans-serif;
  --font-open-sans:  'Open Sans', sans-serif;
```

- [ ] **Step 2: Verify**
```bash
pnpm tsc --noEmit
```

---

### Task 5: Rewrite app/page.tsx

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace with full implementation**

```tsx
import Image from "next/image";
import Link from "next/link";
import { MobileNav } from "./_components/MobileNav";

const CLIENT_ID = process.env.DISCORD_CLIENT_ID ?? "";
const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=66448710&scope=bot+applications.commands`;
const DOCS_URL = "https://docs.guacamoleninja.com";
const GITHUB_URL = "https://github.com/kreativermario/guacamoleninja-bot";

function DiscordIcon({ size = 22 }: { size?: number }) {
  const h = Math.round(size * (96.36 / 127.14));
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 127.14 96.36"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
    </svg>
  );
}

export default function Home() {
  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>

      {/* ── Nav ───────────────────────────────────── */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          height: 76,
          background: "rgba(30,32,48,0.95)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          padding: "0 3rem",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--text)" }}
        >
          <Image
            src="/mascot.jpg"
            alt="guacamoleninja"
            width={44}
            height={44}
            style={{ borderRadius: "50%", border: "2px solid rgba(255,255,255,0.12)", flexShrink: 0 }}
          />
          <span className="nav-logo-name">guacamoleninja</span>
        </Link>

        {/* Desktop centre links */}
        <div className="nav-center-links" style={{ marginLeft: "2.5rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <a className="nav-link" href={DOCS_URL} target="_blank" rel="noopener noreferrer">Docs</a>
          <a className="nav-link" href="#features">Commands</a>
          <Link className="nav-link" href="/dashboard">Dashboard</Link>
        </div>

        {/* Desktop right */}
        <div className="nav-right-links" style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
          <Link className="btn-nav-login" href="/login">
            <DiscordIcon size={20} />
            Login with Discord
          </Link>
        </div>

        {/* Mobile hamburger */}
        <MobileNav docsUrl={DOCS_URL} />
      </nav>

      {/* ── Hero ──────────────────────────────────── */}
      <section
        style={{
          minHeight: "100dvh",
          background: "linear-gradient(180deg, #191c2e 0%, var(--bg-feat) 100%)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="hero-grid"
          style={{
            flex: 1,
            maxWidth: 1300,
            margin: "0 auto",
            width: "100%",
            padding: "0 3rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            alignItems: "center",
            gap: "3rem",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "clamp(2.75rem, 5vw, 4rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.04,
                marginBottom: "1.375rem",
              }}
            >
              The utility bot<br />
              for{" "}
              <em style={{ fontStyle: "normal", color: "var(--primary)" }}>your</em>{" "}
              server
            </h1>
            <p
              style={{
                fontFamily: "var(--font-open-sans), sans-serif",
                fontSize: "1.125rem",
                color: "var(--muted)",
                lineHeight: 1.7,
                maxWidth: 430,
                marginBottom: "2.5rem",
              }}
            >
              Weather, polls, reminders, and server tools. Built for small
              communities who want something reliable without the bloat.
            </p>
            <div className="hero-cta" style={{ display: "flex", gap: "0.875rem", alignItems: "center", flexWrap: "wrap" }}>
              <a className="btn-hero-primary" href={INVITE_URL} target="_blank" rel="noopener noreferrer">
                <DiscordIcon size={22} />
                Add to Discord
              </a>
              <a className="btn-hero-secondary" href="#features">See features</a>
            </div>
          </div>

          <div
            className="hero-mascot"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 0" }}
          >
            <div
              className="mascot-ring"
              style={{
                width: 280,
                height: 280,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(74,124,89,0.16) 0%, transparent 70%)",
                border: "2px solid rgba(120,168,106,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 80px rgba(74,124,89,0.1)",
              }}
            >
              <Image
                src="/mascot.jpg"
                alt="guacamoleninja mascot"
                width={200}
                height={200}
                className="mascot-img"
                style={{ borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(120,168,106,0.3)" }}
                priority
              />
            </div>
          </div>
        </div>

        {/* Scroll chevron */}
        <div style={{ textAlign: "center", padding: "1.75rem 0 2.25rem" }}>
          <div className="scroll-chevron" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>

      {/* ── Feature sections ──────────────────────── */}
      <section id="features" style={{ background: "var(--bg-feat)" }}>

        {/* Weather */}
        <div style={{ padding: "6rem 2rem" }}>
          <div
            className="feat-card-grid"
            style={{
              maxWidth: 1300,
              margin: "0 auto",
              borderRadius: 32,
              overflow: "hidden",
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              minHeight: 560,
              boxShadow: "0 6px 30px rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {/* Visual */}
            <div
              className="feat-visual"
              style={{
                background: "linear-gradient(140deg, #0b1e14 0%, #14301e 55%, #1c4028 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "3rem 2.5rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <FeatureWeatherMock />
            </div>
            {/* Text */}
            <div
              className="feat-text-pad"
              style={{ background: "#252839", padding: "4rem 3.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}
            >
              <div className="feat-eyebrow">Weather</div>
              <h2 className="feat-title">Real-time<br />weather<br />anywhere</h2>
              <p style={{ fontFamily: "var(--font-open-sans), sans-serif", fontSize: "1.075rem", color: "var(--muted)", lineHeight: 1.75, maxWidth: 380 }}>
                Current conditions and forecasts for any city in the world. Powered by Open-Meteo, no API key needed.
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard */}
        <div style={{ padding: "6rem 2rem" }}>
          <div
            className="feat-card-grid rev"
            style={{
              maxWidth: 1300,
              margin: "0 auto",
              borderRadius: 32,
              overflow: "hidden",
              display: "grid",
              gridTemplateColumns: "0.9fr 1.1fr",
              minHeight: 560,
              boxShadow: "0 6px 30px rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {/* Text */}
            <div
              className="feat-text-pad"
              style={{ background: "#252839", padding: "4rem 3.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}
            >
              <div className="feat-eyebrow">Dashboard</div>
              <h2 className="feat-title">Configure<br />from<br />the web</h2>
              <p style={{ fontFamily: "var(--font-open-sans), sans-serif", fontSize: "1.075rem", color: "var(--muted)", lineHeight: 1.75, maxWidth: 380, marginBottom: "2rem" }}>
                Toggle commands, set timezones and manage welcome messages. All from a clean web dashboard.
              </p>
              <Link className="btn-feat" href="/dashboard">Open Dashboard</Link>
            </div>
            {/* Visual */}
            <div
              className="feat-visual"
              style={{
                background: "linear-gradient(140deg, #10132a 0%, #181d3e 55%, #20254e 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "3rem 2.5rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <FeatureDashboardMock />
            </div>
          </div>
        </div>

        {/* Welcome messages */}
        <div style={{ padding: "6rem 2rem" }}>
          <div
            className="feat-card-grid"
            style={{
              maxWidth: 1300,
              margin: "0 auto",
              borderRadius: 32,
              overflow: "hidden",
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              minHeight: 560,
              boxShadow: "0 6px 30px rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {/* Visual */}
            <div
              className="feat-visual"
              style={{
                background: "linear-gradient(140deg, #0d1e18 0%, #132a1e 55%, #1a3626 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "3rem 2.5rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <FeatureWelcomeMock />
            </div>
            {/* Text */}
            <div
              className="feat-text-pad"
              style={{ background: "#252839", padding: "4rem 3.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}
            >
              <div className="feat-eyebrow">Welcome Messages</div>
              <h2 className="feat-title">Greet every<br />new<br />member</h2>
              <p style={{ fontFamily: "var(--font-open-sans), sans-serif", fontSize: "1.075rem", color: "var(--muted)", lineHeight: 1.75, maxWidth: 380 }}>
                Personalised welcome messages with{" "}
                <code style={{ color: "var(--primary)" }}>{"{user}"}</code>,{" "}
                <code style={{ color: "var(--primary)" }}>{"{server}"}</code>, and{" "}
                <code style={{ color: "var(--primary)" }}>{"{memberCount}"}</code>. Configurable per server.
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* ── CTA Banner ────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(135deg, #2d5038 0%, #4a7c59 50%, #3a6647 100%)",
          padding: "7rem 2.5rem",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(2.25rem, 4vw, 3.25rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: "#fff",
            marginBottom: "2.25rem",
          }}
        >
          Build a better Discord<br />server for free
        </h2>
        <a className="btn-cta-white" href={INVITE_URL} target="_blank" rel="noopener noreferrer">
          <DiscordIcon size={22} />
          Add to Discord
        </a>
      </section>

      {/* ── Footer ────────────────────────────────── */}
      <footer
        style={{
          background: "#191c2e",
          borderTop: "1px solid var(--border)",
          padding: "5rem 3rem 3rem",
        }}
      >
        <div
          className="footer-top-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "4rem", marginBottom: "3.5rem" }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1rem" }}>
              <Image src="/mascot.jpg" alt="" width={32} height={32} style={{ borderRadius: "50%" }} />
              <span style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.02em" }}>guacamoleninja</span>
            </div>
            <p style={{ fontFamily: "var(--font-open-sans), sans-serif", fontSize: "1rem", color: "var(--muted)", lineHeight: 1.65, maxWidth: 240 }}>
              A utility Discord bot for small communities. Open source and self-hostable.
            </p>
          </div>
          <div
            className="footer-cols-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2.5rem" }}
          >
            <FooterCol title="Bot" links={[
              { label: "Commands", href: "#features" },
              { label: "Welcome Messages", href: "#features" },
              { label: "Dashboard", href: "/dashboard" },
              { label: "Add to Discord", href: INVITE_URL, external: true },
            ]} />
            <FooterCol title="Resources" links={[
              { label: "Documentation", href: DOCS_URL, external: true },
              { label: "GitHub", href: GITHUB_URL, external: true },
              { label: "Self-hosting", href: `${DOCS_URL}/contributing`, external: true },
              { label: "Contributing", href: `${DOCS_URL}/contributing`, external: true },
            ]} />
            <FooterCol title="Project" links={[
              { label: "Changelog", href: GITHUB_URL, external: true },
              { label: "Bot API", href: `${DOCS_URL}/bot-api`, external: true },
              { label: "Support", href: GITHUB_URL, external: true },
            ]} />
          </div>
        </div>
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "1.75rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.95rem",
            color: "var(--muted)",
          }}
        >
          <span>© 2026 guacamoleninja-bot</span>
          <span>Open source · MIT License</span>
        </div>
      </footer>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────── */

function FooterCol({ title, links }: { title: string; links: { label: string; href: string; external?: boolean }[] }) {
  return (
    <div>
      <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text)", marginBottom: "1.25rem", letterSpacing: "-0.01em" }}>
        {title}
      </h4>
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              style={{ fontSize: "0.975rem", color: "#72767d" }}
              className="footer-link"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MockPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "rgba(18,20,38,0.94)",
      border: "1px solid rgba(255,255,255,0.09)",
      borderRadius: 16,
      overflow: "hidden",
      width: "100%",
      maxWidth: 420,
      boxShadow: "0 8px 28px rgba(0,0,0,0.45)",
    }}>
      <div style={{
        background: "rgba(0,0,0,0.35)",
        padding: "0.75rem 1rem",
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ed4245", display: "inline-block", flexShrink: 0 }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#faa61a", display: "inline-block", flexShrink: 0 }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#3ba55c", display: "inline-block", flexShrink: 0 }} />
        <span style={{ fontSize: "0.72rem", color: "var(--muted)", marginLeft: "0.3rem" }}>{title}</span>
      </div>
      <div style={{ padding: "1.25rem 1.25rem 1.5rem" }}>{children}</div>
    </div>
  );
}

function ChatMsg({ avatar, name, isBot, children }: { avatar: string; name: string; isBot?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", alignItems: "flex-start" }}>
      <div style={{
        width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
        background: isBot ? "rgba(120,168,106,0.22)" : "rgba(88,101,242,0.3)",
        color: isBot ? "var(--primary)" : "#818cf8",
        fontSize: "0.68rem", fontWeight: 800,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>{avatar}</div>
      <div>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, marginBottom: "0.15rem", color: isBot ? "var(--primary)" : "var(--text)" }}>
          {name}
        </div>
        {children}
      </div>
    </div>
  );
}

function Embed({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      marginTop: "0.4rem",
      background: "rgba(255,255,255,0.03)",
      borderLeft: "3px solid var(--primary)",
      borderRadius: "0 7px 7px 0",
      padding: "0.575rem 0.875rem",
      fontSize: "0.8rem",
      lineHeight: 1.55,
      color: "#b9bbbe",
    }}>
      {children}
    </div>
  );
}

function FeatureWeatherMock() {
  return (
    <MockPanel title="#general">
      <ChatMsg avatar="A" name="alex">
        <div style={{ fontSize: "0.875rem", color: "#dcddde" }}>
          <span style={{ color: "var(--primary)", fontWeight: 600 }}>/weather</span> Lisbon
        </div>
      </ChatMsg>
      <ChatMsg avatar="GN" name="guacamoleninja" isBot>
        <Embed>🌤 <strong style={{ color: "#f2f3f5" }}>Lisbon, PT</strong><br />22°C, partly cloudy<br /><span style={{ color: "#72767d" }}>Wind 14 km/h · Humidity 58%</span></Embed>
      </ChatMsg>
      <ChatMsg avatar="S" name="sam">
        <div style={{ fontSize: "0.875rem", color: "#dcddde" }}>
          <span style={{ color: "var(--primary)", fontWeight: 600 }}>/weather</span> Tokyo
        </div>
      </ChatMsg>
      <div style={{ marginBottom: 0 }}>
        <ChatMsg avatar="GN" name="guacamoleninja" isBot>
          <Embed>⛅ <strong style={{ color: "#f2f3f5" }}>Tokyo, JP</strong><br />18°C, overcast<br /><span style={{ color: "#72767d" }}>Wind 8 km/h · Humidity 72%</span></Embed>
        </ChatMsg>
      </div>
    </MockPanel>
  );
}

function FeatureDashboardMock() {
  const commands = [
    { name: "/weather", desc: "Conditions for any city", on: true },
    { name: "/poll",    desc: "Community votes",          on: true },
    { name: "/remind",  desc: "Personal reminders",       on: false },
    { name: "/server",  desc: "Server info",              on: true },
  ];
  return (
    <MockPanel title="Server Settings">
      <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.625rem" }}>Commands</div>
      {commands.map((cmd, i) => (
        <div key={cmd.name} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0.75rem 0",
          borderBottom: i < commands.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
          fontSize: "0.82rem",
        }}>
          <div>
            <div style={{ color: "#dcddde", fontWeight: 500 }}>{cmd.name}</div>
            <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "0.1rem" }}>{cmd.desc}</div>
          </div>
          <div style={{
            width: 38, height: 21, borderRadius: 999,
            background: cmd.on ? "var(--primary)" : "rgba(255,255,255,0.15)",
            flexShrink: 0, position: "relative",
          }}>
            <div style={{
              position: "absolute", width: 15, height: 15, borderRadius: "50%",
              background: "#fff", top: 3,
              right: cmd.on ? 3 : "auto",
              left: cmd.on ? "auto" : 3,
              boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
            }} />
          </div>
        </div>
      ))}
    </MockPanel>
  );
}

function FeatureWelcomeMock() {
  return (
    <MockPanel title="#welcome">
      <div style={{
        background: "rgba(120,168,106,0.07)",
        border: "1px solid rgba(120,168,106,0.18)",
        borderRadius: 10,
        padding: "1rem 1.125rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(120,168,106,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>👋</div>
          <div>
            <div style={{ fontSize: "0.8rem", fontWeight: 700 }}>guacamoleninja</div>
            <div style={{ fontSize: "0.67rem", color: "var(--muted)" }}>Today at 14:32</div>
          </div>
        </div>
        <div style={{ fontSize: "0.85rem", color: "#b9bbbe", lineHeight: 1.55 }}>
          Hey <span style={{ color: "var(--primary)", fontWeight: 600 }}>@taylor</span>, welcome to{" "}
          <span style={{ color: "var(--text)", fontWeight: 600 }}>My Community</span>! You are member{" "}
          <span style={{ color: "var(--text)", fontWeight: 600 }}>#42</span>. Make sure to check out #rules.
        </div>
      </div>
      <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "1rem", fontFamily: "var(--font-open-sans), sans-serif", lineHeight: 1.5 }}>
        Configure channel, message, and variables from the dashboard.
      </div>
    </MockPanel>
  );
}
```

- [ ] **Step 2: Run type-check**
```bash
pnpm tsc --noEmit
```
Expected: no errors.

---

### Task 6: Verify and commit

- [ ] **Step 1: Start dev server and check visually**
```bash
pnpm dev
```
Visit `http://localhost:3000`. Check:
- Hero fills viewport, mascot visible on right
- Scroll chevrons blink (cascading opacity)
- Three feature sections all on same dark bg, no colour seam
- Dashboard section has "Open Dashboard" button only
- CTA banner is green gradient
- Footer columns readable, © 2026

- [ ] **Step 2: Check mobile at 375px** (browser DevTools)
- Hamburger visible, nav links hidden
- Hamburger tap opens drawer with Docs / Commands / Dashboard / Login with Discord
- Hero goes single column, mascot above text
- CTA buttons stack full-width, text centred

- [ ] **Step 3: Production build**
```bash
pnpm build
```
Expected: exits 0, no type errors.

- [ ] **Step 4: Commit**
```bash
git add app/globals.css app/layout.tsx app/page.tsx app/_components/MobileNav.tsx docs/
git commit -m "feat: redesign landing page — Discord-dark, mee6-style feature sections"
```
