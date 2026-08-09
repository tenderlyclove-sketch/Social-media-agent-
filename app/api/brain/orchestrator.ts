// app/api/brain/orchestrator.ts

import { createPlan } from "./planner";

import {
  createJob,
  startJob,
} from "./jobState";

import {
  attachWorkflow,
  buildWorkflow,
} from "./workflow";

import {
  executeWorkflow,
} from "./executor";

import {
  buildError,
  buildResponse,
} from "./responseBuilder";


// ==========================================
// ADSTRAL ORCHESTRATOR
// ==========================================

export async function orchestrate(
  userMessage: string
) {

  try {

    // ========================================
    // STEP 1 — UNDERSTAND / PLAN
    // ========================================

    const plan =
      await createPlan(
        userMessage
      );


    // ========================================
    // STEP 2 — CREATE JOB
    // ========================================

    let job =
      createJob(
        userMessage,
        plan.intent
      );


    // ========================================
    // STEP 3 — BUILD WORKFLOW
    // ========================================

    let workflow =
      buildWorkflow(
        plan
      );


    // ========================================
    // STEP 3B — GUARANTEE EXECUTABLE WORKFLOW
    // ========================================

    if (workflow.steps.length === 0) {

      workflow = {
        steps: [
          {
            id: "primary",

            department:
              getDepartmentForAgent(
                plan.agent
              ),

            agent:
              plan.agent,

            reason:
              "Execute the primary user request.",

            metadata:
              plan.metadata
                ? {
                    ...plan.metadata,
                  }
                : undefined,
          },
        ],
      };
    }


    // ========================================
    // STEP 4 — ATTACH WORKFLOW TO JOB
    // ========================================

    job =
      attachWorkflow(
        job,
        workflow
      );


    // ========================================
    // STEP 5 — START JOB
    // ========================================

    job =
      startJob(
        job
      );


    // ========================================
    // STEP 6 — EXECUTE WORKFLOW
    // ========================================

    const execution =
      await executeWorkflow(
        job
      );


    // ========================================
    // STEP 7 — HANDLE FAILURE
    // ========================================

    if (execution.failed) {

      return buildError(
        getExecutionError(
          execution.job
        )
      );

    }


    // ========================================
    // STEP 8 — BUILD FINAL RESPONSE
    // ========================================

    const output =
      execution.output;

    const reply =
      extractReply(
        output
      );


    return buildResponse(
      reply,
      {
        job: execution.job,

        output,

        plan,
      }
    );

  } catch (error) {

    console.error(
      "[Adstral Orchestrator Error]",
      error
    );

    return buildError(
      error instanceof Error
        ? error.message
        : "Adstral encountered an unexpected error."
    );
  }
}


// ==========================================
// MAP AGENT → DEPARTMENT
// ==========================================

function getDepartmentForAgent(
  agent: string
): "brain" | "story" | "creative" | "sales" | "platform" {

  switch (agent) {

    case "story":
      return "story";

    case "branding":
    case "flyer":
    case "image":
    case "video":
      return "creative";

    case "sales":
      return "sales";

    case "facebook":
    case "whatsapp":
    case "calendar":
    case "ads":
      return "platform";

    default:
      return "brain";
  }
}


// ==========================================
// EXTRACT REPLY
// ==========================================

function extractReply(
  output: unknown
): string {

  if (
    output &&
    typeof output === "object" &&
    "reply" in output &&
    typeof output.reply === "string"
  ) {

    return output.reply;
  }


  if (
    output &&
    typeof output === "object" &&
    "message" in output &&
    typeof output.message === "string"
  ) {

    return output.message;
  }


  return "Your Adstral workflow has been completed successfully.";
}


// ==========================================
// EXTRACT EXECUTION ERROR
// ==========================================

function getExecutionError(
  job: {
    error?: string;
  }
): string {

  return (
    job.error ??
    "Adstral workflow execution failed."
  );
}