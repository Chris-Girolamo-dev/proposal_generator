import { SectionHeading } from "./SectionHeading";

export function DeliverablesSection({ items }: { items: { text: string }[] }) {
  return (
    <section className="min-h-[11in] p-20">
      <SectionHeading number="03" eyebrow="WHAT YOU GET" boldText="What" accentText="you get." />
      <p className="mt-6 max-w-2xl border-t border-[#e5e5e5] pt-6 text-[#5a5a5a]">
        A complete, working system, not a slide deck. Here is exactly what ships.
      </p>

      <ul className="mt-16 max-w-2xl space-y-5">
        {items.map((item, i) => (
          <li key={i} className="no-break flex gap-4 text-base text-[#2a2a2a]">
            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-red" />
            {item.text}
          </li>
        ))}
      </ul>

      <div className="mt-16 h-1.5 w-full bg-red" />
    </section>
  );
}
