// SPDX-License-Identifier: MIT-0

/**
 * Tipos de contexto reutilizáveis - consolidados de múltiplos arquivos
 * Objetivo: Centralizar tipos que representam estado/contexto de execução
 */

import type { FileEntryWithAst, Ocorrencia } from '@';

import type { GuardianResult } from '../guardian/resultado.js';

/**
 * Contexto base de execução - usado em analistas, parsing, detectores
 */
export interface ContextoExecucao {
  baseDir: string;
  arquivos: FileEntryWithAst[];
  ambiente?: AmbienteExecucao;
  /**
   * Canal opcional para reportar ocorrências de forma desacoplada de mensagens.
   * Atenção: não deve ser serializado/replicado para Worker Threads (funções não são clonáveis).
   */
  report?: ReporterFn;
}

/**
 * Ambiente de execução com validação de arquivos e segurança
 */
export interface AmbienteExecucao {
  arquivosValidosSet: Set<string>;
  guardian: GuardianResult;
}

/**
 * Evento de relatório com nível e dados estruturados
 */
export interface ReportEvent {
  /** Código estável para i18n/mapeamento de mensagens (ex.: ARQ_PADRAO) */
  code?: string;
  /** Tipo de ocorrência (ex.: analise-arquitetura) */
  tipo: string;
  nivel?: ReportNivel;
  /** Mensagem final (quando já formatada) */
  mensagem?: string;
  /** Dados estruturados para formar a mensagem no reporter */
  data?: Record<string, unknown>;
  relPath: string;
  linha?: number;
  coluna?: number;
  origem?: string;
}

/**
 * Nível de severidade de relatório
 */
export type ReportNivel = 'info' | 'aviso' | 'erro' | 'sucesso';

/**
 * Função reporter para canalizar ocorrências
 */
export type ReporterFn = (event: ReportEvent) => Ocorrencia | void;

/**
 * Contexto de análise para detectores (evidence/proof context)
 */
export interface EvidenciaContexto {
  arquivo: string;
  linha?: number;
  tipo: string;
  evidencia: unknown;
}

/**
 * Contexto de projeto (detecção de tipo/framework)
 */
export interface ContextoProjeto {
  isBot: boolean;
  isCLI: boolean;
  isWebApp: boolean;
  isLibrary: boolean;
  isTest: boolean;
  isConfiguracao: boolean;
  isInfrastructure: boolean;
  frameworks: string[];
  linguagens: string[];
  arquetipo?: string;
}

/**
 * Contexto de relatório (processamento de outputs)
 */
export interface ContextoRelatorio {
  total: number;
  processados: number;
  erros: number;
  tempo?: number;
  avisos?: number;
  sucessos?: number;
  fase?: string;
  detalhes?: string;
  [key: string]: unknown;
}

/**
 * Contexto de inferência de tipos
 */
export interface TypeInferenceContext {
  nomeVariavel?: string;
  tipoInferido?: string;
  confianca?: number;
  sugestao?: string;
}

/**
 * Contexto genérico para logs
 */
export type LogContext = 'simples' | 'medio' | 'complexo' | 'ci';

/**
 * Estado de contexto do Prometheus em memory
 */
export type PrometheusContextState = {
  fase?: string;
  totalArquivos?: number;
  arquivosProcessados?: number;
  ultimoErro?: unknown;
  timestamp?: number;
};

/**
 * Opções para detecção de contexto
 */
export interface DetectarContextoOpcoes {
  arquivo: string;
  conteudo: string;
  relPath?: string;
  packageJson?: Record<string, unknown>;
}
