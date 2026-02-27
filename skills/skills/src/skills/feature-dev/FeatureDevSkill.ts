import type { ISkill, ISkillContext, ISkillResult, ISkillPhase, ISkillMetadata } from '@core/interfaces/ISkill.js';
import { FeaturePhase, type FeatureConfig, DEFAULT_FEATURE_CONFIG } from './types.js';

export class FeatureDevSkill implements ISkill {
  readonly name = 'Feature Development';
  readonly description = 'Workflow estruturado em 7 fases para desenvolvimento de features, do entendimento à entrega';
  
  readonly metadata: ISkillMetadata = {
    version: '1.0.0',
    author: 'Doutor/Prometheus',
    tags: ['development', 'workflow', 'feature'],
    prerequisites: ['git', 'node', 'testing-framework'],
  };

  readonly phases: ISkillPhase[] = [
    {
      name: 'Fase 1 — Entendimento',
      description: 'Entendimento completo do requisito antes de escrever código',
      steps: [
        { id: 'u1', description: 'Ler o requisito/issue completo' },
        { id: 'u2', description: 'Listar as perguntas que surgirem' },
        { id: 'u3', description: 'Definir o escopo mínimo (MVP da feature)' },
        { id: 'u4', description: 'Identificar dependências (APIs, libs, dados)' },
      ],
    },
    {
      name: 'Fase 2 — Exploração do Codebase',
      description: 'Mapear onde a feature se encaixa na arquitetura',
      steps: [
        { id: 'e1', description: 'Identificar onde a feature se encaixa na arquitetura' },
        { id: 'e2', description: 'Mapear arquivos que serão modificados' },
        { id: 'e3', description: 'Verificar padrões existentes' },
        { id: 'e4', description: 'Checar se há utils/helpers reutilizáveis' },
      ],
    },
    {
      name: 'Fase 3 — Design',
      description: 'Definir interface pública e fluxo de dados',
      steps: [
        { id: 'd1', description: 'Definir a interface pública (API, props, params)' },
        { id: 'd2', description: 'Definir o fluxo de dados' },
        { id: 'd3', description: 'Identificar edge cases' },
        { id: 'd4', description: 'Documentar decisões de design' },
      ],
    },
    {
      name: 'Fase 4 — Implementação',
      description: 'Escrever o código da feature',
      steps: [
        { id: 'i1', description: 'Criar branch: feat/<ticket>-<descricao>' },
        { id: 'i2', description: 'Implementar o core da feature' },
        { id: 'i3', description: 'Adicionar tipos/interfaces' },
        { id: 'i4', description: 'Tratar edge cases identificados' },
      ],
    },
    {
      name: 'Fase 5 — Testes',
      description: 'Criar e executar testes',
      steps: [
        { id: 't1', description: 'Testes unitários para a lógica core' },
        { id: 't2', description: 'Testes de integração para o fluxo completo' },
        { id: 't3', description: 'Testes de edge cases' },
        { id: 't4', description: 'Verificar cobertura mínima (>80%)' },
      ],
    },
    {
      name: 'Fase 6 — Review',
      description: 'Revisão e preparação para PR',
      steps: [
        { id: 'r1', description: 'Self-review usando skill code-review' },
        { id: 'r2', description: 'Verificar que CI/CD passa' },
        { id: 'r3', description: 'Atualizar docs se necessário' },
        { id: 'r4', description: 'Criar PR com descrição completa' },
      ],
    },
    {
      name: 'Fase 7 — Entrega',
      description: 'Entrega final e comunicação',
      steps: [
        { id: 'dl1', description: 'PR aprovado e merged' },
        { id: 'dl2', description: 'Feature testada em staging' },
        { id: 'dl3', description: 'Comunicar stakeholders' },
        { id: 'dl4', description: 'Fechar issue/ticket' },
      ],
    },
  ];

  private config: FeatureConfig;

  constructor(config: Partial<FeatureConfig> = {}) {
    this.config = { ...DEFAULT_FEATURE_CONFIG, ...config };
  }

  async execute(context: ISkillContext): Promise<ISkillResult> {
    const output = this.buildChecklist();
    
    return {
      success: true,
      output,
      metadata: {
        phases: this.phases.length,
        totalSteps: this.phases.reduce((acc, p) => acc + p.steps.length, 0),
        config: this.config,
      },
    };
  }

  private buildChecklist(): string {
    const lines = [
      `# ${this.name}`,
      '',
      `${this.description}`,
      '',
    ];

    for (const phase of this.phases) {
      lines.push(`## ${phase.name}`);
      lines.push('');
      lines.push(phase.description);
      lines.push('');
      for (const step of phase.steps) {
        lines.push(`- [ ] ${step.description}`);
      }
      lines.push('');
    }

    lines.push('## Regras de Implementação');
    lines.push('');
    lines.push('- Commits atômicos (usar skill `commit-workflow`)');
    lines.push('- Funções pequenas (max ~30 linhas)');
    lines.push('- Nomes descritivos, sem abreviações obscuras');
    lines.push('- Sem `any`, sem magic numbers');
    if (this.config.requireTests) {
      lines.push(`- Cobertura mínima: ${this.config.minCoverage}%`);
    }

    return lines.join('\n');
  }
}
