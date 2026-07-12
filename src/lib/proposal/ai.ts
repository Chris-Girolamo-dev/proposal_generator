"use server";

import Anthropic from "@anthropic-ai/sdk";
import type { NumberedItem } from "./types";

// Copywriting model. Swap here if you want a different tier.
const MODEL = "claude-sonnet-5";

const SYSTEM = `You write the "Areas of Opportunity" section of a B2B proposal for OPFOR, a clinical-supply demand-forecasting product for biotech and pharma.

Read the sales-call transcript and identify the prospect's most important, specific problems in their current demand forecasting and clinical-supply planning workflow. Write them as short, sharp "areas of opportunity" (problems worth solving), at most four.

Hard rules:
- Ground every point in what was actually said on the call. Never invent problems, numbers, systems, or specifics that are not in the transcript. If the transcript is thin, return fewer points rather than fabricate.
- Describe the problem and its cost, not the solution. Do not pitch OPFOR here.
- Voice: second person ("your"), direct, spartan, declarative, calm authority. No em dashes. No marketing adjectives. No exclamation points.
- Never name competitors or other vendors. Never mention the transcript, the call, or that this was AI-generated.
- Never include patient-level, subject-level, or blinded/unblinding data even if present in the transcript.
- Each point is one or two sentences, roughly 15 to 30 words. Use the prospect's own terminology where they used it.

Return the points with the emit_opportunities tool.`;

/**
 * Turns a sales-call transcript into custom "Areas of Opportunity" items, grounded
 * strictly in the transcript. Returns [] only if nothing usable was found.
 * Requires ANTHROPIC_API_KEY in the server env.
 */
export async function generateOpportunities(
  transcript: string,
  clientCompany: string,
): Promise<NumberedItem[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set. Add it to .env.local and restart the dev server.");
  }
  const text = transcript.trim();
  if (text.length < 60) {
    throw new Error("Paste a longer transcript (a few sentences at least) to generate from.");
  }

  const anthropic = new Anthropic({ apiKey });
  const res = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1500,
    system: SYSTEM,
    tools: [
      {
        name: "emit_opportunities",
        description: "Return the Areas of Opportunity items drafted from the transcript.",
        input_schema: {
          type: "object",
          properties: {
            opportunities: {
              type: "array",
              minItems: 1,
              maxItems: 4,
              items: {
                type: "object",
                properties: { text: { type: "string" } },
                required: ["text"],
              },
            },
          },
          required: ["opportunities"],
        },
      },
    ],
    tool_choice: { type: "tool", name: "emit_opportunities" },
    messages: [
      {
        role: "user",
        content: `Prospect company: ${clientCompany || "the prospect"}\n\nSales-call transcript:\n"""\n${text}\n"""`,
      },
    ],
  });

  const tool = res.content.find((c) => c.type === "tool_use");
  if (!tool || tool.type !== "tool_use") {
    throw new Error("The model did not return structured output. Try again.");
  }
  const opportunities = (tool.input as { opportunities?: { text?: string }[] }).opportunities ?? [];
  return opportunities
    .map((it) => (it.text ?? "").trim())
    .filter(Boolean)
    .slice(0, 4)
    .map((textItem, i) => ({ n: String(i + 1).padStart(2, "0"), text: textItem }));
}
