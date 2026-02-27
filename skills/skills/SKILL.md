<!-- AVISO DE PROVENIÊNCIA E AUTORIA -->

> **Proveniência e Autoria**
>
> Este arquivo ou componente faz parte do ecossistema Doutor/Prometheus.
> Distribuído sob os termos de licença MIT-0.
> O uso do material neste componente não implica em apropriação ou violação de direitos autorais, morais ou de terceiros.
> Em caso de problemas com nosso uso, entre em contato pelo email: ossmoralus@gmail.com

---
name: Skills Framework
description: Framework de skills com Strategy Pattern, arquitetura limpa e SOLID
---

# Skills Framework

Framework para desenvolvimento de skills com padrão **Strategy Pattern**, arquitetura limpa e princípios **SOLID**.

## Arquitetura

```
src/
├── core/
│   ├── interfaces/
│   │   └── ISkill.ts       # Interface base da strategy
│   └── SkillRunner.ts      # Executor de strategies
│
├── skills/
│   ├── code-review/        # Implementação concreta
│   ├── feature-dev/
│   ├── commit-workflow/
│   └── ...
│
├── shared/
│   ├── types/              # Tipos compartilhados
│   └── utils/
│
└── index.ts                # Exports
```

## Strategy Pattern

Cada skill implementa a interface `ISkill`:

```typescript
interface ISkill {
  readonly name: string;
  readonly description: string;
  readonly phases: ISkillPhase[];
  readonly metadata: ISkillMetadata;
  execute(context: ISkillContext): Promise<ISkillResult>;
}
```

## SOLID Aplicado

- **S** - Cada skill tem responsabilidade única
- **O** - Novas skills não modificam código existente
- **L** - Todas as skills são intercambiáveis
- **I** - Interfaces pequenas e específicas
- **D** - Depende de abstrações (interfaces), não concretudes

## Uso

```typescript
import { skillRunner, CodeReviewSkill, FeatureDevSkill } from '@doutor/skills';

skillRunner.register(new CodeReviewSkill());
skillRunner.register(new FeatureDevSkill());

const result = await skillRunner.execute('code-review', {
  workingDirectory: '/project',
  diff: '...',
});
```

## Skills Disponíveis

| Skill | Descrição |
|-------|-----------|
| Code Review | Revisão com checklist e scoring de confiança |
| Feature Dev | Workflow de 7 fases para features |
| Commit Workflow | Conventional commits e git workflow |
| Security Check | Checklist de segurança |
| Project Setup | Setup de projetos Node/TS |
| PR Review | Review de pull requests |
