import { lineTotalCents, subtotalCents, formatMoney, type CostItem } from "@/lib/proposal/types";

export function InvestmentSection({ items, currency }: { items: CostItem[]; currency: string }) {
  return (
    <section className="min-h-[11in] p-20">
      <h2 className="font-serif text-4xl">Investment.</h2>
      <p className="mt-6 max-w-2xl border-t border-[#e5e5e5] pt-6 text-[#5a5a5a]">
        A one-time investment covering the full build, described below.
      </p>

      <div className="mt-16 max-w-2xl">
        {items.map((item, i) => (
          <div key={i} className="flex items-start justify-between gap-6 border-b border-[#e5e5e5] py-4">
            <div>
              <p className="font-medium text-[#2a2a2a]">{item.label}</p>
              {item.description && (
                <p className="mt-1 text-sm text-[#7a7a7a]">{item.description}</p>
              )}
              {item.qty !== 1 && (
                <p className="mt-1 text-sm text-[#7a7a7a]">Qty {item.qty}</p>
              )}
            </div>
            <span className="shrink-0 tabular-nums text-[#2a2a2a]">
              {formatMoney(lineTotalCents(item), currency)}
            </span>
          </div>
        ))}

        <div className="flex items-baseline justify-between pt-6">
          <span className="font-serif text-2xl">Total</span>
          <span className="font-serif text-2xl tabular-nums">
            {formatMoney(subtotalCents(items), currency)}
          </span>
        </div>
      </div>

      <div className="mt-16 h-1 w-full bg-red" />
    </section>
  );
}
