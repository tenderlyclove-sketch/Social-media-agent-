import { BrainMemory } from "./types";

export const memory: BrainMemory = {
  conversationHistory: [],
};

export function remember(
  role: "user" | "assistant",
  content: string
) {
  memory.conversationHistory.push({
    role,
    content,
  });
}

export function updateMemory(
  data: Partial<BrainMemory>
) {
  Object.assign(memory, data);
}

export function getMemory(): BrainMemory {
  return memory;
}

export function resetMemory() {
  Object.keys(memory).forEach((key) => {
    delete (memory as any)[key];
  });

  memory.conversationHistory = [];
}