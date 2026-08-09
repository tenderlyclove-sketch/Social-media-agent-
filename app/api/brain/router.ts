// app/api/brain/router.ts

import type { AgentName, AgentInput } from "./types";
import type { WorkflowStep } from "./jobTypes";

import { facebookAgent } from "./agents/facebook";
import { flyerAgent } from "./agents/flyer";
import { adsAgent } from "./agents/ads";
import { whatsappAgent } from "./agents/whatsapp";
import { calendarAgent } from "./agents/calendar";
import { salesAgent } from "./agents/sales";
import { brandingAgent } from "./agents/branding";

import { StoryStudio } from "./story";
import type {
  StoryCategory,
  StoryRequest,
} from "./story/types";

// ==========================================
// LEGACY / DIRECT AGENT ROUTER
// ==========================================

export async function routeTask(
  agent: AgentName,
  prompt: string
) {
  const input: AgentInput = {
    message: prompt,
    memory: {
      conversationHistory: [],
    },
  };

  switch (agent) {
    case "facebook":
      return facebookAgent(input);

    case "flyer":
      return flyerAgent(input);

    case "ads":
      return adsAgent(input);

    case "whatsapp":
      return whatsappAgent(input);

    case "calendar":
      return calendarAgent(input);

    case "sales":
      return salesAgent(input);

    case "branding":
      return brandingAgent(input);

    case "story":
      return executeStory(prompt);

    case "image":
      throw new Error(
        "Image agent is not implemented yet."
      );

    case "video":
      throw new Error(
        "Video agent is not implemented yet."
      );

    default:
      return facebookAgent(input);
  }
}

// ==========================================
// WORKFLOW STEP ROUTER

// ==========================================

export async function routeWorkflowStep(
  step: WorkflowStep,
  input: unknown
) {
  if (!step.agent) {
    throw new Error(
      `No agent assigned to workflow step: ${step.id}`
    );
  }

  // ----------------------------------------
  // STORY WORKFLOW
  // ----------------------------------------

  if (
    step.department === "story" ||
    step.agent === "story"
  ) {
    const prompt = buildWorkflowPrompt(
      step,
      input
    );

    return executeStory(
      prompt,
      input
    );
  }

  // ----------------------------------------
  // ALL OTHER AGENTS
  // ----------------------------------------

  const agentInput: AgentInput =
    buildAgentInput(
      step,
      input
    );

  switch (step.agent) {
    case "facebook":
      return facebookAgent(agentInput);

    case "flyer":
      return flyerAgent(agentInput);

    case "ads":
      return adsAgent(agentInput);

    case "whatsapp":
      return whatsappAgent(agentInput);

    case "calendar":
      return calendarAgent(agentInput);

    case "sales":
      return salesAgent(agentInput);

    case "branding":
      return brandingAgent(agentInput);

    case "image":
      throw new Error(
        "Image agent is not implemented yet."
      );

    case "video":
      throw new Error(
        "Video agent is not implemented yet."
      );


    default:
      throw new Error(
        `Unsupported workflow agent: ${step.agent}`
      );
  }
}

// ==========================================
// BUILD AGENT INPUT
// ==========================================

function buildAgentInput(
  step: WorkflowStep,
  input: unknown
): AgentInput {
  const source =
    input &&
    typeof input === "object"
      ? input as Record<string, unknown>
      : {};

  const userRequest =
    typeof source.userRequest === "string"
      ? source.userRequest
      : "";

  const previousOutputs =
    Array.isArray(source.previousOutputs)
      ? source.previousOutputs
      : [];

  const message =
    buildWorkflowPrompt(
      step,
      input
    );

  return {
    message:
      message || userRequest,

    memory: {
      conversationHistory: [],

      platform:
        readString(
          source.platform
        ),

      goal:
        readString(
          source.goal
        ),

      targetAudience:
        readString(
          source.targetAudience
        ),
    },

    context: {
      userRequest,
      intent:
        typeof source.intent === "string"
          ? source.intent
          : "",

      currentStep: {
        id: step.id,
        department: step.department,
        agent: step.agent,
      },

      previousOutputs,
    },
  };
}

// ==========================================
// STORY EXECUTION
// ==========================================

async function executeStory(
  prompt: string,
  input?: unknown
) {
  const metadata =
    extractStoryMetadata(input);

  const request: StoryRequest = {
    title:
      metadata.title ||
      extractStoryTitle(prompt),

    category:
      metadata.category,

    goal:
      metadata.goal ||
      "Create a high-quality engaging story",

    audience:
      metadata.audience ||
      "General audience",

    duration:
      metadata.duration,

    language:
      metadata.language,

    tone:
      metadata.tone,
  };

  return StoryStudio.create(
    request
  );
}

// ==========================================
// STORY METADATA
// ==========================================

interface StoryMetadata {
  title?: string;

  category: StoryCategory;

  audience?: string;

  duration?:
    StoryRequest["duration"];

  goal?: string;

  language?: string;

  tone?: string;
}

// ==========================================
// EXTRACT STORY METADATA
// ==========================================

function extractStoryMetadata(
  input: unknown
): StoryMetadata {
  const fallback: StoryMetadata = {
    category: "fiction",
  };

  if (
    !input ||
    typeof input !== "object"
  ) {
    return fallback;
  }

  const source =
    input as Record<
      string,
      unknown
    >;

  const metadata =
    source.metadata;

  if (
    metadata &&
    typeof metadata === "object"
  ) {
    const data =
      metadata as Record<
        string,
        unknown
      >;

    return {
      title:
        readString(data.title),

      category:
        readStoryCategory(
          data.category
        ),

      audience:
        readString(
          data.audience
        ),

      duration:
        readDuration(
          data.duration
        ),

      goal:
        readString(
          data.goal
        ),

      language:
        readString(
          data.language
        ),

      tone:
        readString(
          data.tone
        ),
    };
  }

  const currentStep =
    source.currentStep;

  if (
    currentStep &&
    typeof currentStep === "object"
  ) {
    const current =
      currentStep as Record<
        string,
        unknown
      >;

    const stepMetadata =
      current.metadata;

    if (
      stepMetadata &&
      typeof stepMetadata === "object"
    ) {
      const data =
        stepMetadata as Record<
          string,
          unknown
        >;

      return {
        title:
          readString(
            data.title
          ),

        category:
          readStoryCategory(
            data.category
          ),

        audience:
          readString(
            data.audience
          ),

        duration:
          readDuration(
            data.duration
          ),

        goal:
          readString(
            data.goal
          ),

        language:
          readString(
            data.language
          ),

        tone:
          readString(
            data.tone
          ),
      };
    }
  }

  return fallback;
}

// ==========================================
// VALIDATE STORY CATEGORY
// ==========================================

function readStoryCategory(
  value: unknown
): StoryCategory {
  const categories:
    StoryCategory[] = [
      "bible",
      "history",
      "business",
      "motivation",
      "documentary",
      "fiction",
    ];

  if (
    typeof value === "string" &&
    categories.includes(
      value as StoryCategory
    )
  ) {
    return value as StoryCategory;
  }

  return "fiction";
}

// ==========================================
// READ STRING
// ==========================================

function readString(
  value: unknown
): string | undefined {
  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return value.trim();
  }

  return undefined;
}

// ==========================================
// READ DURATION
// ==========================================

function readDuration(
  value: unknown
): StoryRequest["duration"] {
  if (
    value === "short" ||
    value === "medium" ||
    value === "long"
  ) {
    return value;
  }

  return undefined;
}

// ==========================================
// WORKFLOW PROMPT
// ==========================================

function buildWorkflowPrompt(
  step: WorkflowStep,
  input: unknown
): string {
  const source =
    input &&
    typeof input === "object"
      ? input as Record<string, unknown>
      : {};

  const userRequest =
    typeof source.userRequest === "string"
      ? source.userRequest
      : "";

  const previousOutputs =
    Array.isArray(
      source.previousOutputs
    )
      ? source.previousOutputs
      : [];

  return `
ADSTRAL WORKFLOW EXECUTION

Workflow Step:
${step.id}

Department:
${step.department}

Agent:
${step.agent ?? "unassigned"}

Responsibility:
${
  typeof step.input === "string"
    ? step.input
    : "Execute the assigned workflow responsibility."
}

USER REQUEST:
${userRequest}

INTENT:
${
  typeof source.intent === "string"
    ? source.intent
    : ""
}

PREVIOUS DEPARTMENT OUTPUTS:
${safeJson(previousOutputs)}

Execute ONLY the responsibility assigned to this workflow step.

Use previous outputs as context when relevant.

Return the strongest useful result for the next workflow stage.
`.trim();
}

// ==========================================
// SAFE JSON
// ==========================================

function safeJson(
  value: unknown
): string {
  try {
    return JSON.stringify(
      value,
      null,
      2
    );
  } catch {
    return String(value);
  }
}

// ==========================================
// STORY TITLE
// ==========================================

function extractStoryTitle(
  prompt: string
): string {
  const cleaned =
    prompt
      .replace(
        /\s+/g,
        " "
      )
      .trim();

  if (!cleaned) {
    return "Untitled Story";
  }

  return cleaned.length > 80
    ? `${cleaned.slice(0, 77)}...`
    : cleaned;
}