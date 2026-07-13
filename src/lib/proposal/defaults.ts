// Default proposal copy — OPFOR voice: second-person, direct, no em dashes, calm authority.
// Domain: clinical-supply / demand forecasting for B2B biotech & pharma.
// These are starting points the editor pre-fills; you edit per client.

import type { AgreementClause, ProposalDraft, TeamMember } from "./types";

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
    "Forecasting is innately high-leverage. Done well it compounds in your favor; done manually it compounds against you. In your current workflow, a few persistent, high-impact areas are capping accuracy and speed:",
  solution:
    "These gaps close the same way every time. Clean inputs, a model that shows its uncertainty, and a process your team owns. Here is what that looks like.",
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
    "Provider will invoice fifty percent (50%) of first-year fees upon execution of this Agreement, and the remainder in two equal installments invoiced in the third and fourth calendar quarters of the first year. Thereafter, the annual renewal fee is invoiced in full, in advance, at the start of each renewal year. Payment is due within thirty (30) days of the invoice date.",
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

export const DEFAULT_TEAM: TeamMember[] = [
  {
    role: "Engagement Lead",
    badge: "CORE",
    description:
      "On the work full time from kickoff to handoff. Primary point of contact for the engagement.",
  },
  {
    role: "Forecasting & Data Systems",
    badge: "CORE",
    description:
      "Builds the model and Monte Carlo risk engine, and integrates it against your live data sources.",
  },
];

/**
 * Moat-edition Why-OPFOR points (docs/OPFOR_Marketing_Soundbites_and_Moat_Analysis
 * .md.docx). Three architecture-backed points (S2, S3, S9) replace the three most
 * generic defaults; tone stays matter-of-fact. All claims are status-gated USABLE
 * NOW; the IRT point uses the doc's cautious phrasing (Medidata live, others
 * onboarding) and deliberately avoids the "Switzerland" tagline.
 */
export const MOAT_WHY_US_POINTS = [
  {
    title: "An assumption change becomes an answer in seconds.",
    description:
      "Any assumption change re-forecasts in seconds, in your browser. Self-serve, unlimited, no analyst queue.",
  },
  {
    title: "IRT-agnostic by architecture.",
    description:
      "A neutral layer over whatever randomization system each study runs. Medidata live today; other formats onboard per study.",
  },
  {
    title: "Calibrated to your actuals, not a benchmark.",
    description:
      "Every model ships trained against your historical and protocol actuals, not a generic industry template.",
  },
  {
    title: "Every forecast is reproducible.",
    description:
      "Deterministic engine: any forecast re-derives exactly from its configuration snapshot. Every change is versioned.",
  },
  {
    title: "Calibrated to your actuals.",
    description:
      "Every model ships trained against your actual historical and protocol parameters, never a generic industry template.",
  },
  {
    title: "No patient data. Ever.",
    description:
      "No subject-level records, no treatment arms. Enrollment reduces to per-site counts in your browser. Only the counts leave your machine.",
  },
];

export const DEFAULT_PROPOSAL: ProposalDraft = {
  proposal_version: "V1.0",
  renewal_cents: 0, // set per client in the editor (½ of year one, locked)
  discount_pct: 0, // optional year-one discount; blank hides it on the PDF
  client_company: "[Client Company]",
  client_logo_url: null,
  project_title: "Clinical Supply Forecasting Simulator",
  subtitle:
    "A purpose-built demand forecasting and scenario-planning engine that grows with your team, and your clinical programs. Unlimited scenarios, studies, & seats, for life.",

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
      text: "A forecasting model that recomputes instantly when any assumption changes.",
    },
    {
      n: "02",
      text: "10,000 run Monte Carlo simulation that quantifies stockout and overage risk at your target service level.",
    },
    {
      n: "03",
      text: "One-click scenarios so you can pressure-test enrollment, site, and dosing changes in real time.",
    },
    {
      n: "04",
      text: "A shared, auditable dashboard that gives supply, clinical, and finance one aligned number, in demand and dollars.",
    },
    {
      n: "05",
      text: "Production plan lot optimization and automated depot transfers, sized from the forecast instead of by hand.",
    },
  ],

  deliverables: [
    { text: "Custom demand forecasting model calibrated to your protocol & historical data." },
    { text: "Monte Carlo risk engine with configurable service-level and buffer targets." },
    { text: "Interactive scenario-planning dashboard (web-based, access-controlled)." },
    { text: "A clean intake for the reports you already export." },
    { text: "Documentation so your team runs and updates forecasts without us." },
    { text: "Handover training and 30 days of post-launch support." },
    {
      text: "Team accounts so supply, clinical, and finance work from shared scenarios and one source of truth from day one.",
    },
  ],

  timeline: [
    {
      phase: "01",
      label: "Kickoff & Discovery.",
      tagline: "map the terrain before you build.",
      detail:
        "We read your current forecasting workflow end to end: existing spreadsheets, data sources, and the assumptions baked into each. Then we map exactly where the manual rework happens and where uncertainty is being dropped on the floor.",
      whyItMatters:
        "Every model input reflects how your program actually runs, not textbook assumptions, so the forecast is trustworthy from day one.",
      deliverables: ["Data source audit", "Assumption map", "Day-4 working review"],
      duration: "Week 1",
    },
    {
      phase: "02",
      label: "Model Build.",
      tagline: "the forecasting engine, calibrated to you.",
      detail:
        "We build the forecasting model and Monte Carlo risk engine against your historical data, not a generic template.",
      whyItMatters:
        "Calibrating against your real data means the risk numbers you see are the risk numbers you'll actually face, not generic benchmarks.",
      deliverables: ["Forecasting model", "Monte Carlo risk engine", "Day-4 working review"],
      duration: "Week 2",
    },
    {
      phase: "03",
      label: "Dashboard & Scenarios.",
      tagline: "one-click answers for the room.",
      detail:
        "We ship the interactive dashboard, wire up one-click scenario planning, and connect the whole thing to your enrollment and inventory sources.",
      whyItMatters:
        "A one-click scenario tool means you can defend supply decisions in the room, not after the meeting.",
      deliverables: ["Interactive dashboard", "Scenario planner", "Sources connected"],
      duration: "Week 3",
    },
    {
      phase: "04",
      label: "Signal & Warm Handoff.",
      tagline: "proof it holds, then a clean handoff.",
      detail:
        "We run the model against known outcomes so you see real signal that it holds, not performance we claim on our own docs. Then we document what your team needs and walk them through owning it.",
      whyItMatters:
        "Seeing the model checked against known outcomes before handoff means you inherit a proven system, not an unproven black box.",
      deliverables: ["Signal report", "Documentation", "Team training", "30-day support"],
      duration: "Week 4",
    },
  ],

  team: DEFAULT_TEAM,

  why_us: {
    headline: "Why us",
    blurb:
      "We build forecasting systems for supply-constrained operations. Our work has driven measurable reductions in overage and stockout risk across clinical and commercial supply programs. We pair modeling depth with a process your team owns, so it keeps working after we leave.",
    stats: [
      { value: "26+ yrs", label: "team experience in drug development & supply chain" },
      { value: "95%+", label: "target service levels engineered into every model" },
      { value: "At all levels", label: "from actuals pipeline to boardroom dashboard" },
    ],
    capabilities: [
      "Demand per *protocol*",
      "Per *arm*",
      "Per *visit schedule*",
      "Enrollment *curves*",
      "Titration *paths*",
      "Dropout *modeling*",
      "Depot *allocation*",
      "Shelf-life *aware*",
      "Live *reforecast*",
      "IRT *actuals*",
      "Cohort *management*",
      "Monte Carlo *simulations*",
      "Demand *aggregation*",
      "Budget *planning*",
      "DP *alignment*",
    ],
    points: [
      {
        title: "We build systems, not slide decks.",
        description:
          "You get a working model and dashboard, not a strategy deck for another vendor to implement.",
      },
      {
        title: "Calibrated to your actuals, not a benchmark.",
        description:
          "Every model ships trained against your historical and protocol actuals, not a generic industry template.",
      },
      {
        title: "Senior team, narrow focus.",
        description:
          "The same person who scopes the model builds it and hands it over. No account-manager-to-engineer relay.",
      },
      {
        title: "We build for the forecast, not the deck.",
        description:
          "The dashboard is how this gets funded internally. Forecast accuracy is why it matters. We optimize for the second, and the first follows.",
      },
      {
        title: "Calibrated to your actuals.",
        description:
          "Every model ships trained against your actual historical and protocol parameters, never a generic industry template.",
      },
      {
        title: "No patient data. Ever.",
        description:
          "No subject-level records, no treatment arms. Enrollment reduces to per-site counts in your browser. Only the counts leave your machine.",
      },
    ],
  },

  next_steps: [
    { step: "Approve this proposal to reserve your build slot." },
    { step: "Kickoff call to grant data access and confirm assumptions." },
    { step: "We begin the Discovery & Scenario Build within one week of kickoff." },
  ],

  guarantee:
    // "validation data" (the statistical sense) read as computerized-system validation to a
    // pharma audience, and contradicted the Data boundaries page, which says adoption does not
    // wait on a validation project. "your historical data" says the same thing without the
    // regulatory collision.
    "If the delivered model does not hold to the agreed service-level target on your historical data, we keep working at no additional cost until it does.",

  cost_items: [
    { label: "OPFOR Genesis Clinical Supply Forecasting Simulator", description: "Core model, risk engine, and dashboard build.", qty: 1, unit_cents: 0 },
    {
      label: "IRT integration",
      description: "Optional. Billed per integration; refunded onto your following-year renewal.",
      qty: 1,
      unit_cents: 568_000,
      optional: true,
    },
  ],

  // The value stack shown under the price: real values on the right, an
  // Included/credited stamp instead of a charge. Order = punch order.
  bonuses: [
    // Headline "for life" bonuses. Values left blank on purpose: set per call once the
    // prospect names their study count and team size, then bake the qty into the label
    // e.g. "(12) studies covered" and set a value.
    { label: "Unlimited studies, for life", tag: "For life" },
    { label: "Unlimited seats, for life", tag: "For life" },
    // Price-lock value per user.
    { label: "Locked-for-life renewal: your annual price never increases" },
    { label: "Testimonial credit off your next renewal", value_cents: 700_000, tag: "On renewal" },
    { label: "Unlimited scenario breakdown videos", value_cents: 295_000 },
    { label: "Weekly working call, one hour a week", value_cents: 1_404_000 },
    { label: "White-glove onboarding", value_cents: 450_000 },
    { label: "(5) Live training sessions", value_cents: 200_000 },
    { label: "SOC 2-compliant host-for-you", value_cents: 74_900 },
    { label: "(2) RTSM/IRT integration fee waivers ($5,680 each)", value_cents: 1_136_000, tag: "On renewal" },
    { label: "Unlimited Anthropic API usage", value_cents: 120_000 },
    { label: "Step-by-step study build master manual", value_cents: 79_000 },
    { label: "Long Range Planning module", value_cents: 479_500 },
    { label: "Drug Product DOM Alignment module", value_cents: 379_600 },
    { label: "24/7 customer service access", tag: "Included" },
    { label: "(21) Master-builder training video guides", value_cents: 522_900 },
    { label: "(11) Do-it-for-you white glove study builds", value_cents: 821_700 },
  ],
  currency: "usd",

  services_agreement: DEFAULT_SERVICES_AGREEMENT,
};
