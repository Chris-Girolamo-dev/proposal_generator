import { FOUNDERS_COHORT } from "@/lib/proposal/defaults";

/**
 * The Founders Cohort terms, rendered from one source in both places they appear.
 *
 * Two shapes, because the pages have different budgets. `cover` stacks name, terms and
 * duration under the blurb, where there is room. `investment` runs the name and terms on
 * one line beside the price: stacked, it pushed that page 28px past the sheet, and the
 * spacing needed to claw that back left only 6px of slack.
 */
export function FoundersCohortBlock({ tone = "cover" }: { tone?: "cover" | "investment" }) {
  if (tone === "investment") {
    return (
      <div className="mt-5 border-t border-[var(--pd-line)] pt-4">
        <p className="text-[13px] leading-[1.5] text-[var(--pd-ink)]">
          <span className="pd-display font-semibold tracking-[-0.01em] text-[#E5192B]">
            {FOUNDERS_COHORT.name}
          </span>
          {/* Middot, not an em dash: the terms list already uses it, and the document
              avoids em dashes throughout. */}
          <span className="text-[var(--pd-mid)]"> · </span>
          {FOUNDERS_COHORT.terms.join(" · ")}
        </p>
        <p className="mt-1 text-[11.5px] leading-[1.5] text-[var(--pd-dim)]">
          {FOUNDERS_COHORT.duration}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-7">
      <p className="pd-display text-[15px] font-semibold tracking-[-0.01em]">
        <span className="text-[#E5192B]">{FOUNDERS_COHORT.name}</span>
      </p>
      <p className="mt-2 text-[15px] leading-[1.6] text-[var(--pd-ink)]">
        {FOUNDERS_COHORT.terms.join(" · ")}
      </p>
      <p className="mt-1.5 text-[12.5px] leading-[1.55] text-[var(--pd-dim)]">
        {FOUNDERS_COHORT.duration}
      </p>
    </div>
  );
}
