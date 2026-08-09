import { AgentInput, AgentResult } from "../types";
import { callLLM } from "../utils";
import { FLYER_PROMPT } from "../prompts";

export async function flyerAgent(
  input: AgentInput
): Promise<AgentResult> {

  const prompt = `
${FLYER_PROMPT}

BUSINESS
---------
${JSON.stringify(input.memory, null, 2)}

USER REQUEST
------------
${input.message}

Return ONLY valid JSON.
`;

  const raw = await callLLM(prompt);

  try {

    const data = JSON.parse(raw);

    return {

      success: true,

      tool: "flyer",

      data,

    };

  } catch {

    return {

      success: false,

      tool: "flyer",

      error: "Flyer agent produced invalid JSON.",

      raw,

    };

  }

}