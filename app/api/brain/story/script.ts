// app/api/brain/story/script.ts

import {
  StoryHook,
  StoryRequest,
  StoryScene,
  StoryScript,
} from "./types";

export async function createScript(
  request: StoryRequest,
  hook: StoryHook
): Promise<StoryScript> {

  const scenes: StoryScene[] = [

    {
      scene: 1,
      title: "Opening Hook",
      narration: hook.opening,
      objective: "Grab attention immediately",
    },

    {
      scene: 2,
      title: "Introduction",
      narration: `Introduce ${request.title} clearly and establish the setting.`,
      objective: "Build context",
    },

    {
      scene: 3,
      title: "Conflict",
      narration: "Present the central challenge, tension, or problem.",
      objective: "Increase curiosity",
    },

    {
      scene: 4,
      title: "Turning Point",
      narration: "Reveal the major event that changes everything.",
      objective: "Maintain retention",
    },

    {
      scene: 5,
      title: "Climax",
      narration: "Deliver the emotional peak of the story.",
      objective: "Maximum emotional impact",
    },

    {
      scene: 6,
      title: "Resolution",
      narration: "Conclude the story with its lesson and outcome.",
      objective: "Provide satisfaction",
    }

  ];

  return {

    title: request.title,

    hook,

    scenes,

    ending:
      "Summarize the lesson and encourage reflection.",

    cta:
      "If this story inspired you, like, subscribe, and share.",

  };

}