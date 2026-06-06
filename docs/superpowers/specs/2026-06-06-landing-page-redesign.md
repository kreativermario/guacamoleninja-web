# Landing Page Redesign Spec

## Context

The existing landing page (`app/page.tsx`) uses a centered hero, card-grid features, and step list. This redesign brings it in line with the mee6.xyz / Discord.com design language: Discord-dark flat background, left-aligned hero, alternating full-bleed feature sections with large Discord-chrome mockup panels, and UPPERCASE heavy feature titles. The approved mockup is `.superpowers/brainstorm/63151-1780738708/content/layout-v6.html`.

---

## Design tokens

All CSS custom properties live in `app/globals.css`.

```css
--bg:           #1e2030
--bg-feat:      #191c2e   /* single colour for ALL feature sections */
--bg-card:      #252839
--bg-input:     #1a1d2e
--border:       rgba(255,255,255,0.07)
--border-hover: rgba(255,255,255,0.12)
--text:         #f2f3f5
--text-2:       #b9bbbe
--muted:        #8e9297
--primary:      #78a86a
--primary-dk:   #4a7c59
--primary-dim:  rgba(120,168,106,0.10)
--discord:      #5865f2
--destructive:  #ed4245
```

---

## Typography

Loaded via `next/font/google` in `app/layout.tsx`.

| Role | Font | Weight |
|---|---|---|
| Headlines (h1–h3) | Inter | 800–900 |
| Body / descriptions | Open Sans | 400 |
| UI / nav / buttons | Inter | 600–700 |
| Code / commands | system monospace | 600 |

---

## Page sections

### Nav
- Height 76px, sticky, `rgba(30,32,48,0.95)` + `backdrop-filter: blur(14px)`
- Left: mascot image (36×36, circle) + name `1.375rem / 900`
- Centre: Docs · Commands · Dashboard links
- Right: "Login with Discord" button (`--discord` bg, Discord SVG icon)
- Mobile: hamburger opens a drawer, links + login button stacked

### Hero
- `min-height: 100dvh`, `background: linear-gradient(180deg, #191c2e 0%, #1e2030 80%)`
- Two-column grid (1fr 1fr), text left / mascot ring right
- Headline: `clamp(2.75rem, 5vw, 4rem)` / 800 / `-0.04em` tracking; `em` word uses `--primary`
- Sub: Open Sans 1.125rem / `--muted`
- CTAs: "Add to Discord" (`--discord`) + "See features" (ghost outline)
- Bottom: three cascading-blink chevrons (opacity animation only, no translate)

### Feature sections
- Wrapped in a single `<section>` with `background: var(--bg-feat)`
- Three sections, each `padding: 6rem 2rem`, **no dividers between them**
- Each contains a `.feat-card` — `max-width: 1300px`, `border-radius: 32px`, two-column grid (1.1fr / 0.9fr), `min-height: 560px`
- Cards alternate direction (first and third: mockup left; second: mockup right via `direction: rtl`)
- Mockup visual side: coloured gradient bg specific per feature (green-dark / blue-dark / teal-dark)
- Text side: `background: #252839`, eyebrow / UPPERCASE title (clamp 2.5–3.5rem / 900) / Open Sans description / optional CTA
- Only the Dashboard section has a CTA button ("Open Dashboard")
- Discord-chrome mock panels inside the visual side

### CTA banner
- `background: linear-gradient(135deg, #2d5038, #4a7c59, #3a6647)`
- White headline + white "Add to Discord" button with Discord SVG

### Footer
- `background: #191c2e`, `1fr 2fr` grid (brand left / 3 cols right)
- Brand: mascot img + name 1.1rem/800 + tagline Open Sans 1rem
- Col headings: 1.05rem / 700
- Links: 0.975rem / `#72767d`
- Bottom bar: © 2026 guacamoleninja-bot · Open source · MIT License

---

## Files changed

| File | Change |
|---|---|
| `app/globals.css` | Full rewrite: new tokens, Inter+OpenSans import, all component classes |
| `app/layout.tsx` | Add `next/font/google` for Inter + Open Sans; apply to `<body>` |
| `app/page.tsx` | Full rewrite: new section structure per spec |

Dashboard, login, and guild pages are **not touched** by this spec.

---

## Verification

1. `pnpm dev` — visit `/`, scroll through all sections
2. Check mobile at 375px: hamburger opens drawer, hero is single-column, CTA buttons full-width centered
3. Check no underlines appear on any `<a>`
4. Check Discord SVG icon renders correctly in nav + hero CTA + bottom banner
5. Check mascot image loads from `/mascot.jpg`
6. `pnpm build` passes type-check and build
