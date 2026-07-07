"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { updateProposal } from "@/lib/proposal/actions";
import { lineTotalCents, subtotalCents, formatMoney, type CostItem, type Proposal } from "@/lib/proposal/types";

export function ProposalEditor({ proposal }: { proposal: Proposal }) {
  const [clientCompany, setClientCompany] = useState(proposal.client_company);
  const [projectTitle, setProjectTitle] = useState(proposal.project_title);
  const [subtitle, setSubtitle] = useState(proposal.subtitle);
  const [guarantee, setGuarantee] = useState(proposal.guarantee);
  const [costItems, setCostItems] = useState<CostItem[]>(proposal.cost_items);
  const [isPending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  function updateCostItem(index: number, patch: Partial<CostItem>) {
    setCostItems((items) => items.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }

  function addCostItem() {
    setCostItems((items) => [...items, { label: "", description: "", qty: 1, unit_cents: 0 }]);
  }

  function removeCostItem(index: number) {
    setCostItems((items) => items.filter((_, i) => i !== index));
  }

  function handleSave() {
    startTransition(async () => {
      await updateProposal(proposal.id, {
        client_company: clientCompany,
        project_title: projectTitle,
        subtitle,
        guarantee,
        cost_items: costItems,
      });
      setSavedAt(new Date());
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="eyebrow mb-1">OPFOR</p>
          <h1 className="font-display text-2xl font-semibold text-fg">Edit Proposal</h1>
        </div>
        <div className="flex items-center gap-3">
          {savedAt && (
            <span className="text-xs text-text-3">Saved {savedAt.toLocaleTimeString()}</span>
          )}
          <a href={`/api/pdf/${proposal.id}`} className="btn-secondary" target="_blank" rel="noopener noreferrer">
            Download PDF
          </a>
          <button onClick={handleSave} disabled={isPending} className="btn-primary">
            {isPending ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div className="card space-y-5 p-6">
        <div>
          <label className="label">Client company</label>
          <input
            className="input-field"
            value={clientCompany}
            onChange={(e) => setClientCompany(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Project title</label>
          <input
            className="input-field"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Subtitle</label>
          <input
            className="input-field"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Guarantee</label>
          <textarea
            className="input-field"
            rows={3}
            value={guarantee}
            onChange={(e) => setGuarantee(e.target.value)}
          />
        </div>
      </div>

      <div className="card mt-6 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-fg">Investment</h2>
          <button onClick={addCostItem} className="btn-secondary">
            <Plus size={14} /> Add line item
          </button>
        </div>

        <div className="space-y-3">
          {costItems.map((item, i) => (
            <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] items-start gap-3">
              <div>
                <input
                  className="input-field"
                  placeholder="Label"
                  value={item.label}
                  onChange={(e) => updateCostItem(i, { label: e.target.value })}
                />
                <input
                  className="input-field mt-2"
                  placeholder="Description (optional)"
                  value={item.description ?? ""}
                  onChange={(e) => updateCostItem(i, { description: e.target.value })}
                />
              </div>
              <input
                type="number"
                min={0}
                className="input-field w-20"
                value={item.qty}
                onChange={(e) => updateCostItem(i, { qty: Number(e.target.value) })}
              />
              <input
                type="number"
                min={0}
                step={0.01}
                className="input-field w-28"
                placeholder="Unit price"
                value={item.unit_cents / 100}
                onChange={(e) =>
                  updateCostItem(i, { unit_cents: Math.round(Number(e.target.value) * 100) })
                }
              />
              <div className="flex h-full items-center gap-2">
                <span className="w-24 shrink-0 text-right text-sm tabular-nums text-text-2">
                  {formatMoney(lineTotalCents(item), proposal.currency)}
                </span>
                <button
                  onClick={() => removeCostItem(i)}
                  className="btn-secondary px-2"
                  aria-label="Remove line item"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end border-t border-border pt-4">
          <span className="font-display text-lg font-semibold text-fg">
            Total: {formatMoney(subtotalCents(costItems), proposal.currency)}
          </span>
        </div>
      </div>
    </div>
  );
}
