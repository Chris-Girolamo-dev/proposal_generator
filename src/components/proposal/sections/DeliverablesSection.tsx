export function DeliverablesSection({ items }: { items: { text: string }[] }) {
  return (
    <section className="min-h-[11in] p-20">
      <h2 className="font-serif text-4xl">What you get.</h2>
      <p className="mt-6 max-w-2xl border-t border-[#e5e5e5] pt-6 text-[#5a5a5a]">
        A complete, working system, not a slide deck. Here is exactly what ships.
      </p>

      <ul className="mt-16 max-w-2xl space-y-4">
        {items.map((item, i) => (
          <li key={i} className="flex gap-4 text-[#2a2a2a]">
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red" />
            {item.text}
          </li>
        ))}
      </ul>

      <div className="mt-16 h-1 w-full bg-red" />
    </section>
  );
}
