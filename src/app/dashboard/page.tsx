import Link from "next/link";
import { FileText, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/supabase/actions";
import { deleteProposal } from "@/lib/proposal/actions";
import { DeleteProposalButton } from "@/components/editor/DeleteProposalButton";
import { formatMoney } from "@/lib/proposal/types";
import type { Proposal } from "@/lib/proposal/types";

const STATUS_LABEL: Record<Proposal["status"], string> = {
  draft: "Draft",
  ready: "Ready",
  sent: "Sent",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: proposals } = await supabase
    .from("proposals")
    .select("*")
    .order("updated_at", { ascending: false });

  const list = (proposals ?? []) as Proposal[];

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="eyebrow mb-1">OPFOR</p>
          <h1 className="font-display text-2xl font-semibold text-fg">Proposals</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/proposals/new" className="btn-primary">
            New Proposal
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="btn-secondary px-2.5"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </form>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 px-8 py-16 text-center">
          <FileText size={28} className="text-text-3" strokeWidth={1.5} />
          <p className="font-display text-lg font-medium text-fg">No proposals yet</p>
          <p className="max-w-sm text-sm text-text-2">
            Create your first proposal from the OPFOR template — fill in the client details and
            variable costs, then download a client-ready PDF.
          </p>
          <Link href="/proposals/new" className="btn-primary mt-2">
            New Proposal
          </Link>
        </div>
      ) : (
        <div className="card divide-y divide-border overflow-hidden">
          {list.map((p) => (
            <div
              key={p.id}
              className="group flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-surface-2"
            >
              <Link href={`/proposals/${p.id}/edit`} className="flex min-w-0 flex-1 items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate font-medium text-fg">
                    {p.client_company || "Untitled client"}
                  </p>
                  <p className="truncate text-sm text-text-2">
                    {p.project_title || "Untitled proposal"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <span className="text-sm tabular-nums text-text-2">
                    {formatMoney(p.total_cents, p.currency)}
                  </span>
                  <span className="rounded-pill border border-border bg-surface-2 px-3 py-1 text-xs font-medium text-text-2">
                    {STATUS_LABEL[p.status]}
                  </span>
                </div>
              </Link>
              <DeleteProposalButton action={deleteProposal.bind(null, p.id)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
