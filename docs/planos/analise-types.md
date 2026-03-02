---
Proveniência e Autoria: Este documento integra o projeto Prometheus (licença MIT-0).
Nada aqui implica cessão de direitos morais/autorais.
Conteúdos de terceiros não licenciados de forma compatível não devem ser incluídos.
Referências a materiais externos devem ser linkadas e reescritas com palavras próprias.
---


# Análise da Pasta Types - Prometheus

## Visão Geral

A pasta `src/types/` contém **~70 arquivos** com tipos TypeScript centralizados. O objetivo é reduzir conflitos, eliminar redundâncias e criar utilitários compartilhados.

---

## 🔴 Problemas Identificados

### 1. Tipos Duplicados

| Tipo | Arquivo A | Arquivo B | Ação Sugerida |
|------|-----------|-----------|---------------|
| `ScanOptions` | `core/execution/scanner.ts:11` | `core/execution/ambiente.ts:51` | Unificar em `core/execution/scan.ts` |
| `ResultadoInquisicaoCompleto` | `core/execution/resultados.ts:22` | `core/execution/inquisidor.ts:39` | Manter apenas uma (remover extensão) |
| `CacheValor` | `core/execution/executor.ts:17` | `core/execution/inquisidor.ts:49` | Unificar (são idênticas) |
| `EstadoIncremental` | `core/execution/executor.ts:25` | `core/execution/inquisidor.ts:67` | Consolidar em um único tipo |
| `MetricasGlobais` | `core/execution/inquisidor.ts:54` | `MetricasGlobaisExecutor` em `executor.ts:46` | Unificar ou renomear |

### 2. Arquivos Extensos

| Arquivo | Linhas | Problema |
|---------|--------|----------|
| `cli/options.ts` | 218 | Muita responsabilidade (flags, filtros, opções) |
| `analistas/detectores.ts` | 215 | Muitos tipos específicos em um arquivo |
| `core/config/config.ts` | 129 | Mistura AutoFix, Pontuação, Excludes |

### 3. Estrutura de Re-exports Confusa

- `shared/index.ts` faz re-export de `projeto/` e `relatorios/` - sugere organização confusa
- `index.ts` principal tem 146 linhas com múltiplas fontes

### 4. Tipos Excessivamente Permissivos

```typescript
// Exemplos encontrados
interface OcorrenciaGenerica {
  [k: string]: unknown;  // Perda de type safety
}

export type ProblemaQualidade =
  | Fragilidade
  | ProblemaPerformance
  | ProblemaDocumentacao
  | ProblemaFormatacao;  // OK, mas usado em poucos lugares
```

---

## 📁 Estrutura Atual

```
src/types/
├── index.ts                 # 146 linhas - re-exports centralizados
├── tipos.ts                 # (verificar existência)
│
├── analistas/              # ~9 arquivos
│   ├── index.ts
│   ├── detectores.ts       # 215 linhas - MUITO GRANDE
│   ├── contexto.ts
│   ├── corrections/
│   ├── estrategistas.ts
│   ├── handlers.ts
│   ├── markdown.ts
│   ├── metricas.ts
│   ├── modulos-dinamicos.ts
│   └── pontuacao.ts
│
├── cli/                    # ~12 arquivos
│   ├── options.ts         # 218 linhas - MUITO GRANDE
│   ├── diagnostico.ts
│   ├── handlers.ts
│   ├── metricas.ts
│   └── ...
│
├── comum/                  # ~5 arquivos
│   ├── ocorrencias.ts     # Com funções factory
│   ├── file-entries.ts
│   ├── utils.ts
│   └── ...
│
├── core/                   # ~20 arquivos
│   ├── config/
│   │   └── config.ts      # 129 linhas
│   ├── execution/
│   │   ├── executor.ts    # CacheValor duplicado
│   │   ├── inquisidor.ts  # CacheValor duplicado
│   │   ├── scanner.ts     # ScanOptions (duplicado)
│   │   ├── ambiente.ts    # ScanOptions (duplicado)
│   │   └── resultados.ts
│   ├── messages/
│   └── parsing/
│
├── projeto/
│   ├── contexto.ts
│   └── deteccao.ts
│
├── relatorios/             # ~8 arquivos
│   ├── estrutura.ts        # 13 linhas (quase vazio?)
│   ├── fragmentacao.ts
│   ├── leitor.ts
│   └── ...
│
├── shared/                 # ~10 arquivos
│   ├── index.ts           # Re-export confuso
│   ├── estrutura.ts       # Duplicado em relatorios/estrutura.ts
│   ├── validacao.ts
│   └── ...
│
├── guardian/              # ~6 arquivos
├── zeladores/             # ~5 arquivos
├── estrutura/             # ~2 arquivos
└── licensas.ts
```

---

## ✅ Recomendações

### Fase 1: Unificar Tipos Duplicados

#### 1.1 ScanOptions

**Criar**: `src/types/core/execution/scan.ts`
```typescript
export interface ScanOptions {
  includeContent?: boolean;
  includeAst?: boolean;
  filter?: (relPath: string, entry: Dirent) => boolean;
  onProgress?: (msg: string) => void;
}
```
**Remover**: `scanner.ts` e `ambiente.ts` (manter apenas re-export)

#### 1.2 CacheValor

**Manter**: apenas `core/execution/inquisidor.ts:49`
**Remover**: `core/execution/executor.ts:17`

#### 1.3 ResultadoInquisicaoCompleto

**Manter**: `core/execution/resultados.ts:22`
**Remover**: `core/execution/inquisidor.ts:39`

#### 1.4 MetricasGlobais

**Unificar**: `MetricasGlobaisExecutor` + `MetricasGlobais` em único tipo

---

### Fase 2: Criar Utilitários Compartilhados

#### 2.1 Occurrence Factory

**Mover de**: `comum/ocorrencias.ts`
**Para**: `shared/types/occurrence.ts`

```typescript
// Criar utilitários reutilizáveis
export function criarOcorrencia(base: ...): OcorrenciaBase
export function ocorrenciaErroAnalista(data: ...): OcorrenciaErroAnalista
export function ocorrenciaFuncaoComplexa(data: ...): OcorrenciaComplexaFuncao
export function ocorrenciaParseErro(data: ...): OcorrenciaParseErro
```

#### 2.2 Base Result Types

**Criar**: `shared/types/resultado.ts`

```typescript
export interface ResultadoBase {
  timestamp: number;
  duracaoMs: number;
}

export interface ResultadoComArquivos extends ResultadoBase {
  arquivosAnalisados: string[];
  totalArquivos: number;
}
```

#### 2.3 Config Patterns

**Criar**: `shared/types/config.ts`

```typescript
export interface OptionsBase {
  verbose?: boolean;
  dryRun?: boolean;
}

export interface FilterOptions extends OptionsBase {
  include?: string[];
  exclude?: string[];
}
```

---

### Fase 3: Quebrar Arquivos Grandes

#### 3.1 cli/options.ts (218 linhas)

Quebrar em:
```
cli/
├── options/
│   ├── flags.ts        # FlagsBrutas, FlagsNormalizadas
│   ├── filtros.ts      # FiltrosProcessados, OpcoesProcessamentoFiltros
│   ├── modo.ts         # ModoOperacao, ModoAutoFix, FormatoSaida
│   └── output.ts       # FixTypesOptions, OtimizarSvgOptions
└── index.ts            # Re-export
```

#### 3.2 core/config/config.ts (129 linhas)

Quebrar em:
```
core/config/
├── auto-fix.ts         # AutoFixConfig, PatternBasedQuickFix
├── pontuacao.ts        # ConfiguracaoPontuacao
├── excludes.ts         # ConfigExcludesPadrao
└── index.ts
```

#### 3.3 analistas/detectores.ts (215 linhas)

Possível divisão:
- Tipos de análise: `AnaliseArquitetural`, `EstatisticasArquivo`
- Problemas: `ProblemaSeguranca`, `ProblemaTeste`, `ProblemaPerformance`
- Funções/blocos: `BlocoFuncao`, `DuplicacaoEncontrada`

---

### Fase 4: Limpar Re-exports

#### 4.1 shared/index.ts

Remover re-exports de `projeto/` e `relatorios/` - importações diretas.

#### 4.2 index.ts principal

Considerar拆分 (split) por domínio:
- `index.ts` apenas re-exports de sub-módulos
- Cada domínio com seu próprio `index.ts`

---

### Fase 5: Aprimorar Type Safety

#### 5.1 Substituir tipos permissivos

| Antes | Depois |
|-------|--------|
| `[k: string]: unknown` | Tipos específicos |
| `Record<string, unknown>` | `Record<string, string | number>` |
| `any` | `unknown` ou genéricos |

#### 5.2 Utilizar Discriminated Unions

```typescript
// Em vez de
export interface OcorrenciaGenerica {
  [k: string]: unknown;
}

// Usar
export type Ocorrencia =
  | { tipo: 'erro'; mensagem: string }
  | { tipo: 'aviso'; mensagem: string; sugestao?: string }
  | { tipo: 'info'; mensagem: string };
```

---

## 📋 Ordem de Implementação Sugerida

1. **Unificar duplicados** (risco baixo, impacto alto)
   - ScanOptions, CacheValor, ResultadoInquisicaoCompleto

2. **Criar utilitários compartilhados** (risco médio)
   - occurrence.ts, resultado.ts, config.ts

3. **Quebrar arquivos grandes** (risco médio)
   - cli/options.ts, core/config/config.ts

4. **Limpar re-exports** (risco baixo)
   - shared/index.ts, index.ts principal

5. **Aprimorar type safety** (risco alto - pode quebrar código)
   - Substituir tipos permissivos

---

## ⚠️ Riscos

- **Quebrar imports existentes**: qualquer mudança de caminho requer update em todo o codebase
- **Unificar tipos**: pode perder granularidade necessária
- **Refinar tipos**: pode causar erros de compilação em cascata

**Recomendação**: Fazer mudanças incrementais, com testes de compilação após cada etapa.

---

## 📎 Scripts Úteis

```bash
# Verificar erros de tipo antes de começar
npm run typecheck

# Após cada mudança
npm run typecheck && npm run lint
```

---

*Gerado em: 2026-03-01*

