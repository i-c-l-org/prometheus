type ErroUnknown = unknown;
export declare const DetectorAgregadosMensagens: {
    problemasSegurancaResumo: (severidade: string, resumo: string, total: number) => string;
    erroAnalisarSeguranca: (erro: ErroUnknown) => string;
    problemasPerformanceResumo: (impacto: string, resumo: string, total: number) => string;
    erroAnalisarPerformance: (erro: ErroUnknown) => string;
    problemasDocumentacaoResumo: (prioridade: string, resumo: string, total: number) => string;
    erroAnalisarDocumentacao: (erro: ErroUnknown) => string;
    duplicacoesResumo: (tipo: string, resumo: string, total: number) => string;
    erroAnalisarDuplicacoes: (erro: ErroUnknown) => string;
    problemasTesteResumo: (severidade: string, resumo: string, total: number) => string;
    erroAnalisarQualidadeTestes: (erro: ErroUnknown) => string;
};
export {};
//# sourceMappingURL=detector-agregados-messages.d.ts.map