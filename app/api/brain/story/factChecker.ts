// app/api/brain/story/factChecker.ts

import {
  StoryFact,
  StoryScript,
} from "./types";

export async function verifyFacts(
  script: StoryScript
): Promise<StoryFact[]> {

  const facts: StoryFact[] = [];

  facts.push({
    source: "Story input",
    reference: script.title,
    verified: false,
  });

  for (const scene of script.scenes) {
    facts.push({
      source: "Generated scene",
      reference: `Scene ${scene.scene}: ${scene.title}`,
      verified: false,
    });
  }

  return facts;
}