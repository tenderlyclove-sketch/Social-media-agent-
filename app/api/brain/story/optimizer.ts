// app/api/brain/story/optimizer.ts

import {
  StoryAnalysis,
  StoryFact,
  StoryScript,
} from "./types";

import type { Storyboard } from "./storyboard";

export interface StoryProductionInput {
  script: StoryScript;
  storyboard: Storyboard;
  facts: StoryFact[];
  retention: StoryAnalysis;
}

export interface OptimizedStory {
  script: StoryScript;
  storyboard: Storyboard;
  facts: StoryFact[];
  analysis: StoryAnalysis;
  recommendations: string[];
}

export function optimizeStory(
  input: StoryProductionInput
): OptimizedStory {

  const recommendations: string[] = [];

  if (input.script.scenes.length < 6) {
    recommendations.push(
      "Consider adding more narrative beats for stronger audience retention."
    );
  }

  if (input.retention.retentionScore < 90) {
    recommendations.push(
      "Strengthen the opening hook and add stronger tension before the climax."
    );
  }

  const unverifiedFacts =
    input.facts.filter(
      (fact) => !fact.verified
    );

  if (unverifiedFacts.length > 0) {
    recommendations.push(
      "Verify factual claims against authoritative sources before publication."
    );
  }

  if (!input.script.cta) {
    recommendations.push(
      "Add a platform-appropriate call to action."
    );
  }

  return {
    script: input.script,

    storyboard: input.storyboard,

    facts: input.facts,

    analysis: {
      ...input.retention,
      pacing: improvePacing(
        input.retention.pacing
      ),
    },

    recommendations,
  };
}

function improvePacing(
  pacing: string
): string {

  if (pacing === "Fast Pace") {
    return "Fast opening → escalating tension → emotional climax → concise resolution";
  }

  if (pacing === "Slow Build → Fast Climax") {
    return "Slow atmospheric opening → progressive tension → rapid climax → emotional resolution";
  }

  return "Strong hook → context → rising conflict → turning point → climax → satisfying resolution";
}