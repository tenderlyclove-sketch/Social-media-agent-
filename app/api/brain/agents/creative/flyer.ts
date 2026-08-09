// app/api/brain/creative/flyer.ts

import {
  CreativeRequest,
  FlyerAsset,
} from "./types";

import { generateBranding } from "./branding";

export async function generateFlyer(
  request: CreativeRequest
): Promise<FlyerAsset> {

  const brand = await generateBranding(request);

  const colors = brand.identity.colors.join(", ");

  return {

    title: `${request.businessName} Marketing Flyer`,

    description:
      `Premium ${brand.identity.style} flyer for ${request.businessName}.`,

    layout: `
HEADER
--------
Business Logo
Headline

CENTER
--------
Main Product Image

LEFT
--------
Features

RIGHT
--------
Offer

BOTTOM
--------
CTA
Phone
Address
QR Code
Social Icons
`.trim(),

    prompt: `
Create an ultra premium advertising flyer.

Business Name:
${request.businessName}

Business Type:
${request.businessType}

Target Audience:
${request.audience || "General audience"}

Offer:
${request.offer || "Special Offer"}

Headline:
${request.headline || ""}

Description:
${request.description || ""}

Call To Action:
${request.cta || "Contact us today"}

Brand Style:
${brand.identity.style}

Brand Tone:
${brand.identity.tone}

Brand Colors:
${colors}

Design Requirements

• Agency quality
• Modern
• Premium
• Luxury composition
• Strong visual hierarchy
• Clean typography
• Large headline
• Attractive CTA button
• Professional spacing
• Soft shadows
• Premium lighting
• High resolution
• Print ready
• Social media ready

Aspect Ratio:
4:5

Return ONE finished flyer only.
`.trim(),

  };

}