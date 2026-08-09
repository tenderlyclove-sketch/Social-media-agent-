import { AgentInput, AgentResult } from "../types";

export async function imageAgent(
  input: AgentInput
): Promise<AgentResult> {
  return {
    success: true,
    tool: "image",
    data: {
      message: "Image agent is ready.",
      request: input.message,
    },
  };
}