// SPDX-License-Identifier: MIT-0

export interface ResultadoBase {
  timestamp: number;
  duracaoMs: number;
}

export interface ResultadoComArquivos extends ResultadoBase {
  arquivosAnalisados: string[];
  totalArquivos: number;
}

export interface ResultadoStatus {
  status: 'ok' | 'problemas' | 'erro';
}

export interface ResultadoComOcorrencias<T = unknown> extends ResultadoBase {
  ocorrencias: T[];
  totalOcorrencias: number;
}
