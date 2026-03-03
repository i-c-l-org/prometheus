// SPDX-License-Identifier: MIT-0

/**
 * Tipos de handlers, callbacks e funções reutilizáveis
 * Objetivo: Consolidar patterns de funções e event handlers
 */

import type { Pendencia } from '@';

/**
 * Informação sobre um handler/função
 */
export interface HandlerInfo {
  nome?: string;
  tipo?: 'comando' | 'evento' | 'query';
  parametros?: string[];
  descricao?: string;
  middleware?: boolean;
  path?: string;
  // Campos adicionais observados em runtime / analisadores
  func?: unknown; // referência ao nó/função original (Babel node)
  bodyBlock?: { start?: number | null; end?: number | null; body?: unknown };
  isAnonymous?: boolean;
  params?: unknown[];
  totalParams?: number;
  node?: unknown;
}

/**
 * Registro de comando com handler
 */
export interface ComandoRegistro {
  id?: string;
  timestamp: string;
  handler?: HandlerInfo | undefined;
  payload?: unknown;
  // Campos runtime observados
  comandoNome?: string;
  node?: unknown;
  origemFramework?: string;
}

/**
 * Opções para exportação de relatórios
 */
export interface ExportadorOpcoes {
  baseDir: string;
  verbose?: boolean;
  formato?: 'json' | 'markdown' | 'csv';
}

/**
 * Resultado de exportação de dados
 */
export interface ExportadorResultados {
  arquivo: string;
  caminho: string;
  formato: string;
  timestamp: string;
  tamanho?: number;
  pendencias?: Pendencia[];
}

/**
 * Caso de tipo inseguro (tipo-safety handler)
 */
export interface CasoTipoInseguro {
  arquivo: string;
  linha?: number;
  tipo: 'tipo-inseguro-any' | 'tipo-inseguro-unknown';
  categoria: 'legitimo' | 'melhoravel' | 'corrigir';
  confianca: number;
  motivo: string;
  variantes?: string[];
  contexto?: string;
}

/**
 * Opções para fix-types
 */
export interface FixTypesExportOptions {
  baseDir: string;
  casos: CasoTipoInseguro[];
  stats: {
    legitimo: number;
    melhoravel: number;
    corrigir: number;
    totalConfianca: number;
  };
  minConfidence: number;
  verbose: boolean;
}

/**
 * Resultado de fix-types
 */
export interface FixTypesExportResult {
  markdown: string;
  json: string;
  dir: string;
}

/**
 * Callback genérico de leitura
 */
export type LeitorCallback<T = unknown> = (erro: Error | null, dados?: T) => void;

/**
 * Callback de processamento
 */
export type ProcessadorCallback<I = unknown, O = unknown> = (item: I) => O | Promise<O>;

/**
 * Callback de evento
 */
export type EventoCallback<T = unknown> = (evento: T) => void | Promise<void>;

/**
 * Função de diagnóstico (retorna ocorrências)
 */
export type DiagnosticoHandler = (arquivo: string) => Promise<unknown[]>;

/**
 * Função middleware (com next)
 */
export type MiddlewareHandler = (dados: unknown, proximo: () => void | Promise<void>) => void | Promise<void>;
