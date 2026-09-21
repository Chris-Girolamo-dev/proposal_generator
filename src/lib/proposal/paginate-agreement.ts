import type { AgreementClause } from "./types";

/**
 * Splits the services agreement into explicit pages.
 *
 * The agreement used to be one tall <section> that Chromium broke wherever it liked. That
 * put the repeated page header on the first sheet only and the folio on the last, so the
 * middle sheets arrived bare -- visibly not part of the document.
 *
 * Rather than lean on a table-header repeat, the clauses are packed into pages here and
 * each page renders as its own PageShell, which carries the header and footer every sheet
 * already gets. Heights are estimated rather than measured (this runs server-side, with no
 * layout available), so the budgets below are deliberately conservative: overshooting costs
 * white space at the foot of a page, undershooting costs a bare sheet again.
 */

/** Characters that fit on one line of clause body at 12px across the 11-column measure. */
const CHARS_PER_LINE = 96;
const LINE_HEIGHT = 18.6;
const CLAUSE_GAP = 16;
/** A bulleted clause pays for its title line plus per-bullet leading. */
const BULLET_LEADING = 5;
/** Signature block: witness line, two columns of ruled lines, and its top margin. */
const SIGNATURE_HEIGHT = 290;

/** Usable content height after page padding, header, folio, and the section title. */
const FIRST_PAGE_BUDGET = 655;
/** Continuation pages carry a shorter heading and no preamble. */
const CONTINUATION_BUDGET = 760;

function lines(text: string): number {
  return Math.max(1, Math.ceil(text.length / CHARS_PER_LINE));
}

export function estimateClauseHeight(clause: AgreementClause): number {
  const titleAllowance = clause.bullets ? clause.title.length : clause.title.length + 2;
  const bodyLines = clause.body.reduce(
    (sum, paragraph, i) => sum + lines(paragraph + (i === 0 ? titleAllowance : 0)),
    0,
  );
  const bulletLeading = clause.bullets ? clause.body.length * BULLET_LEADING + LINE_HEIGHT : 0;
  return bodyLines * LINE_HEIGHT + bulletLeading + CLAUSE_GAP;
}

export interface AgreementPage {
  clauses: AgreementClause[];
  /** The signature block rides on the last page when it fits, else on a page of its own. */
  signature: boolean;
}

export function paginateAgreement(clauses: AgreementClause[]): AgreementPage[] {
  const pages: AgreementPage[] = [];
  let current: AgreementClause[] = [];
  let used = 0;
  let budget = FIRST_PAGE_BUDGET;

  for (const clause of clauses) {
    const height = estimateClauseHeight(clause);
    // A clause taller than a whole page still has to start somewhere; it gets its own page
    // and is allowed to break, which is far less jarring than an orphaned heading.
    if (current.length > 0 && used + height > budget) {
      pages.push({ clauses: current, signature: false });
      current = [];
      used = 0;
      budget = CONTINUATION_BUDGET;
    }
    current.push(clause);
    used += height;
  }

  if (current.length > 0) pages.push({ clauses: current, signature: false });
  if (pages.length === 0) pages.push({ clauses: [], signature: false });

  const last = pages[pages.length - 1];
  const lastBudget = pages.length === 1 ? FIRST_PAGE_BUDGET : CONTINUATION_BUDGET;
  const lastUsed = last.clauses.reduce((sum, c) => sum + estimateClauseHeight(c), 0);

  if (lastUsed + SIGNATURE_HEIGHT <= lastBudget) {
    last.signature = true;
  } else {
    pages.push({ clauses: [], signature: true });
  }

  return pages;
}
