// app/api/brain/story/index.ts

import { StoryRequest } from "./types";

import { createBibleStory } from "./bible";
import { createHistoryStory } from "./history";
import { createHook } from "./hook";
import { createRetentionPlan } from "./retention";
import { createScript } from "./script";
import { createStoryboard } from "./storyboard";
import { verifyFacts } from "./factChecker";
import { optimizeStory } from "./optimizer";

export class StoryDepartment {

  async create(request: StoryRequest) {

    // Specialized departments handle
    // their own domain-specific preparation.
    if (request.category === "bible") {
      return createBibleStory(request);
    }

    if (request.category === "history") {
      return createHistoryStory(request);
    }

    // Universal story pipeline.
    const hook = await createHook(request);

    const script = await createScript(
      request,
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
}

export const StoryStudio =
  new StoryDepartment();