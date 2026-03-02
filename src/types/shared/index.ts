// SPDX-License-Identifier: MIT-0
/**
 * Exportações centralizadas de tipos do shared
 */

export type {
  NomeacaoEstilo,
  OpcoesEstrategista,
  ParseNomeResultado,
} from './estrutura.js';
export type {
  FrameworkInfo,
  MagicConstantRule,
  MemoryMessage,
  RegrasSuprimidas,
  RuleConfig,
  RuleOverride,
  SupressaoInfo,
} from './helpers.js';
export type {
  FormatadorMinimoParser,
  FormatadorMinimoResult,
  FormatadorMinimoResultError,
  FormatadorMinimoResultOk,
  SvgoMinimoMudanca,
  SvgoMinimoResult,
} from './impar.js';
export type { ImportReescrito } from './imports.js';
export type { PrometheusContextState, PrometheusRunRecord } from './memory.js';
export type {
  SalvarBinarioFn,
  SalvarEstadoFn,
  VitestSpyWrapper,
} from './persistencia.js';
export type {
  CssDuplicateContext,
  CssLintSeverity,
  CssLintWarning,
  CssTreeNode,
} from './stylelint.js';
export * from './types/index.js';
export type {
  ConfigPlugin,
  DisplayNamesAPI,
  DisplayNamesConstructor,
  EntradaMapaReversao,
  ErroComMensagem,
  ErrorLike,
  ErroValidacaoCombinacao,
  GlobalComImport,
  GlobalComVitest,
  ImportDinamico,
  IntlComDisplayNames,
  SnapshotAnalise,
  VitestMockFn,
} from './validacao.js';
export {
  extrairMensagemErro,
  isConfigPlugin,
  isErroComMensagem,
  isGlobalComImport,
  isGlobalComVitest,
  isIntlComDisplayNames,
  validarSeguro,
} from './validacao.js';
export type { VitestAlias } from './vitest-alias.js';
