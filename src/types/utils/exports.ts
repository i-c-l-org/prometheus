// SPDX-License-Identifier: MIT-0

/**
 * Tipos de exportação reutilizáveis
 * Objetivo: Consolidar padrão Options + Result para diferentes exportadores
 */

/**
 * Opções base para exportação
 */
export interface ExportOptions {
  baseDir: string;
  verbose?: boolean;
  formato?: 'json' | 'markdown' | 'csv' | 'html';
  timestamp?: string;
}

/**
 * Resultado base de exportação
 */
export interface ExportResult {
  arquivo: string;
  caminho: string;
  formato: string;
  timestamp: string;
  tamanho?: number;
}

/**
 * Opções para exportação JSON
 */
export interface JsonExportOptions extends ExportOptions {
  indent?: number;
  schema?: 'prometheus' | 'generic';
}

/**
 * Opções para exportação Markdown
 */
export interface MarkdownExportOptions extends ExportOptions {
  incluirTOC?: boolean;
  nivel?: 1 | 2 | 3;
}

/**
 * Opções para Fix-Types
 */
export interface FixTypesExportOptions extends ExportOptions {
  casos?: Array<{
    arquivo: string;
    linha?: number;
    tipo: string;
    categoria: string;
    confianca: number;
  }>;
  stats?: {
    legitimo: number;
    melhoravel: number;
    corrigir: number;
    totalConfianca: number;
  };
  minConfidence?: number;
}

/**
 * Resultado de Fix-Types
 */
export interface FixTypesExportResult extends ExportResult {
  markdown: string;
  json: string;
  dir: string;
}

/**
 * Opções para Guardian
 */
export interface GuardianExportOptions extends ExportOptions {
  incluirSnapshot?: boolean;
  incluirBaseline?: boolean;
  incluirIntegridade?: boolean;
}

/**
 * Resultado de Guardian
 */
export interface GuardianExportResult extends ExportResult {
  baseline?: string;
  snapshot?: string;
  integridade?: string;
}

/**
 * Opções para Poda (cleanup)
 */
export interface PodaExportOptions extends ExportOptions {
  incluirSimulacao?: boolean;
  incluirDetalhes?: boolean;
}

/**
 * Resultado de Poda
 */
export interface PodaExportResult extends ExportResult {
  simulacao?: string;
  detalhes?: string;
  arquivosAfetados?: number;
}

/**
 * Opções para Reestruturação
 */
export interface ReestruturacaoExportOptions extends ExportOptions {
  incluirArquetipos?: boolean;
  incluirPlano?: boolean;
}

/**
 * Resultado de Reestruturação
 */
export interface ReestruturacaoExportResult extends ExportResult {
  arquetipos?: string;
  plano?: string;
  sugestoes?: string[];
}

/**
 * Resultado para SVG (otimização)
 */
export interface SvgExportResult {
  arquivo: string;
  originalBytes: number;
  optimizedBytes: number;
  mudancas?: Array<{
    prop?: string;
    prevValue?: string | number;
    nextValue?: string | number;
  }>;
}
