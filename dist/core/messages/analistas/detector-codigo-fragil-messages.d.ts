type ErroUnknown = unknown;
type FragilidadesDetalhesArgs = {
    severidade: string;
    total: number;
    tipos: Record<string, number>;
    amostra: string[];
};
export declare const DetectorCodigoFragilMensagens: {
    fragilidadesResumo: (severidade: string, resumo: string, detalhes: FragilidadesDetalhesArgs) => string;
    erroAnalisarCodigoFragil: (erro: ErroUnknown) => string;
};
export {};
//# sourceMappingURL=detector-codigo-fragil-messages.d.ts.map