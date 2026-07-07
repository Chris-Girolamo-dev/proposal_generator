import type { NumberedItem } from "@/lib/proposal/types";

export function NumberedSection({
  eyebrow,
  intro,
  items,
  tint = false,
}: {
  eyebrow: string;
  intro: string;
  items: NumberedItem[];
  tint?: boolean;
}) {
  return (
    <section className={`min-h-[11in] p-20 ${tint ? "section-tint" : ""}`}>
      <p className="eyebrow mb-3">OPFOR</p>
      <h2 className="font-serif text-4xl">
        <span className="uppercase">{eyebrow}</span>
      </h2>
      <p className="mt-6 max-w-2xl border-t border-[#e5e5e5] pt-6 text-[#5a5a5a]">{intro}</p>

      <div className="mt-16 grid grid-cols-2 gap-x-12 gap-y-12">
        {items.map((item) => (
          <div key={item.n}>
            <span className="font-serif text-5xl text-[#e8b7ba]">{item.n}</span>
            <p className="mt-3 max-w-sm text-[#2a2a2a]">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 h-1.5 w-full bg-red" />
    </section>
  );
}
