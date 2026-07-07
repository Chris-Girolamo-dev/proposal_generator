// Shared heading treatment across proposal sections, styled after the LCA reference deck:
// numbered eyebrow ("01 | AREAS OF OPPORTUNITY") + bold headline with an italic serif accent
// phrase in brand red (their green, recolored).
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
        {boldText} <em className="font-serif italic font-normal text-red">{accentText}</em>
      </h2>
    </div>
  );
}
