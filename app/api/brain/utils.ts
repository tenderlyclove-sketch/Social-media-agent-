import { BrainConfig } from "./config";

export function cleanText(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/\n+/g, "\n")
    .trim();
}

export function safeJsonParse<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export function limitHistory<T>(history: T[]): T[] {
  if (history.length <= BrainConfig.MEMORY_LIMIT) {
    return history;
  }

  return history.slice(-BrainConfig.MEMORY_LIMIT);
}

export function isEmpty(value: unknown): boolean {
  return (
    value === undefined ||
    value === null ||
    value === ""
  );
}

export function timestamp(): string {
  return new Date().toISOString();
}

/**
 * Shared LLM gateway for all Brain agents.
 * Uses OpenRouter so every agent can share the same model/configuration.
 */
export async function callLLM(
  prompt: string,
  options?: {
    temperature?: number;
    maxTokens?: number;
    system?: string;
  }
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("Missing OPENROUTER_API_KEY");
  }

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: BrainConfig.MODEL,
        temperature:
          options?.temperature ??
          BrainConfig.TEMPERATURE,
        max_tokens:
          options?.maxTokens ??
          BrainConfig.MAX_TOKENS,
        messages: [
          {
            role: "system",
            content:
              options?.system ??
              "You are Adstral's AI brain. Follow the user's instructions exactly. Return valid JSON when requested.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `OpenRouter request failed (${response.status}): ${errorText}`
    );
  }

  const result = await response.json();

  const content =
    result?.choices?.[0]?.message?.content;

  if (typeof content !== "string") {
    throw new Error(
      "OpenRouter returned no usable message content."
    );
  }

  return content
    .replace(/^```json/i, "")
    .replace(/^```/i, "")
    .replace(/```$/i, "")
    .trim();
}
