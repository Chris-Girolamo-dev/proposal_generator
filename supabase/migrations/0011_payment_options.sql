-- Payment options shown on the investment page. Each option carries its own discount, so a
-- client can see what paying up front or committing to two years actually costs. Editable
-- per proposal the same way bonuses are, hence jsonb rather than fixed columns.
--
-- Defaults to '[]': the app fills new proposals from DEFAULT_PAYMENT_OPTIONS, and existing
-- rows are backfilled so they do not lose the section.

alter table public.proposals
  add column if not exists payment_options jsonb not null default '[]'::jsonb;
