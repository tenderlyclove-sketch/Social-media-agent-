import { BrainMemory } from "./types";

export function validateMemory(memory: BrainMemory): boolean {
  if (!memory) return false;

  if (!Array.isArray(memory.conversationHistory)) return false;

  return true;
}

export function validateMessage(message: string): boolean {
  if (!message) return false;

  if (message.trim().length === 0) return false;

  return true;
}
