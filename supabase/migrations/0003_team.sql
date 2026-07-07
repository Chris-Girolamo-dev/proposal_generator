-- Adds the team column (LCA-style "who's on the engagement" section).

alter table public.proposals
  add column if not exists team jsonb not null default '[]'::jsonb;
