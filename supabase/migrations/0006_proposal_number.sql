-- Sequential, never-repeating proposal numbers starting at 928801, plus a
-- per-proposal version label. A sequence never re-issues a value (even after
-- deletes or rollbacks), so numbers cannot repeat; the unique constraint
-- additionally guards manual edits.

create sequence if not exists public.proposal_number_seq start 928801;

alter table public.proposals
  add column if not exists proposal_number bigint not null default nextval('public.proposal_number_seq');

alter table public.proposals
  add constraint proposals_proposal_number_key unique (proposal_number);

alter table public.proposals
  add column if not exists proposal_version text not null default 'V1.0';
