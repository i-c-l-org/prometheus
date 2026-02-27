export enum ConfidenceLevel {
  CRITICAL = 'CRITICAL',
  IMPORTANT = 'IMPORTANT',
  SUGGESTION = 'SUGGESTION',
  NIT = 'NIT',
}

export const ConfidenceThresholds = {
  [ConfidenceLevel.CRITICAL]: { min: 90, max: 100 },
  [ConfidenceLevel.IMPORTANT]: { min: 70, max: 89 },
  [ConfidenceLevel.SUGGESTION]: { min: 50, max: 69 },
  [ConfidenceLevel.NIT]: { min: 0, max: 49 },
} as const;

export function getConfidenceLevel(confidence: number): ConfidenceLevel {
  if (confidence >= 90) return ConfidenceLevel.CRITICAL;
  if (confidence >= 70) return ConfidenceLevel.IMPORTANT;
  if (confidence >= 50) return ConfidenceLevel.SUGGESTION;
  return ConfidenceLevel.NIT;
}

export function getConfidenceEmoji(level: ConfidenceLevel): string {
  return {
    [ConfidenceLevel.CRITICAL]: '🔴',
    [ConfidenceLevel.IMPORTANT]: '🟡',
    [ConfidenceLevel.SUGGESTION]: '🟢',
    [ConfidenceLevel.NIT]: '⚪',
  }[level];
}
