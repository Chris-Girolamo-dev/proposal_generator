# CLAUDE.md — Proposal Generator

OPFOR-branded proposal generator. Fill variables + costs against a LeftClick-style high-converting
template, preview live, and **download a pixel-faithful PDF** to send to B2B biotech/pharma clients.
Single user (you). No in-app signing or payment (handled off-platform by client legal/procurement).

## Stack
- **Next.js 15 (App Router) + TypeScript + Tailwind**
- **Supabase** — Auth (single user, email/password) + Postgres + RLS. Owner-scoped.
- **PDF** — serverless `puppeteer-core` + `@sparticuz/chromium` renders the proposal route → PDF.
- **Design system** — OPFOR FINAL (red `#E5192B`), lifted from the starter-kit into `src/`.
- Deploy: Vercel (app) + Supabase (data).

## Two visual languages (do not mix them up)
1. **App shell** (`login`, `dashboard`, `proposals/*` editor): Apple-esque, clean, OPFOR **light**
   theme, Space Grotesk display + Outfit body, `rounded-xl` cards, motion presets from `lib/ease.ts`.
2. **Proposal document** (`components/proposal/`): the LeftClick high-converting layout — white
   pages, serif display headings, yellow highlighter on client name, **OPFOR red** accent/progress
   bar. This is what renders to PDF and what the client sees.

## Proposal sections (high-converting order — from Nick Saraev / LeftClick format)
Cover → YOUR problem areas → YOUR solution → Deliverables/Scope → Timeline/Roadmap → WHY us →
Investment/Pricing (variable costs) → Next Steps / CTA + Guarantee.

## Cost model
`cost_items = [{label, description?, qty, unit_cents}]` → line totals → subtotal/total.
Handles base tool delivery (qty 1) + add-ons ("white glove setup ×3", "training hours ×5").

## Directory map
```
src/
  app/                     Next.js routes
    login/                 Supabase Auth
    dashboard/             proposal list + status chips
    proposals/new/         create
    proposals/[id]/edit/   editor: variables + cost table + live preview
    api/pdf/[id]/          serverless PDF render → download
  components/
    proposal/              <ProposalDocument> + sections/  (LeftClick layout, OPFOR skin)
    editor/                form controls for the editor
    ui/                    OPFOR Motion* primitives (from starter-kit)
  lib/
    supabase/              client.ts (browser) + server.ts (server/RLS)
    pdf/                   chromium render helper
    proposal/              types + default copy + cost math
    ease.ts utils.ts hooks/  design-system motion (from starter-kit)
  styles/
    tokens.css globals.css OPFOR design tokens (source of truth: OPFOR FINAL)
    OPFOR_tokens_reference.md
supabase/migrations/       SQL schema + RLS
public/brand/logo/         OPFOR_LOGO_NEW_2026.png
Plans/                     planning docs (PLAN_proposal_generator.md is canonical)
```

## Design tokens — rules
- **Brand color is RED `#E5192B`** (not the old mirage blue — that DESIGN.md is superseded).
- Components consume **semantic Tailwind utilities** only (`bg-surface`, `text-fg`, `bg-red`, …),
  never raw hex. Source of truth = `src/styles/tokens.css`.
- Fonts: Space Grotesk (display), Outfit (body), IBM Plex Mono (mono), OCR-A (eyebrows). The
  proposal doc additionally uses a serif display (Fraunces) for the LeftClick feel.

## Build phases
P0 scaffold · P1 auth + dashboard · P2 editor + cost table · P3 proposal template · P4 PDF · P5 polish.
See `Plans/PLAN_proposal_generator.md` for the full plan + interview decisions.

## Conventions
- Follow the parent global CLAUDE.md skills/subagent workflow (code-review + qa before ship).
- Money stored as integer cents. Dates absolute.
- Never expose Supabase service-role key to the client; PDF route runs server-side only.
