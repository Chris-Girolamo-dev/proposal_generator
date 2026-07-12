import {
  lineTotalCents,
  subtotalCents,
  bonusTotalCents,
  formatMoney,
  type BonusItem,
  type CostItem,
} from "@/lib/proposal/types";
import { SectionHeading } from "./SectionHeading";
import { PageShell } from "./PageShell";

// Investment — clean ruled price rows (optional add-ons show their price but sit
// outside the total), the total set large, then the value stack: every bonus with
// its real dollar value on the right and an Included/credited stamp, closed by a
// "total bonus value" strip so the stack visibly dwarfs the price.
export function InvestmentSection({
  items,
  bonuses,
  currency,
  clientCompany,
  clientLogoUrl,
}: {
  items: CostItem[];
  bonuses: BonusItem[];
  currency: string;
  clientCompany: string;
  clientLogoUrl: string | null;
}) {
  const bonusTotal = bonusTotalCents(bonuses);

  return (
    <PageShell number="07" clientCompany={clientCompany} clientLogoUrl={clientLogoUrl}>
      <SectionHeading
        number="07"
        title="The investment"
        say={<>One-time build.<br />Fixed price.</>}
      />

      <div className="no-break mt-6 max-w-md">
        {items.map((item, i) => (
          <div
            key={i}
            className={`flex items-baseline justify-between gap-6 py-2 ${
              i > 0 ? "border-t border-[var(--pd-line)]" : ""
            }`}
          >
            <div>
              <p className="text-[13.5px] text-[var(--pd-ink)]">
                {item.label}
                {item.optional && <span className="pd-meta ml-2">Optional</span>}
              </p>
              {item.optional && item.description && (
                <p className="mt-0.5 text-[11px] leading-[1.5] text-[var(--pd-dim)]">
                  {item.description}
                </p>
              )}
              {!item.optional && item.qty > 1 && <p className="pd-meta mt-0.5">Qty {item.qty}</p>}
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

        <div className="mt-1 flex items-baseline justify-between border-t border-[var(--pd-line-strong)] pt-2">
          <span className="pd-meta">Total investment</span>
          <span className="pd-display text-[24px] font-bold tracking-[-0.02em] text-[var(--pd-ink)]">
            {formatMoney(subtotalCents(items), currency)}
          </span>
        </div>
      </div>

      {bonuses.length > 0 && (
        <div className="pd-shead mt-6 pt-3">
          <p className="pd-meta">The bonuses · yours with the build</p>

          <div className="mt-2">
            {bonuses.map((b, i) => (
              <div
                key={i}
                className={`no-break flex items-baseline justify-between gap-6 py-[3px] ${
                  i > 0 ? "border-t border-[var(--pd-line)]" : ""
                }`}
              >
                <p className="text-[11.5px] leading-[1.4] text-[var(--pd-ink)]">{b.label}</p>
                <p className="pd-meta shrink-0 text-right">
                  {b.value_cents != null && (
                    <span className="normal-case text-[var(--pd-ink)]">
                      {formatMoney(b.value_cents, currency)}
                    </span>
                  )}
                  <span className={b.value_cents != null ? "ml-3" : ""}>{b.tag ?? "Included"}</span>
                </p>
              </div>
            ))}
          </div>

          {bonusTotal > 0 && (
            <div className="no-break mt-1 flex items-baseline justify-between border-y border-[var(--pd-line-strong)] py-2">
              <span className="pd-meta">Total bonus value · included at no charge</span>
              <span className="pd-display text-[18px] font-bold tracking-[-0.02em] text-[var(--pd-ink)]">
                {formatMoney(bonusTotal, currency)}
              </span>
            </div>
          )}
        </div>
      )}

      <p className="pd-meta mt-3">
        Invoiced by milestone · Net 15 · Full terms in the services agreement
      </p>
    </PageShell>
  );
}
