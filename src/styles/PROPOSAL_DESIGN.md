# Proposal document — Swiss Atlas design system

The proposal PDF (`src/components/proposal/`) carries the OPFOR.ai website design language
("Swiss Atlas" — Swiss timetable typography meets cartography) into print. Source references
(READ-ONLY, do not modify):

- Light: `D:\OPFOR Website Fable_version_Site_2_spinoff_1\Fable_version_Site_2_spinoff_1`
  (`Design System Token md/design.md` + `design-tokens.json`)
- Dark: `D:\OPFOR Website - Copy 2 Dark\Fable_version_Site_2_spinoff_2\index.html` (`:root` tokens)

## One token contract, dual-purpose

Every proposal component reads color exclusively through the `--pd-*` custom properties
defined on `.proposal-doc` in `globals.css`. Light values are the base; the dark variant is a
scoped override (`.proposal-doc[data-variant="dark"]`) that swaps the same token names for the
dark site's values. Nothing in the light system changes when dark ships — and any new
component that sticks to `--pd-*` tokens is automatically dual-mode.

| Token | Light (site design-tokens.json) | Dark (spinoff_2 :root) |
|---|---|---|
| `--pd-paper` | `#F7F8FA` page ground | `#0B0F17` |
| `--pd-ink` | `#0E1420` headlines/primary | `#E7ECF4` slate-white |
| `--pd-tag` | `rgba(14,20,32,.72)` lead copy | `rgba(231,236,244,.72)` |
| `--pd-dim` | `rgba(14,20,32,.56)` meta/labels | `rgba(231,236,244,.56)` |
| `--pd-mid` | `rgba(14,20,32,.38)` tertiary | `rgba(231,236,244,.38)` |
| `--pd-line` | `rgba(14,20,32,.16)` hairlines | `rgba(255,255,255,.10)` |
| `--pd-line-strong` | `rgba(14,20,32,.5)` emphasized rules | `rgba(255,255,255,.34)` |
| `--pd-faint` | `rgba(14,20,32,.12)` ghost numerals | `rgba(231,236,244,.12)` |
| `--pd-chip` | `rgba(14,20,32,.05)` client-logo backdrop | `rgba(255,255,255,.07)` |
| red accent | `#E5192B` — rule bars, red CTA period, logo only | same (never body text) |

The ground is painted per `section`, not on the wrapper — Chromium's print engine drops a tall
ancestor's background after page 1.

## Type

Direct next/font vars (Tailwind's `font-*` family utilities are never generated in this
project — see the `:root` font mirror note in `globals.css`):

- `.pd-display` — Space Grotesk: headlines, section titles, numerals, stats
- `.pd-meta` — IBM Plex Mono 10.5px uppercase: indices, labels, tags, folios
- `.pd-tag` — OCR-A: cover tagline only
- body — Inter (set on `.proposal-doc`)

## Structural signatures

- `.pd-shead` — strong top hairline + 56px×3px red bar (site `.shead`); `--sm` = 32px bar
- Mono `NN / 09` section indices, `.tfoot`-style folio footer on every page (`PageShell`)
- Oversized faint Space Grotesk numerals for phases/steps (site `.phase .pnum`)
- Red is an instrument accent only: rule bars, tick marks, the CTA period, the logo

## Logos

- Light: `OPFOR_LOGO_NEW_CROPPED.png` (flat crop — the glow asset smears on paper)
- Dark: `OPFOR_LOGO_GLOW.png` (designed glow, dark grounds only)
- Both render in `PageHeader`; CSS (`.pd-logo-light`/`.pd-logo-dark`) shows one per variant.

## Variants

`data-variant` on `ProposalDocument`, previewable at `/preview?v=<name|1-8>`:
`atlas` (default) · `instrument` (red instrument labels) · `plate` (framed pages) ·
`poster` (uppercase bold titles) · `serif` (Fraunces titles) · `dark` · `globe`
(red-ink orthographic globe behind the cover's right half, `CoverGlobe.tsx`) ·
`dark-globe` (dark + the globe backdrop).

Dark-mode exception: the services agreement + signature pages (`.pd-agreement`) always stay on
paper — clients e-sign them (DocuSign), which doesn't work on a dark ground.

Example PDFs: `proposal_examples/OPFOR_Proposal_V1..V8_*.pdf`.

## Print rules

Letter portrait, margin 0, `p-16` page padding. Every top-level section `break-before: page`;
`.no-break` on atomic blocks. Verify pagination at true print width — 816px viewport +
`emulateMediaType('print')` — screen-width measurements lie. Every section must measure
≤1056px there (Services Agreement intentionally spans 2 pages).
