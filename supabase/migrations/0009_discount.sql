-- Optional year-one discount (deal-closing pivot). Percentage off the year-one
-- subtotal; 0 hides the discount entirely on the PDF. Applied to year one only,
-- not the locked renewal.

alter table public.proposals
  add column if not exists discount_pct numeric not null default 0;
