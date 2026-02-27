import { ConfidenceLevel, getConfidenceLevel, getConfidenceEmoji } from '@shared/types/ConfidenceLevel.js';

export enum ReviewCategory {
  CORRECTNESS = 'correctness',
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  MAINTAINABILITY = 'maintainability',
  TYPING = 'typing',
  TESTING = 'testing',
}

export interface ReviewItem {
  id: string;
  category: ReviewCategory;
  title: string;
  description: string;
  file?: string;
  line?: number;
  confidence: number;
  suggestion?: string;
}

export interface CodeReviewConfig {
  checkSecurity: boolean;
  checkPerformance: boolean;
  checkTyping: boolean;
  confidenceThreshold?: number;
}

export const DEFAULT_REVIEW_CONFIG: CodeReviewConfig = {
  checkSecurity: true,
  checkPerformance: true,
  checkTyping: true,
  confidenceThreshold: 50,
};

export function formatReviewItem(item: ReviewItem): string {
  const level = getConfidenceLevel(item.confidence);
  const emoji = getConfidenceEmoji(level);
  
  return `
### [${emoji}] ${item.title}

**Arquivo:** ${item.file ?? 'N/A'}${item.line ? `:${item.line}` : ''}
**Categoria:** ${item.category}
**Confiança:** ${item.confidence}%

**Problema:** ${item.description}
${item.suggestion ? `\n**Sugestão:**\n\`\`\`typescript\n${item.suggestion}\n\`\`\`` : ''}
  `.trim();
}
