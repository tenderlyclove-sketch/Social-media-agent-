import { SalesTask, SalesResult } from "./types";
import { callLLM } from "../../utils";

export async function offerSpecialist(
  task: SalesTask
): Promise<SalesResult> {

  const prompt = `
You are Adstral's Offer Specialist.

You are an expert in:

• Promotional campaigns
• Flash sales
• Buy One Get One
• Bundle offers
• Weekend offers
• Holiday campaigns
• Customer incentives

Business

${JSON.stringify(task.context, null, 2)}

Request

${task.request}

Generate ONLY valid JSON.

{
  "title":"Offer Strategy",

  "headline":"",

  "offer":"",

  "urgency":"",

  "callToAction":"",

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

      specialist: "offers",

      title: "Offer Strategy",

      data,

      recommendations: data.recommendations ?? []

    };

  } catch {

    return {

      success: false,

      specialist: "offers",

      title: "Offer Strategy",

      error: "Offer Specialist returned invalid JSON.",

      raw

    };

  }

}