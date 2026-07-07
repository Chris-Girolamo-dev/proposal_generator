export function NextStepsSection({
  steps,
  guarantee,
}: {
  steps: { step: string }[];
  guarantee: string;
}) {
  return (
    <section className="min-h-[11in] p-20">
      <h2 className="font-serif text-4xl">Next steps.</h2>

      <ol className="mt-16 max-w-xl space-y-6">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-6">
            <span className="font-serif text-2xl text-[#c9c9c9]">{String(i + 1).padStart(2, "0")}</span>
            <span className="pt-1 text-[#2a2a2a]">{s.step}</span>
          </li>
        ))}
      </ol>

      {guarantee && (
        <div className="mt-16 max-w-xl border-l-2 border-red bg-[#faf9f6] p-6">
          <p className="eyebrow mb-2">Guarantee</p>
          <p className="text-[#2a2a2a]">{guarantee}</p>
        </div>
      )}
    </section>
  );
}
