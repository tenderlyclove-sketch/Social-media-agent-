// app/api/brain/story/retention.ts

import {
  StoryAnalysis,
  StoryScript,
} from "./types";

export async function createRetentionPlan(
  script: StoryScript
): Promise<StoryAnalysis> {

  return {

    retentionScore: calculateRetention(script),

    emotionalFlow: [
      "Curiosity",
      "Suspense",
      "Discovery",
      "Conflict",
      "Emotion",
      "Relief",
      "Call To Action",
    ],

    pacing: recommendPacing(script),

  };

}

function calculateRetention(
  script: StoryScript
): number {

  const scenes = script.scenes.length;

  if (scenes >= 8) return 98;

  if (scenes >= 6) return 95;

  if (scenes >= 4) return 90;

  return 80;

}

function recommendPacing(
  script: StoryScript
): string {

  if (script.scenes.length > 8)
    return "Slow Build → Fast Climax";

  if (script.scenes.length > 5)
    return "Balanced";

  return "Fast Pace";

}