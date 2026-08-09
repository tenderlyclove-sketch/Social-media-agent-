import { SalesTask, SalesResult } from "./types";
import { callLLM } from "../../utils";

export async function pricingSpecialist(
  task: SalesTask
): Promise<SalesResult> {

  const prompt = `
You are Adstral's Pricing Specialist.

You are an expert in:

• Pricing psychology
• Profit optimization
• Premium pricing
• Competitive pricing
• Restaurant pricing
• Service pricing
• Product pricing

Business

${JSON.stringify(task.context, null, 2)}

Request

${task.request}

Generate ONLY valid JSON.

{
  "title":"Pricing Strategy",

  "recommendedPrice":"",

  "pricingModel":"",

  "competitorPosition":"",

  "reasoning":"",

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

      specialist: "pricing",

      title: "Pricing Strategy",

      data,

      recommendations: data.recommendations ?? []

    };

  } catch {

    return {

      success: false,

      specialist: "pricing",

      title: "Pricing Strategy",

      error: "Pricing Specialist returned invalid JSON.",

      raw

    };

  }

}