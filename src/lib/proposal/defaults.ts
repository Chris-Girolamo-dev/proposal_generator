// Default proposal copy — OPFOR voice: second-person, direct, no em dashes, calm authority.
// Domain: clinical-supply / demand forecasting for B2B biotech & pharma.
// These are starting points the editor pre-fills; you edit per client.

import type { AgreementClause, ProposalDraft } from "./types";

export const SECTION_TITLES = {
  opportunity: "Your areas of opportunity", // renamed from "problem areas" for the biotech market
  solution: "Your solution",
  deliverables: "What you get",
  timeline: "How we get there",
  whyUs: "Why us",
  investment: "What you're investing",
  nextSteps: "Next steps",
  agreement: "Services agreement",
} as const;

/** Intro paragraph that sits under each numbered section, mirroring the LeftClick layout. */
export const SECTION_INTROS = {
  opportunity:
    "Forecasting is innately high-leverage. Done well it compounds in your favor; done manually it compounds against you. In your current workflow, a few persistent, high-impact areas are quietly capping accuracy and speed:",
  solution:
    "Closing these gaps is straightforward, and we have done it many times before. In practice the fix is almost always a combination of clean data pipelines, probabilistic modeling, and repeatable SOPs. Here is what that looks like for you:",
} as const;

/**
 * Generic services-agreement boilerplate. This is a starting point, not legal advice — have
 * counsel review before relying on it for a real engagement. The Effective Date / party details
 * are rendered separately in ServicesAgreementSection from live proposal data.
 */
export const DEFAULT_SERVICES_AGREEMENT: AgreementClause[] = [
  { number: "1", title: "Services", body: [
    'Provider will perform the services described in this proposal (the "Services") in accordance with the scope, timeline, and deliverables set out above.',
  ] },
  { number: "2.1", title: "Fees", body: [
    "Client will pay the fees set out in the Investment section above.",
  ] },
  { number: "2.2", title: "Invoicing", body: [
    "Provider will invoice Client upon completion of each milestone; payment is due within fifteen (15) days of the invoice date.",
  ] },
  { number: "3.1", title: "Payment Terms", body: [
    "Late payments accrue interest at 1.5% per month, or the maximum allowed by law, whichever is lower.",
  ] },
  { number: "3.2", title: "Taxes", body: [
    "Client is responsible for all sales, use, VAT, or similar taxes, excluding taxes on Provider's net income.",
  ] },
  { number: "3.3", title: "Third-Party Costs", body: [
    "Client will reimburse Provider for third-party software licenses, API-usage fees, or comparable platform costs necessary to perform the Services, provided Provider obtains Client's written approval before incurring any such expense.",
  ] },
  { number: "4", title: "Client Responsibilities", bullets: true, body: [
    "Timely access to relevant staff, systems, data, and credentials.",
    "A single point of contact with decision-making authority.",
    "Prompt review/approval of deliverables (deemed accepted if no written rejection within five (5) business days).",
    "Compliance with all laws governing Client data supplied to Provider.",
  ] },
  { number: "5.1", title: "Provider Materials", body: [
    'Tools, code libraries, frameworks, models, prompts, pre-existing IP, and generic know-how ("Background IP") remain Provider property; Provider grants Client a non-exclusive, perpetual, worldwide license to use Background IP only as embedded in Deliverables.',
  ] },
  { number: "5.2", title: "Deliverables", body: [
    'Custom code, configurations, documentation, and model outputs created specifically for Client under this proposal ("Deliverables") become Client property upon full payment.',
  ] },
  { number: "6.1", title: "Confidentiality", body: [
    "Each Party will protect the other's Confidential Information with at least the same care it uses for its own similar information, but no less than reasonable care.",
  ] },
  { number: "6.2", title: "Survival", body: [
    "Obligations last three (3) years after termination, except trade secrets, which remain protected while they are trade secrets under applicable law.",
  ] },
  { number: "7.1", title: "Provider Indemnity", body: [
    "Provider will defend and indemnify Client against third-party claims that Deliverables infringe intellectual-property rights.",
  ] },
  { number: "7.2", title: "Client Indemnity", body: [
    "Client will defend and indemnify Provider against claims arising from Client data, misuse of Deliverables, or Client's violation of law.",
  ] },
  { number: "8", title: "Limitation of Liability", body: [
    "Each Party's total liability is limited to the greater of (i) US $100,000 or (ii) the fees paid or payable under this Agreement in the twelve (12) months preceding the claim. Neither Party is liable for indirect, incidental, consequential, special, or punitive damages, including lost profits or revenue.",
  ] },
  { number: "9", title: "General", body: [
    "Provider is an independent contractor. This Agreement is governed by the laws of [Governing State/Country], without regard to conflict-of-laws principles. This Agreement is the entire understanding between the Parties and supersedes all prior proposals or agreements. Amendments must be in writing signed by both Parties.",
  ] },
];

export const DEFAULT_PROPOSAL: ProposalDraft = {
  client_company: "[Client Company]",
  project_title: "Clinical Supply Forecasting System",
  subtitle: "A purpose-built demand forecasting and scenario-planning engine for your program.",

  // Areas of opportunity (was "problems")
  problems: [
    {
      n: "01",
      text: "Forecasts live in spreadsheets that break as soon as enrollment, site count, or protocol assumptions change.",
    },
    {
      n: "02",
      text: "Demand planning is deterministic, so it cannot express the uncertainty that actually drives overage and stockout risk.",
    },
    {
      n: "03",
      text: "Scenario planning (enrollment swings, new sites, dosing changes) takes days of manual rework instead of minutes.",
    },
    {
      n: "04",
      text: "There is no single source of truth, so supply, clinical, and finance are each working from a different number.",
    },
  ],

  // Your solution
  benefits: [
    {
      n: "01",
      text: "A parameterized forecasting model that recomputes instantly when any assumption changes.",
    },
    {
      n: "02",
      text: "Monte Carlo simulation that quantifies stockout and overage risk at your target service level.",
    },
    {
      n: "03",
      text: "One-click scenarios so you can pressure-test enrollment, site, and dosing changes in real time.",
    },
    {
      n: "04",
      text: "A shared, auditable dashboard that gives supply, clinical, and finance one aligned number.",
    },
  ],

  deliverables: [
    { text: "Custom demand forecasting model calibrated to your protocol and historical data." },
    { text: "Monte Carlo risk engine with configurable service-level and buffer targets." },
    { text: "Interactive scenario-planning dashboard (web-based, access-controlled)." },
    { text: "Data pipeline connecting your enrollment and inventory sources." },
    { text: "Documented SOPs so your team can run and update forecasts without us." },
    { text: "Handover training and 30 days of post-launch support." },
  ],

  timeline: [
    {
      phase: "01",
      label: "Discovery & Data Audit",
      detail: "Map your data sources, assumptions, and current forecasting workflow.",
      whyItMatters: "Every model input reflects how your program actually runs, not textbook assumptions, so the forecast is trustworthy from day one.",
      duration: "Week 1",
    },
    {
      phase: "02",
      label: "Model Build",
      detail: "Stand up the forecasting model and Monte Carlo risk engine against your data.",
      whyItMatters: "Calibrating against your real data means the risk numbers you see are the risk numbers you'll actually face, not generic benchmarks.",
      duration: "Weeks 2–3",
    },
    {
      phase: "03",
      label: "Dashboard & Scenarios",
      detail: "Ship the interactive dashboard with one-click scenario planning.",
      whyItMatters: "A one-click scenario tool means you can defend supply decisions in the room, not after the meeting.",
      duration: "Weeks 4–5",
    },
    {
      phase: "04",
      label: "Validation & Handover",
      detail: "Validate against known outcomes, deliver SOPs, and train your team.",
      whyItMatters: "Validating against known outcomes before handover means you inherit a proven system, not an unproven black box.",
      duration: "Week 6",
    },
  ],

  why_us: {
    headline: "Why us",
    blurb:
      "We build AI and forecasting systems for supply-constrained operations. Our work has driven measurable reductions in overage and stockout risk across clinical and commercial supply programs. We pair modeling depth with practical SOPs, so the system keeps working after we leave.",
    stats: [
      { value: "6+ yrs", label: "applying AI to supply and forecasting" },
      { value: "95%+", label: "target service levels engineered into every model" },
      { value: "End-to-end", label: "from data pipeline to boardroom dashboard" },
    ],
  },

  next_steps: [
    { step: "Approve this proposal to reserve your build slot." },
    { step: "Kickoff call to grant data access and confirm assumptions." },
    { step: "We begin the Discovery & Data Audit within one week of kickoff." },
  ],

  guarantee:
    "If the delivered model does not hold to the agreed service-level target on validation data, we keep working at no additional cost until it does.",

  cost_items: [
    { label: "Clinical Supply Forecasting System", description: "Core model, risk engine, and dashboard build.", qty: 1, unit_cents: 0 },
  ],
  currency: "usd",

  services_agreement: DEFAULT_SERVICES_AGREEMENT,
};
