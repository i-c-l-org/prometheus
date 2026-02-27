export enum FeaturePhase {
  UNDERSTANDING = 'understanding',
  EXPLORATION = 'exploration',
  DESIGN = 'design',
  IMPLEMENTATION = 'implementation',
  TESTING = 'testing',
  REVIEW = 'review',
  DELIVERY = 'delivery',
}

export interface FeatureConfig {
  requireTests: boolean;
  minCoverage: number;
  strictTyping: boolean;
}

export const DEFAULT_FEATURE_CONFIG: FeatureConfig = {
  requireTests: true,
  minCoverage: 80,
  strictTyping: true,
};

export interface FeatureContext {
  ticket?: string;
  description?: string;
  scope?: string[];
  dependencies?: string[];
}
