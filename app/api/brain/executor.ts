// app/api/brain/executor.ts

import { AdstralJob, WorkflowStep } from "./jobTypes";

import {
  completeJob,
  completeStep,
  failJob,
  failStep,
  getNextPendingStep,
  hasFailedStep,
  setCurrentStep,
  startStep,
} from "./jobState";

import { routeWorkflowStep } from "./router";


// ==========================================
// EXECUTOR RESULT
// ==========================================

export interface WorkflowExecutionResult {
  job: AdstralJob;

  completed: boolean;

  failed: boolean;

  output?: unknown;
}


// ==========================================
// EXECUTE WORKFLOW
// ==========================================

export async function executeWorkflow(
  job: AdstralJob
): Promise<WorkflowExecutionResult> {

  let currentJob = job;

  try {

    while (true) {

      // --------------------------------------
      // Check for failed workflow
      // --------------------------------------

      if (hasFailedStep(currentJob)) {

        currentJob =
          failJob(
            currentJob,
            "Workflow stopped because a step failed."
          );

        return {
          job: currentJob,
          completed: false,
          failed: true,
        };
      }


      // --------------------------------------
      // Find next pending step
      // --------------------------------------

      const step =
        getNextPendingStep(
          currentJob
        );


      // --------------------------------------
      // No pending steps = workflow complete
      // --------------------------------------

      if (!step) {

        const finalOutput =
          collectWorkflowOutput(
            currentJob
          );

        currentJob =
          completeJob(
            currentJob,
            finalOutput
          );

        return {
          job: currentJob,
          completed: true,
          failed: false,
          output: finalOutput,
        };
      }


      // --------------------------------------
      // Set current step
      // --------------------------------------

      currentJob =
        setCurrentStep(
          currentJob,
          step.id
        );


      // --------------------------------------
      // Start step
      // --------------------------------------

      currentJob =
        startStep(
          currentJob,
          step.id
        );


      try {

        // ------------------------------------
        // Build step input
        // ------------------------------------

        const stepInput =
          buildStepInput(
            currentJob,
            step
          );


        // ------------------------------------
        // Execute agent
        // ------------------------------------

        const output =
          await executeStep(
            step,
            stepInput
          );


        // ------------------------------------
        // Save output
        // ------------------------------------

        currentJob =
          completeStep(
            currentJob,
            step.id,
            output
          );

      } catch (error) {

        const message =
          error instanceof Error
            ? error.message
            : "Unknown workflow error.";

        currentJob =
          failStep(
            currentJob,
            step.id,
            message
          );

        currentJob =
          failJob(
            currentJob,
            message
          );

        return {
          job: currentJob,
          completed: false,
          failed: true,
        };
      }
    }

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Unknown workflow execution error.";

    currentJob =
      failJob(
        currentJob,
        message
      );

    return {
      job: currentJob,
      completed: false,
      failed: true,
    };
  }
}


// ==========================================
// EXECUTE ONE STEP
// ==========================================

async function executeStep(
  step: WorkflowStep,
  input: unknown
): Promise<unknown> {

  // A workflow step without an agent
  // cannot be executed by the router.

  if (!step.agent) {

    throw new Error(
      `No agent assigned to workflow step: ${step.id}`
    );
  }

  return routeWorkflowStep(
  step,
  input
);
}


// ==========================================
// BUILD AGENT PROMPT
// ==========================================

function buildAgentPrompt(
  step: WorkflowStep,
  input: unknown
): string {

  const context =
    input === undefined
      ? ""
      : `\n\nPrevious workflow context:\n${safeSerialize(input)}`;

  return `
You are executing workflow step "${step.id}".

Department:
${step.department}

Agent:
${step.agent ?? "unassigned"}

Reason:
${typeof step.input === "string"
    ? step.input
    : "Execute the assigned workflow responsibility."}

Complete this step using the workflow context provided below.

${context}
`;
}


// ==========================================
// BUILD STEP INPUT
// ==========================================

function buildStepInput(
  job: AdstralJob,
  step: WorkflowStep
): unknown {

  const previousOutputs =
    job.steps
      .filter(
        (item) =>
          item.status === "completed" &&
          item.id !== step.id
      )
      .map(
        (item) => ({
          stepId: item.id,
          department: item.department,
          agent: item.agent,
          output: item.output,
        })
      );

  return {
    userRequest: job.userRequest,

    intent: job.intent,

    currentStep: {
      id: step.id,
      department: step.department,
      agent: step.agent,
    },

    previousOutputs,
  };
}


// ==========================================
// COLLECT FINAL OUTPUT
// ==========================================

function collectWorkflowOutput(
  job: AdstralJob
): Record<string, unknown> {

  return {
    jobId: job.id,

    steps: job.steps
      .filter(
        (step) =>
          step.status === "completed"
      )
      .map(
        (step) => ({
          id: step.id,

          department:
            step.department,

          agent:
            step.agent,

          output:
            step.output,
        })
      ),
  };
}


// ==========================================
// SAFE SERIALIZATION
// ==========================================

function safeSerialize(
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