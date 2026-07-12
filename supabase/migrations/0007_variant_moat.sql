-- Per-proposal export options: which visual edition renders to PDF, and whether
-- the moat content (Data boundaries page + moat-backed Why-OPFOR points) is included.
-- Defaults chosen to match the reviewed favorites: light plate-globe, moat on.

alter table public.proposals
  add column if not exists variant text not null default 'plate-globe';

alter table public.proposals
  add column if not exists moat boolean not null default true;
