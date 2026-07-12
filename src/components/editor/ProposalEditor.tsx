"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { updateProposal } from "@/lib/proposal/actions";
import { LogoUpload } from "./LogoUpload";
import {
  lineTotalCents,
  subtotalCents,
  bonusTotalCents,
  formatMoney,
  type BonusItem,
  type CostItem,
  type Proposal,
} from "@/lib/proposal/types";

// Theme options map the user-facing Light/Dark choice to the two reviewed
// plate-globe editions that render to PDF.
const THEMES = [
  { value: "plate-globe", label: "Light" },
  { value: "plate-globe-dark", label: "Dark" },
];

export function ProposalEditor({ proposal }: { proposal: Proposal }) {
  const [proposalNumber, setProposalNumber] = useState(proposal.proposal_number ?? 928801);
  const [proposalVersion, setProposalVersion] = useState(proposal.proposal_version ?? "V1.0");
  const [clientCompany, setClientCompany] = useState(proposal.client_company);
  const [projectTitle, setProjectTitle] = useState(proposal.project_title);
  const [subtitle, setSubtitle] = useState(proposal.subtitle);
  const [guarantee, setGuarantee] = useState(proposal.guarantee);
  const [costItems, setCostItems] = useState<CostItem[]>(proposal.cost_items);
  const [renewalCents, setRenewalCents] = useState(proposal.renewal_cents ?? 0);
  const [bonuses, setBonuses] = useState<BonusItem[]>(proposal.bonuses ?? []);
  const [variant, setVariant] = useState(proposal.variant ?? "plate-globe");
  const [moat, setMoat] = useState(proposal.moat ?? true);
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

  function updateBonus(index: number, patch: Partial<BonusItem>) {
    setBonuses((list) => list.map((b, i) => (i === index ? { ...b, ...patch } : b)));
  }
  function addBonus() {
    setBonuses((list) => [...list, { label: "", tag: "Included" }]);
  }
  function removeBonus(index: number) {
    setBonuses((list) => list.filter((_, i) => i !== index));
  }

  function handleSave() {
    startTransition(async () => {
      await updateProposal(proposal.id, {
        proposal_number: proposalNumber,
        proposal_version: proposalVersion,
        client_company: clientCompany,
        project_title: projectTitle,
        subtitle,
        guarantee,
        cost_items: costItems,
        renewal_cents: renewalCents,
        bonuses,
        variant,
        moat,
      });
      setSavedAt(new Date());
    });
  }

  const previewHref = `/preview?v=${variant}${moat ? "&m=1" : ""}`;

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
          <a href={previewHref} className="btn-secondary" target="_blank" rel="noopener noreferrer">
            Preview
          </a>
          <a href={`/api/pdf/${proposal.id}`} className="btn-secondary" target="_blank" rel="noopener noreferrer">
            Download PDF
          </a>
          <button onClick={handleSave} disabled={isPending} className="btn-primary">
            {isPending ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {/* ── Proposal details ─────────────────────────────────────────── */}
      <div className="card space-y-5 p-6">
        <LogoUpload proposalId={proposal.id} initialUrl={proposal.client_logo_url} />

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label">Proposal number</label>
            {/* Auto-assigned sequentially from 928801 on create; editable, but the DB
                unique constraint rejects any number already used. */}
            <input
              type="number"
              className="input-field"
              value={proposalNumber}
              onChange={(e) => setProposalNumber(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label">Version</label>
            <input
              className="input-field"
              value={proposalVersion}
              onChange={(e) => setProposalVersion(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Theme</label>
            <select
              className="input-field"
              value={variant}
              onChange={(e) => setVariant(e.target.value)}
            >
              {THEMES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2.5 text-sm text-text-2">
          <input
            type="checkbox"
            checked={moat}
            onChange={(e) => setMoat(e.target.checked)}
            className="h-4 w-4 accent-red"
          />
          Include the Data boundaries page (data-privacy / moat edition)
        </label>

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
          <textarea
            className="input-field"
            rows={2}
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

      {/* ── Investment line items ────────────────────────────────────── */}
      <div className="card mt-6 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-fg">Investment</h2>
          <button onClick={addCostItem} className="btn-secondary">
            <Plus size={14} /> Add line item
          </button>
        </div>

        <div className="space-y-4">
          {costItems.map((item, i) => (
            <div key={i} className="rounded-lg border border-border bg-surface-2 p-4">
              <div className="mb-3 flex items-start gap-3">
                <div className="flex-1 space-y-2">
                  <input
                    className="input-field"
                    placeholder="Label (e.g. Clinical Supply Forecasting Simulator)"
                    value={item.label}
                    onChange={(e) => updateCostItem(i, { label: e.target.value })}
                  />
                  <input
                    className="input-field"
                    placeholder="Description (optional)"
                    value={item.description ?? ""}
                    onChange={(e) => updateCostItem(i, { description: e.target.value })}
                  />
                </div>
                <button
                  onClick={() => removeCostItem(i)}
                  className="btn-secondary px-2"
                  aria-label="Remove line item"
                  title="Remove line item"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="flex flex-wrap items-end gap-4">
                <div>
                  <label className="label">Qty</label>
                  <input
                    type="number"
                    min={0}
                    className="input-field w-24"
                    value={item.qty}
                    onChange={(e) => updateCostItem(i, { qty: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="label">Unit price ($)</label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    className="input-field w-36"
                    value={item.unit_cents / 100}
                    onChange={(e) =>
                      updateCostItem(i, { unit_cents: Math.round(Number(e.target.value) * 100) })
                    }
                  />
                </div>
                <label className="flex items-center gap-2 pb-2.5 text-sm text-text-2">
                  <input
                    type="checkbox"
                    checked={item.optional ?? false}
                    onChange={(e) => updateCostItem(i, { optional: e.target.checked })}
                    className="h-4 w-4 accent-red"
                  />
                  Optional add-on
                </label>
                <span className="ml-auto pb-2.5 text-sm tabular-nums text-text-2">
                  {item.optional ? "excluded" : formatMoney(lineTotalCents(item), proposal.currency)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-border pt-4">
          <div className="flex items-end justify-between gap-6">
            <div>
              <label className="label">Annual renewal — year 2 onward ($)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  className="input-field w-40"
                  placeholder="0 = flat price"
                  value={renewalCents ? renewalCents / 100 : ""}
                  onChange={(e) =>
                    setRenewalCents(e.target.value === "" ? 0 : Math.round(Number(e.target.value) * 100))
                  }
                />
                <button
                  type="button"
                  onClick={() => setRenewalCents(Math.round(subtotalCents(costItems) / 2))}
                  className="btn-secondary whitespace-nowrap text-xs"
                >
                  ½ of year one
                </button>
              </div>
              <p className="mt-1 text-xs text-text-3">
                {renewalCents > 0 && subtotalCents(costItems) > 0
                  ? `${Math.round((renewalCents / subtotalCents(costItems)) * 100)}% of year one, locked for life`
                  : "Leave 0 for a single flat price (no renewal tier)."}
              </p>
            </div>
            <span className="font-display text-lg font-semibold text-fg">
              {renewalCents > 0 ? "Year one: " : "Total: "}
              {formatMoney(subtotalCents(costItems), proposal.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Bonuses (value stack) ────────────────────────────────────── */}
      <div className="card mt-6 p-6">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-fg">Bonuses</h2>
          <button onClick={addBonus} className="btn-secondary">
            <Plus size={14} /> Add bonus
          </button>
        </div>
        <p className="mb-4 text-xs text-text-3">
          Leave value blank to show only the status tag (no dollar figure). Put a quantity in the
          label itself, e.g. &ldquo;(12) studies covered&rdquo;.
        </p>

        <div className="space-y-3">
          {bonuses.map((b, i) => (
            <div key={i} className="flex items-start gap-3">
              <input
                className="input-field flex-1"
                placeholder="Bonus label"
                value={b.label}
                onChange={(e) => updateBonus(i, { label: e.target.value })}
              />
              <div className="w-32 shrink-0">
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  className="input-field"
                  placeholder="Value ($)"
                  value={b.value_cents != null ? b.value_cents / 100 : ""}
                  onChange={(e) =>
                    updateBonus(i, {
                      value_cents:
                        e.target.value === "" ? undefined : Math.round(Number(e.target.value) * 100),
                    })
                  }
                />
              </div>
              <input
                className="input-field w-40 shrink-0"
                placeholder="Tag (e.g. Included)"
                value={b.tag ?? ""}
                onChange={(e) => updateBonus(i, { tag: e.target.value })}
              />
              <button
                onClick={() => removeBonus(i)}
                className="btn-secondary px-2"
                aria-label="Remove bonus"
                title="Remove bonus"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end border-t border-border pt-4">
          <span className="font-display text-lg font-semibold text-fg">
            Total bonus value: {formatMoney(bonusTotalCents(bonuses), proposal.currency)}
          </span>
        </div>
      </div>
    </div>
  );
}
