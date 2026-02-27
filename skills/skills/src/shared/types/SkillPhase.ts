export enum SkillPhaseName {
  UNDERSTANDING = 'understanding',
  EXPLORATION = 'exploration',
  DESIGN = 'design',
  IMPLEMENTATION = 'implementation',
  TESTING = 'testing',
  REVIEW = 'review',
  DELIVERY = 'delivery',
}

export interface PhaseDefinition {
  name: string;
  order: number;
  description: string;
}

export const PHASES: Record<SkillPhaseName, PhaseDefinition> = {
  [SkillPhaseName.UNDERSTANDING]: {
    name: 'Entendimento',
    order: 1,
    description: 'Entendimento do requisito e escopo',
  },
  [SkillPhaseName.EXPLORATION]: {
    name: 'Exploração',
    order: 2,
    description: 'Exploração do codebase',
  },
  [SkillPhaseName.DESIGN]: {
    name: 'Design',
    order: 3,
    description: 'Design da solução',
  },
  [SkillPhaseName.IMPLEMENTATION]: {
    name: 'Implementação',
    order: 4,
    description: 'Implementação do código',
  },
  [SkillPhaseName.TESTING]: {
    name: 'Testes',
    order: 5,
    description: 'Criação e execução de testes',
  },
  [SkillPhaseName.REVIEW]: {
    name: 'Review',
    order: 6,
    description: 'Revisão de código',
  },
  [SkillPhaseName.DELIVERY]: {
    name: 'Entrega',
    order: 7,
    description: 'Entrega e comunicação',
  },
};
