// SPDX-License-Identifier: MIT-0

export type OcorrenciaNivel = 'erro' | 'aviso' | 'info' | 'sucesso';

export interface OcorrenciaBase {
  mensagem: string;
  relPath: string;
  tipo?: string;
  nivel?: string | OcorrenciaNivel;
  linha?: number;
  coluna?: number;
  origem?: string;
  arquivo?: string;
}

export interface OcorrenciaAnalista extends OcorrenciaBase {
  tipo: string;
  nivel?: OcorrenciaNivel;
}

export interface OcorrenciaErroAnalista extends OcorrenciaAnalista {
  tipo: 'ERRO_ANALISTA';
  stack?: string;
}

export interface OcorrenciaComplexidadeFuncao extends OcorrenciaAnalista {
  tipo: 'FUNCAO_COMPLEXA';
  linhas?: number;
  parametros?: number;
  aninhamento?: number;
  limites?: {
    maxLinhas?: number;
    maxParametros?: number;
    maxAninhamento?: number;
  };
}

export interface OcorrenciaParseErro extends OcorrenciaAnalista {
  tipo: 'PARSE_ERRO';
  detalhe?: string;
  trecho?: string;
}

export interface OcorrenciaComFix extends OcorrenciaAnalista {
  sugestao?: string;
  quickFixId?: string;
  confidence?: number;
  category?: string;
  matchIndex?: number;
  matchLength?: number;
  contexto?: string;
  detalhes?: Record<string, unknown>;
}

export type Ocorrencia =
  | OcorrenciaBase
  | OcorrenciaAnalista
  | OcorrenciaErroAnalista
  | OcorrenciaComplexidadeFuncao
  | OcorrenciaParseErro
  | OcorrenciaComFix;

export function criarOcorrencia(
  base: Pick<OcorrenciaBase, 'mensagem' | 'relPath'> & Partial<OcorrenciaBase>,
): OcorrenciaBase {
  return {
    nivel: 'info',
    origem: 'prometheus',
    ...base,
    mensagem: base.mensagem.trim(),
  };
}

export function ocorrenciaErroAnalista(data: {
  mensagem: string;
  relPath: string;
  stack?: string;
  origem?: string;
}): OcorrenciaErroAnalista {
  return {
    tipo: 'ERRO_ANALISTA',
    nivel: 'erro',
    origem: 'prometheus',
    ...data,
    mensagem: data.mensagem.trim(),
  };
}

export function ocorrenciaFuncaoComplexa(data: {
  mensagem: string;
  relPath: string;
  linhas?: number;
  parametros?: number;
  aninhamento?: number;
  limites?: {
    maxLinhas?: number;
    maxParametros?: number;
    maxAninhamento?: number;
  };
  origem?: string;
}): OcorrenciaComplexidadeFuncao {
  return {
    tipo: 'FUNCAO_COMPLEXA',
    nivel: 'aviso',
    origem: 'prometheus',
    ...data,
    mensagem: data.mensagem.trim(),
  };
}

export function ocorrenciaParseErroFactory(data: {
  mensagem: string;
  relPath: string;
  detalhe?: string;
  trecho?: string;
  origem?: string;
  linha?: number;
  coluna?: number;
}): OcorrenciaParseErro {
  return {
    tipo: 'PARSE_ERRO',
    nivel: 'erro',
    origem: 'prometheus',
    ...data,
    mensagem: data.mensagem.trim(),
  };
}

export { ocorrenciaParseErroFactory as ocorrenciaParseErro };
