<!-- AVISO DE PROVENIÊNCIA E AUTORIA -->

> **Proveniência e Autoria**
>
> Este arquivo ou componente faz parte do ecossistema Doutor/Prometheus.
> Distribuído sob os termos de licença MIT-0.
> O uso do material neste componente não implica em apropriação ou violação de direitos autorais, morais ou de terceiros.
> Em caso de problemas com nosso uso, entre em contato pelo email: ossmoralus@gmail.com

---
name: Code Review
description: Revisão de código com checklist estruturado e scoring por confiança para filtrar falsos positivos
---

# Code Review

Skill para revisão de código com abordagem sistemática e multi-dimensional.

## Implementação

```typescript
import { CodeReviewSkill, skillRunner } from '@doutor/skills';

const reviewSkill = new CodeReviewSkill({
  checkSecurity: true,
  checkPerformance: true,
  checkTyping: true,
  confidenceThreshold: 50,
});

skillRunner.register(reviewSkill);

const result = await skillRunner.execute('Code Review', {
  workingDirectory: '/project',
  diff: '...', // diff do git
  files: ['src/auth.ts', 'src/api.ts'],
});
```

## Checklist de Review

### 1. Correção

- [ ] A lógica resolve o problema proposto?
- [ ] Edge cases estão tratados?
- [ ] Inputs inválidos são rejeitados adequadamente?
- [ ] Retornos são consistentes (não mistura null/undefined/throw)?

### 2. Segurança

- [ ] Sem injection (SQL, command, XSS)?
- [ ] Sem secrets hardcoded?
- [ ] Inputs são sanitizados/validados?
- [ ] Sem uso de `eval()`, `innerHTML`, `dangerouslySetInnerHTML`?

### 3. Performance

- [ ] Sem loops desnecessários ou complexidade O(n²)?
- [ ] Sem re-renders desnecessários (React)?
- [ ] Queries são otimizadas (N+1, índices)?
- [ ] Sem memory leaks (event listeners, timers)?

### 4. Manutenibilidade

- [ ] Nomes de variáveis/funções são descritivos?
- [ ] Funções têm responsabilidade única (SRP)?
- [ ] Sem magic numbers — constantes nomeadas?
- [ ] Código duplicado foi extraído?

### 5. Tipagem (TypeScript)

- [ ] Sem `any` desnecessário?
- [ ] Interfaces/types estão definidos?
- [ ] Generics usados quando apropriado?
- [ ] Union types ao invés de booleans para estados?

### 6. Testes

- [ ] Mudança tem teste correspondente?
- [ ] Testes cobrem happy path + edge cases?
- [ ] Mocks não escondem bugs reais?
- [ ] Assertions são específicas (não só `.toBeTruthy()`)?

## Scoring de Confiança

Ao reportar issues, classifique cada uma:

| Nível         | Confiança | Ação                     |
| ------------- | --------- | ------------------------ |
| 🔴 Crítico    | >90%      | Bloqueia merge           |
| 🟡 Importante | 70-90%    | Revisar antes do merge   |
| 🟢 Sugestão   | 50-70%    | Nice to have             |
| ⚪ Nit        | <50%      | Ignorar se não concordar |

## Template de Feedback

```markdown
### [🔴/🟡/🟢/⚪] Título curto do problema

**Arquivo:** `path/to/file.ts:42`
**Categoria:** Segurança | Performance | Correção | Manutenibilidade
**Confiança:** X%

**Problema:** Descrição do que está errado e por quê.

**Sugestão:**
\`\`\`typescript
// código sugerido
\`\`\`
```

## Princípios SOLID Aplicados

- **S** - Cada item de review verifica um aspecto específico
- **O** - Novas categorias de review não modificam existentes
- **L** - Todas as categorias seguem a mesma interface
- **I** - Interfaces pequenas e focadas
- **D** - Depende de abstrações (ISkill), não concretudes
