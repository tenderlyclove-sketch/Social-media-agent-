// app/api/brain/planner.ts

import OpenAI from "openai";

import { BrainConfig } from "./config";
import { PLANNER_PROMPT } from "./prompts";
import {
  AgentName,
  PlannedWorkflowStep,
  TaskPlan,
} from "./types";
import { safeJsonParse } from "./utils";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY!,
});


// ==========================================
// WORKFLOW-AWARE PLANNER
// ==========================================

export async function createPlan(
  userMessage: string
): Promise<TaskPlan> {

  const systemPrompt = `
${PLANNER_PROMPT}

You are also Adstral's multi-department workflow planner.

Your job is NOT limited to selecting one agent.

Determine whether the user's request requires one
or multiple departments.

Available departments:

- brain
- story
- creative
- sales
- platform

Available agents:

- facebook
- flyer
- ads
- calendar
- sales
- branding
- whatsapp
- image
- video
- story

Workflow rules:

1. Use the smallest workflow that can fully satisfy
   the user's request.

2. A simple request should normally use one department.

3. A complex production request may require multiple
   departments.

4. Story requests may use:
   story → creative → platform

5. Marketing/creative requests may use:
   creative → sales → platform

6. Do NOT add sales unless the user asks for selling,
   conversion, an offer, monetization, upselling,
   lead generation, or a similar commercial objective.

7. Do NOT add platform unless the user asks for content
   prepared for, scheduled for, or published to a platform.

8. Do NOT invent unnecessary workflow steps.

Return ONLY valid JSON.

Required JSON structure:

{
  "intent": "short description",
  "confidence": 0.0,
  "agent": "primary agent",
  "prompt": "original user request",
  "workflow": [
    {
      "id": "step_1",
      "department": "story",
      "agent": "story",
      "reason": "why this step is needed"
    }
  ]
}

The "agent" field must be one of:

facebook, flyer, ads, calendar, sales,
branding, whatsapp, image, video, story

The "department" field must be one of:

brain, story, creative, sales, platform
`;

  const completion =
    await client.chat.completions.create({

      model: BrainConfig.MODEL,

      temperature: 0,

      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],

    });

  const raw =
    completion.choices[0].message.content ?? "";

  const parsed =
    safeJsonParse<
      Partial<TaskPlan>
    >(raw);

  if (!parsed) {

    return createFallbackPlan(
      userMessage
    );

  }

  const workflow =
    normalizeWorkflow(
      parsed.workflow
    );

  return {

    intent:
      typeof parsed.intent === "string"
        ? parsed.intent
        : "general",

    confidence:
      typeof parsed.confidence === "number"
        ? Math.max(
            0,
            Math.min(1, parsed.confidence)
          )
        : 0.5,

    agent:
      isAgentName(parsed.agent)
        ? parsed.agent
        : "facebook",

    prompt:
      userMessage,

    workflow:
      workflow.length > 0
        ? workflow
        : createFallbackWorkflow(
            userMessage
          ),

  };
}


// ==========================================
// FALLBACK PLAN
// ==========================================

function createFallbackPlan(
  userMessage: string
): TaskPlan {

  const workflow =
    createFallbackWorkflow(
      userMessage
    );

  return {

    intent: "general",

    confidence: 0.2,

    agent:
      workflow[0]?.agent ??
      "facebook",

    prompt:
      userMessage,

    workflow,

  };
}


// ==========================================
// FALLBACK WORKFLOW
// ==========================================

function createFallbackWorkflow(
  userMessage: string
): PlannedWorkflowStep[] {

  const text =
    userMessage.toLowerCase();

  if (
    text.includes("story") ||
    text.includes("bible") ||
    text.includes("samson") ||
    text.includes("delilah") ||
    text.includes("script")
  ) {

    return [
      {
        id: "step_1",
        department: "story",
        agent: "story",
        reason:
          "The request requires story development.",
      },
    ];

  }

  if (
    text.includes("flyer") ||
    text.includes("logo") ||
    text.includes("thumbnail") ||
    text.includes("image") ||
    text.includes("video") ||
    text.includes("branding")
  ) {

    return [
      {
        id: "step_1",
        department: "creative",
        agent:
          text.includes("flyer")
            ? "flyer"
            : text.includes("video")
            ? "video"
            : text.includes("thumbnail")
            ? "image"
            : "branding",
        reason:
          "The request requires creative production.",
      },
    ];

  }

  if (
    text.includes("sell") ||
    text.includes("sales") ||
    text.includes("offer") ||
    text.includes("funnel") ||
    text.includes("upsell") ||
    text.includes("conversion")
  ) {

    return [
      {
        id: "step_1",
        department: "sales",
        agent: "sales",
        reason:
          "The request has a sales or conversion objective.",
      },
    ];

  }

  return [
    {
      id: "step_1",
      department: "platform",
      agent: "facebook",
      reason:
        "No specialized workflow was confidently detected.",
    },
  ];
}


// ==========================================
// WORKFLOW NORMALIZER
// ==========================================

function normalizeWorkflow(
  workflow: unknown
): PlannedWorkflowStep[] {

  if (!Array.isArray(workflow)) {
    return [];
  }

  return workflow
    .filter(
      (
        step
      ): step is Partial<PlannedWorkflowStep> =>
        !!step &&
        typeof step === "object"
    )
    .map(
      (
        step,
        index
      ): PlannedWorkflowStep => ({

        id:
          typeof step.id === "string"
            ? step.id
            : `step_${index + 1}`,

        department:
          isDepartmentName(
            step.department
          )
            ? step.department
            : "brain",

        agent:
          isAgentName(
            step.agent
          )
            ? step.agent
            : undefined,

        reason:
          typeof step.reason === "string"
            ? step.reason
            : "Workflow step required by the plan.",

      })
    );
}


// ==========================================
// VALID AGENT CHECK
// ==========================================

function isAgentName(
  value: unknown
): value is AgentName {

  return [
    "facebook",
    "flyer",
    "ads",
    "calendar",
    "sales",
    "branding",
    "whatsapp",
    "image",
    "video",
    "story",
  ].includes(
    value as AgentName
  );
}


// ==========================================
// VALID DEPARTMENT CHECK
// ==========================================

function isDepartmentName(
  value: unknown
): value is PlannedWorkflowStep["department"] {

  return [
    "brain",
    "story",
    "creative",
    "sales",
    "platform",
  ].includes(
    value as PlannedWorkflowStep["department"]
  );
}