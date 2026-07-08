"use client";

import { Trash2 } from "lucide-react";

export function DeleteProposalButton({ action }: { action: () => Promise<void> }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Delete this proposal? This can't be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="btn-secondary px-2 opacity-0 transition-opacity group-hover:opacity-100"
        aria-label="Delete proposal"
        title="Delete proposal"
      >
        <Trash2 size={14} />
      </button>
    </form>
  );
}
