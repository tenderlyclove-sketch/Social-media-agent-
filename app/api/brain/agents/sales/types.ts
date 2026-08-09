export interface SalesContext {
  businessName: string;
  businessType: string;
  location: string;
  targetAudience: string;
  goal: string;
  budget: string;
  platform: string;
  product?: string;
}

export interface SalesTask {
  request: string;
  context: SalesContext;
}

export interface SalesResult {
  success: boolean;
  specialist: string;
  title: string;
  data?: any;
  recommendations?: string[];
  raw?: string;
  error?: string;
}

export interface PricingStrategy {
  recommendedPrice: string;
  pricingModel: string;
  competitorPosition: string;
  reasoning: string;
}

export interface OfferStrategy {
  headline: string;
  offer: string;
  urgency: string;
  callToAction: string;
}

export interface FunnelStrategy {
  awareness: string[];
  interest: string[];
  conversion: string[];
  retention: string[];
}

export interface RetentionStrategy {
  loyaltyProgram: string;
  followUpPlan: string[];
  reviewStrategy: string;
}

export interface UpsellStrategy {
  primaryOffer: string;
  upsells: string[];
  expectedIncrease: string;
}