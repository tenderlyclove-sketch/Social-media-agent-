// app/api/brain/creative/types.ts

export type BrandStyle =
  | "modern"
  | "luxury"
  | "minimal"
  | "corporate"
  | "playful"
  | "restaurant"
  | "church"
  | "tech"
  | "fashion";

export interface BrandIdentity {
  name: string;
  slogan?: string;
  colors: string[];
  fonts: string[];
  tone: string;
  style: BrandStyle;
}

export interface CreativeRequest {
  businessName: string;
  businessType: string;
  platform?: string;
  goal?: string;
  audience?: string;
  location?: string;
  product?: string;
  offer?: string;
  headline?: string;
  description?: string;
  cta?: string;
  imageStyle?: string;
  colors?: string[];
}

export interface CreativeAsset {
  title: string;
  description: string;
  prompt: string;
}

export interface FlyerAsset extends CreativeAsset {
  layout: string;
}

export interface ThumbnailAsset extends CreativeAsset {
  emotion: string;
}

export interface LogoAsset extends CreativeAsset {
  icon: string;
}

export interface ImageAsset extends CreativeAsset {}

export interface VideoAsset extends CreativeAsset {
  scenes: string[];
}

export interface BrandAsset {
  identity: BrandIdentity;
}