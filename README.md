# Proposal Generator

OPFOR-branded proposal generator. Enter variables + variable costs against a high-converting
(LeftClick-style) template, preview live, and download a pixel-faithful **PDF** to send to clients.

- **App:** Apple-esque, OPFOR light theme (red `#E5192B`, Space Grotesk + Outfit).
- **Proposals:** LeftClick high-converting layout, skinned in OPFOR tokens, exported to PDF.
- **Backend:** Supabase (Auth + Postgres + RLS). Single user.
- **No in-app signing/payment** — clients handle that through their own legal/procurement.

## Getting started (once P0 build lands)
```bash
npm install
cp .env.example .env.local   # fill Supabase keys
npx supabase db push          # apply migrations
npm run dev
```

## Docs
- `Plans/PLAN_proposal_generator.md` — full plan + interview decisions (canonical).
- `CLAUDE.md` — architecture + conventions for agents.
- `src/styles/OPFOR_tokens_reference.md` — design token reference.
