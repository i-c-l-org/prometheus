<!-- AVISO DE PROVENIÊNCIA E AUTORIA -->

> **Proveniência e Autoria**
>
> Este arquivo ou componente faz parte do ecossistema Doutor/Prometheus.
> Distribuído sob os termos de licença MIT-0.
> O uso do material neste componente não implica em apropriação ou violação de direitos autorais, morais ou de terceiros.
> Em caso de problemas com nosso uso, entre em contato pelo email: ossmoralus@gmail.com

---
name: PR Review
description: Review de pull requests
---

# PR Review

Guia completo para revisar pull requests de forma eficiente.

## Implementação

```typescript
import { PRReviewSkill, skillRunner } from '@doutor/skills';

const prSkill = new PRReviewSkill({
  requireTests: true,
  requireDocs: false,
  minCoverage: 80,
});

skillRunner.register(prSkill);

const result = await skillRunner.execute('PR Review', {
  workingDirectory: '/project',
  diff: '...', // diff do PR
});
```

## Checklist de Revisão

### 1. Escopo

- [ ] PR resolve apenas uma issue/tarefa
- [ ] Mudanças são coerentes com o objetivo
- [ ] Não há código não relacionado

### 2. Descrição

- [ ] Descrição clara do que foi mudado
- [ ] Link para issue/ticket
- [ ] Screenshots se aplicável (UI)
- [ ] Passos para testar

### 3. Qualidade de Código

- [ ] Segue padrões do projeto
- [ ] Nomes descritivos
- [ ] Funções pequenas e SRP
- [ ] Sem código duplicado
- [ ] Sem magic numbers

### 4. Testes

- [ ] Testes unitários presentes
- [ ] Testes de integração se aplicável
- [ ] Edge cases cobertos
- [ ] Cobertura mínima atingida (>80%)

### 5. Segurança

- [ ] Sem secrets no código
- [ ] Input validation presente
- [ ] Queries parametrizadas
- [ ] Headers de segurança

### 6. Performance

- [ ] Sem queries N+1
- [ ] Sem loops desnecessários
- [ ] Índices onde necessário

### 7. Documentação

- [ ] README atualizado se necessário
- [ ] JSDoc para APIs públicas
- [ ] CHANGELOG atualizado

## Tipos de Feedback

### 🔴 Bloqueador

- Bug funcional
- Falta de testes críticos
- Problema de segurança
- Breaking change não documentado

### 🟡 Necesário

- Código não segue padrões
- Testes insuficientes
- Nomes confusos
- Documentação incompleta

### 🟡 Sugestão

- Melhorias de performance
- Refactoring opcional
- Code style

### ⚪ Nitpick

- Formatação
- Ordnação de imports
- Comentários opcionais

## Template de Review

```markdown
## Resumo

Breve descrição do PR.

### ✅ Pontos Positivos

- O que está bom no código

### ❌ Problemas Encontrados

**Bloqueadores:**
1. [🔴] Problema X - descrição

**Necessários:**
1. [🟡] Problema Y - descrição
2. [🟡] Problema Z - descrição

**Sugestões:**
1. [🟢] Melhoria A - descrição

**Nits:**
1. [⚪] Nit B - descrição

### 📝 Comentários

Comentários adicionais.

### Verificações

- [ ] Testes passando
- [ ] Build passando
- [ ] Sem warnings
- [ ] Cobertura mantida/aumentada
```

## Fluxo de Review

```
Autor submete PR
       ↓
Revisor analisa (máx 24h)
       ↓
Feedback retornado
       ↓
Autor corrige (se necessário)
       ↓
Revisor aprova
       ↓
Merge
```

## Princípios SOLID Aplicados

- **S** - Cada item de review verifica um aspecto específico
- **O** - Novas categorias não modificam existentes
- **L** - Todos os reviews seguem a mesma interface
- **I** - Interfaces pequenas e focadas
- **D** - Depende de abstrações (ISkill), não concretudes
