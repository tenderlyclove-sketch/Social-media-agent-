// app/api/brain/types.ts

import type {
  AgentName,
  PlannedWorkflowStep,
} from "./jobTypes";

export { AgentName, PlannedWorkflowStep };

// ==========================================
// BRAIN MEMORY
// ==========================================

export interface BrainMemory {
  businessName?: string;
  businessType?: string;
  location?: string;
  targetAudience?: string;
  goal?: string;
  budget?: string;
  platform?: string;

  lastAgent?: AgentName;

  conversationHistory: {
    role: "user" | "assistant";
    content: string;
  }[];
}


// ==========================================
// WORKFLOW PLAN
// ==========================================




// ==========================================
// TASK PLAN
// ==========================================

export interface TaskPlan {
  intent: string;

  confidence: number;

  agent: AgentName;

  prompt: string;

  workflow?: PlannedWorkflowStep[];

  metadata?: {
    title?: string;
    category?: string;
    audience?: string;
    goal?: string;
    duration?: "short" | "medium" | "long";
    language?: string;
    tone?: string;
  };
}
// ==========================================
// AGENT INPUT
// ==========================================

export interface AgentInput {
  message: string;
  memory: BrainMemory;
  context?: Record<string, unknown>;
}

// ==========================================
// AGENT RESULT
// ==========================================

export interface AgentResult {
  success: boolean;
  tool: AgentName | string;
  data?: unknown;
  error?: string;
  raw?: string;
}
