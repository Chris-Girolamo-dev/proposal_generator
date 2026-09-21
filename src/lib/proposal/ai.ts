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

export type GenerateResult =
  | { ok: true; items: NumberedItem[] }
  | { ok: false; error: string };

/**
 * Turns a sales-call transcript into custom "Areas of Opportunity" items, grounded
 * strictly in the transcript. Requires ANTHROPIC_API_KEY in the server env.
 *
 * Returns a result object rather than throwing. A server action that throws reaches the
 * client as Next.js's generic "an error occurred in the Server Components render" in
 * production builds -- the real message is stripped to avoid leaking server internals --
 * which left the UI unable to say what actually went wrong. These messages are written to
 * be safe to show, so they are returned as data instead.
 */
export async function generateOpportunities(
  transcript: string,
  clientCompany: string,
): Promise<GenerateResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "ANTHROPIC_API_KEY is not set in this environment." };
  }
  const text = transcript.trim();
  if (text.length < 60) {
    return { ok: false, error: "Paste a longer transcript (a few sentences at least) to generate from." };
  }

  const anthropic = new Anthropic({ apiKey });
  let res;
  try {
    res = await anthropic.messages.create({
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
  } catch (e) {
    // Surface the API's own reason (bad key, no credit, model unavailable, rate limit)
    // instead of a blank failure. The key itself is never part of these messages.
    const status = (e as { status?: number }).status;
    const detail = e instanceof Error ? e.message : String(e);
    return {
      ok: false,
      error: status
        ? `Anthropic API error ${status}: ${detail}`
        : `Could not reach the Anthropic API: ${detail}`,
    };
  }


  const tool = res.content.find((c) => c.type === "tool_use");
  if (!tool || tool.type !== "tool_use") {
    return { ok: false, error: "The model did not return structured output. Try again." };
  }
  const opportunities = (tool.input as { opportunities?: { text?: string }[] }).opportunities ?? [];
  const items = opportunities
    .map((it) => (it.text ?? "").trim())
    .filter(Boolean)
    .slice(0, 4)
    .map((textItem, i) => ({ n: String(i + 1).padStart(2, "0"), text: textItem }));

  return { ok: true, items };
}
