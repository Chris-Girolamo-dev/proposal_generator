// Shared heading treatment across proposal sections, styled after the LCA reference deck:
// numbered eyebrow ("01 | AREAS OF OPPORTUNITY") + bold headline with an italic serif accent
// phrase. Kept monochrome (not their green/our red) — the proposal document only uses red as
// a thin rule/logo accent, never in body or heading text.
export function SectionHeading({
  number,
  eyebrow,
  boldText,
  accentText,
}: {
  number: string;
  eyebrow: string;
  boldText: string;
  accentText: string;
}) {
  return (
    <div>
      <p className="eyebrow mb-3">
        {number} | {eyebrow}
      </p>
      <h2 className="font-heading text-4xl font-extrabold tracking-tight text-[#1a1a1a]">
        {boldText} <em className="font-serif italic font-normal text-[#1a1a1a]">{accentText}</em>
      </h2>
    </div>
  );
}
