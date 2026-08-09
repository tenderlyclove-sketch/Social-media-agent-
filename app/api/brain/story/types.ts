// app/api/brain/story/types.ts

export type StoryCategory =
  | "bible"
  | "history"
  | "business"
  | "motivation"
  | "documentary"
  | "fiction";

export interface StoryRequest {
  title: string;
  category: StoryCategory;
  audience?: string;
  duration?: "short" | "medium" | "long";
  goal?: string;
  language?: string;
  tone?: string;
}

export interface StoryHook {
  opening: string;
  emotion: string;
}

export interface StoryScene {
  scene: number;
  title: string;
  narration: string;
  objective: string;
}

export interface StoryScript {
  title: string;
  hook: StoryHook;
  scenes: StoryScene[];
  ending: string;
  cta?: string;
}

export interface StoryFact {
  source: string;
  reference?: string;
  verified: boolean;
}

export interface StoryAnalysis {
  retentionScore: number;
  emotionalFlow: string[];
  pacing: string;
}

export interface StoryPackage {
  script: StoryScript;
  facts: StoryFact[];
  analysis: StoryAnalysis;
}