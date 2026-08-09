import { AgentInput, AgentResult } from "../types";
import { callLLM } from "../utils";
import { WHATSAPP_PROMPT } from "../prompts";

export async function whatsappAgent(
  input: AgentInput
): Promise<AgentResult> {

  const prompt = `
${WHATSAPP_PROMPT}

BUSINESS
---------
${JSON.stringify(input.memory, null, 2)}

USER REQUEST
------------
${input.message}

Generate professional WhatsApp marketing content.

Return ONLY valid JSON.

Expected format:

{
  "broadcast":"",
  "followUp":"",
  "status":"",
  "callToAction":""
}
`;

  const raw = await callLLM(prompt);

  try {

    const data = JSON.parse(raw);

    return {
      success: true,
      tool: "whatsapp",
      data,
    };

  } catch {

    return {
      success: false,
      tool: "whatsapp",
      error: "WhatsApp agent produced invalid JSON.",
      raw,
    };

  }

}