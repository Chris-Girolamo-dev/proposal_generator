import { createProposal } from "@/lib/proposal/actions";

export default function NewProposalPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-6">
      <div className="card w-full p-8 text-center">
        <p className="eyebrow mb-2">OPFOR</p>
        <h1 className="font-display text-lg font-semibold text-fg">Start a new proposal</h1>
        <p className="mt-2 text-sm text-text-2">
          Seeds the OPFOR clinical-supply-forecasting template. You&rsquo;ll edit every field next.
        </p>
        <form action={createProposal} className="mt-6">
          <button type="submit" className="btn-primary w-full justify-center">
            Create Proposal
          </button>
        </form>
      </div>
    </div>
  );
}
