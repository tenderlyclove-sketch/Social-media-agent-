// app/api/brain/story/hook.ts

import {
  StoryHook,
  StoryRequest,
} from "./types";

export async function createHook(
  request: StoryRequest
): Promise<StoryHook> {

  const emotion = detectEmotion(request);

  return {

    emotion,

    opening: generateOpening(
      request,
      emotion
    ),

  };

}

function detectEmotion(
  request: StoryRequest
): string {

  const text = `
${request.title}
${request.goal}
${request.tone}
`.toLowerCase();

  if (
    text.includes("bible")
  )
    return "Hope";

  if (
    text.includes("history")
  )
    return "Curiosity";

  if (
    text.includes("war")
  )
    return "Fear";

  if (
    text.includes("money")
  )
    return "Greed";

  if (
    text.includes("love")
  )
    return "Love";

  return "Curiosity";

}

function generateOpening(
  request: StoryRequest,
  emotion: string
): string {

  switch (emotion) {

    case "Hope":

      return `
What if everything you've ever believed about this Bible story...
is only HALF the truth?
`.trim();

    case "Fear":

      return `
One wrong decision...
changed history forever.
`.trim();

    case "Greed":

      return `
This secret has made ordinary people rich...
yet almost nobody talks about it.
`.trim();

    case "Love":

      return `
Their love changed everything...
until betrayal destroyed it all.
`.trim();

    default:

      return `
What happened next...
changed everything forever.
`.trim();

  }

}