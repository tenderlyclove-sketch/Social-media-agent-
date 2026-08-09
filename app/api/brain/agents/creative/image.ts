// app/api/brain/creative/image.ts

import {
  CreativeRequest,
  ImageAsset,
} from "./types";

import { generateBranding } from "./branding";

export async function generateImage(
  request: CreativeRequest
): Promise<ImageAsset> {

  const brand = await generateBranding(request);

  const camera = chooseCamera(request);

  const lighting = chooseLighting(request);

  const composition = chooseComposition(request);

  const colorGrade = chooseColorGrade(brand.identity.style);

  const renderEngine = "Flux / Midjourney / DALL·E";

  return {

    title: `${request.businessName} AI Image`,

    description:
      `Professional cinematic AI image for ${request.businessName}.`,

    prompt: `
Create an ultra realistic commercial image.

Subject:
${request.product || request.businessType}

Business:
${request.businessName}

Audience:
${request.audience || "General"}

Goal:
${request.goal || "Marketing"}

Brand Style:
${brand.identity.style}

Brand Tone:
${brand.identity.tone}

Brand Colors:
${brand.identity.colors.join(", ")}

Camera
${camera}

Lighting
${lighting}

Composition
${composition}

Color Grading
${colorGrade}

Quality
• Ultra realistic
• 8K
• HDR
• Photorealistic
• Cinematic
• Premium
• Professional advertising
• High detail
• Sharp focus
• Soft depth of field
• Luxury materials
• Natural skin tones
• Editorial photography
• Commercial quality

Rendering Engine
${renderEngine}

Negative Prompt

low quality,
blurry,
cropped,
watermark,
text,
logo,
distorted face,
duplicate,
bad anatomy,
oversaturated,
poor lighting

Return ONE finished image.
`.trim(),

  };

}

function chooseCamera(request: CreativeRequest): string {

  const goal = (request.goal || "").toLowerCase();

  if (goal.includes("luxury"))
    return "85mm Portrait Lens";

  if (goal.includes("product"))
    return "50mm Product Lens";

  if (goal.includes("building"))
    return "24mm Wide Lens";

  return "35mm Cinematic Lens";

}

function chooseLighting(request: CreativeRequest): string {

  const goal = (request.goal || "").toLowerCase();

  if (goal.includes("luxury"))
    return "Soft luxury studio lighting";

  if (goal.includes("food"))
    return "Warm restaurant lighting";

  if (goal.includes("church"))
    return "Golden heavenly light";

  return "Natural cinematic lighting";

}

function chooseComposition(request: CreativeRequest): string {

  const type = (request.businessType || "").toLowerCase();

  if (type.includes("restaurant"))
    return "Hero composition with foreground food";

  if (type.includes("fashion"))
    return "Editorial composition";

  if (type.includes("church"))
    return "Centered inspirational composition";

  return "Rule of thirds";

}

function chooseColorGrade(style: string): string {

  switch (style) {

    case "luxury":
      return "Luxury Gold";

    case "tech":
      return "Blue Corporate";

    case "church":
      return "Golden Worship";

    case "fashion":
      return "Editorial Contrast";

    default:
      return "Modern Commercial";

  }

}