import { AgentInput, AgentResult } from "../types";

export async function videoAgent(
  input: AgentInput
): Promise<AgentResult> {
  return {
    success: true,
    tool: "video",
    data: {
      message: "Video agent is ready.",
      request: input.message,
    },
  };
}