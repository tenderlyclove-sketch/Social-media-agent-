// app/api/brain/creative/thumbnail.ts

import {
  CreativeRequest,
  ThumbnailAsset,
} from "./types";

import { generateBranding } from "./branding";

export async function generateThumbnail(
  request: CreativeRequest
): Promise<ThumbnailAsset> {

  const brand = await generateBranding(request);

  const emotion = detectEmotion(request);

  return {

    title: `${request.businessName} Thumbnail`,

    description:
      `High CTR YouTube thumbnail optimized for ${emotion}.`,

    emotion,

    prompt: `
Create a HIGH CTR YouTube Thumbnail.

Brand:
${request.businessName}

Business:
${request.businessType}

Audience:
${request.audience || "General"}

Goal:
${request.goal || "Maximum Click Through Rate"}

Brand Style:
${brand.identity.style}

Brand Tone:
${brand.identity.tone}

Primary Colors:
${brand.identity.colors.join(", ")}

Thumbnail Psychology

• Huge emotional impact
• Large expressive face
• Strong eye contact
• One clear subject
• Extremely high contrast
• Premium lighting
• Cinematic composition
• Bold colors
• Clean background
• Mobile friendly
• Large readable text
• Curiosity gap
• Professional shadows
• Luxury composition
• Viral YouTube quality
• No clutter

Emotion:
${emotion}

Text:
"${request.headline || ""}"

Aspect Ratio:
16:9

Return ONE finished thumbnail.
`.trim(),

  };

}

function detectEmotion(
  request: CreativeRequest
): string {

  const text = `
${request.goal}
${request.headline}
${request.description}
`.toLowerCase();

  if (
    text.includes("danger") ||
    text.includes("warning")
  )
    return "Fear";

  if (
    text.includes("secret") ||
    text.includes("hidden")
  )
    return "Curiosity";

  if (
    text.includes("money") ||
    text.includes("income")
  )
    return "Greed";

  if (
    text.includes("jesus") ||
    text.includes("miracle")
  )
    return "Hope";

  if (
    text.includes("success") ||
    text.includes("win")
  )
    return "Excitement";

  if (
    text.includes("love")
  )
    return "Love";

  return "Curiosity";
}