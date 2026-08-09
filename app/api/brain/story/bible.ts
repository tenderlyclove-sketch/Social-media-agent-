// app/api/brain/story/bible.ts

import {
  StoryRequest,
  StoryPackage,
} from "./types";

import { createHook } from "./hook";
import { createScript } from "./script";
import { createStoryboard } from "./storyboard";
import { verifyFacts } from "./factChecker";
import { createRetentionPlan } from "./retention";
import { optimizeStory } from "./optimizer";

export async function createBibleStory(
  request: StoryRequest
): Promise<StoryPackage> {

  const hook = await createHook({
    ...request,
    tone: "Biblical",
  });

  const script = await createScript(
    {
      ...request,
      tone: "Biblical",
    },
    hook
  );

  const storyboard =
    await createStoryboard(script);

  const facts =
    await verifyFacts(script);

  const retention =
    await createRetentionPlan(script);

  return optimizeStory({
    script,
    storyboard,
    facts,
    retention,
  });

}