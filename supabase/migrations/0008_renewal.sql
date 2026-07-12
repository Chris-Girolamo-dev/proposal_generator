-- Annual renewal price (structure B: higher year one, lower locked renewal).
-- 0 keeps the flat single-price behavior; any positive value renders the
-- two-tier "Year one / Annual renewal, locked" treatment on the Investment page.

alter table public.proposals
  add column if not exists renewal_cents bigint not null default 0;
