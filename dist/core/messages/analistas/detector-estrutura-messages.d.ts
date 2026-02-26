type EntrypointsAgrupadosArgs = {
    previewGrupos: string;
    sufixoOcultos?: string;
};
export declare const DetectorEstruturaMensagens: {
    monorepoDetectado: string;
    monorepoSemPackages: string;
    fullstackDetectado: string;
    pagesSemApi: string;
    estruturaMista: string;
    muitosArquivosRaiz: string;
    sinaisBackend: string;
    sinaisFrontend: string;
    projetoGrandeSemSrc: string;
    arquivosConfigDetectados: (detectados: string[]) => string;
    multiplosEntrypointsAgrupados: ({ previewGrupos, sufixoOcultos }: EntrypointsAgrupadosArgs) => string;
    multiplosEntrypointsLista: (preview: string[], resto: number) => string;
};
export {};
//# sourceMappingURL=detector-estrutura-messages.d.ts.map