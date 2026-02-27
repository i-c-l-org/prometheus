<!-- AVISO DE PROVENIÊNCIA E AUTORIA -->

> **Proveniência e Autoria**
>
> Este arquivo ou componente faz parte do ecossistema Doutor/Prometheus.
> Distribuído sob os termos de licença MIT-0.
> O uso do material neste componente não implica em apropriação ou violação de direitos autorais, morais ou de terceiros.
> Em caso de problemas com nosso uso, entre em contato pelo email: ossmoralus@gmail.com

---
name: Commit Workflow
description: Conventional Commits, mensagens padronizadas e workflow git estruturado
---

# Commit Workflow

Regras e padrões para commits limpos, rastreáveis e automatizáveis.

## Implementação

```typescript
import { CommitWorkflowSkill, skillRunner } from '@doutor/skills';

const commitSkill = new CommitWorkflowSkill();
skillRunner.register(commitSkill);

const result = await skillRunner.execute('Commit Workflow', {
  workingDirectory: '/project',
});

// Validar mensagem de commit
const validation = commitSkill.validateCommitMessage('feat(auth): add JWT refresh');
// { valid: true, errors: [] }
```

## Conventional Commits

Formato obrigatório:

```
<tipo>(<escopo>): <descrição curta>

<corpo opcional>

<footer opcional>
```

### Tipos

| Tipo       | Quando usar                       | Exemplo                                |
| ---------- | --------------------------------- | -------------------------------------- |
| `feat`     | Nova funcionalidade               | `feat(auth): add JWT refresh token`    |
| `fix`      | Correção de bug                   | `fix(api): handle null response`       |
| `refactor` | Mudança sem alterar comportamento | `refactor(utils): extract date parser` |
| `docs`     | Documentação                      | `docs(readme): add setup instructions` |
| `style`    | Formatação, semicolons, etc       | `style: apply prettier`                |
| `test`     | Adicionar/corrigir testes         | `test(auth): add login edge cases`     |
| `chore`    | Build, CI, deps                   | `chore(deps): bump lodash to 4.17.21`  |
| `perf`     | Melhoria de performance           | `perf(query): add index on user_id`    |
| `ci`       | CI/CD                             | `ci: add Node 20 to test matrix`       |

### Regras

1. **Descrição em inglês**, imperativo, sem ponto final, max 72 chars
2. **Escopo reflete o módulo/componente** afetado
3. **Breaking changes** usam `!` após o tipo: `feat(api)!: change response format`
4. **Footer** para referências: `Closes #123`, `BREAKING CHANGE: ...`

## Boas Práticas

### Commits atômicos

- **Um commit = uma mudança lógica**
- Não misture refactor com feature
- Não misture style com fix

### Frequência

- Commitar frequentemente (a cada 15-30min de trabalho)
- Cada commit deve compilar e passar testes

### Mensagens ruins vs boas

```diff
- fix: fix bug
+ fix(cart): prevent negative quantity on item update

- update files
+ refactor(auth): extract token validation to middleware

- changes
+ feat(dashboard): add real-time notification counter
```

## Git Hooks Recomendados

### pre-commit

```bash
# Lint staged files
npx lint-staged
```

### commit-msg

```bash
# Validar conventional commits
npx commitlint --edit $1
```

### Configuração (.commitlintrc.json)

```json
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
```

## Branch Naming

```
<tipo>/<ticket>-<descricao-curta>
```

Exemplos:

- `feat/AUTH-123-jwt-refresh`
- `fix/BUG-456-null-response`
- `chore/INFRA-789-update-node`

## Princípios SOLID Aplicados

- **S** - Cada tipo de commit tem propósito específico
- **O** - Novos tipos não modificam existentes
- **L** - Todas as validações seguem a mesma interface
- **I** - Interfaces pequenas e focadas
- **D** - Depende de abstrações (ISkill), não concretudes
