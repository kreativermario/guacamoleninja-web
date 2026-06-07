# Animations & Skeleton Loading — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Option B fluid animations site-wide and replace every "Loading…" text placeholder with a content-shaped shimmer skeleton.

**Architecture:** Pure CSS keyframes + utility classes in `globals.css`; thin `<ScrollReveal>` client component (IntersectionObserver) for scroll-triggered sections; animation classes added directly to existing server/client component JSX; skeleton shimmer via shared `.skel` CSS class. No new libraries.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS — zero new dependencies.

---

## Pre-work findings (read before starting)

- `.db-server-card` already has hover (`translateY(-3px)`, border-color, box-shadow) — Task 1 only adds spring easing to its transition.
- `.btn-save` already has `transform: translateY(-1px)` on hover — Task 1 adds `box-shadow` to that hover and updates the transition to use `--ease-spring`.
- `.guild-sidebar` uses `transform` for the mobile slide-in (`translateX(-100%)` → `0`). **Never add a CSS entrance animation to `.guild-sidebar` itself.** Animate inner elements (`sb-server-hdr`, `sb-nav`, `sb-back`) via JSX classes in Task 6 instead.
- Spec mentions a `<ServerGrid>` component for the dashboard stagger — skipping it. The dashboard page is `force-dynamic` SSR, so CSS `anim-fade-up` classes on the server-rendered card divs trigger on page load automatically without any JS.

---

## File map

| File | Action |
|---|---|
| `app/globals.css` | Add `--ease-spring`, 5 keyframes, utility classes, `.skel`, `.scroll-reveal`, `.section-enter`, update existing `.btn-save` and `.db-server-card` transitions |
| `app/_components/ScrollReveal.tsx` | **Create** — thin client component (IntersectionObserver → adds `.visible` class) |
| `app/page.tsx` | Add animation classes to hero elements; import + wrap 3 feature sections, CTA, footer in `<ScrollReveal>` |
| `app/dashboard/page.tsx` | Add `anim-fade-up anim-delay-N` directly to each server card div |
| `app/dashboard/[guildId]/_components/GuildLayout.tsx` | Add animation classes to sidebar inner elements; wrap `renderSection()` output in `key={section}` div with `.section-enter` |

---

## Task 1 — CSS foundation

**Files:** `app/globals.css`

- [ ] **Step 1: Add the animation system block**

Open `app/globals.css`. Find the line `/* ── Reset ───────────────── */` and insert this entire block **above** it:

```css
/* ── Animation system ────────────────────────────── */
:root { --ease-spring: cubic-bezier(0.22, 1, 0.36, 1); }

@keyframes shimmer {
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
}

/* Skeleton base — always visible (no shimmer when reduced motion) */
.skel {
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.06);
}

@media (prefers-reduced-motion: no-preference) {
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slide-right {
    from { opacity: 0; transform: translateX(-10px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes pop {
    0%   { opacity: 0; transform: scale(0.88); }
    60%  { transform: scale(1.03); }
    100% { opacity: 1; transform: scale(1); }
  }

  /* Skeleton shimmer sweep */
  .skel {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.05) 25%,
      rgba(255, 255, 255, 0.10) 50%,
      rgba(255, 255, 255, 0.05) 75%
    );
    background-size: 1200px 100%;
    animation: shimmer 1.6s ease-in-out infinite;
  }

  /* Utility animation classes */
  .anim-fade-up  { animation: fade-up    400ms var(--ease-spring) both; }
  .anim-fade-in  { animation: fade-in    350ms var(--ease-spring) both; }
  .anim-pop      { animation: pop        380ms var(--ease-spring) both; }
  .anim-delay-1  { animation-delay:  60ms; }
  .anim-delay-2  { animation-delay: 120ms; }
  .anim-delay-3  { animation-delay: 180ms; }
  .anim-delay-4  { animation-delay: 240ms; }
  .anim-delay-5  { animation-delay: 300ms; }

  /* Section switch entrance (short — triggers on every nav click) */
  .section-enter { animation: fade-up 200ms var(--ease-spring) both; }

  /* Server switcher dropdown */
  .sb-server-dropdown { animation: fade-up 200ms var(--ease-spring) both; }
}

/* Scroll-reveal — invisible until IntersectionObserver fires */
.scroll-reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 500ms var(--ease-spring, ease), transform 500ms var(--ease-spring, ease);
}
.scroll-reveal.visible { opacity: 1; transform: none; }

/* Always show content when reduced motion is preferred */
@media (prefers-reduced-motion: reduce) {
  .scroll-reveal { opacity: 1; transform: none; }
}
```

- [ ] **Step 2: Update `.db-server-card` transition to use spring easing**

Find in `app/globals.css`:
```css
.db-server-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  transition: border-color 200ms, transform 200ms, box-shadow 200ms;
}
```
Replace the `transition` line only:
```css
  transition: border-color 250ms var(--ease-spring), transform 250ms var(--ease-spring), box-shadow 250ms;
```

- [ ] **Step 3: Update `.btn-save` transition and hover to add box-shadow**

Find:
```css
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
```
Replace both rules:
```css
.btn-save {
  display: inline-flex; align-items: center; gap: 0.4rem;
  background: var(--primary-dark); color: #fff;
  padding: 0.6rem 1.25rem; border-radius: 7px;
  border: none;
  font-weight: 700; font-size: 0.875rem;
  transition: background 150ms, transform 180ms var(--ease-spring), box-shadow 180ms;
  box-shadow: 0 2px 8px rgba(74,124,89,0.3);
}
.btn-save:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(120,168,106,0.4);
}
```

- [ ] **Step 4: Type-check and commit**

```bash
pnpm tsc --noEmit
```
Expected: no output (clean).

```bash
git add app/globals.css
git commit -m "feat: add animation system — spring keyframes, utility classes, skel shimmer, hover polish"
```

---

## Task 2 — Hero entrance animations

**Files:** `app/page.tsx`

- [ ] **Step 1: Animate the H1**

Find:
```jsx
            <h1
              style={{
                fontSize: "clamp(2.75rem, 5vw, 4rem)",
```
Add `className`:
```jsx
            <h1
              className="anim-fade-up anim-delay-2"
              style={{
                fontSize: "clamp(2.75rem, 5vw, 4rem)",
```

- [ ] **Step 2: Animate the hero paragraph**

Find:
```jsx
            <p
              style={{
                fontFamily: "var(--font-open-sans), sans-serif",
                fontSize: "1.125rem",
```
Add `className`:
```jsx
            <p
              className="anim-fade-up anim-delay-3"
              style={{
                fontFamily: "var(--font-open-sans), sans-serif",
                fontSize: "1.125rem",
```

- [ ] **Step 3: Animate the CTA button row**

Find:
```jsx
            <div
              className="hero-cta"
              style={{ display: "flex", gap: "0.875rem", alignItems: "center", flexWrap: "wrap" }}
```
Replace `className`:
```jsx
            <div
              className="hero-cta anim-pop anim-delay-4"
              style={{ display: "flex", gap: "0.875rem", alignItems: "center", flexWrap: "wrap" }}
```

- [ ] **Step 4: Animate the mascot**

Find:
```jsx
          <div
            className="hero-mascot"
            style={{
```
Replace `className`:
```jsx
          <div
            className="hero-mascot anim-fade-in anim-delay-3"
            style={{
```

- [ ] **Step 5: Type-check and commit**

```bash
pnpm tsc --noEmit
git add app/page.tsx
git commit -m "feat: hero entrance animations — fade-up stagger + mascot fade-in"
```

---

## Task 3 — ScrollReveal client component

**Files:** `app/_components/ScrollReveal.tsx` (create)

- [ ] **Step 1: Create the file**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

export function ScrollReveal({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-reveal${visible ? " visible" : ""} ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Type-check and commit**

```bash
pnpm tsc --noEmit
git add app/_components/ScrollReveal.tsx
git commit -m "feat: ScrollReveal client component for intersection-observer scroll animations"
```

---

## Task 4 — Scroll-triggered feature sections, CTA, and footer

**Files:** `app/page.tsx`

- [ ] **Step 1: Import ScrollReveal**

At the top of `app/page.tsx`, after the existing imports add:
```tsx
import { ScrollReveal } from "./_components/ScrollReveal";
```

- [ ] **Step 2: Wrap the Weather feature card**

The first `<div style={{ padding: "6rem 2rem" }}>` block (Weather section) contains a `feat-card-grid` div. Wrap just the inner `feat-card-grid` div:

Find:
```jsx
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
```
Replace with:
```jsx
        <div style={{ padding: "6rem 2rem" }}>
          <ScrollReveal>
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
```
And close `</ScrollReveal>` right after the closing `</div>` of that feat-card-grid.

- [ ] **Step 3: Wrap the Dashboard feature card (gridTemplateColumns: "0.9fr 1.1fr")**

Same pattern — wrap the second `feat-card-grid` div in `<ScrollReveal>`.

- [ ] **Step 4: Wrap the Welcome feature card (second "1.1fr 0.9fr" grid)**

Same pattern — wrap the third `feat-card-grid` div in `<ScrollReveal>`.

- [ ] **Step 5: Wrap the CTA banner section**

Find:
```jsx
      {/* ── CTA Banner ────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(135deg, #2d5038 0%, #4a7c59 50%, #3a6647 100%)",
```
Wrap the `<section>` contents (the `h2` and `<a>`) — or simply wrap the entire `<section>` element itself in `<ScrollReveal>`:
```jsx
      <ScrollReveal>
      <section
        style={{
          background: "linear-gradient(135deg, #2d5038 0%, #4a7c59 50%, #3a6647 100%)",
          ...
        }}
      >
        ...
      </section>
      </ScrollReveal>
```

- [ ] **Step 6: Wrap the footer**

Find:
```jsx
      {/* ── Footer ────────────────────────────────── */}
      <footer
        style={{
          background: "#191c2e",
```
Wrap it:
```jsx
      <ScrollReveal>
      <footer
        style={{
          background: "#191c2e",
          ...
        }}
      >
        ...
      </footer>
      </ScrollReveal>
```

- [ ] **Step 7: Type-check and commit**

```bash
pnpm tsc --noEmit
git add app/page.tsx
git commit -m "feat: scroll-reveal for feature sections, CTA banner, and footer"
```

---

## Task 5 — Dashboard server card stagger

**Files:** `app/dashboard/page.tsx`

The dashboard is `force-dynamic` SSR — CSS `animation` classes on server-rendered HTML fire on page load automatically. No client component needed.

- [ ] **Step 1: Add stagger index to the guilds map**

Find in `app/dashboard/page.tsx`:
```jsx
            {guilds.map((guild) => {
```
Replace with:
```jsx
            {guilds.map((guild, i) => {
```

- [ ] **Step 2: Add animation classes to each card**

Find the card root div:
```jsx
                <div key={guild.id} className="db-server-card">
```
Replace with:
```jsx
                <div key={guild.id} className={`db-server-card anim-fade-up anim-delay-${Math.min(i, 4) + 1}`}>
```

This staggers cards at 60ms, 120ms, 180ms, 240ms, 300ms — the 5th card and beyond all share 300ms to avoid long waits.

- [ ] **Step 3: Type-check and commit**

```bash
pnpm tsc --noEmit
git add 'app/dashboard/page.tsx'
git commit -m "feat: stagger entrance animation on dashboard server cards"
```

---

## Task 6 — GuildLayout sidebar and section-switch animations

**Files:** `app/dashboard/[guildId]/_components/GuildLayout.tsx`

Two changes:
1. Animate sidebar inner elements (not the `<aside>` itself — it owns mobile slide-in via transform).
2. Wrap `renderSection()` output in a keyed div with `.section-enter`.

- [ ] **Step 1: Animate sidebar inner elements**

In `GuildLayout.tsx` find the `<aside>` JSX and its children. Add animation classes to three elements:

Find:
```jsx
          <div className="sb-server-hdr sb-server-hdr-btn"
```
The outer `<div ref={switcherRef}>` wrapper — add `anim-fade-up anim-delay-1` to it:
```jsx
          <div ref={switcherRef} className="anim-fade-up anim-delay-1">
```

Find the `<nav className="sb-nav">`:
```jsx
          <nav className="sb-nav">
```
Replace with:
```jsx
          <nav className="sb-nav anim-fade-up anim-delay-2">
```

Find the back link:
```jsx
          <Link href="/dashboard" className="sb-back">
```
Replace with:
```jsx
          <Link href="/dashboard" className="sb-back anim-fade-up anim-delay-3">
```

- [ ] **Step 2: Add keyed section-enter wrapper in renderSection**

Find:
```tsx
  function renderSection() {
    switch (section) {
      case "general":  return <SectionGeneral guildId={guildId} config={config} />;
      case "commands": return <SectionCommands guildId={guildId} disabledCommands={disabledCommands} />;
      case "welcome":  return <SectionWelcome guildId={guildId} welcome={welcome} channels={channels} />;
      case "stats":    return <SectionStats guildId={guildId} />;
      case "audit":    return <SectionAudit guildId={guildId} />;
    }
  }
```
Replace with:
```tsx
  function renderSection() {
    let content: React.ReactNode;
    switch (section) {
      case "general":  content = <SectionGeneral guildId={guildId} config={config} />; break;
      case "commands": content = <SectionCommands guildId={guildId} disabledCommands={disabledCommands} />; break;
      case "welcome":  content = <SectionWelcome guildId={guildId} welcome={welcome} channels={channels} />; break;
      case "stats":    content = <SectionStats guildId={guildId} />; break;
      case "audit":    content = <SectionAudit guildId={guildId} />; break;
    }
    return <div key={section} className="section-enter">{content}</div>;
  }
```

The `key={section}` forces React to create a new DOM node on every section switch, triggering the CSS `section-enter` animation each time.

- [ ] **Step 3: Type-check and commit**

```bash
pnpm tsc --noEmit
git add 'app/dashboard/[guildId]/_components/GuildLayout.tsx'
git commit -m "feat: sidebar stagger entrance + section-switch fade animation in GuildLayout"
```

---

## Task 7 — SectionStats skeleton

**Files:** `app/dashboard/[guildId]/_components/GuildLayout.tsx`

- [ ] **Step 1: Replace the "Loading…" state in SectionStats**

Find:
```tsx
        {stats === "loading" ? (
          <div style={{ padding: "2rem 1.75rem", textAlign: "center", color: "var(--muted)", fontSize: "0.9375rem" }}>
            Loading…
          </div>
        ) : !stats || stats.total === 0 ? (
```
Replace with:
```tsx
        {stats === "loading" ? (
          <div style={{ padding: "1.5rem 1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[78, 54, 33, 18].map((pct, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div className="skel" style={{ height: 10, width: 70 }} />
                  <div className="skel" style={{ height: 8, width: 55 }} />
                </div>
                <div style={{ height: 10, borderRadius: 99, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                  <div className="skel" style={{ height: "100%", width: `${pct}%`, borderRadius: 99 }} />
                </div>
              </div>
            ))}
            <div className="skel" style={{ height: 8, width: 130, marginTop: "0.25rem" }} />
          </div>
        ) : !stats || stats.total === 0 ? (
```

- [ ] **Step 2: Type-check and commit**

```bash
pnpm tsc --noEmit
git add 'app/dashboard/[guildId]/_components/GuildLayout.tsx'
git commit -m "feat: shimmer skeleton for Command Stats loading state"
```

---

## Task 8 — SectionAudit skeleton

**Files:** `app/dashboard/[guildId]/_components/GuildLayout.tsx`

- [ ] **Step 1: Replace the null state in SectionAudit**

Find:
```tsx
        {auditLog === null ? (
          <div style={{ padding: "2rem 1.75rem", textAlign: "center", color: "var(--muted)", fontSize: "0.9375rem" }}>
            Loading…
          </div>
        ) : auditLog.length === 0 ? (
```
Replace with:
```tsx
        {auditLog === null ? (
          <div>
            {[{ w: 110, a: 155 }, { w: 90, a: 130 }, { w: 120, a: 100 }].map(({ w, a }, i) => (
              <div
                key={i}
                style={{
                  padding: "0.875rem 1.75rem",
                  borderBottom: i < 2 ? "1px solid var(--border)" : undefined,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div className="skel" style={{ height: 11, width: w }} />
                  <div className="skel" style={{ height: 9, width: 72 }} />
                </div>
                <div className="skel" style={{ height: 9, width: a }} />
              </div>
            ))}
          </div>
        ) : auditLog.length === 0 ? (
```

- [ ] **Step 2: Type-check and commit**

```bash
pnpm tsc --noEmit
git add 'app/dashboard/[guildId]/_components/GuildLayout.tsx'
git commit -m "feat: shimmer skeleton for Audit Log loading state"
```

---

## Task 9 — Push

- [ ] **Step 1: Push all commits**

```bash
git push
```

Expected: branch `dev` updated on remote.

---

## Self-review checklist

- [x] **Spec §1 (animation system):** Task 1 — `--ease-spring`, 5 keyframes, utility classes, reduced motion ✓
- [x] **Spec §2 (landing page hero):** Task 2 ✓
- [x] **Spec §2 (scroll feature sections + CTA + footer):** Tasks 3–4 ✓
- [x] **Spec §3 (dashboard card stagger + hover):** Task 5; hover handled in Task 1 CSS ✓
- [x] **Spec §4 (sidebar entrance):** Task 6 (inner elements, not `<aside>` to avoid mobile conflict) ✓
- [x] **Spec §4 (section switch):** Task 6 `key={section}` wrapper ✓
- [x] **Spec §4 (switcher dropdown, save button):** Task 1 CSS ✓
- [x] **Spec §5 (Stats skeleton):** Task 7 ✓
- [x] **Spec §5 (Audit skeleton):** Task 8 ✓
- [x] **No placeholders:** All steps contain actual code ✓
- [x] **Type names consistent:** `section-enter`, `anim-fade-up`, `skel`, `ScrollReveal` used identically throughout ✓
