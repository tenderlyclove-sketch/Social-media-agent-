// app/api/brain/jobState.ts

import {
  AdstralJob,
  DepartmentName,
  DepartmentStatus,
  WorkflowStep,
} from "./jobTypes";


// ==========================================
// ID GENERATOR
// ==========================================

function createId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}


// ==========================================
// CREATE JOB
// ==========================================

export function createJob(
  userRequest: string,
  intent: string
): AdstralJob {

  const now = new Date();

  return {
    id: createId("job"),

    userRequest,

    intent,

    status: "queued",

    steps: [],

    createdAt: now,

    updatedAt: now,
  };
}


// ==========================================
// ADD WORKFLOW STEP
// ==========================================

export function addWorkflowStep(
  job: AdstralJob,
  department: DepartmentName,
  agent?: WorkflowStep["agent"],
  input?: unknown,
  metadata?: Record<string, unknown>
): AdstralJob {

  const step: WorkflowStep = {
  id: createId("step"),

  department,

  agent,

  status: "pending",

  input,

  metadata,
};

  return {
    ...job,

    steps: [
      ...job.steps,
      step,
    ],

    updatedAt: new Date(),
  };
}


// ==========================================
// START JOB
// ==========================================

export function startJob(
  job: AdstralJob
): AdstralJob {

  const now = new Date();

  return {
    ...job,

    status: "running",

    updatedAt: now,
  };
}


// ==========================================
// START STEP
// ==========================================

export function startStep(
  job: AdstralJob,
  stepId: string
): AdstralJob {

  const now = new Date();

  return updateStep(
    job,
    stepId,
    {
      status: "running",
      startedAt: now,
    }
  );
}


// ==========================================
// COMPLETE STEP
// ==========================================

export function completeStep(
  job: AdstralJob,
  stepId: string,
  output: unknown
): AdstralJob {

  const now = new Date();

  return updateStep(
    job,
    stepId,
    {
      status: "completed",
      output,
      completedAt: now,
    }
  );
}


// ==========================================
// FAIL STEP
// ==========================================

export function failStep(
  job: AdstralJob,
  stepId: string,
  error: string
): AdstralJob {

  const now = new Date();

  return updateStep(
    job,
    stepId,
    {
      status: "failed",
      error,
      completedAt: now,
    }
  );
}


// ==========================================
// SKIP STEP
// ==========================================

export function skipStep(
  job: AdstralJob,
  stepId: string
): AdstralJob {

  return updateStep(
    job,
    stepId,
    {
      status: "skipped",
      completedAt: new Date(),
    }
  );
}


// ==========================================
// SET CURRENT STEP
// ==========================================

export function setCurrentStep(
  job: AdstralJob,
  stepId: string
): AdstralJob {

  const exists = job.steps.some(
    (step) => step.id === stepId
  );

  if (!exists) {
    throw new Error(
      `Workflow step not found: ${stepId}`
    );
  }

  return {
    ...job,

    currentStepId: stepId,

    updatedAt: new Date(),
  };
}


// ==========================================
// COMPLETE JOB
// ==========================================

export function completeJob(
  job: AdstralJob,
  result: unknown
): AdstralJob {

  const now = new Date();

  return {
    ...job,

    status: "completed",

    result,

    completedAt: now,

    updatedAt: now,

    currentStepId: undefined,
  };
}


// ==========================================
// FAIL JOB
// ==========================================

export function failJob(
  job: AdstralJob,
  error: string
): AdstralJob {

  return {
    ...job,

    status: "failed",

    error,

    updatedAt: new Date(),
  };
}


// ==========================================
// CANCEL JOB
// ==========================================

export function cancelJob(
  job: AdstralJob
): AdstralJob {

  return {
    ...job,

    status: "cancelled",

    updatedAt: new Date(),
  };
}


// ==========================================
// UPDATE STEP
// ==========================================

function updateStep(
  job: AdstralJob,
  stepId: string,
  changes: Partial<WorkflowStep>
): AdstralJob {

  const stepExists = job.steps.some(
    (step) => step.id === stepId
  );

  if (!stepExists) {
    throw new Error(
      `Workflow step not found: ${stepId}`
    );
  }

  return {
    ...job,

    steps: job.steps.map((step) =>
      step.id === stepId
        ? {
            ...step,
            ...changes,
          }
        : step
    ),

    updatedAt: new Date(),
  };
}


// ==========================================
// FIND STEP
// ==========================================

export function getStep(
  job: AdstralJob,
  stepId: string
): WorkflowStep | undefined {

  return job.steps.find(
    (step) => step.id === stepId
  );
}


// ==========================================
// FIND NEXT PENDING STEP
// ==========================================

export function getNextPendingStep(
  job: AdstralJob
): WorkflowStep | undefined {

  return job.steps.find(
    (step) => step.status === "pending"
  );
}


// ==========================================
// CHECK JOB COMPLETION
// ==========================================

export function areAllStepsComplete(
  job: AdstralJob
): boolean {

  if (job.steps.length === 0) {
    return false;
  }

  return job.steps.every(
    (step) =>
      step.status === "completed" ||
      step.status === "skipped"
  );
}


// ==========================================
// CHECK FOR FAILED STEPS
// ==========================================

export function hasFailedStep(
  job: AdstralJob
): boolean {

  return job.steps.some(
    (step) => step.status === "failed"
  );
}


// ==========================================
// GET JOB PROGRESS
// ==========================================

export function getJobProgress(
  job: AdstralJob
): number {

  if (job.steps.length === 0) {
    return 0;
  }

  const finishedSteps =
    job.steps.filter(
      (step) =>
        step.status === "completed" ||
        step.status === "skipped"
    ).length;

  return Math.round(
    (finishedSteps / job.steps.length) * 100
  );
}


// ==========================================
// GET STEP STATUS
// ==========================================

export function getStepStatus(
  job: AdstralJob,
  stepId: string
): DepartmentStatus | undefined {

  return getStep(
    job,
    stepId
  )?.status;
}