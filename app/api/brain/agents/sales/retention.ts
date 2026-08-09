import { SalesTask, SalesResult } from "./types";
import { callLLM } from "../../utils";

export async function retentionSpecialist(
  task: SalesTask
): Promise<SalesResult> {

  const prompt = `
You are Adstral's Customer Retention Specialist.

You are an expert in:

• Customer loyalty
• Repeat purchases
• Customer experience
• Membership programs
• Referral systems
• WhatsApp follow-up
• Customer relationship management

Business

${JSON.stringify(task.context, null, 2)}

Request

${task.request}

Return ONLY valid JSON.

{
  "title":"Customer Retention Strategy",

  "loyaltyProgram":"",

  "followUpPlan":[
    "",
    "",
    ""
  ],

  "reviewStrategy":"",

  "referralProgram":"",

  "recommendations":[
    "",
    "",
    ""
  ]
}
`;

  const raw = await callLLM(prompt);

  try {

    const data = JSON.parse(raw);

    return {

      success: true,

      specialist: "retention",

      title: "Customer Retention Strategy",

      data,

      recommendations: data.recommendations ?? []

    };

  } catch {

    return {

      success: false,

      specialist: "retention",

      title: "Customer Retention Strategy",

      error: "Retention Specialist returned invalid JSON.",

      raw

    };

  }

}