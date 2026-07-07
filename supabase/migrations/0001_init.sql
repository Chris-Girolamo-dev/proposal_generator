-- Proposal Generator — initial schema (v1)
-- Single-user, owner-scoped. No signatures/payments (handled off-platform).

create extension if not exists "pgcrypto";

create table if not exists public.proposals (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references auth.users(id) on delete cascade,
  slug          text unique not null default encode(gen_random_bytes(6), 'hex'),

  -- header
  client_company text not null default '',
  project_title  text not null default '',
  subtitle       text not null default '',

  -- LeftClick high-converting sections (defaults filled by app from lib/proposal defaults)
  problems     jsonb not null default '[]'::jsonb,  -- [{n, text}]
  benefits     jsonb not null default '[]'::jsonb,  -- [{n, text}]  (YOUR solution)
  deliverables jsonb not null default '[]'::jsonb,  -- [{text}]
  timeline     jsonb not null default '[]'::jsonb,  -- [{phase, label, detail}]
  why_us       jsonb not null default '{}'::jsonb,  -- editable stats/blurbs
  next_steps   jsonb not null default '[]'::jsonb,  -- [{step}]
  guarantee    text  not null default '',

  -- variable costs: qty x unit
  cost_items   jsonb not null default '[]'::jsonb,  -- [{label, description, qty, unit_cents}]
  currency     text  not null default 'usd',
  total_cents  integer not null default 0,          -- derived, kept in sync by app

  status       text not null default 'draft',        -- draft | ready | sent
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists proposals_owner_idx on public.proposals(owner_id);

-- keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists proposals_touch on public.proposals;
create trigger proposals_touch before update on public.proposals
  for each row execute function public.touch_updated_at();

-- RLS: an owner sees and mutates only their own proposals
alter table public.proposals enable row level security;

drop policy if exists proposals_select_own on public.proposals;
create policy proposals_select_own on public.proposals
  for select using (auth.uid() = owner_id);

drop policy if exists proposals_insert_own on public.proposals;
create policy proposals_insert_own on public.proposals
  for insert with check (auth.uid() = owner_id);

drop policy if exists proposals_update_own on public.proposals;
create policy proposals_update_own on public.proposals
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists proposals_delete_own on public.proposals;
create policy proposals_delete_own on public.proposals
  for delete using (auth.uid() = owner_id);
