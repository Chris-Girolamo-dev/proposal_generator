-- Adds the bonuses column (Investment-page value stack) and notes that cost_items
-- may now carry an `optional` flag inside its existing jsonb (no schema change needed).

alter table public.proposals
  add column if not exists bonuses jsonb not null default '[]'::jsonb;
