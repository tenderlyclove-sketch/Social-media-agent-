// app/api/brain/creative/logo.ts

import {
  CreativeRequest,
  LogoAsset,
} from "./types";

import { generateBranding } from "./branding";

export async function generateLogo(
  request: CreativeRequest
): Promise<LogoAsset> {

  const brand = await generateBranding(request);

  const colors = brand.identity.colors.join(", ");

  return {
    title: `${request.businessName} Logo Concept`,

    description:
      `Professional ${brand.identity.style} logo for ${request.businessName}.`,

    icon: suggestIcon(request.businessType),

    prompt: `
Design a premium logo for "${request.businessName}".

Business:
${request.businessType}

Style:
${brand.identity.style}

Primary Colors:
${colors}

Tone:
${brand.identity.tone}

Requirements:
• Flat vector
• Premium
• Clean
• Timeless
• Professional
• High contrast
• Minimal
• White background
• Suitable for restaurant menus, social media, packaging and signboards.

Do NOT include mockups.

Return only the logo.
`.trim(),
  };
}

function suggestIcon(type: string): string {

  const t = type.toLowerCase();

  if (t.includes("restaurant")) return "chef hat";

  if (t.includes("church")) return "cross";

  if (t.includes("fashion")) return "hanger";

  if (t.includes("tech")) return "chip";

  if (t.includes("hotel")) return "building";

  if (t.includes("bakery")) return "bread";

  if (t.includes("pharmacy")) return "medical cross";

  return "abstract geometric symbol";
}