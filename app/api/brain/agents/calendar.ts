import { AgentInput, AgentResult } from "../types";
import { callLLM } from "../utils";
import { CALENDAR_PROMPT } from "../prompts";

export async function calendarAgent(
  input: AgentInput
): Promise<AgentResult> {

  const prompt = `
${CALENDAR_PROMPT}

You are Adstral's Master Campaign Planner.

Your job is NOT to write posts.

Your job is to create a complete MULTI-PLATFORM campaign schedule.

Business Profile
----------------
${JSON.stringify(input.memory, null, 2)}

User Request
------------
${input.message}

Generate a coordinated content calendar for every suitable platform.

Possible platforms:

- Facebook
- Instagram
- TikTok
- WhatsApp
- X
- LinkedIn
- YouTube

For every day include:

• Platform
• Content Type
• Topic
• Goal
• Which specialist agent should create it

Return ONLY valid JSON.

{
  "campaignName":"",
  "duration":"30 Days",

  "calendar":[
    {
      "day":1,
      "platform":"Facebook",
      "contentType":"Post",
      "topic":"",
      "goal":"",
      "agent":"facebook"
    },
    {
      "day":1,
      "platform":"Instagram",
      "contentType":"Carousel",
      "topic":"",
      "goal":"",
      "agent":"facebook"
    },
    {
      "day":1,
      "platform":"TikTok",
      "contentType":"Video",
      "topic":"",
      "goal":"",
      "agent":"video"
    },
    {
      "day":1,
      "platform":"WhatsApp",
      "contentType":"Broadcast",
      "topic":"",
      "goal":"",
      "agent":"whatsapp"
    }
  ]
}
`;

  const raw = await callLLM(prompt);

  try {

    const data = JSON.parse(raw);

    return {
      success: true,
      tool: "calendar",
      data
    };

  } catch {

    return {
      success: false,
      tool: "calendar",
      error: "Calendar agent produced invalid JSON.",
      raw
    };

  }

}