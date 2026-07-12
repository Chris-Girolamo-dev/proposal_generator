-- Sequential, never-repeating proposal numbers starting at 928801, plus a
-- per-proposal version label. A sequence never re-issues a value (even after
-- deletes or rollbacks), so numbers cannot repeat; the unique constraint
-- additionally guards manual edits.

create sequence if not exists public.proposal_number_seq start 928801;

alter table public.proposals
  add column if not exists proposal_number bigint not null default nextval('public.proposal_number_seq');

-- Guarded so the migration is safe to re-run (add constraint has no IF NOT EXISTS).
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'proposals_proposal_number_key') then
    alter table public.proposals add constraint proposals_proposal_number_key unique (proposal_number);
  end if;
end $$;

alter table public.proposals
  add column if not exists proposal_version text not null default 'V1.0';
