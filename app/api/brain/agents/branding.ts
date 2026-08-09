import { AgentInput, AgentResult } from "../types";
import { callLLM } from "../utils";
import { BRANDING_PROMPT } from "../prompts";

export async function brandingAgent(
  input: AgentInput
): Promise<AgentResult> {

  const prompt = `
${BRANDING_PROMPT}

You are Adstral's Creative Director.

Business Profile
----------------
${JSON.stringify(input.memory, null, 2)}

User Request
------------
${input.message}

Your responsibility is to build a complete brand identity.

Return ONLY valid JSON.

{
  "brandPersonality":"",
  "brandVoice":"",
  "brandStory":"",
  "brandColors":[
    "",
    "",
    ""
  ],
  "fonts":[
    "",
    ""
  ],
  "logoIdea":"",
  "slogan":"",
  "visualStyle":""
}
`;

  const raw = await callLLM(prompt);

  try {

    const data = JSON.parse(raw);

    return {
      success: true,
      tool: "branding",
      data
    };

  } catch {

    return {
      success: false,
      tool: "branding",
      error: "Branding agent produced invalid JSON.",
      raw
    };

  }

}