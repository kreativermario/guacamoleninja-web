# Animations & Skeleton Loading — Design Spec
_Date: 2026-06-06_

## Overview

Add **Option B "Fluid" animations** site-wide and replace every "Loading…" text placeholder with a **shimmer skeleton** that matches the shape of the real content. No new dependencies — pure CSS keyframes + IntersectionObserver.

---

## 1. Animation System (globals.css)

### Easing

All motion uses a single spring-like easing curve:

```
--ease-spring: cubic-bezier(0.22, 1, 0.36, 1)
```

Applied via a CSS custom property so it can be changed globally.

### Keyframes (added to globals.css)

| Name | Motion |
|---|---|
| `fade-up` | opacity 0→1, translateY 14px→0 |
| `fade-in` | opacity 0→1 only |
| `slide-right` | opacity 0→1, translateX -10px→0 |
| `pop` | scale 0.88→1.03→1 with opacity |
| `shimmer` | background-position sweep for skeleton |

### Utility classes

```
.anim-fade-up      — applies fade-up with var(--ease-spring)
.anim-fade-in      — applies fade-in
.anim-pop          — applies pop (for buttons/badges)
.anim-delay-1..5   — stagger delays: 60ms, 120ms, 180ms, 240ms, 300ms
```

### Reduced motion

All keyframe animations wrapped in `@media (prefers-reduced-motion: no-preference)` so the system respects the OS accessibility setting.

---

## 2. Landing Page (app/page.tsx)

Server Component — no hooks. Animations added via CSS classes only (no JS needed for mount; IntersectionObserver used for scroll sections).

### Hero section
- Logo image: `anim-fade-up` delay-1
- H1 heading: `anim-fade-up` delay-2
- Paragraph: `anim-fade-up` delay-3
- CTA buttons div: `anim-pop` delay-4
- Hero mascot image: `anim-fade-in` delay-3 + scale 0.95→1

### Scroll-triggered feature sections (3 cards)
Wrap each `.feat-card-grid` in a thin client component `<ScrollReveal>` that adds `data-visible` via IntersectionObserver (threshold 0.15). CSS transitions on `[data-visible]`. No library needed.

```
ScrollReveal children transition: opacity 0→1, translateY 20px→0, 500ms spring
Stagger between the 3 sections: sections enter independently as they scroll into view
```

### CTA banner + footer
Same `<ScrollReveal>` wrapper, fade-in only (no Y movement — already full-width).

---

## 3. Dashboard page (app/dashboard/page.tsx)

Server Component. Wrap the server grid in a client component `<ServerGrid>` that handles mount animation.

### Server cards entrance
- Cards stagger in with `fade-up` on mount: each card delayed by `index * 60ms`
- Max stagger cap: 300ms (5th+ cards share the same delay to avoid long waits)

### Card hover (CSS only)
```css
.db-server-card {
  transition: transform 250ms var(--ease-spring), box-shadow 250ms, border-color 250ms;
}
.db-server-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 28px rgba(0,0,0,0.5);
  border-color: rgba(120,168,106,0.3);
}
```

### Skeleton state
While `getUserGuilds` + `getBotGuildIds` resolve (server-side, so no client skeleton needed here — the page is SSR). No skeleton required for the dashboard grid itself.

---

## 4. Guild Settings page (GuildLayout.tsx)

Client Component — all hooks available.

### Sidebar entrance (on mount)
- `<aside>`: slide in from left (`slide-right`, 420ms, `--ease-spring`)
- `SbGroup` labels: stagger fade-up (delay-1, delay-2)
- `SbItem` rows within each group: cascade with 40ms per item

### Main content entrance (on mount)
- Section header: `fade-up` 380ms delay-1
- Form card: `fade-up` 400ms delay-2
- Save button: `pop` 360ms delay-3

### Section switch transition
When `section` state changes, the incoming section gets a `fade-up` entrance (160ms, no stagger). The outgoing section exits instantly (no exit animation — keeps navigation snappy).

Implementation: add a `key={section}` on the `<main>` content wrapper so React remounts the subtree, triggering the CSS entrance animation automatically.

### Server switcher dropdown
When `switcherOpen` becomes true, the dropdown animates open:
```css
.sb-server-dropdown {
  animation: fade-up 200ms var(--ease-spring);
}
```

### Save button hover
```css
.btn-save {
  transition: transform 180ms, box-shadow 180ms, background 150ms;
}
.btn-save:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(120,168,106,0.35);
}
```

---

## 5. Skeleton Loading

### Shared shimmer (globals.css)
```css
@keyframes shimmer {
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
}
.skel {
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.05) 25%,
    rgba(255,255,255,0.10) 50%,
    rgba(255,255,255,0.05) 75%
  );
  background-size: 1200px 100%;
  animation: shimmer 1.6s ease-in-out infinite;
}
```

### SectionStats skeleton
Replaces `"Loading…"` while `fetchGuildStats` is in flight.
Shape mirrors real content: 4 rows of `[command-name pill] [count pill]` + bar track.

### SectionAudit skeleton  
Replaces `"Loading…"` while `fetchGuildAuditLog` is in flight.
Shape mirrors real content: 3 rows of `[action pill] [timestamp pill]` + `[actor line]`.

### When data arrives
Both sections use `useState("loading" | data | null)`. On transition from loading → data, the container gets `anim-fade-up` (160ms) so content slides in rather than snapping.

---

## 6. Files Changed

| File | Change |
|---|---|
| `app/globals.css` | Add `--ease-spring`, keyframes, `.anim-*`, `.skel`, hover rules |
| `app/page.tsx` | Add animation classes to hero elements; wrap feat sections in `<ScrollReveal>` |
| `app/_components/ScrollReveal.tsx` | New thin client component (IntersectionObserver) |
| `app/dashboard/page.tsx` | Wrap server grid in `<ServerGrid>` client component |
| `app/dashboard/_components/ServerGrid.tsx` | New: handles stagger mount animation |
| `app/dashboard/[guildId]/_components/GuildLayout.tsx` | Section `key` swap, save button hover, sidebar/main entrance |
| `app/globals.css` (skeleton) | `.skel` shimmer class |
| `GuildLayout.tsx` SectionStats | Skeleton replaces "Loading…" |
| `GuildLayout.tsx` SectionAudit | Skeleton replaces "Loading…" |

---

## 7. Out of Scope

- Page-to-page route transition animations (Next.js App Router doesn't support these without a library)
- Exit animations on section unmount
- Parallax scrolling
- Any animation library (Framer Motion, GSAP, etc.)
