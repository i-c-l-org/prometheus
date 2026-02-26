type ErroUnknown = unknown;
export declare const DetectorArquiteturaMensagens: {
    padraoArquitetural: (padraoIdentificado: string | undefined, confianca: number) => string;
    caracteristicas: (caracteristicas: string[]) => string;
    violacao: (violacao: string) => string;
    metricas: (acoplamento: number, coesao: number) => string;
    erroAnalisarArquitetura: (erro: ErroUnknown) => string;
};
export {};
//# sourceMappingURL=detector-arquitetura-messages.d.ts.map