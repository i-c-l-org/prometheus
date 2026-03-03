// SPDX-License-Identifier: MIT-0

/**
 * Tipos de validação reutilizáveis
 * Objetivo: Consolidar tipos para validação, regras e verificações
 */

/**
 * Tipo padronizado para errors em toda a aplicação
 */
export type ErrorLike = Error | ErroComMensagem | { message: string };

/**
 * Objetos de erro genéricos
 */
export interface ErroComMensagem {
  message: string | Error;
  name?: string;
  stack?: string;
  code?: string | number;
  cause?: Error;
}

/**
 * Regra de validação
 */
export interface RegrasSuprimidas {
  padrao?: string | RegExp;
  motivo?: string;
  data?: string;
}

/**
 * Configuração de regra
 */
export interface RuleConfig {
  nome: string;
  ativo?: boolean;
  severidade?: 'info' | 'aviso' | 'erro';
  opcoes?: Record<string, unknown>;
}

/**
 * Override de regra
 */
export interface RuleOverride {
  regra: string;
  valor: unknown;
  arquivo?: string;
}

/**
 * Informação de supressão
 */
export interface SupressaoInfo {
  regra: string;
  arquivo: string;
  linha?: number;
  motivo?: string;
}

/**
 * API DisplayNames do Intl
 */
export interface DisplayNamesAPI {
  of: (input: string) => string | undefined;
}

/**
 * Constructor de DisplayNames
 */
export interface DisplayNamesConstructor {
  new (locales: string[], options: { type: string }): DisplayNamesAPI;
}

/**
 * Intl com DisplayNames tipado
 */
export interface IntlComDisplayNames {
  DisplayNames?: DisplayNamesConstructor;
  DateTimeFormat?: typeof Intl.DateTimeFormat;
  NumberFormat?: typeof Intl.NumberFormat;
  Collator?: typeof Intl.Collator;
}

/**
 * Função de import dinâmico
 */
export type ImportDinamico = (path: string) => Promise<unknown>;

/**
 * Objeto com import dinâmico
 */
export interface GlobalComImport {
  __dirname?: string;
  __filename?: string;
  import?: ImportDinamico;
}

/**
 * Objeto com vitest
 */
export interface GlobalComVitest {
  vi?: {
    mock?: (path: string) => void;
    resetModules?: () => void;
  };
  describe?: (nome: string, fn: () => void) => void;
  it?: (nome: string, fn: () => void | Promise<void>) => void;
}

/**
 * Mock function do Vitest
 */
export type VitestMockFn = {
  (...args: unknown[]): unknown;
  mock?: { calls?: unknown[][] };
  mockReturnValue?: (v: unknown) => void;
};

/**
 * Wrapper para spy do Vitest
 */
export interface VitestSpyWrapper {
  original: unknown;
  spy?: VitestMockFn;
}

/**
 * Snapshot de análise para teste
 */
export type SnapshotAnalise = {
  versao?: string;
  data?: string;
  resultados?: Record<string, unknown>;
};

/**
 * Mapa de reversão (string mapping)
 */
export interface EntradaMapaReversao {
  chave: string;
  valor: string;
  tipo?: string;
}

/**
 * Plugin de configuração
 */
export interface ConfigPlugin {
  nome: string;
  aplicar: (config: Record<string, unknown>) => Record<string, unknown>;
}

/**
 * Erros com mensagem parametrizável
 */
export interface ErroValidacaoCombinacao {
  tipo: string;
  mensagem: string;
  esperado?: unknown;
  obtido?: unknown;
}

/**
 * Guard functions
 */
export function isConfigPlugin(value: unknown): value is ConfigPlugin {
  return (
    typeof value === 'object' &&
    value !== null &&
    'nome' in value &&
    'aplicar' in value &&
    typeof (value as ConfigPlugin).nome === 'string' &&
    typeof (value as ConfigPlugin).aplicar === 'function'
  );
}

export function isErroComMensagem(value: unknown): value is ErroComMensagem {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    (typeof (value as ErroComMensagem).message === 'string' ||
      (value as ErroComMensagem).message instanceof Error)
  );
}

export function isGlobalComImport(value: unknown): value is GlobalComImport {
  return typeof value === 'object' && value !== null && ('import' in value || '__dirname' in value);
}

export function isGlobalComVitest(value: unknown): value is GlobalComVitest {
  return typeof value === 'object' && value !== null && ('vi' in value || 'describe' in value);
}

export function isIntlComDisplayNames(value: unknown): value is IntlComDisplayNames {
  return (
    typeof value === 'object' &&
    value !== null &&
    ('DisplayNames' in value || 'DateTimeFormat' in value)
  );
}

/**
 * Validação segura com type narrowing
 */
export function validarSeguro<T>(
  valor: unknown,
  guard: (v: unknown) => v is T,
  padrao: T,
): T {
  return guard(valor) ? valor : padrao;
}

/**
 * Helper para extrair mensagem de erro
 */
export function extrairMensagemErro(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (isErroComMensagem(error)) {
    if (typeof error.message === 'string') {
      return error.message;
    }
    if (error.message instanceof Error) {
      return error.message.message;
    }
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    const msg = (error as { message: string | Error }).message;
    if (typeof msg === 'string') return msg;
  }
  return 'Erro desconhecido';
}
