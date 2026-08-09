// app/api/brain/story/storyboard.ts

import {
  StoryScript,
  StoryScene,
} from "./types";

export interface StoryboardScene {
  scene: number;
  title: string;
  objective: string;
  narration: string;
  visualDirection: string;
  shotType: string;
  cameraMovement: string;
  lighting: string;
  audioDirection: string;
  transition: string;
}

export interface Storyboard {
  title: string;
  scenes: StoryboardScene[];
}

export async function createStoryboard(
  script: StoryScript
): Promise<Storyboard> {

  const scenes = script.scenes.map(
    (scene: StoryScene): StoryboardScene => ({
      scene: scene.scene,
      title: scene.title,
      objective: scene.objective,
      narration: scene.narration,

      visualDirection:
        createVisualDirection(scene),

      shotType:
        chooseShot(scene.scene),

      cameraMovement:
        chooseCameraMovement(scene.scene),

      lighting:
        chooseLighting(scene.scene),

      audioDirection:
        chooseAudio(scene.scene),

      transition:
        chooseTransition(scene.scene),
    })
  );

  return {
    title: script.title,
    scenes,
  };
}

function createVisualDirection(
  scene: StoryScene
): string {

  switch (scene.title) {

    case "Opening Hook":
      return "Visually striking opening image that immediately establishes mystery, emotion, and the central subject.";

    case "Introduction":
      return "Wide establishing environment followed by character and location details.";

    case "Conflict":
      return "Visual tension between characters, environment, or opposing forces.";

    case "Turning Point":
      return "Strong visual reveal emphasizing the moment everything changes.";

    case "Climax":
      return "Maximum cinematic intensity with dramatic composition and emotional focus.";

    case "Resolution":
      return "Calmer visual composition showing the consequences and meaning of the story.";

    default:
      return "Cinematic storytelling visual supporting the narration.";
  }
}

function chooseShot(scene: number): string {

  switch (scene) {
    case 1:
      return "Extreme close-up / dramatic hero shot";

    case 2:
      return "Wide establishing shot";

    case 3:
      return "Medium shot with reaction close-ups";

    case 4:
      return "Dynamic medium-to-close shot";

    case 5:
      return "Wide cinematic shot followed by close-up";

    case 6:
      return "Slow cinematic wide shot";

    default:
      return "Cinematic medium shot";
  }
}

function chooseCameraMovement(scene: number): string {

  switch (scene) {
    case 1:
      return "Slow push-in";

    case 2:
      return "Slow establishing pan";

    case 3:
      return "Subtle handheld movement";

    case 4:
      return "Controlled tracking movement";

    case 5:
      return "Dynamic tracking followed by slow motion";

    case 6:
      return "Slow pull-back";

    default:
      return "Subtle cinematic movement";
  }
}

function chooseLighting(scene: number): string {

  switch (scene) {
    case 1:
      return "High-contrast dramatic lighting";

    case 2:
      return "Natural environmental lighting";

    case 3:
      return "Moody directional lighting";

    case 4:
      return "Dramatic contrast with focused highlights";

    case 5:
      return "Intense cinematic lighting with strong highlights and shadows";

    case 6:
      return "Soft warm closing light";

    default:
      return "Cinematic natural lighting";
  }
}

function chooseAudio(scene: number): string {

  switch (scene) {
    case 1:
      return "Immediate atmospheric sound with subtle cinematic tension.";

    case 2:
      return "Low-volume environmental ambience.";

    case 3:
      return "Rising tension music with subtle sound effects.";

    case 4:
      return "Musical rise with a dramatic impact at the reveal.";

    case 5:
      return "Maximum cinematic score with carefully timed impacts.";

    case 6:
      return "Music resolves into a calm emotional ending.";

    default:
      return "Supportive background ambience.";
  }
}

function chooseTransition(scene: number): string {

  switch (scene) {
    case 1:
      return "Hard cut";

    case 2:
      return "Cinematic dissolve";

    case 3:
      return "Match cut";

    case 4:
      return "Impact cut";

    case 5:
      return "Fast cinematic cut";

    case 6:
      return "Slow fade";

    default:
      return "Clean cinematic transition";
  }
}