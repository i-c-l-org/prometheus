import type { ISkill, ISkillContext, ISkillResult, ISkillPhase, ISkillMetadata } from '@core/interfaces/ISkill.js';
import { ReviewCategory, type CodeReviewConfig, DEFAULT_REVIEW_CONFIG, formatReviewItem, type ReviewItem } from './types.js';

export class CodeReviewSkill implements ISkill {
  readonly name = 'Code Review';
  readonly description = 'Revisão de código com checklist estruturado e scoring por confiança para filtrar falsos positivos';
  
  readonly metadata: ISkillMetadata = {
    version: '1.0.0',
    author: 'Doutor/Prometheus',
    tags: ['review', 'quality', 'security'],
    prerequisites: ['git', 'code-base-knowledge'],
  };

  readonly phases: ISkillPhase[] = [
    {
      name: 'Correção',
      description: 'Verificar se a lógica resolve o problema proposto',
      steps: [
        { id: 'c1', description: 'A lógica resolve o problema proposto?' },
        { id: 'c2', description: 'Edge cases estão tratados?' },
        { id: 'c3', description: 'Inputs inválidos são rejeitados adequadamente?' },
        { id: 'c4', description: 'Retornos são consistentes?' },
      ],
    },
    {
      name: 'Segurança',
      description: 'Verificar vulnerabilidades de segurança',
      steps: [
        { id: 's1', description: 'Sem injection (SQL, command, XSS)?' },
        { id: 's2', description: 'Sem secrets hardcoded?' },
        { id: 's3', description: 'Inputs são sanitizados/validados?' },
        { id: 's4', description: 'Sem uso de eval(), innerHTML?' },
      ],
    },
    {
      name: 'Performance',
      description: 'Verificar eficiência do código',
      steps: [
        { id: 'p1', description: 'Sem loops desnecessários ou complexidade O(n²)?' },
        { id: 'p2', description: 'Sem re-renders desnecessários?' },
        { id: 'p3', description: 'Queries são otimizadas (N+1, índices)?' },
        { id: 'p4', description: 'Sem memory leaks?' },
      ],
    },
    {
      name: 'Manutenibilidade',
      description: 'Verificar manutenibilidade do código',
      steps: [
        { id: 'm1', description: 'Nomes de variáveis/funções são descritivos?' },
        { id: 'm2', description: 'Funções têm responsabilidade única (SRP)?' },
        { id: 'm3', description: 'Sem magic numbers?' },
        { id: 'm4', description: 'Código duplicado foi extraído?' },
      ],
    },
  ];

  private config: CodeReviewConfig;

  constructor(config: Partial<CodeReviewConfig> = {}) {
    this.config = { ...DEFAULT_REVIEW_CONFIG, ...config };
  }

  async execute(context: ISkillContext): Promise<ISkillResult> {
    const { diff, files } = context;
    
    const reviewItems: ReviewItem[] = [];
    
    if (diff) {
      reviewItems.push(...this.analyzeDiff(diff));
    }
    
    if (files?.length) {
      for (const file of files) {
        reviewItems.push(...this.analyzeFile(file));
      }
    }

    const filteredItems = reviewItems.filter(
      item => item.confidence >= (this.config.confidenceThreshold ?? 50)
    );

    const criticalCount = filteredItems.filter(i => i.confidence >= 90).length;
    const importantCount = filteredItems.filter(i => i.confidence >= 70 && i.confidence < 90).length;
    const suggestionCount = filteredItems.filter(i => i.confidence >= 50 && i.confidence < 70).length;

    const output = [
      `# ${this.name}`,
      '',
      `## Resumo`,
      `- 🔴 Críticos: ${criticalCount}`,
      `- 🟡 Importantes: ${importantCount}`,
      `- 🟢 Sugestões: ${suggestionCount}`,
      '',
      `## Itens de Review`,
      '',
      filteredItems.length > 0 
        ? filteredItems.map(formatReviewItem).join('\n\n')
        : 'Nenhum problema encontrado.',
    ].join('\n');

    return {
      success: true,
      output,
      metadata: {
        totalItems: reviewItems.length,
        filteredItems: filteredItems.length,
        categories: ReviewCategory,
      },
    };
  }

  private analyzeDiff(diff: string): ReviewItem[] {
    const items: ReviewItem[] = [];

    if (diff.includes('eval(')) {
      items.push({
        id: 'sec-eval-1',
        category: ReviewCategory.SECURITY,
        title: 'Uso de eval() detectado',
        description: 'eval() é perigoso e pode permitir execução de código arbitrário',
        confidence: 95,
        suggestion: 'Evite eval(), use JSON.parse() ou funções alternativas seguras',
      });
    }

    if (diff.includes('any') && diff.includes(':')) {
      items.push({
        id: 'type-any-1',
        category: ReviewCategory.TYPING,
        title: 'Uso de "any" detectado',
        description: 'O uso de "any" elimina a segurança de tipos',
        confidence: 75,
      });
    }

    return items;
  }

  private analyzeFile(file: string): ReviewItem[] {
    const items: ReviewItem[] = [];

    if (file.includes('password') || file.includes('secret')) {
      items.push({
        id: 'sec-hardcoded-1',
        category: ReviewCategory.SECURITY,
        title: 'Possível secret hardcoded',
        description: 'Evite secrets hardcoded, use variáveis de ambiente',
        file,
        confidence: 85,
      });
    }

    return items;
  }
}
