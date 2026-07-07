-- Adds the services-agreement clauses column, and backfills whyItMatters onto
-- existing timeline phases (both were added to the app after 0001_init.sql).

alter table public.proposals
  add column if not exists services_agreement jsonb not null default '[]'::jsonb;
