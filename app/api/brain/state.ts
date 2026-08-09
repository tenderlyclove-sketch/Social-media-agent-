import { BrainMemory } from "./types";

export function createInitialMemory(): BrainMemory {
  return {
    businessName: undefined,
    businessType: undefined,
    location: undefined,
    targetAudience: undefined,
    goal: undefined,
    budget: undefined,
    platform: undefined,
    lastAgent: undefined,
    conversationHistory: [],
  };
}

export function updateTimestamp(memory: BrainMemory) {
  return memory;
}

export function resetConversation(memory: BrainMemory) {
  memory.conversationHistory = [];
  memory.lastAgent = undefined;

  return updateTimestamp(memory);
}