// app/api/brain/creative/video.ts

import {
  CreativeRequest,
  VideoAsset,
} from "./types";

import { generateBranding } from "./branding";

export async function generateVideo(
  request: CreativeRequest
): Promise<VideoAsset> {

  const brand = await generateBranding(request);

  return {

    title: `${request.businessName} Video Production`,

    description:
      `Professional cinematic production blueprint.`,

    scenes: [

      "HOOK",

      "INTRO",

      "PROBLEM",

      "STORY",

      "SOLUTION",

      "CALL TO ACTION",

    ],

    prompt: `
Create a professional cinematic production plan.

Business:
${request.businessName}

Topic:
${request.headline || request.product || request.businessType}

Audience:
${request.audience || "General"}

Goal:
${request.goal || "Marketing"}

Brand Style:
${brand.identity.style}

Brand Tone:
${brand.identity.tone}

Production Rules

• Hollywood cinematic quality

• Scene by scene

• Camera movements

• Drone shots where appropriate

• Establishing shots

• Close ups

• Medium shots

• Slow motion moments

• B-roll suggestions

• Voice-over timing

• Sound effects

• Background music

• Color grading

• Emotional pacing

• High audience retention

• Mobile friendly

• YouTube optimized

Deliver:

1. Storyboard

2. Camera plan

3. Shot list

4. Editing transitions

5. Voice timing

6. Music suggestions

7. Sound effects

8. Visual style

9. AI image prompts

10. AI video prompts

Return ONE production blueprint.
`.trim(),

  };

}