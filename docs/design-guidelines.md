# guacamoleninja-web — Design Guidelines

## Colors

```css
--bg:           #1e2030   /* page background */
--bg-feat:      #191c2e   /* ALL feature sections — single colour, no alternating */
--bg-card:      #252839   /* card/panel surfaces */
--bg-input:     #1a1d2e   /* form inputs */
--border:       rgba(255,255,255,0.06)
--border-hover: rgba(255,255,255,0.12)
--text:         #f2f3f5   /* primary text */
--text-secondary: #b9bbbe /* secondary text */
--muted:        #8e9297   /* Discord muted gray */
--primary:      #78a86a   /* brand green — use sparingly as accent only */
--primary-dk:   #4a7c59   /* darker green — CTA buttons, active states */
--primary-dim:  rgba(120,168,106,0.10) /* green tint backgrounds */
--discord:      #5865f2   /* Discord blue — "Add to Discord" / "Login with Discord" buttons only */
--destructive:  #ed4245
```

### Green usage rules
- One accent per visual unit maximum (one word in a headline, one badge, or one icon — not all three)
- Never use `--primary` as a background color on large surfaces
- CTAs that invite to Discord use `--discord` (#5865f2), not green
- The full-width bottom CTA banner uses `--primary-dk` as a gradient background (exception)

## Typography

| Role | Font | Weight | Notes |
|---|---|---|---|
| Headlines (h1–h3) | Inter | 800 | letter-spacing: -0.04em |
| Body / descriptions | Open Sans | 400 | line-height: 1.7 |
| UI labels, nav, buttons | Inter | 600–700 | |
| Code / commands | monospace (system) | 600 | color: --primary |

Google Fonts import:
```
Inter:wght@400;500;600;700;800;900
Open+Sans:wght@400;500;600;700
```

## Layout

- Max content width: **1200px**, centered
- Section padding: **6rem 3rem** desktop, **3rem 1.25rem** mobile
- Feature sections: **2-column grid** alternating left/right (text + mockup)
- Hero: **left-aligned text**, mascot/visual on right

## Scroll

- `html { scroll-behavior: smooth; }`
- Hero section: `min-height: 100dvh` so it fills the first screen
- Sections flow naturally below — no pagination or JS scroll hijacking

## Navbar

- Height: **62px**
- Background: `rgba(30,32,48,0.9)` + `backdrop-filter: blur(12px)`
- Border-bottom: `1px solid var(--border)`
- Sticky, `z-index: 20`
- Left: logo mark + name
- Right: Docs · Commands · Dashboard · **Add to Discord** · **Login with Discord**
- "Add to Discord" → `--primary-dk` background
- "Login with Discord" → `--discord` background + Discord SVG icon (see CLAUDE.md)

## Discord SVG Icon

Always use the SVG in CLAUDE.md. viewBox `0 0 127.14 96.36`. Never substitute with a different path or emoji.

## Buttons

```
btn-primary:  background --discord,    color #fff,   padding 0.75rem 1.5rem,  border-radius 8px,  font-weight 700
btn-green:    background --primary-dk, color #fff,   padding 0.75rem 1.5rem,  border-radius 8px,  font-weight 700
btn-outline:  background rgba(255,255,255,0.05), border 1px solid rgba(255,255,255,0.1), color --text
```

## Cards / Mockup Panels

- Background: `--bg-card`
- Border: `1px solid var(--border)`
- Border-radius: **16px**
- Box-shadow: `0 8px 40px rgba(0,0,0,0.4)`
- Titlebar (fake browser chrome): `background rgba(0,0,0,0.25)`, red/amber/green dots

## Sections structure (landing page)

1. **Nav** — sticky, 76px height, logo 1.375rem/900 weight
2. **Hero** — 100dvh, left-aligned text, mascot right, no badge, cascading blink chevron at bottom
3. **Feature sections** — wrapped in `.features-wrap` with single `--bg-feat` background. Three sections (Weather, Dashboard, Welcome Messages), alternating left/right layout. Separated by a single 1px `rgba(255,255,255,0.05)` line only — no colour change between sections.
4. **CTA Banner** — full-width `--primary-dk` gradient, white text + white "Add to Discord" button
5. **Footer** — dark `#191c2e`, `1fr 2fr` grid (brand left, 3 cols right)

## Copy rules

- No em-dashes (—) in body copy. Use a period and new sentence instead.
- No underlines on any link or button, ever. Use `a { text-decoration: none !important; }` globally.
- Placeholder names in mockups: alex, sam, taylor, jamie, casey — never real names.

## Scroll cue (hero bottom)

Three chevron spans, `opacity` only animation (no translate/movement). Cascading blink with `animation-delay` 0s / 0.2s / 0.4s on a 1.4s `chevBlink` keyframe (0→1 opacity). Size: 20×20px, `border-right + border-bottom` rotated 45°, `var(--primary)` colour.

## Footer

- Background: `#191c2e`
- Font size: minimum **0.875rem** (14px at 16px base)
- Columns: Brand+tagline / Bot / Resources / Project
- Link color: `#72767d`, hover `--text`

## Mobile (< 768px)

- Hero: single column, mascot hidden or below text
- Feature sections: single column, mockup below text
- Nav: logo + hamburger (or just the two CTA buttons)
- Section padding: `3rem 1.25rem`
- Footer: single column stack

## Content rules

- Never use real names of contributors/maintainers in mockups or examples
- Use generic placeholder names: alex, sam, taylor, jamie, casey, riley
- Chat mockups use Discord-dark UI chrome (titlebar dots, channel name)
- Command text in mockups: `color: --primary`, font-weight 600
