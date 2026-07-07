# PLAN — Proposal Generator Platform

_Status: DRAFT (pre-interview) · Created 2026-07-07_

## 1. Goal

A PandaDoc-style proposal platform (minus the template builder). You feed it a template + variables; it generates end-to-end, client-ready proposals as shareable public URLs. Each published proposal page can be **signed** and **paid** by the client. You can enter **variable costs** and **download a PDF**.

Two distinct visual languages:
- **The app (dashboard, editor, auth)** → clean, minimal, Apple-esque, built on the **OPFOR "Mirage" design tokens** (mirage-blue accent, Outfit font, soft shadows, rounded-xl cards).
- **The generated proposal pages** → faithful to the **LEFTCLICK template** (serif display type, yellow highlighter accents, numbered 01–04 problem/solution blocks, red progress bar, "WHY us" section).

## 2. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | **Next.js 15 (App Router) + TypeScript** | Matches OPFOR stack; SSR for public proposal pages; API routes for Stripe/PDF |
| Styling | **Tailwind CSS** + OPFOR mirage tokens | Reuse existing design system for the app shell |
| Fonts | Outfit + JetBrains Mono (app); a serif display (e.g. Fraunces/Playfair) + grotesque (proposal) | App = OPFOR; proposal = LEFTCLICK |
| Backend | **Supabase** (Postgres + Auth + Storage + RLS) | Auth + DB + file storage in one; owner-scoped RLS |
| Auth | **Supabase Auth** (email/password + magic link) | Per the brief |
| Payments | **Stripe** (Checkout or Payment Element) | Client pays the proposal total on the public page |
| E-signature | **Built-in** (typed + drawn canvas signature, stored with timestamp/IP) | Avoids DocuSign cost/complexity for v1; DocuSign as later option |
| PDF | **Puppeteer-core + @sparticuz/chromium** serverless route renders the proposal page → PDF | Pixel-faithful to the live page |
| Hosting | **Vercel** (app) + Supabase (data) | Standard, cheap |

## 3. Architecture & Flow

```
Sign in (Supabase Auth)
   → Dashboard: list of proposals (draft / sent / signed / paid)
   → New Proposal: pick template → fill variables + cost line items → live preview
   → Publish: generates public slug → /p/[slug]
   → Send URL to client
Client opens /p/[slug]:
   → Reads proposal (LEFTCLICK-styled, SSR)
   → Signs (name/email + drawn signature) → status: signed
   → Pays (Stripe Checkout for the total) → status: paid
Owner can Download PDF at any time.
```

### Routes
- `/login`, `/signup` — Supabase Auth (Apple-esque)
- `/dashboard` — proposal list + status chips
- `/proposals/new`, `/proposals/[id]/edit` — editor with live preview (variable costs entered here)
- `/p/[slug]` — **public** SSR proposal page (sign + pay)
- `/api/pdf/[slug]` — server route → PDF download
- `/api/stripe/checkout`, `/api/stripe/webhook` — payment
- `/api/sign` — record signature

## 4. Data Model (Supabase)

```
proposals
  id uuid pk, owner_id uuid → auth.users, slug text unique,
  client_company text, project_title text, subtitle text,
  problems jsonb  -- [{n, text}] x4
  benefits jsonb  -- [{n, text}] x4
  why_us jsonb    -- editable stats/blurbs (defaults from LEFTCLICK)
  cost_items jsonb -- [{label, qty, unit_amount}]
  currency text default 'usd', total_cents int (derived),
  status text default 'draft', -- draft|sent|viewed|signed|paid
  published_at timestamptz, created_at, updated_at

signatures
  id, proposal_id fk, signer_name, signer_email,
  signature_svg text, signed_at, ip, user_agent

payments
  id, proposal_id fk, stripe_session_id, amount_cents,
  status, paid_at
```

**RLS:** owners CRUD their own proposals/signatures/payments. Public read of a *published* proposal exposed via a restricted view or a `SECURITY DEFINER` RPC keyed by slug (never expose owner_id/email to the public page).

## 5. The LEFTCLICK Proposal Template (to be generated)

A React component `<ProposalDocument data={...} />` rendering these sections, driven by variables:

1. **Cover** — LEFTCLICK logo, `{client_company}` (yellow highlight), `{project_title}`, hero image, slide footer.
2. **YOUR problem areas** — intro copy + 4 numbered blocks `{problems[0..3]}`.
3. **YOUR solution** — intro copy + 4 numbered benefit blocks `{benefits[0..3]}`.
4. **WHY us** — team image + credibility stats (editable, defaults preloaded).
5. **Investment / Costs** — variable cost line-items table + total. **(New section — this is where variable costs render.)**
6. **Sign** — signature block (public page only).
7. **Pay** — pay-the-total CTA (public page only).

Design cues extracted from screenshots: heavy/thin serif display headings, yellow highlighter spans, `01–04` large numerals, thin rule under intro paragraphs, red/pink bottom progress bar, monochrome body with restrained accents. Template ships with sensible **default copy** so a proposal is generatable with only company/title/costs filled in.

## 6. Build Phases

- **P0 — Scaffold:** Next.js + Tailwind + OPFOR tokens ported into `globals.css`/theme; Supabase project + schema + RLS; env wiring.
- **P1 — Auth + Dashboard:** Supabase Auth screens; proposal list with status chips (Apple-esque shell).
- **P2 — Editor:** variable form (company, title, problems, benefits, why-us, cost line-items) + live LEFTCLICK preview; save to DB.
- **P3 — Proposal template component:** pixel-match the LEFTCLICK design; wire variables + cost table.
- **P4 — Publish + public page:** slug generation; SSR `/p/[slug]`; view tracking.
- **P5 — Sign:** signature capture + record + status transition.
- **P6 — Pay:** Stripe Checkout for the total + webhook → status: paid.
- **P7 — PDF:** serverless Chromium render → download.
- **P8 — Polish:** empty states, responsive, print CSS, error handling.

## 7. Decisions from Interview (2026-07-07) — these SUPERSEDE conflicting text above

1. **Single user (just you).** No teams, no multi-tenant, no per-org branding. Supabase Auth still used (email/password) so data is owner-scoped, but RLS is trivial (one owner).
2. **No in-app signing. No in-app payment.** Clients are B2B biotech/pharma; signing + payment run through their own legal/procurement on other platforms. **Cut Stripe and signature capture entirely from v1.** Removes `signatures` + `payments` tables and all related routes.
3. **PDF is the primary (only) deliverable for v1.** No public `/p/[slug]` page. App flow = login → dashboard → editor → **Download PDF**. A shareable link can be a later add-on.
4. **Cost model = Qty × unit-price line items.** Each line: `label`, optional `description`, `qty`, `unit_amount` → line total; proposal shows subtotal/total. Handles base tool delivery (qty 1) plus add-ons like "white glove setup ×3", "training hours ×5".
5. **Template sections (Nick Saraev / LEFTCLICK high-converting order):**
   Cover → **YOUR areas of opportunity** → **YOUR solution** → **Deliverables / Scope** → **Timeline / Roadmap** → **WHY us** → **Investment / Pricing** (variable costs) → **Next Steps / CTA + Guarantee**.
   _Note: "problem areas" renamed → **"Areas of Opportunity"** for the biotech market (keeps the diagnostic principle, drops negative framing). Solution section stays "Your Solution."_
6. **Brand = OPFOR (FINAL design system), NOT LeftClick branding.** LeftClick supplies the *high-converting section structure* only; the *look* is OPFOR.
   - **Canonical source:** `D:\OPFOR Supply\DESIGN TOKEN_UI OVERHAUL\OPFOR Design System FINAL` (June 2026 overhaul). This **supersedes** the older mirage-blue `DESIGN.md`.
   - **Brand color:** red `--red #E5192B` (hover `#c30f1f`, soft tint `rgba(229,25,43,.10)`). Status: ok `#10B981`, warn `#e2b53e`, crit `#f2535a`. De-blue rule in effect.
   - **Fonts:** Space Grotesk (display/headings), Outfit (body/UI), IBM Plex Mono (codes/IDs) via `next/font/google`. **OCR-A resolved** → `OCRAEXT.TTF` (+ `ocr-a.woff`) copied to `public/brand/fonts/`, loaded via `@font-face` for section eyebrows. _Proposal-doc serif (Fraunces) for the LEFTCLICK feel — pending confirm._
   - **Surfaces (light, for Apple-esque app):** canvas `#f6f8fb` → surface `#fff` → surface-2 `#f1f3f7`. Text fg `#0f1722` / text-2 `#475063` / text-3 `#8a93a3`. Radius cards `rounded-xl/2xl`. Motion presets from `lib/ease.ts`.
   - **Logo:** `D:\OPFOR Website - Copy\OPFOR_LOGO_NEW_2026.png` → copied to `public/brand/logo/`.
   - **Starter-kit** (`.../OPFOR Design System FINAL/starter-kit`) lifted into `src/` (tokens.css, globals.css, lib/ease.ts, lib/utils.ts, Motion* components) so the system is wired from P0.
   - **App vs proposal:** app shell uses OPFOR **light** theme, Apple-esque. Proposal doc uses LEFTCLICK layout skinned in OPFOR tokens (white pages, serif display, red accent = OPFOR red, yellow highlighter on client name).
7. **Deploy:** Vercel (app) + Supabase (data). No public-URL domain needed for v1 since PDF-only.

### Revised data model (v1)
Keep only `proposals` (drop `signatures`, `payments`). Add `deliverables jsonb`, `timeline jsonb`, `next_steps jsonb`, `guarantee text`. `cost_items jsonb = [{label, description, qty, unit_cents}]`.

### Revised build phases (v1)
- **P0** Scaffold: Next.js + Tailwind + OPFOR tokens + Supabase schema/RLS.
- **P1** Auth (single user) + Dashboard list.
- **P2** Editor: all section variables + qty×unit cost table + live preview.
- **P3** LEFTCLICK `<ProposalDocument>` template (all 8 sections, exact brand tokens).
- **P4** PDF export (serverless Chromium → download).
- **P5** Polish: print CSS, responsive editor, empty/error states.
_(Former P5–P7 sign/pay/public-page phases removed.)_

### Resolved (all inputs collected)
- ✅ Brand = OPFOR FINAL (red). Logo + tokens + starter-kit in project.
- ✅ Fonts local: Space Grotesk / Outfit / IBM Plex Mono (Google) + OCR-A (`OCRAEXT.TTF`). Proposal serif = **Fraunces** (confirmed).
- ✅ Section rename: "problem areas" → **"Areas of Opportunity"**.
- ✅ Default biotech-forecasting copy drafted → `src/lib/proposal/defaults.ts` (+ `types.ts`).

### Ready to build — nothing blocking P0.
