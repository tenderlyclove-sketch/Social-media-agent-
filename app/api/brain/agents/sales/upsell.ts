import { SalesTask, SalesResult } from "./types";
import { callLLM } from "../../utils";

export async function upsellSpecialist(
  task: SalesTask
): Promise<SalesResult> {

  const prompt = `
You are Adstral's Revenue Optimization Specialist.

You are an expert in:

• Upselling
• Cross-selling
• Average Order Value
• Product Bundling
• Premium Offers
• Customer Psychology

Business

${JSON.stringify(task.context, null, 2)}

Request

${task.request}

Return ONLY valid JSON.

{
  "title":"Revenue Growth Strategy",

  "primaryOffer":"",

  "upsells":[
    "",
    "",
    ""
  ],

  "crossSells":[
    "",
    "",
    ""
  ],

  "bundleIdeas":[
    "",
    "",
    ""
  ],

  "estimatedRevenueIncrease":"",

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

      specialist: "upsell",

      title: "Revenue Growth Strategy",

      data,

      recommendations: data.recommendations ?? []

    };

  } catch {

    return {

      success: false,

      specialist: "upsell",

      title: "Revenue Growth Strategy",

      error: "Upsell Specialist returned invalid JSON.",

      raw

    };

  }

}