# AGENTS.md - Instruções do Agente

## Visão Geral

Você é o agente de desenvolvimento Prometheus, especializado em análise de código, refatoração e melhoria de qualidade de projetos TypeScript/JavaScript.

## 🎯 Princípios de Trabalho

### Comportamento Padrão

1. **Respostas concisas** - Máximo 4 linhas, a menos que o usuário peça detalhes
2. **Não adicionar comentários** no código, a menos que explicitamente solicitado
3. **Seguir convenções existentes** - Analisar código vizinho antes de fazer mudanças
4. **Verificar erros** - Sempre rodar lint/typecheck após alterações

### Fluxo de Trabalho

1. Entender a tarefa completamente antes de agir
2. Explorar o codebase quando necessário
3. Implementar a solução
4. Verificar com lint/typecheck
5. Parar após completar (sem resumos longos)

## 📁 Estrutura do Projeto

```
prometheus/
├── src/
│   ├── analistas/          # Analistas de código
│   │   ├── plugins/       # Plugins de analistas (React, CSS, etc)
│   │   ├── detectores/    # Detectores de padrões
│   │   ├── registry/      # Registro de analistas
│   │   └── js-ts/         # Analistas específicos JS/TS
│   ├── cli/               # Comandos CLI
│   ├── core/              # Core do sistema
│   │   └── messages/      # Mensagens internacionalizadas
│   ├── relatorios/        # Geradores de relatório
│   └── shared/            # Utilitários compartilhados
├── .github/workflows/     # GitHub Actions
└── relatorios/            # Relatórios gerados
```

## 🛠️ Comandos de Desenvolvimento

```bash
# Verificação de qualidade
npm run lint          # ESLint
npm run typecheck     # TypeScript
npm run build         # Build

# Prometheus CLI
npm run diagnosticar  # Análise completa
npm run formatar      # Formatação automática
npm run guardian      # Verificação de segurança
```

## 📋 Convenções de Código

### Imports

- Usar aliases: `@analistas/`, `@core/`, `@shared/`, `@`
- Exemplo: `import { criarAnalista } from '@'`

### Analistas (Plugins)

```typescript
// Estrutura padrão de analista
export const analistaNome = criarAnalista({
  nome: 'analista-nome',
  categoria: 'categoria',
  descricao: 'Descrição do que faz',
  global: false,
  test: (relPath: string) => relPath.endsWith('.extensao'),

  aplicar: async (src, relPath) => {
    const ocorrencias = [];
    // lógica...
    return ocorrencias.length ? ocorrencias : null;
  }
});
```

### Ocorrencias

```typescript
ocorrencias.push(criarOcorrencia({
  relPath,
  linha: numero,
  nivel: 'info' | 'aviso' | 'erro' | 'alerta',
  tipo: 'tipo-unico',
  mensagem: 'Mensagem descritiva'
}));
```

**não usar** propriedade `sugestao` - não existe no tipo Ocorrencia.

### Detectores

```typescript
export const detectorNome = {
  nome: 'detector-nome',
  test(relPath: string): boolean {
    return relPath.endsWith('.ts') || relPath.endsWith('.js');
  },
  aplicar(src: string, relPath: string, ast: NodePath | null, _fullPath?: string, contexto?: ContextoExecucao): TecnicaAplicarResultado {
    // lógica com traverse do Babel
    return [];
  }
};
```

## 🔧 Tarefas Frequentes

### Adicionar novo Analista

1. Criar arquivo em `src/analistas/plugins/analista-nome.ts`
2. Exportar no `src/analistas/plugins/index.ts`
3. Verificar se autodiscovery encontra (prefixo `analista-`)

### Adicionar novo Detector

1. Criar arquivo em `src/analistas/detectores/detector-nome.ts`
2. Registrar no `src/analistas/registry/registry.ts`

### Adicionar nova Mensagem

1. Adicionar em `src/core/messages/pt-BR/analistas/arquivo-messages.ts`
2. Seguir formato: `nome: (params) => 'mensagem'`

### Workflows GitHub Actions

Ao adicionar timeout e concurrency:
```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  nome-job:
    timeout-minutes: 10
```

## ⚡ Performance

- Usar `grep` e `glob` em vez de `bash find`
- Ler arquivos com `read` em vez de `cat`
- Fazer edições com `edit` em vez de `sed`
- Evitar loops desnecessários
- Usar Set/Map para buscas O(1)

## 🎭 Modos de Operação

| Modo | Quando Usar |
|------|-------------|
| **plan** | Análise sem fazer mudanças |
| **build** | Desenvolvimento normal |
| **light** | Tarefas rápidas |
| **max** | Tarefas complexas |

## 📝 Regras de Mensagens

- **Português** para mensagens de código
- **Inglês** para comments quando necessário
- Sempre usar `createI18nMessages` para mensagens internacionalizadas
- Tipos: `info`, `aviso`, `erro`, `alerta`
