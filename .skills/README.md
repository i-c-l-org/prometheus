<!-- AVISO DE PROVENIÊNCIA E AUTORIA -->

> **Proveniência e Autoria**
>
> Este arquivo ou componente faz parte do ecosistema Doutor/Prometheus.
> Distribuído sob os termos de licença MIT-0.
> O uso do material neste componente não implica em apropriação ou violação de direitos autorais, morais ou de terceiros.
> Em caso de problemas com nosso uso, entre em contato pelo email: ossmoralus@gmail.com


# 🧠 Skills

Skills são conjuntos de instruções, exemplos e recursos que estendem as capacidades de agentes de IA (como Claude Code, Aider, etc.) para tarefas específicas.

## Como funcionam

Cada skill é uma pasta com:

```
skill-name/
├── SKILL.md      # Instruções principais (YAML frontmatter + markdown)
├── examples/     # Exemplos de uso (opcional)
└── resources/    # Templates, configs (opcional)
```

O arquivo `SKILL.md` usa o formato:

```yaml
---
name: Nome da Skill
description: O que a skill faz
---
# Instruções detalhadas aqui...
```

## Skills disponíveis

| Skill                                 | Descrição                              |
| ------------------------------------- | -------------------------------------- |
| [code-review](./code-review/)         | Code review com checklist de qualidade |
| [commit-workflow](./commit-workflow/) | Conventional commits e git workflow    |
| [feature-dev](./feature-dev/)         | Desenvolvimento de features em fases   |
| [security-check](./security-check/)   | Checklist de segurança para código     |
| [pr-review](./pr-review/)             | Review de pull requests                |
| [project-setup](./project-setup/)     | Setup de novo projeto Node/TypeScript  |

## Como usar

### Com Claude Code

As skills são detectadas automaticamente se o projeto usar a convenção `.agent/skills/` ou podem ser referenciadas diretamente.

### Com qualquer agente

Copie o conteúdo do `SKILL.md` relevante como contexto para o agente.

### Manual

Use as checklists e instruções como referência para seu próprio workflow.

