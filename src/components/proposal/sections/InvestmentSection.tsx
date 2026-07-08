import { lineTotalCents, subtotalCents, formatMoney, type CostItem } from "@/lib/proposal/types";
import { SectionHeading } from "./SectionHeading";
import { PageShell } from "./PageShell";

// Investment — clean heroside-style ruled rows (no card chrome), mono tabular
// figures, and the total set large in Space Grotesk on a strong rule.
export function InvestmentSection({
  items,
  currency,
  clientCompany,
  clientLogoUrl,
}: {
  items: CostItem[];
  currency: string;
  clientCompany: string;
  clientLogoUrl: string | null;
}) {
  return (
    <PageShell number="07" clientCompany={clientCompany} clientLogoUrl={clientLogoUrl}>
      <SectionHeading
        number="07"
        title="The investment"
        say={<>One-time build.<br />Fixed price.</>}
      />
      <p className="mt-8 max-w-[52ch] text-[13.5px] leading-[1.65] text-[var(--pd-tag)]">
        A one-time investment covering the full build described in this proposal.
      </p>

      <div className="no-break mt-12 max-w-md">
        {items.map((item, i) => (
          <div
            key={i}
            className={`flex items-baseline justify-between gap-6 py-3.5 ${
              i > 0 ? "border-t border-[var(--pd-line)]" : ""
            }`}
          >
            <div>
              <p className="text-[13.5px] text-[var(--pd-ink)]">{item.label}</p>
              {item.qty > 1 && <p className="pd-meta mt-0.5">Qty {item.qty}</p>}
            </div>
            <span className="pd-meta shrink-0 text-[12px] normal-case text-[var(--pd-ink)]">
              {formatMoney(lineTotalCents(item), currency)}
            </span>
          </div>
        ))}

        <div className="mt-1 flex items-baseline justify-between border-t border-[var(--pd-line-strong)] pt-4">
          <span className="pd-meta">Total investment</span>
          <span className="pd-display text-[26px] font-bold tracking-[-0.02em] text-[var(--pd-ink)]">
            {formatMoney(subtotalCents(items), currency)}
          </span>
        </div>
      </div>

      <p className="pd-meta mt-10">
        Invoiced by milestone · Net 15 · Full terms in the services agreement
      </p>
    </PageShell>
  );
}
