import { lineTotalCents, subtotalCents, formatMoney, type CostItem } from "@/lib/proposal/types";

export function InvestmentSection({ items, currency }: { items: CostItem[]; currency: string }) {
  return (
    <section className="min-h-[11in] p-20">
      <p className="eyebrow mb-3">OPFOR</p>
      <h2 className="font-serif text-4xl">
        <span className="font-semibold uppercase">What</span> you&rsquo;re investing.
      </h2>
      <p className="mt-6 max-w-2xl border-t border-[#e5e5e5] pt-6 text-[#5a5a5a]">
        A one-time investment covering the full build, described below.
      </p>

      <div className="mt-12 max-w-sm rounded-lg border border-[#e5e5e5] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        {items.map((item, i) => (
          <div
            key={i}
            className={`flex items-baseline justify-between gap-6 py-3 ${i > 0 ? "border-t border-[#eee]" : ""}`}
          >
            <span className="text-sm text-[#4a4a4a]">{item.label}</span>
            <span className="shrink-0 font-semibold tabular-nums text-[#1a1a1a]">
              {formatMoney(lineTotalCents(item), currency)}
            </span>
          </div>
        ))}

        <div className="mt-2 flex items-baseline justify-between border-t border-[#eee] pt-3">
          <span className="text-sm text-[#4a4a4a]">Total</span>
          <span className="font-semibold tabular-nums text-[#1a1a1a]">
            {formatMoney(subtotalCents(items), currency)}
          </span>
        </div>
      </div>

      <div className="mt-16 h-1.5 w-full bg-red" />
    </section>
  );
}
