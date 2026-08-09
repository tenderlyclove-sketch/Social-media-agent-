// app/api/brain/jobTypes.ts

// ==========================================
// AGENT NAMES
// ==========================================

export type AgentName =
  | "facebook"
  | "flyer"
  | "ads"
  | "calendar"
  | "sales"
  | "branding"
  | "whatsapp"
  | "image"
  | "video"
  | "story";


// ==========================================
// JOB STATUS
// ==========================================

export type JobStatus =
  | "queued"
  | "planning"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";


// ==========================================
// DEPARTMENT STATUS
// ==========================================

export type DepartmentStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "skipped";


// ==========================================
// DEPARTMENT NAMES
// ==========================================

export type DepartmentName =
  | "brain"
  | "story"
  | "creative"
  | "sales"
  | "platform";


// ==========================================
// PLANNED WORKFLOW STEP
// ==========================================

export interface PlannedWorkflowStep {

  id: string;

  department: DepartmentName;

  agent?: AgentName;

  reason?: string;

  metadata?: Record<string, unknown>;
}


// ==========================================
// WORKFLOW STEP
// ==========================================

export interface WorkflowStep {

  id: string;

  department: DepartmentName;

  agent?: AgentName;

  status: DepartmentStatus;

  input?: unknown;

  output?: unknown;

  error?: string;

  startedAt?: Date;

  completedAt?: Date;

  metadata?: Record<string, unknown>;
}


// ==========================================
// JOB
// ==========================================

export interface AdstralJob {

  id: string;

  userRequest: string;

  intent: string;

  status: JobStatus;

  steps: WorkflowStep[];

  currentStepId?: string;

  result?: unknown;

  error?: string;

  createdAt: Date;

  updatedAt: Date;

  completedAt?: Date;
}