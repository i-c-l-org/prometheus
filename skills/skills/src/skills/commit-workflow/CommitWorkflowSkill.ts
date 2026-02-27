import type { ISkill, ISkillContext, ISkillResult, ISkillPhase, ISkillMetadata } from '@core/interfaces/ISkill.js';
import { COMMIT_TYPES, formatCommitMessage, type CommitMessage, CommitType } from './types.js';

export class CommitWorkflowSkill implements ISkill {
  readonly name = 'Commit Workflow';
  readonly description = 'Conventional Commits, mensagens padronizadas e workflow git estruturado';

  readonly metadata: ISkillMetadata = {
    version: '1.0.0',
    author: 'Doutor/Prometheus',
    tags: ['git', 'commits', 'workflow'],
    prerequisites: ['git'],
  };

  readonly phases: ISkillPhase[] = [
    {
      name: 'Conventional Commits',
      description: 'Formato obrigatório para mensagens de commit',
      steps: [
        { id: 'cc1', description: 'Usar formato: <tipo>(<escopo>): <descrição>' },
        { id: 'cc2', description: 'Descrição em inglês, imperativo, sem ponto final' },
        { id: 'cc3', description: 'Max 72 caracteres no header' },
        { id: 'cc4', description: 'Breaking changes: adicionar ! após tipo' },
      ],
    },
    {
      name: 'Tipos de Commit',
      description: 'Quando usar cada tipo de commit',
      steps: Object.entries(COMMIT_TYPES).map(([type, info], idx) => ({
        id: `type-${idx}`,
        description: `${type}: ${info.description}`,
      })),
    },
    {
      name: 'Boas Práticas',
      description: 'Práticas para commits de qualidade',
      steps: [
        { id: 'bp1', description: 'Commits atômicos (um commit = uma mudança lógica)' },
        { id: 'bp2', description: 'Commitar frequentemente (a cada 15-30min)' },
        { id: 'bp3', description: 'Cada commit deve compilar e passar testes' },
        { id: 'bp4', description: 'Escopo reflete o módulo/componente afetado' },
      ],
    },
    {
      name: 'Branch Naming',
      description: 'Padrão para nomes de branch',
      steps: [
        { id: 'bn1', description: 'Usar formato: <tipo>/<ticket>-<descricao>' },
        { id: 'bn2', description: 'Exemplos: feat/AUTH-123-jwt-refresh' },
        { id: 'bn3', description: 'fix/BUG-456-null-response' },
        { id: 'bn4', description: 'chore/INFRA-789-update-node' },
      ],
    },
  ];

  async execute(context: ISkillContext): Promise<ISkillResult> {
    const output = this.buildDocumentation();

    return {
      success: true,
      output,
      metadata: {
        phases: this.phases.length,
        commitTypes: Object.keys(COMMIT_TYPES).length,
      },
    };
  }

  validateCommitMessage(message: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    const lines = message.split('\n');
    const header = lines[0];

    const pattern = /^(feat|fix|refactor|docs|style|test|chore|perf|ci|revert)(?:\(([^)]+)\))?!?: .+$/;
    if (!pattern.test(header)) {
      errors.push('Header não segue o padrão conventional commits');
    }

    if (header.length > 72) {
      errors.push('Header excede 72 caracteres');
    }

    return { valid: errors.length === 0, errors };
  }

  private buildDocumentation(): string {
    const typeTable = Object.values(COMMIT_TYPES)
      .map(t => `| \`${t.type}\` | ${t.description} | ${t.example} |`)
      .join('\n');

    return `# ${this.name}

${this.description}

## Conventional Commits

Formato obrigatório:

\`\`\`
<tipo>(<escopo>): <descrição curta>

<corpo opcional>

<footer opcional>
\`\`\`

### Tipos

| Tipo       | Quando usar                       | Exemplo                                |
| ---------- | --------------------------------- | -------------------------------------- |
${typeTable}

## Regras

1. **Descrição em inglês**, imperativo, sem ponto final, max 72 chars
2. **Escopo reflete o módulo/componente** afetado
3. **Breaking changes** usam \`!\` após o tipo: \`feat(api)!: change response format\`
4. **Footer** para referências: \`Closes #123\`, \`BREAKING CHANGE: ...\`

## Boas Práticas

### Commits atômicos

- **Um commit = uma mudança lógica**
- Não misture refactor com feature
- Não misture style com fix

### Frequência

- Commitar frequentemente (a cada 15-30min de trabalho)
- Cada commit deve compilar e passar testes

### Mensagens ruins vs boas

\`\`\`diff
- fix: fix bug
+ fix(cart): prevent negative quantity on item update

- update files
+ refactor(auth): extract token validation to middleware

- changes
+ feat(dashboard): add real-time notification counter
\`\`\`

## Git Hooks Recomendados

### pre-commit

\`\`\`bash
# Lint staged files
npx lint-staged
\`\`\`

### commit-msg

\`\`\`bash
# Validar conventional commits
npx commitlint --edit $1
\`\`\`

### Configuração (.commitlintrc.json)

\`\`\`json
{
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "subject-max-length": [2, "always", 72],
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "refactor",
        "docs",
        "style",
        "test",
        "chore",
        "perf",
        "ci",
        "revert"
      ]
    ]
  }
}
\`\`\`

## Branch Naming

\`\`\`
<tipo>/<ticket>-<descricao-curta>
\`\`\`

Exemplos:

- \`feat/AUTH-123-jwt-refresh\`
- \`fix/BUG-456-null-response\`
- \`chore/INFRA-789-update-node\`
`;
  }
}
