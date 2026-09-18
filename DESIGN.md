# Design System — Reusable Base for Projects

A shared visual system to apply across upcoming projects. Built on five core colors: **white, black, amber, deep blue, green.**

Copy this file into each new project, adjust only the brand accent if that project needs its own identity, and keep everything else consistent.

---

## 1. Color Palette

### 1.1 Neutrals (the foundation — ~85% of any screen)

| Token | Hex | Usage |
|---|---|---|
| `--canvas` | `#FAF9F7` | Page background (warm off-white, not sterile pure white) |
| `--surface` | `#FFFFFF` | Cards, panels, nav, modals |
| `--surface-sunken` | `#F3F1ED` | Recessed areas — code blocks, canvases, dropzones, empty states |
| `--surface-alt` | `#EFECE6` | Alternating sections, table header rows |
| `--border` | `#DFDAD1` | Card borders, dividers, inputs |
| `--border-strong` | `#BDB5A8` | Focus/active/hover borders, drag-over states |

### 1.2 Text (black scale)

| Token | Hex | Usage | Contrast on canvas |
|---|---|---|---|
| `--text-primary` | `#1A1917` | Headings, key values | 16.5:1 |
| `--text-secondary` | `#413E39` | Body copy | 10.2:1 |
| `--text-muted` | `#6B655B` | Metadata, helper text, labels | 5.1:1 ✓ AA |
| `--text-disabled` | `#9A9288` | Disabled states only | — |
| `--text-inverse` | `#FFFFFF` | Text on dark/colored fills |

### 1.3 Amber (the "intelligence / attention" accent — capped at ~3% of screen)

| Token | Hex | Usage |
|---|---|---|
| `--amber` | `#C7953D` | AI indicators, key metric emphasis, focal action, progress |
| `--amber-strong` | `#A87A2B` | Amber hover / higher emphasis |
| `--amber-surface` | `#F7EACE` | Recommendation chips, highlight backgrounds |
| `--amber-text` | `#76561B` | Text on amber-surface (5.5:1 ✓ AA) |

**Amber rules (strict):**
- Never a section background, headline color, or navbar
- Never the default button color — use black/dark for primary CTAs
- Only for: AI/recommendation states, the single most important metric on a screen, one focal action, or processing indicators
- If amber appears on more than ~3 places in a viewport, remove some

### 1.4 Deep Blue (structural / informational accent)

| Token | Hex | Usage |
|---|---|---|
| `--blue` | `#2C4A7C` | Links, primary buttons (when you don't want black), active tabs, brand |
| `--blue-strong` | `#1E3559` | Hover state |
| `--blue-surface` | `#E6ECF5` | Selected chips, info callout backgrounds |
| `--blue-text` | `#274169` | Text on blue-surface (7.2:1 ✓ AAA) |

Blue is the workhorse interactive color — safe, unlimited use for links, tabs, selected states, and chart primaries.

### 1.5 Green (success / positive state)

| Token | Hex | Usage |
|---|---|---|
| `--green` | `#2F7D5C` | Success icons, positive deltas, "ready"/"complete" states |
| `--green-strong` | `#215C43` | Hover / emphasis |
| `--green-surface` | `#E2F0E9` | Success banners and chips |
| `--green-text` | `#1F5A42` | Text on green-surface (6.8:1 ✓ AA) |

### 1.6 Supporting semantics (derive, don't invent new hues)

| State | Surface | Icon | Text |
|---|---|---|---|
| Success / ready | `#E2F0E9` | `#2F7D5C` | `#1F5A42` |
| Info / neutral | `#E6ECF5` | `#2C4A7C` | `#274169` |
| Warning / attention | `#F7EACE` | `#C7953D` | `#76561B` |
| Error / risk | `#F7E5E2` | `#B8503F` | `#8A3A2D` |

Error red (`#B8503F`) is the only color outside your five — it's unavoidable for destructive/failure states, and it's warm enough to sit naturally beside amber.

### 1.7 Chart series order

1. `#2C4A7C` (deep blue)
2. `#2F7D5C` (green)
3. `#C7953D` (amber)
4. `#7A6EA8` (muted violet — 4th series only)
5. `#B8503F` (warm red — 5th series only)

**Never distinguish series by color alone** — pair with solid/dashed lines, circle/diamond markers, or direct labels.

### 1.8 Usage balance target

| Share | Colors |
|---|---|
| ~70% | Canvas + surface (white/off-white) |
| ~15% | Alt surfaces, borders |
| ~9% | Black text and dark controls |
| ~3% | Blue interactive elements |
| ~3% | Amber + green + semantic accents combined |

---

## 2. Typography

**Family:** Inter, Geist, or Manrope. System fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. Never a script or handwritten face.

**Mono (code, file paths, IDs):** JetBrains Mono, Fira Code, or `ui-monospace, SFMono-Regular, Menlo, monospace`.

| Role | Size | Weight | Color |
|---|---|---|---|
| Display / hero | 56–80px | 600 | `--text-primary` |
| H1 / page title | 32–40px | 600 | `--text-primary` |
| H2 / section | 22–26px | 600 | `--text-primary` |
| H3 / card title | 16–18px | 600 | `--text-primary` |
| Body | 15px | 400 | `--text-secondary` |
| Small / helper | 13px | 400 | `--text-muted` |
| Label / eyebrow | 12px | 500, `letter-spacing: 0.08em`, uppercase | `--text-muted` |
| Hero metric | 44–56px | 700 | `--text-primary` |

**Line height:** 1.15 for display/headings, 1.6 for body.
**Max line length:** ~68 characters for body text.

---

## 3. Shape System

Not everything gets the same radius — that's what creates hierarchy.

| Element | Radius |
|---|---|
| Hero containers, primary feature cards | 28–32px |
| Standard cards, panels | 16–20px |
| Inputs, small cards, code blocks | 10–12px |
| Buttons | Full pill (999px) |
| Badges, status chips, filters | Full pill |
| Icon containers | 12px squircle, 40×40px |
| Utility icon buttons (close, zoom, arrow) | Full circle, 36–44px |
| Avatars | Full circle |

**Rule:** the more important and the larger the element, the softer the corner.

---

## 4. Spacing & Layout

**Base unit: 4px.** Use only: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128`.

| Context | Spacing |
|---|---|
| Inside a chip/badge | 6px 12px |
| Inside a button | 10px 20px |
| Inside a card | 20–24px |
| Between cards in a grid | 16–20px |
| Between sections (app) | 32–48px |
| Between sections (marketing page) | 96–128px |

**Container widths:** content `1200px`, reading/prose `720px`, forms `560px`.

**Grid:** 12-column desktop, 8-column tablet, 4-column mobile.

---

## 5. Elevation

Warm shadows only — never colored glows.

| Level | Shadow | Use |
|---|---|---|
| 0 | none, `1px solid --border` | Default cards |
| 1 | `0 1px 3px rgba(26,25,23,0.06)` | Hover on interactive cards |
| 2 | `0 4px 12px rgba(26,25,23,0.08)` | Raised/hero cards |
| 3 | `0 12px 32px rgba(26,25,23,0.12)` | Dropdowns, popovers |
| 4 | `0 24px 64px rgba(26,25,23,0.16)` | Modals |

Most cards should be level 0 (border only). Reserve level 2+ for the one element that matters most on a screen.

---

## 6. Component Specs

### Buttons

| Variant | Background | Text | Border |
|---|---|---|---|
| Primary | `--text-primary` (`#1A1917`) | white | none |
| Secondary | `--surface` | `--text-primary` | `--border` |
| Accent | `--blue` | white | none |
| Ghost | transparent | `--text-secondary` | none |
| Danger | `#B8503F` | white | none |

Heights: small 36px, default 44px, large 52px. **Minimum touch target 44px.**

Primary buttons are **black**, not amber — this is what keeps the design premium instead of looking like an orange template.

### Badges / status chips

Full pill, 24px (small) or 28px (default) height, 12px font, 500 weight, `6px 12px` padding. Always pull background/text from the semantic table in §1.6 — never one-off colors.

### Cards

`--surface` background, 16–20px radius, `1px solid --border`, 20–24px padding. On hover (only if interactive): border → `--border-strong`, shadow level 1, 1px lift, 180ms ease.

### Inputs

44px height, `--surface` background, `1px solid --border`, 10px radius, 15px text. Focus: 2px `--blue` ring with 2px offset. Placeholder: `--text-muted`.

### Empty states

`--surface-sunken` background, dashed `--border`, centered: 32px icon → 16px semibold headline → 13px `--text-muted` line → optional pill CTA.

### Tables

Header row `--surface-alt`, 12px uppercase `--text-muted` labels. Rows 48px, `1px solid --border` between. Hover `--surface-alt`. Numeric columns right-aligned, tabular figures.

---

## 7. Motion

| Interaction | Duration | Easing |
|---|---|---|
| Hover / color change | 150ms | `ease-out` |
| Card hover lift | 180ms | `cubic-bezier(0.2,0,0,1)` |
| Tab / panel crossfade | 150ms | `ease-out` |
| Dropdown, popover | 200ms | `cubic-bezier(0.2,0,0,1)` |
| Modal | 250ms | `cubic-bezier(0.2,0,0,1)` |
| Chart / gauge draw-in | 600ms, once | `ease-out` |
| Ambient background drift | 20–24s loop | `linear` |

**Rules:**
- Every animation explains a state change — nothing decorative
- No bouncing, particles, parallax, auto-carousels, rotating 3D, or infinite loops
- Charts draw in **once**, never on every re-render
- Always ship a `prefers-reduced-motion` block that disables transforms, loops, and draw-ins

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Accessibility (non-negotiable)

- [ ] Body text ≥4.5:1, large text ≥3:1 — all tokens above are pre-verified
- [ ] Amber (`#C7953D`) is **never** used for body text on white (2.7:1) — icons/graphics only; use `--amber-text` for text
- [ ] Visible focus ring on every interactive element (2px `--blue`, 2px offset)
- [ ] Minimum 44×44px touch targets
- [ ] Never encode meaning in color alone — pair with icon, label, or shape
- [ ] All form inputs have associated `<label>`
- [ ] Content that swaps in place uses `aria-live`
- [ ] Full keyboard navigation; logical tab order; skip-to-content link
- [ ] Charts include text labels and non-color series differentiation

---

## 9. Responsive

| Breakpoint | Width |
|---|---|
| Mobile | <640px |
| Tablet | 640–1024px |
| Desktop | 1024–1440px |
| Wide | >1440px |

**Mobile is recomposed, not shrunk:**
- Full-width blocks, one message per block
- Multi-column grids → single column
- Sticky/side-by-side layouts → stacked sequence
- Dense tables → stacked key-value cards
- Section spacing drops to ~56–64px
- Display type drops to 36–44px
- Text before visual where context is needed first

---

## 10. Content Rules

- Outcomes before features
- One strong headline + one short explanation per section
- Plain language up top, technical terms further down
- Avoid: "revolutionary," "game-changing," "effortlessly," "seamlessly," repeated "AI-powered"
- **Never invent** metrics, customer counts, testimonials, or partner logos
- Only advertise features that actually exist
- Use real product data in screenshots and demos, not placeholder numbers
- Label demos clearly as demos

---

## 11. CSS Variables (drop-in)

```css
:root {
  /* Neutrals */
  --canvas:           #FAF9F7;
  --surface:          #FFFFFF;
  --surface-sunken:   #F3F1ED;
  --surface-alt:      #EFECE6;
  --border:           #DFDAD1;
  --border-strong:    #BDB5A8;

  /* Text */
  --text-primary:     #1A1917;
  --text-secondary:   #413E39;
  --text-muted:       #6B655B;
  --text-disabled:    #9A9288;
  --text-inverse:     #FFFFFF;

  /* Amber */
  --amber:            #C7953D;
  --amber-strong:     #A87A2B;
  --amber-surface:    #F7EACE;
  --amber-text:       #76561B;

  /* Blue */
  --blue:             #2C4A7C;
  --blue-strong:      #1E3559;
  --blue-surface:     #E6ECF5;
  --blue-text:        #274169;

  /* Green */
  --green:            #2F7D5C;
  --green-strong:     #215C43;
  --green-surface:    #E2F0E9;
  --green-text:       #1F5A42;

  /* Error */
  --error:            #B8503F;
  --error-surface:    #F7E5E2;
  --error-text:       #8A3A2D;

  /* Radius */
  --r-sm:   10px;
  --r-md:   16px;
  --r-lg:   20px;
  --r-xl:   28px;
  --r-pill: 999px;

  /* Shadow */
  --sh-1: 0 1px 3px rgba(26,25,23,0.06);
  --sh-2: 0 4px 12px rgba(26,25,23,0.08);
  --sh-3: 0 12px 32px rgba(26,25,23,0.12);
  --sh-4: 0 24px 64px rgba(26,25,23,0.16);

  /* Type */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
}
```

---

## 12. Per-Project Customization

Keep everything above fixed. Change only this:

1. **Pick one brand accent** for the project — deep blue is the default; substitute another hue only if the project needs its own identity (e.g. terracotta, violet)
2. Generate its four variants: `base`, `strong`, `surface`, `text` — matching the contrast targets in §1
3. Leave amber, green, and error exactly as they are — they carry consistent meaning across all your projects
4. Adjust display type size to the project's density (denser tools → smaller display type)

---

## 13. Pre-Ship Checklist

- [ ] Every color on screen traces back to a token — zero one-off hex values
- [ ] Amber occupies ≤3% of any viewport
- [ ] Primary buttons are black, not amber
- [ ] Radius hierarchy is visible (hero softer than cards, cards softer than inputs)
- [ ] At most one level-2+ shadow per screen
- [ ] All badges pull from the semantic table
- [ ] Focus rings visible everywhere
- [ ] `prefers-reduced-motion` block present
- [ ] Mobile recomposed, not shrunk
- [ ] No invented metrics or fake social proof
- [ ] Contrast spot-checked on rendered output, not just the token table