import {
  bonusTotalCents,
  formatMoney,
  type BonusItem,
} from "@/lib/proposal/types";
import { SectionHeading } from "./SectionHeading";
import { PageShell } from "./PageShell";

// The included-scope stack on its own page. It used to sit under the price on the
// investment page; once payment options landed there that page ran 204px past the sheet,
// and this is the half that wanted room rather than compression -- twelve ruled rows and a
// struck-through total that is the whole argument.
export function IncludedSection({
  bonuses,
  currency,
  number,
  total,
  clientCompany,
  clientLogoUrl,
}: {
  bonuses: BonusItem[];
  currency: string;
  number: string;
  total?: string;
  clientCompany: string;
  clientLogoUrl: string | null;
}) {
  const bonusTotal = bonusTotalCents(bonuses);

  return (
    <PageShell number={number} total={total} clientCompany={clientCompany} clientLogoUrl={clientLogoUrl}>
      <SectionHeading title="Also included" />
      <p className="mt-8 text-[13.5px] leading-[1.65] text-[var(--pd-tag)]">
        Scope that would otherwise be billed, carried by the engagement at no additional
        cost.
      </p>

      {bonuses.length > 0 && (
        <div className="pd-shead mt-3 pt-5">
          <h3 className="pd-display text-[25px] font-semibold leading-none tracking-[-0.02em] text-[var(--pd-ink)]">
            Also included<span className="text-[var(--pd-mid)]">, at no additional cost.</span>
          </h3>

          <div className="mt-2">
            {bonuses.map((b, i) => (
              <div
                key={i}
                className={`no-break flex items-baseline justify-between gap-6 py-[1px] ${
                  i > 0 ? "border-t border-[var(--pd-line)]" : ""
                }`}
              >
                <p className="text-[11px] leading-[1.35] text-[var(--pd-ink)]">{b.label}</p>
                <p className="pd-meta flex shrink-0 items-baseline">
                  <span className="w-16 text-right normal-case text-[var(--pd-ink)]">
                    {b.value_cents != null ? formatMoney(b.value_cents, currency) : ""}
                  </span>
                  <span className="w-24 text-right">{b.tag ?? "Included"}</span>
                </p>
              </div>
            ))}
          </div>

          {bonusTotal > 0 && (
            <div className="no-break mt-1 flex items-baseline justify-between border-y border-[var(--pd-line-strong)] py-1">
              <span className="pd-meta">Total included value</span>
              <span className="flex items-baseline gap-4">
                <span className="pd-display text-[20px] font-bold tracking-[-0.02em] text-[var(--pd-ink)] line-through decoration-[rgba(229,25,43,.55)] decoration-[1.5px]">
                  {formatMoney(bonusTotal, currency)}
                </span>
                {/* "Included", not "Free": the struck-through total already makes the
                    point, and "free" is the exact infomercial cue this section was
                    renamed to get away from. */}
                <span className="pd-display text-[22px] font-bold uppercase tracking-[-0.02em] text-[#E5192B]">
                  Included
                </span>
              </span>
            </div>
          )}
        </div>
      )}

      <p className="pd-meta mt-1">
        50% at signature · balance across Q3 and Q4 · renewals billed annually in advance · Net 30
      </p>
    </PageShell>
  );
}
