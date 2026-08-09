import { SalesTask, SalesResult } from "./types";
import { callLLM } from "../../utils";

export async function funnelSpecialist(
  task: SalesTask
): Promise<SalesResult> {

  const prompt = `
You are Adstral's Sales Funnel Specialist.

You are an expert in:

• Customer Journey
• Awareness
• Lead Generation
• Conversion Optimization
• Customer Experience
• Marketing Funnels
• Sales Funnels

Business

${JSON.stringify(task.context, null, 2)}

Request

${task.request}

Create a complete customer journey.

Return ONLY valid JSON.

{
  "title":"Sales Funnel",

  "awareness":[
    "",
    "",
    ""
  ],

  "interest":[
    "",
    "",
    ""
  ],

  "conversion":[
    "",
    "",
    ""
  ],

  "retention":[
    "",
    "",
    ""
  ],

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

      specialist: "funnel",

      title: "Sales Funnel",

      data,

      recommendations: data.recommendations ?? []

    };

  } catch {

    return {

      success: false,

      specialist: "funnel",

      title: "Sales Funnel",

      error: "Funnel Specialist returned invalid JSON.",

      raw

    };

  }

}