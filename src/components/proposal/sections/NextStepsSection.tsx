import { SectionHeading } from "./SectionHeading";
import { PageHeader } from "./PageHeader";

export function NextStepsSection({
  steps,
  guarantee,
  clientCompany,
  clientLogoUrl,
}: {
  steps: { step: string }[];
  guarantee: string;
  clientCompany: string;
  clientLogoUrl: string | null;
}) {
  return (
    <section className="section-tint min-h-[11in] p-20">
      <PageHeader clientCompany={clientCompany} clientLogoUrl={clientLogoUrl} />
      <SectionHeading number="08" eyebrow="NEXT STEPS" boldText="Next" accentText="steps." />

      <ol className="mt-16 max-w-xl space-y-6">
        {steps.map((s, i) => (
          <li key={i} className="no-break flex gap-6">
            <span className="font-serif text-3xl text-[#c4c4c4]">{String(i + 1).padStart(2, "0")}</span>
            <span className="pt-1.5 text-[#2a2a2a]">{s.step}</span>
          </li>
        ))}
      </ol>

      {guarantee && (
        <div className="no-break mt-16 max-w-xl border-l-2 border-red bg-[#faf9f6] p-6">
          <p className="eyebrow mb-2">Guarantee</p>
          <p className="text-[#2a2a2a]">{guarantee}</p>
        </div>
      )}
    </section>
  );
}
