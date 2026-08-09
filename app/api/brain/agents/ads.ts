import { AgentInput, AgentResult } from "../types";
import { callLLM } from "../utils";
import { ADS_PROMPT } from "../prompts";

export async function adsAgent(
  input: AgentInput
): Promise<AgentResult> {

  const prompt = `
${ADS_PROMPT}

BUSINESS
---------
${JSON.stringify(input.memory, null, 2)}

USER REQUEST
------------
${input.message}

Generate a complete advertising campaign.

Return ONLY valid JSON.

Expected format:

{
  "headline":"",
  "primaryText":"",
  "description":"",
  "callToAction":"",
  "audience":"",
  "budget":"",
  "imagePrompt":""
}
`;

  const raw = await callLLM(prompt);

  try {

    const data = JSON.parse(raw);

    return {
      success: true,
      tool: "ads",
      data,
    };

  } catch {

    return {
      success: false,
      tool: "ads",
      error: "Ads agent produced invalid JSON.",
      raw,
    };

  }

}