import {
  paymentOptionTotals,
  lineTotalCents,
  subtotalCents,
  formatMoney,
  type CostItem,
  type PaymentOption,
} from "@/lib/proposal/types";
import { SectionHeading } from "./SectionHeading";
import { LimitedTimeTermsBlock } from "./LimitedTimeTermsBlock";
import { PageShell } from "./PageShell";

// Investment — clean ruled price rows (optional add-ons show their price but sit
// outside the total), the total set large, then the included-scope stack: every item with
// its real dollar value on the right and an Included/credited stamp, closed by a
// "total included value" strip so the stack visibly dwarfs the price. Named "Also
// included" rather than "bonuses": what remains here after the Limited-time terms were
// lifted out is scope that would otherwise be billable, not giveaways.
export function InvestmentSection({
  items,
  paymentOptions = [],
  currency,
  renewalCents = 0,
  discountPct = 0,
  number = "07",
  total,
  foundersCohort = true,
  clientCompany,
  clientLogoUrl,
}: {
  items: CostItem[];
  paymentOptions?: PaymentOption[];
  currency: string;
  renewalCents?: number;
  discountPct?: number;
  number?: string;
  total?: string;
  foundersCohort?: boolean;
  clientCompany: string;
  clientLogoUrl: string | null;
}) {
  const yearOneGross = subtotalCents(items);
  const hasDiscount = discountPct > 0 && yearOneGross > 0;
  const discountCents = hasDiscount ? Math.round(yearOneGross * (discountPct / 100)) : 0;
  const yearOne = yearOneGross - discountCents; // net year-one price
  const hasRenewal = renewalCents > 0 && yearOne > 0;
  const renewalPct = hasRenewal ? Math.round((renewalCents / yearOne) * 100) : 0;
  const renewalTag = renewalPct === 50 ? "Half of year one" : `${renewalPct}% of year one`;
  // Discount stated in both percent and dollars; only rendered when set.
  const discountLine = hasDiscount
    ? `${discountPct % 1 === 0 ? discountPct : discountPct.toFixed(1)}% off · save ${formatMoney(discountCents, currency)}`
    : null;

  return (
    <PageShell number={number} total={total} clientCompany={clientCompany} clientLogoUrl={clientLogoUrl}>
      <SectionHeading title="The investment" />

      <div className="no-break mt-3 max-w-2xl">
        {items.map((item, i) => (
          <div
            key={i}
            className={`flex items-baseline justify-between gap-6 py-1 ${
              i > 0 ? "border-t border-[var(--pd-line)]" : ""
            }`}
          >
            <div>
              <p className="text-[13.5px] text-[var(--pd-ink)]">
                {item.label}
                {!item.optional && item.qty > 1 && (
                  <span className="pd-meta ml-2">Qty {item.qty}</span>
                )}
                {item.optional && <span className="pd-meta ml-2">Optional</span>}
              </p>
              {item.optional && item.description && (
                <p className="mt-0.5 text-[11px] leading-[1.5] text-[var(--pd-dim)]">
                  {item.description}
                </p>
              )}
            </div>
            <span
              className={`pd-meta shrink-0 text-[12px] normal-case ${
                item.optional ? "" : "text-[var(--pd-ink)]"
              }`}
            >
              {formatMoney(item.optional ? item.unit_cents : lineTotalCents(item), currency)}
              {item.optional && " /ea"}
            </span>
          </div>
        ))}

        {hasRenewal ? (
          // Two-tier: year one beside the locked half-price renewal. Juxtaposing the
          // two numbers, with the renewal drop called out in red, makes the recurring
          // discount the thing the eye lands on.
          <div className="mt-1 border-t border-[var(--pd-line-strong)] pt-2">
            <div className="flex items-baseline justify-between gap-6">
              <span className="pd-meta font-bold" style={{ color: "var(--pd-ink)" }}>Year one</span>
              <span className="pd-display text-[22px] font-bold leading-tight tracking-[-0.02em] text-[var(--pd-ink)]">
                {formatMoney(yearOne, currency)}
              </span>
            </div>
            {discountLine && (
              <p className="pd-meta mt-0.5 normal-case tracking-[.04em] text-right text-[#E5192B]">
                {discountLine}
              </p>
            )}
            <div className="mt-2 flex items-baseline justify-between gap-6 border-t border-[var(--pd-line)] pt-2">
              <span className="pd-meta font-bold" style={{ color: "var(--pd-ink)" }}>Annual renewal · year two on</span>
              <span className="pd-display text-[22px] font-bold leading-tight tracking-[-0.02em] text-[var(--pd-ink)]">
                {formatMoney(renewalCents, currency)}
              </span>
            </div>
            <p className="pd-meta mt-0.5 tracking-[.04em] text-right font-bold" style={{ color: "#E5192B" }}>
              {renewalTag}, locked for life
            </p>
          </div>
        ) : (
          <div className="mt-1 flex items-baseline justify-between border-t border-[var(--pd-line-strong)] pt-2">
            <div>
              <span className="pd-meta">Total investment</span>
              {discountLine && (
                <p className="pd-meta mt-0.5 tracking-[.04em]" style={{ color: "#E5192B" }}>{discountLine}</p>
              )}
            </div>
            <span className="pd-display text-[24px] font-bold tracking-[-0.02em] text-[var(--pd-ink)]">
              {formatMoney(yearOne, currency)}
            </span>
          </div>
        )}
      </div>

      {foundersCohort && <LimitedTimeTermsBlock tone="investment" />}

      {paymentOptions.length > 0 && yearOne > 0 && (
        <div className="no-break mt-5 border-t border-[var(--pd-line)] pt-4">
          <p className="pd-meta mb-2">Payment options</p>
          {paymentOptions.map((option, i) => {
            // Option discounts apply to the net year-one price, so they compose with any
            // proposal-level discount rather than silently replacing it. A multi-year
            // option prices its whole commitment, not one year of it.
            const { total: price, perYear, years, saved } = paymentOptionTotals(
              option,
              yearOne,
              renewalCents,
            );
            return (
              <div
                key={i}
                className={`flex items-baseline justify-between gap-6 py-1.5 ${
                  i > 0 ? "border-t border-[var(--pd-line)]" : ""
                }`}
              >
                <div className="min-w-0">
                  <p className="text-[12px] font-medium leading-[1.4] text-[var(--pd-ink)]">
                    {option.label}
                  </p>
                  {option.detail && (
                    <p className="text-[11px] leading-[1.45] text-[var(--pd-dim)]">
                      {option.detail}
                    </p>
                  )}
                </div>
                <p className="flex shrink-0 items-baseline gap-4">
                  {/* The percentage carries the accent and the money sits beside it in
                      grey: a percentage is an abstraction until the reader is told what it
                      is worth. */}
                  <span className="pd-meta w-40 text-right normal-case">
                    {option.discount_pct > 0 && (
                      <>
                        <span className="text-[#E5192B]">
                          {/* Two decimals, trailing zeros stripped. toFixed(1) printed
                              7.75 as "7.8%", and with the money shown beside it a reader
                              can divide and find the two disagree. */}
                          {Number(option.discount_pct.toFixed(2))}% off
                        </span>{" "}
                        <span className="text-[var(--pd-dim)]">
                          ({formatMoney(saved, currency)})
                        </span>
                      </>
                    )}
                  </span>
                  <span className="w-32 text-right">
                    <span className="pd-display block text-[15px] font-bold tracking-[-0.02em] text-[var(--pd-ink)]">
                      {formatMoney(price, currency)}
                    </span>
                    {years > 1 && (
                      <span className="pd-meta block normal-case">
                        {years}-year total · {formatMoney(perYear, currency)}/yr
                      </span>
                    )}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      )}

    </PageShell>
  );
}
