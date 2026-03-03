// SPDX-License-Identifier: MIT-0

/**
 * Tipos de resultado/response reutilizáveis
 * Objetivo: Padronizar tipos que representam outcomes de operações
 */

import type { Ocorrencia } from '@';

/**
 * Resultado genérico de aplicação de técnica
 */
export type TecnicaAplicarResultado = Ocorrencia | Ocorrencia[] | null | undefined;

/**
 * Resultado base - padrão para operações que retornam sucesso/falha
 */
export interface ResultadoBase<T = unknown> {
  sucesso: boolean;
  dados?: T;
  erro?: string | Error;
}

/**
 * Resultado de migração (registry)
 */
export interface MigrationResult {
  migrado: boolean;
  versaoAnterior?: string;
  versaoNova?: string;
  mudancas?: string[];
}

/**
 * Resultado de análise estrutural (AST)
 */
export interface ResultadoAnaliseEstrutural {
  nodos?: unknown[];
  complexidade?: number;
  profundidade?: number;
}

/**
 * Resultado de detecção com contexto
 */
export interface ResultadoDeteccaoContextual {
  detectado: boolean;
  contexto?: Record<string, unknown>;
  confianca?: number;
}

/**
 * Resultado de contexto (para funções)
 */
export interface ResultadoContexto {
  tipo: string;
  argumentos?: number;
  corpo?: unknown;
  isAsync?: boolean;
}

/**
 * Resultado de operação de Guardian (segurança)
 */
export type GuardianResultType = 'passed' | 'failed' | 'warning' | 'pending';

/**
 * Resultado formatado mínimo (SVGO/Formatter)
 */
export type FormatadorMinimoResultOk = {
  data: string;
  error?: undefined;
};

export type FormatadorMinimoResultError = {
  error: string;
  data?: undefined;
};

export type FormatadorMinimoResult = FormatadorMinimoResultOk | FormatadorMinimoResultError;

/**
 * Mudança no SVGO
 */
export interface SvgoMinimoMudanca {
  prop?: string;
  prevValue?: string | number;
  nextValue?: string | number;
  type?: string;
}

/**
 * Resultado de SVGO
 */
export interface SvgoMinimoResult {
  data?: string;
  error?: string;
}

/**
 * Resultado de correção automática
 */
export interface CorrecaoResult {
  arquivo: string;
  linhas: number[];
  codigo: string;
  sucesso: boolean;
}

/**
 * Resultado de exportação
 */
export interface ExportacaoResultado {
  arquivo: string;
  formato: string;
  tamanho?: number;
  timestamp?: string;
}
