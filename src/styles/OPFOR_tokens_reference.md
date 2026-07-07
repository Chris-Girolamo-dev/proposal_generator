# OPFOR Supply — Token Reference

Mirror of `src/app/tokens.css` (values) + `src/app/globals.css` `@theme inline` (utilities) +
`src/lib/ease.ts` (motion). **Edit the code files, not this doc** — this is for quick reading.

---

## Color — Brand & Status (theme-independent unless noted)

| Token | Tailwind utility | Dark | Light | Use |
|---|---|---|---|---|
| `--red` | `bg-red` / `text-red` | `#E5192B` | same | Brand + primary action + shortfall |
| `--red-hover` | `bg-red-hover` | `#c30f1f` | same | Primary hover |
| `--red-soft` | `bg-red-soft` | `rgba(229,25,43,.13)` | `rgba(229,25,43,.10)` | Red tint / focus ring |
| `--ok` | `text-ok` | `#10B981` | `#0f9d6e` | Success / in-stock |
| `--warn` | `text-warn` | `#e2b53e` | `#b8841f` | Low / watch |
| `--crit` | `text-crit` | `#f2535a` | `#d92b30` | Critical |
| `--info` | `text-info` | `#5b8def` | `#3f6bb5` | Informational / forecast. **De-blue rule:** only kept on Visit Day#/ACT badges + OLE markers + chart series; neutralized elsewhere. |

## Color — Surfaces (darkest → lightest)

| Token | Tailwind | Dark | Light |
|---|---|---|---|
| `--bg` | `bg-canvas` | `#0a0c11` | `#f6f8fb` |
| `--surface` | `bg-surface` | `#121620` | `#ffffff` |
| `--surface-2` | `bg-surface-2` | `#181d28` | `#f1f3f7` |
| `--elevated` | `bg-elevated` | `#1f2533` | `#ffffff` |

## Color — Lines & Text

| Token | Tailwind | Dark | Light |
|---|---|---|---|
| `--border` | `border-border` | `rgba(255,255,255,.07)` | `rgba(15,23,34,.09)` |
| `--border-2` | `border-border-2` | `rgba(255,255,255,.12)` | `rgba(15,23,34,.16)` |
| `--text` | `text-fg` | `#f1f2f4` | `#0f1722` |
| `--text-2` | `text-text-2` | `#a6abb3` | `#475063` |
| `--text-3` | `text-text-3` | `#6b7079` | `#8a93a3` |

## Color — Charts (data-viz only; NOT chrome — keep their blues)

`--chart-cat-1..6`: `#6e8fb8 #5aa98e #c2a24e #9a85bf #5f9bb0 #c77f6b` (+ a sequential blue ramp
`--chart-seq` used for ordered series). Charts are exempt from the de-blue rule.

---

## Typography

- **Display / headings:** `font-display` (Space Grotesk in the marketing surfaces; the app uses
  Outfit/“mirage” display for KPIs and the protocol code).
- **Body / UI:** the app sans (Outfit / Inter fallbacks).
- **Mono:** IBM Plex Mono for codes/IDs.
- **OCR-A** (`/OCRAEXT.TTF`, `@font-face` in `globals.css`): section eyebrows/titles on the Share
  dashboard (e.g. "Clinical Supply Forecast", "Program Cost").
- Dense-table convention: `text-xs` / `text-[11px]` / `text-[10px]`, `px-2 py-0.5` cells.

---

## Radius

- Chips/badges: `rounded` (≈4px). Buttons/inputs: `rounded-md` / `rounded-lg`. Cards/sheets:
  `rounded-xl` / `rounded-2xl` (top-sheet uses `rounded-b-2xl`, bottom-style sheets `rounded-t-3xl`).

## Spacing

Tailwind scale. Dense config tables: `px-2 py-0.5`. Standard table style: `text-xs`, `border
border-gray-200`-equivalent via `border-border`, `bg-surface-2` headers, zebra `bg-surface-2/50`.

---

## Motion (`src/lib/ease.ts`)

| Token | Value | Use |
|---|---|---|
| `EASE_OUT` | `[0.16, 1, 0.3, 1]` | General ease-out (tooltips, fades, row reveals) |
| `EASE_IN_OUT` | `[0.77, 0, 0.175, 1]` | Symmetric |
| `EASE_DRAWER` | `[0.32, 0.72, 0, 1]` | Sheets/drawers (Model Settings top-sheet, Help/Chat) |
| `EASE_OUT_CSS` | `cubic-bezier(0.16,1,0.3,1)` | Inline CSS transitions |
| `SPRING_PRESS` | spring 500/30/0.6 | Button/checkbox/radio tap feedback |
| `SPRING_SWAP` | spring 460/30/0.55 | Label/icon swaps (action-swap) |
| `SPRING_PANEL` | spring 420/40/0.5 | Pointer-summoned panels |
| `SPRING_LAYOUT` | spring 360/32/0.6 | Shared-layout glides (radio dot, indicators) |

Conventions: every motion component is **reduced-motion aware** (`useReducedMotion`) and falls
back to a fade or instant transition. Sheets/dropdowns/tooltips **portal** to `document.body` so
they never clip inside scrolling tables/toolbars.
