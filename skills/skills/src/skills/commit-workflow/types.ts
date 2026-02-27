export enum CommitType {
  FEAT = 'feat',
  FIX = 'fix',
  REFACTOR = 'refactor',
  DOCS = 'docs',
  STYLE = 'style',
  TEST = 'test',
  CHORE = 'chore',
  PERF = 'perf',
  CI = 'ci',
  REVERT = 'revert',
}

export interface CommitTypeInfo {
  type: CommitType;
  description: string;
  example: string;
}

export const COMMIT_TYPES: Record<CommitType, CommitTypeInfo> = {
  [CommitType.FEAT]: {
    type: CommitType.FEAT,
    description: 'Nova funcionalidade',
    example: 'feat(auth): add JWT refresh token',
  },
  [CommitType.FIX]: {
    type: CommitType.FIX,
    description: 'Correção de bug',
    example: 'fix(api): handle null response',
  },
  [CommitType.REFACTOR]: {
    type: CommitType.REFACTOR,
    description: 'Mudança sem alterar comportamento',
    example: 'refactor(utils): extract date parser',
  },
  [CommitType.DOCS]: {
    type: CommitType.DOCS,
    description: 'Documentação',
    example: 'docs(readme): add setup instructions',
  },
  [CommitType.STYLE]: {
    type: CommitType.STYLE,
    description: 'Formatação, semicolons, etc',
    example: 'style: apply prettier',
  },
  [CommitType.TEST]: {
    type: CommitType.TEST,
    description: 'Adicionar/corrigir testes',
    example: 'test(auth): add login edge cases',
  },
  [CommitType.CHORE]: {
    type: CommitType.CHORE,
    description: 'Build, CI, deps',
    example: 'chore(deps): bump lodash to 4.17.21',
  },
  [CommitType.PERF]: {
    type: CommitType.PERF,
    description: 'Melhoria de performance',
    example: 'perf(query): add index on user_id',
  },
  [CommitType.CI]: {
    type: CommitType.CI,
    description: 'CI/CD',
    example: 'ci: add Node 20 to test matrix',
  },
  [CommitType.REVERT]: {
    type: CommitType.REVERT,
    description: 'Reverter commit',
    example: 'revert: feat(auth): add JWT refresh token',
  },
};

export interface CommitMessage {
  type: CommitType;
  scope?: string;
  description: string;
  body?: string;
  footer?: string;
  isBreaking: boolean;
}

export function formatCommitMessage(msg: CommitMessage): string {
  const scope = msg.scope ? `(${msg.scope})` : '';
  const breaking = msg.isBreaking ? '!' : '';
  const header = `${msg.type}${scope}${breaking}: ${msg.description}`;
  
  const parts = [header];
  
  if (msg.body) {
    parts.push('', msg.body);
  }
  
  if (msg.footer) {
    parts.push('', msg.footer);
  }
  
  return parts.join('\n');
}
