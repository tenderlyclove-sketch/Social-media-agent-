// app/api/brain/creative/index.ts

import { CreativeRequest } from "./types";

import { generateBranding } from "./branding";
import { generateLogo } from "./logo";
import { generateFlyer } from "./flyer";
import { generateThumbnail } from "./thumbnail";
import { generateImage } from "./image";
import { generateVideo } from "./video";

export class CreativeDepartment {
  async branding(request: CreativeRequest) {
    return generateBranding(request);
  }

  async logo(request: CreativeRequest) {
    return generateLogo(request);
  }

  async flyer(request: CreativeRequest) {
    return generateFlyer(request);
  }

  async thumbnail(request: CreativeRequest) {
    return generateThumbnail(request);
  }

  async image(request: CreativeRequest) {
    return generateImage(request);
  }

  async video(request: CreativeRequest) {
    return generateVideo(request);
  }
}

export const CreativeStudio = new CreativeDepartment();