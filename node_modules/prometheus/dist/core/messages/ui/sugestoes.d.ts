export declare const SUGESTOES_COMANDOS: {
    usarFull: string;
    usarJson: string;
    combinarJsonExport: string;
    usarExport: string;
    usarInclude: string;
    usarExclude: string;
    usarDryRun: string;
    removerDryRun: string;
    usarInterativo: string;
    usarGuardian: string;
    usarBaseline: string;
    usarAutoFix: string;
};
export declare const SUGESTOES_DIAGNOSTICO: {
    modoExecutivo: string;
    primeiraVez: string[];
    projetoGrande: string[];
    poucoProblemas: string;
    muitosProblemas: string[];
    usarFiltros: string;
};
export declare const SUGESTOES_AUTOFIX: {
    autoFixDisponivel: string;
    autoFixAtivo: string;
    dryRunRecomendado: string;
    semMutateFS: string;
    validarDepois: string[];
};
export declare const SUGESTOES_GUARDIAN: {
    guardianDesabilitado: string;
    primeiroBaseline: string[];
    driftDetectado: string[];
    integridadeOK: string;
};
export declare const SUGESTOES_TIPOS: {
    ajustarConfianca: (atual: number) => string;
    revisar: (categoria: string) => string;
    anyEncontrado: string[];
    unknownLegitimo: string;
    melhoravelDisponivel: string;
};
export declare const SUGESTOES_ARQUETIPOS: {
    monorepo: string[];
    biblioteca: string[];
    cli: string[];
    api: string[];
    frontend: string[];
    confiancaBaixa: string[];
};
export declare const SUGESTOES_REESTRUTURAR: {
    backupRecomendado: string[];
    validarDepois: string[];
    usarDryRun: string;
};
export declare const SUGESTOES_PODAR: {
    cuidado: string[];
    revisar: string;
    usarDryRun: string;
};
export declare const SUGESTOES_METRICAS: {
    baseline: string[];
    tendencias: string;
    comparacao: string;
};
export declare const SUGESTOES_ZELADOR: {
    imports: string[];
    estrutura: string[];
};
export declare function gerarSugestoesContextuais(contexto: {
    comando: string;
    temProblemas: boolean;
    countProblemas?: number;
    autoFixDisponivel?: boolean;
    guardianAtivo?: boolean;
    arquetipo?: string;
    flags?: string[];
}): string[];
export declare function formatarSugestoes(sugestoes: string[], titulo?: string): string[];
export declare const SUGESTOES: {
    readonly comandos: {
        usarFull: string;
        usarJson: string;
        combinarJsonExport: string;
        usarExport: string;
        usarInclude: string;
        usarExclude: string;
        usarDryRun: string;
        removerDryRun: string;
        usarInterativo: string;
        usarGuardian: string;
        usarBaseline: string;
        usarAutoFix: string;
    };
    readonly diagnostico: {
        modoExecutivo: string;
        primeiraVez: string[];
        projetoGrande: string[];
        poucoProblemas: string;
        muitosProblemas: string[];
        usarFiltros: string;
    };
    readonly autofix: {
        autoFixDisponivel: string;
        autoFixAtivo: string;
        dryRunRecomendado: string;
        semMutateFS: string;
        validarDepois: string[];
    };
    readonly guardian: {
        guardianDesabilitado: string;
        primeiroBaseline: string[];
        driftDetectado: string[];
        integridadeOK: string;
    };
    readonly tipos: {
        ajustarConfianca: (atual: number) => string;
        revisar: (categoria: string) => string;
        anyEncontrado: string[];
        unknownLegitimo: string;
        melhoravelDisponivel: string;
    };
    readonly arquetipos: {
        monorepo: string[];
        biblioteca: string[];
        cli: string[];
        api: string[];
        frontend: string[];
        confiancaBaixa: string[];
    };
    readonly reestruturar: {
        backupRecomendado: string[];
        validarDepois: string[];
        usarDryRun: string;
    };
    readonly podar: {
        cuidado: string[];
        revisar: string;
        usarDryRun: string;
    };
    readonly metricas: {
        baseline: string[];
        tendencias: string;
        comparacao: string;
    };
    readonly zelador: {
        imports: string[];
        estrutura: string[];
    };
};
export default SUGESTOES;
//# sourceMappingURL=sugestoes.d.ts.map