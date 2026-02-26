import { CliCommonMensagens } from './cli-common-messages.js';
export const CliComandoMetricasMensagens = {
    descricao: 'Inspeciona histórico de métricas de execuções anteriores',
    opcoes: {
        json: CliCommonMensagens.opcoes.json,
        limite: 'Quantidade de registros mais recentes (default 10)',
        export: 'Exporta histórico completo em JSON para arquivo',
        analistas: 'Exibe tabela agregada por analista (top 5)'
    },
    erroProcessar: (erro) => `Falha ao processar métricas: ${erro}`,
    historicoExportado: (destino) => `?? Histórico completo exportado para ${destino}`,
    linhaExecucao: (timestampISO, totalArquivos, duracaoAnalise, duracaoParsing, cacheHits, cacheMiss) => `- ${timestampISO} | arquivos=${totalArquivos} analise=${duracaoAnalise} parsing=${duracaoParsing} cache(h/m)=${cacheHits}/${cacheMiss}`,
    tituloTopAnalistas: (iconeInfo) => `${iconeInfo} Top analistas (por tempo acumulado):`,
    linhaTopAnalista: (nome, total, media, execucoes, ocorrencias) => `  • ${nome} total=${total} média=${media} exec=${execucoes} ocorr=${ocorrencias}`,
    medias: (mediaAnalise, mediaParsing) => `\nMédias (histórico completo): analise=${mediaAnalise}, parsing=${mediaParsing}`,
    linhaEmBranco: ''
};
//# sourceMappingURL=cli-comando-metricas-messages.js.map