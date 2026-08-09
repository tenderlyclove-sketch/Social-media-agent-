// app/api/brain/creative/branding.ts

import {
  CreativeRequest,
  BrandAsset,
  BrandIdentity,
} from "./types";

export async function generateBranding(
  request: CreativeRequest
): Promise<BrandAsset> {

  const style = detectStyle(request.businessType);

  const identity: BrandIdentity = {
    name: request.businessName,
    slogan: request.headline || "",
    colors: colorsForStyle(style),
    fonts: fontsForStyle(style),
    tone: toneForBusiness(request.businessType),
    style,
  };

  return {
    identity,
  };
}

function detectStyle(type: string): BrandIdentity["style"] {

  const t = type.toLowerCase();

  if (t.includes("church")) return "church";

  if (t.includes("restaurant")) return "restaurant";

  if (t.includes("fashion")) return "fashion";

  if (t.includes("tech")) return "tech";

  if (t.includes("law")) return "corporate";

  if (t.includes("bank")) return "corporate";

  if (t.includes("finance")) return "corporate";

  return "modern";
}

function colorsForStyle(style: BrandIdentity["style"]) {

  switch (style) {

    case "church":
      return ["#FFD700", "#000000", "#FFFFFF"];

    case "restaurant":
      return ["#C62828", "#FFF8E1", "#212121"];

    case "fashion":
      return ["#000000", "#FFFFFF", "#C2185B"];

    case "tech":
      return ["#1565C0", "#FFFFFF", "#263238"];

    case "corporate":
      return ["#0D47A1", "#ECEFF1", "#263238"];

    case "luxury":
      return ["#000000", "#D4AF37", "#FFFFFF"];

    default:
      return ["#1976D2", "#FFFFFF", "#263238"];
  }
}

function fontsForStyle(style: BrandIdentity["style"]) {

  switch (style) {

    case "luxury":
      return ["Playfair Display", "Poppins"];

    case "church":
      return ["Cinzel", "Lato"];

    case "fashion":
      return ["Montserrat", "Poppins"];

    default:
      return ["Poppins", "Inter"];
  }
}

function toneForBusiness(type: string) {

  const t = type.toLowerCase();

  if (t.includes("church")) return "Faithful";

  if (t.includes("restaurant")) return "Warm";

  if (t.includes("fashion")) return "Elegant";

  if (t.includes("tech")) return "Innovative";

  return "Professional";
}