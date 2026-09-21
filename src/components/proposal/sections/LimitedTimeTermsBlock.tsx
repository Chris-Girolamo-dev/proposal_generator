import { LIMITED_TIME_TERMS } from "@/lib/proposal/defaults";

/**
 * The limited-time terms, rendered from one source in both places they appear.
 *
 * Each term is its own bulleted line rather than a middot-separated run: three commitments
 * in one sentence read as a single blurred claim, and these are the strongest thing on the
 * page. Markers are round bullets; the agreement's hairline dash reads as an em dash at
 * this size.
 *
 * Two sizes, because the pages have different budgets: the cover has room to breathe, the
 * investment page sits under a price table and a cost list.
 */
export function LimitedTimeTermsBlock({ tone = "cover" }: { tone?: "cover" | "investment" }) {
  const isCover = tone === "cover";

  return (
    <div className={isCover ? "mt-7" : "mt-5 border-t border-[var(--pd-line)] pt-4"}>
      <p
        className={`pd-display font-semibold tracking-[-0.01em] ${
          isCover ? "text-[15px]" : "text-[13px]"
        }`}
      >
        <span className="text-[#E5192B]">{LIMITED_TIME_TERMS.name}</span>
        <span className="font-normal text-[var(--pd-dim)]"> · {LIMITED_TIME_TERMS.closes}</span>
      </p>

      <ul className={isCover ? "mt-2.5 space-y-1.5" : "mt-2 space-y-1"}>
        {LIMITED_TIME_TERMS.terms.map((term) => (
          <li
            key={term}
            className={`flex gap-2 text-[var(--pd-ink)] ${
              isCover ? "text-[15px] leading-[1.5]" : "text-[12.5px] leading-[1.45]"
            }`}
          >
            {/* A round bullet, not the agreement's hairline dash: at this size the dash
                reads as an em dash rather than a list marker. */}
            <span
              className={`shrink-0 rounded-full bg-[var(--pd-ink)] ${
                isCover ? "mt-[9px] h-[4px] w-[4px]" : "mt-[7px] h-[3px] w-[3px]"
              }`}
            />
            {term}
          </li>
        ))}
      </ul>

      <p
        className={`leading-[1.55] text-[var(--pd-dim)] ${
          isCover ? "mt-2.5 text-[12.5px]" : "mt-2 text-[11.5px]"
        }`}
      >
        {LIMITED_TIME_TERMS.duration}
      </p>
    </div>
  );
}
