<!-- AVISO DE PROVENIÊNCIA E AUTORIA -->

> **Proveniência e Autoria**
>
> Este arquivo ou componente faz parte do ecossistema Doutor/Prometheus.
> Distribuído sob os termos de licença MIT-0.
> O uso do material neste componente não implica em apropriação ou violação de direitos autorais, morais ou de terceiros.
> Em caso de problemas com nosso uso, entre em contato pelo email: ossmoralus@gmail.com

---
name: Feature Development
description: Workflow estruturado em 7 fases para desenvolvimento de features, do entendimento à entrega
---

# Feature Development

Workflow completo para desenvolver features com qualidade, dividido em 7 fases.

## Implementação

```typescript
import { FeatureDevSkill, skillRunner } from '@doutor/skills';

const featureSkill = new FeatureDevSkill({
  requireTests: true,
  minCoverage: 80,
  strictTyping: true,
});

skillRunner.register(featureSkill);

const result = await skillRunner.execute('Feature Development', {
  workingDirectory: '/project',
});
```

## Fase 1 — Entendimento

Antes de escrever código:

- [ ] Ler o requisito/issue completo
- [ ] Listar as perguntas que surgirem
- [ ] Definir o escopo mínimo (MVP da feature)
- [ ] Identificar dependências (APIs, libs, dados)

**Output:** Lista clara do que precisa ser feito e do que está fora do escopo.

## Fase 2 — Exploração do Codebase

- [ ] Identificar onde a feature se encaixa na arquitetura
- [ ] Mapear arquivos que serão modificados
- [ ] Verificar padrões existentes (como features similares foram feitas)
- [ ] Checar se há utils/helpers reutilizáveis

**Output:** Lista de arquivos a modificar/criar e padrões a seguir.

## Fase 3 — Design

- [ ] Definir a interface pública (API, props, params)
- [ ] Definir o fluxo de dados
- [ ] Identificar edge cases
- [ ] Documentar decisões de design

**Output:** Pseudo-código ou diagrama do fluxo.

## Fase 4 — Implementação

- [ ] Criar branch: `feat/<ticket>-<descricao>`
- [ ] Implementar o core da feature
- [ ] Adicionar tipos/interfaces
- [ ] Tratar edge cases identificados
- [ ] Adicionar logs/métricas onde relevante

**Regras:**

- Commits atômicos (usar skill `commit-workflow`)
- Funções pequenas (max ~30 linhas)
- Nomes descritivos, sem abreviações obscuras
- Sem `any`, sem magic numbers

## Fase 5 — Testes

- [ ] Testes unitários para a lógica core
- [ ] Testes de integração para o fluxo completo
- [ ] Testes de edge cases
- [ ] Verificar cobertura mínima (>80%)

```bash
# Rodar testes
npm test

# Com cobertura
npm test -- --coverage
```

## Fase 6 — Review

- [ ] Self-review usando skill `code-review`
- [ ] Verificar que CI/CD passa
- [ ] Atualizar docs se necessário
- [ ] Criar PR com descrição completa

**Template de PR:**

```markdown
## O que mudou

Descrição clara da feature.

## Como testar

1. Passo a passo
2. para reproduzir

## Checklist

- [ ] Testes passando
- [ ] Sem warnings no build
- [ ] Docs atualizados
- [ ] Breaking changes documentados
```

## Fase 7 — Entrega

- [ ] PR aprovado e merged
- [ ] Feature testada em staging
- [ ] Comunicar stakeholders
- [ ] Fechar issue/ticket

## Princípios SOLID Aplicados

- **S** - Cada fase tem responsabilidade única
- **O** - Novas fases não modificam existentes
- **L** - Todas as fases seguem a mesma interface
- **I** - Interfaces pequenas e focadas
- **D** - Depende de abstrações (ISkill), não concretudes
