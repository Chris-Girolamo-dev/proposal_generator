// Default proposal copy — OPFOR voice: second-person, direct, no em dashes, calm authority.
// Domain: clinical-supply / demand forecasting for B2B biotech & pharma.
// These are starting points the editor pre-fills; you edit per client.

import type { ProposalDraft } from "./types";

export const SECTION_TITLES = {
  opportunity: "Your areas of opportunity", // renamed from "problem areas" for the biotech market
  solution: "Your solution",
  deliverables: "What you get",
  timeline: "How we get there",
  whyUs: "Why us",
  investment: "Investment",
  nextSteps: "Next steps",
} as const;

/** Intro paragraph that sits under each numbered section, mirroring the LeftClick layout. */
export const SECTION_INTROS = {
  opportunity:
    "Forecasting is innately high-leverage. Done well it compounds in your favor; done manually it compounds against you. In your current workflow, a few persistent, high-impact areas are quietly capping accuracy and speed:",
  solution:
    "Closing these gaps is straightforward, and we have done it many times before. In practice the fix is almost always a combination of clean data pipelines, probabilistic modeling, and repeatable SOPs. Here is what that looks like for you:",
} as const;

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
    { phase: "01", label: "Discovery & Data Audit", detail: "Map your data sources, assumptions, and current forecasting workflow.", duration: "Week 1" },
    { phase: "02", label: "Model Build", detail: "Stand up the forecasting model and Monte Carlo risk engine against your data.", duration: "Weeks 2–3" },
    { phase: "03", label: "Dashboard & Scenarios", detail: "Ship the interactive dashboard with one-click scenario planning.", duration: "Weeks 4–5" },
    { phase: "04", label: "Validation & Handover", detail: "Validate against known outcomes, deliver SOPs, and train your team.", duration: "Week 6" },
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
};
