// app/api/brain/workflow.ts

import {
  AdstralJob,
  DepartmentName,
  PlannedWorkflowStep,
} from "./jobTypes";

import {
  addWorkflowStep,
  getJobProgress,
} from "./jobState";


// ==========================================
// WORKFLOW DEFINITION
// ==========================================

export interface WorkflowDefinition {
  steps: PlannedWorkflowStep[];
}


// ==========================================
// BUILD WORKFLOW
// ==========================================

export function buildWorkflow(
  plan: {
    workflow?: PlannedWorkflowStep[];

    metadata?: Record<string, unknown>;
  }
): WorkflowDefinition {

  const steps =
    Array.isArray(plan.workflow)
      ? plan.workflow
      : [];

  const normalized =
    normalizeWorkflow(steps);

  // ----------------------------------------
  // Pass planner-level metadata into Story
  // steps that don't already define it.
  // ----------------------------------------

  const enriched =
    normalized.map((step) => {

      if (
        step.department !== "story" &&
        step.agent !== "story"
      ) {
        return step;
      }

      if (step.metadata) {
        return step;
      }

      if (!plan.metadata) {
        return step;
      }

      return {
        ...step,

        metadata: {
          ...plan.metadata,
        },
      };
    });

  return {
    steps: enriched,
  };
}


// ==========================================
// ATTACH WORKFLOW TO JOB
// ==========================================

export function attachWorkflow(
  job: AdstralJob,
  workflow: WorkflowDefinition
): AdstralJob {

  let updatedJob = job;

  for (const step of workflow.steps) {

    updatedJob =
  addWorkflowStep(
    updatedJob,
    step.department,
    step.agent,
    step.reason,
    step.metadata
  );
  }

  return updatedJob;
}


// ==========================================
// NORMALIZE WORKFLOW
// ==========================================

function normalizeWorkflow(
  steps: PlannedWorkflowStep[]
): PlannedWorkflowStep[] {

  const seen = new Set<string>();

  const validDepartments: DepartmentName[] = [
    "brain",
    "story",
    "creative",
    "sales",
    "platform",
  ];

  return steps.filter(
    (step) => {

      if (!step) {
        return false;
      }

      if (
        !validDepartments.includes(
          step.department
        )
      ) {
        return false;
      }

      if (seen.has(step.id)) {
        return false;
      }

      seen.add(step.id);

      return true;
    }
  );
}


// ==========================================
// WORKFLOW STATUS
// ==========================================

export function getWorkflowStatus(
  job: AdstralJob
) {

  return {
    jobId: job.id,

    status: job.status,

    progress:
      getJobProgress(job),

    currentStep:
      job.currentStepId,

    steps:
      job.steps.map(
        (step) => ({
          id: step.id,

          department:
            step.department,

          agent:
            step.agent,

          status:
            step.status,

          error:
            step.error,
        })
      ),
  };
}