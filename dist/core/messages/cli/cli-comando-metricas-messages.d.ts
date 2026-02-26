export declare const CliComandoMetricasMensagens: {
    readonly descricao: "Inspeciona histórico de métricas de execuções anteriores";
    readonly opcoes: {
        readonly json: string;
        readonly limite: "Quantidade de registros mais recentes (default 10)";
        readonly export: "Exporta histórico completo em JSON para arquivo";
        readonly analistas: "Exibe tabela agregada por analista (top 5)";
    };
    readonly erroProcessar: (erro: string) => string;
    readonly historicoExportado: (destino: string) => string;
    readonly linhaExecucao: (timestampISO: string, totalArquivos: number, duracaoAnalise: string, duracaoParsing: string, cacheHits: number, cacheMiss: number) => string;
    readonly tituloTopAnalistas: (iconeInfo: string) => string;
    readonly linhaTopAnalista: (nome: string, total: string, media: string, execucoes: number, ocorrencias: number) => string;
    readonly medias: (mediaAnalise: string, mediaParsing: string) => string;
    readonly linhaEmBranco: "";
};
//# sourceMappingURL=cli-comando-metricas-messages.d.ts.map