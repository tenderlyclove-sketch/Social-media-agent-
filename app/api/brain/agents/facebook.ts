import { AgentInput, AgentResult } from "../types";
import { callLLM } from "../utils";
import { FACEBOOK_PROMPT } from "../prompts";

export async function facebookAgent(
  input: AgentInput
): Promise<AgentResult> {
  const prompt = `
${FACEBOOK_PROMPT}

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
      tool: "facebook",
      data,
    };
  } catch (err) {
    return {
      success: false,
      tool: "facebook",
      error: "Facebook agent produced invalid JSON.",
      raw,
    };
  }
}