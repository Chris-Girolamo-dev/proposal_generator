"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

/**
 * Copies a proposal and opens the copy. Sits beside the delete button on each dashboard
 * row and reveals on hover the same way, so the row stays quiet until pointed at.
 *
 * The action redirects into the new proposal's editor, so the pending state is cleared by
 * the navigation rather than by a response; no reset on success is needed.
 */
export function DuplicateProposalButton({ action }: { action: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);

  return (
    <form action={action} onSubmit={() => setBusy(true)}>
      <button
        type="submit"
        disabled={busy}
        className="btn-secondary px-2 opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-60"
        aria-label="Duplicate proposal"
        title="Duplicate as a new draft"
      >
        <Copy size={14} />
      </button>
    </form>
  );
}
