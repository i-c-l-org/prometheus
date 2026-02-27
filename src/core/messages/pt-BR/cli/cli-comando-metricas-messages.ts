// SPDX-License-Identifier: MIT

import { CliCommonMensagens } from './cli-common-messages.js';

export const CliComandoMetricasMensagens = {
  descricao: 'Inspeciona histórico de métricas de execuções anteriores',
  opcoes: {
    json: CliCommonMensagens.opcoes.json,
    limite: 'Quantidade de registros mais recentes (default 10)',
    export: 'Exporta histórico completo em JSON para arquivo',
    analistas: 'Exibe tabela agregada por analista (top 5)'
  },
  erroProcessar: (erro: string) => `Falha ao processar métricas: ${erro}`,
  historicoExportado: (destino: string) => `?? Histórico completo exportado para ${destino}`,
  linhaExecucao: (timestampISO: string, totalArquivos: number, duracaoAnalise: string, duracaoParsing: string, cacheHits: number, cacheMiss: number) => `- ${timestampISO} | arquivos=${totalArquivos} analise=${duracaoAnalise} parsing=${duracaoParsing} cache(h/m)=${cacheHits}/${cacheMiss}`,
  tituloTopAnalistas: (iconeInfo: string) => `${iconeInfo} Top analistas (por tempo acumulado):`,
  linhaTopAnalista: (nome: string, total: string, media: string, execucoes: number, ocorrencias: number) => `  • ${nome} total=${total} média=${media} exec=${execucoes} ocorr=${ocorrencias}`,
  medias: (mediaAnalise: string, mediaParsing: string) => `\nMédias (histórico completo): analise=${mediaAnalise}, parsing=${mediaParsing}`,
  linhaEmBranco: ''
} as const;