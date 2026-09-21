-- Per-proposal toggle for the Founders Cohort offer copy (cover blurb + the terms line
-- beside the price). Defaults on: the offer is the current programme, and every proposal
-- written before this column existed was written with it in mind.

alter table public.proposals
  add column if not exists founders_cohort boolean not null default true;
