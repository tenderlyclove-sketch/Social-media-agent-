import { AgentInput, AgentResult } from "../types";
import { callLLM } from "../utils";
import { SALES_PROMPT } from "../prompts";

export async function salesAgent(
  input: AgentInput
): Promise<AgentResult> {

  const prompt = `
${SALES_PROMPT}

You are Adstral's Sales Growth Consultant.

Business Profile
----------------
${JSON.stringify(input.memory, null, 2)}

User Request
------------
${input.message}

Your responsibility is NOT content creation.

You are responsible for business growth.

Create a practical sales strategy.

Return ONLY valid JSON.

{
  "businessAnalysis":"",

  "salesStrategy":[
    "",
    "",
    "",
    "",
    ""
  ],

  "marketingIdeas":[
    "",
    "",
    ""
  ],

  "customerRetention":[
    "",
    "",
    ""
  ],

  "recommendedOffers":[
    "",
    "",
    ""
  ],

  "estimatedResults":""
}
`;

  const raw = await callLLM(prompt);

  try {

    const data = JSON.parse(raw);

    return {

      success: true,

      tool: "sales",

      data

    };

  } catch {

    return {

      success: false,

      tool: "sales",

      error: "Sales agent produced invalid JSON.",

      raw

    };

  }

}