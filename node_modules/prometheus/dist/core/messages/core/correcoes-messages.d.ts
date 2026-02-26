export declare const MENSAGENS_CORRECAO_TIPOS: {
    fixAny: {
        title: string;
        description: string;
    };
    fixUnknown: {
        title: string;
        description: string;
    };
    validacao: {
        falha: (erros: string[]) => string;
        revisar: string;
    };
    warnings: {
        confiancaBaixa: (confianca: number) => string;
        confiancaMedia: (confianca: number, tipoSugerido: string) => string;
        unknownApropriado: string;
        useTiposCentralizados: () => string;
        criarTipoDedicado: (caminho: string) => string;
        adicioneTypeGuards: () => string;
    };
    erros: {
        extrairNome: string;
        variavelNaoUsada: string;
        analise: (erro: string) => string;
    };
};
export declare const MENSAGENS_AUTOFIX: {
    iniciando: (modo: string) => string;
    dryRun: string;
    aplicando: (count: number) => string;
    concluido: (aplicadas: number, falhas: number) => string;
    naoDisponivel: string;
    flags: {
        fixSafe: string;
        requireMutateFS: string;
    };
    logs: {
        modoConservador: string;
        validarEslint: string;
        arquivoMovido: (origem: string, destino: string) => string;
        arquivoRevertido: (origem: string, destino: string) => string;
        arquivoRevertidoConteudo: (origem: string, destino: string) => string;
    };
    resultados: {
        sucesso: (count: number) => string;
        falhas: (count: number) => string;
        erroArquivo: (arquivo: string, erro: string) => string;
    };
    dicas: {
        executarLint: string;
        executarBuild: string;
        removerDryRun: string;
        ajustarConfianca: string;
    };
};
export declare const MENSAGENS_RELATORIOS_ANALISE: {
    asyncPatterns: {
        titulo: string;
        padroes: string;
        recomendacoes: string;
        critico: string;
        alto: string;
        salvo: (caminho: string) => string;
    };
    fixTypes: {
        analiseSalva: string;
        possibilidades: string;
        sugestao: (texto: string) => string;
        exportado: string;
    };
    guardian: {
        baselineAceito: string;
        exportado: string;
    };
};
export declare const MENSAGENS_ARQUETIPOS_HANDLER: {
    timeout: string;
    salvo: (caminho: string) => string;
    falha: string;
    falhaEstrategista: string;
    falhaGeral: string;
};
export declare const MENSAGENS_PLUGINS: {
    registrado: (nome: string, extensoes: string[]) => string;
    configAtualizada: string;
    erroParsear: (linguagem: string, erro: string) => string;
};
export declare const MENSAGENS_EXECUTOR: {
    analiseCompleta: (tecnica: string, arquivo: string, duracao: string) => string;
    fastModeAtivado: string;
    analiseRapidaConcluida: (total: number, duracao: string) => string;
    tecnicaGlobalSucesso: (nome: string) => string;
    tecnicaGlobalErro: (nome: string, erro: string) => string;
    tecnicaGlobalTimeout: (nome: string) => string;
    tecnicaGlobalTimeoutOcorrencia: (nome: string, timeout: number) => string;
    tecnicaGlobalErroOcorrencia: (nome: string, erro: string) => string;
    tecnicaLocalErro: (nome: string, arquivo: string, erro: string) => string;
    tecnicaLocalTimeoutOcorrencia: (nome: string, arquivo: string, timeout: number) => string;
    tecnicaLocalErroOcorrencia: (nome: string, arquivo: string, erro: string) => string;
    stackTrace: string;
    arquivosAnalisadosProgress: (atual: number, total: number) => string;
    arquivosAnalisadosTotal: (total: number) => string;
    arquivoProcessando: (atual: number, total: number, path: string) => string;
    falhaPersistirMetricas: (erro: string) => string;
};
export declare const MENSAGENS_CORRECOES: {
    readonly fixTypes: {
        fixAny: {
            title: string;
            description: string;
        };
        fixUnknown: {
            title: string;
            description: string;
        };
        validacao: {
            falha: (erros: string[]) => string;
            revisar: string;
        };
        warnings: {
            confiancaBaixa: (confianca: number) => string;
            confiancaMedia: (confianca: number, tipoSugerido: string) => string;
            unknownApropriado: string;
            useTiposCentralizados: () => string;
            criarTipoDedicado: (caminho: string) => string;
            adicioneTypeGuards: () => string;
        };
        erros: {
            extrairNome: string;
            variavelNaoUsada: string;
            analise: (erro: string) => string;
        };
    };
    readonly autofix: {
        iniciando: (modo: string) => string;
        dryRun: string;
        aplicando: (count: number) => string;
        concluido: (aplicadas: number, falhas: number) => string;
        naoDisponivel: string;
        flags: {
            fixSafe: string;
            requireMutateFS: string;
        };
        logs: {
            modoConservador: string;
            validarEslint: string;
            arquivoMovido: (origem: string, destino: string) => string;
            arquivoRevertido: (origem: string, destino: string) => string;
            arquivoRevertidoConteudo: (origem: string, destino: string) => string;
        };
        resultados: {
            sucesso: (count: number) => string;
            falhas: (count: number) => string;
            erroArquivo: (arquivo: string, erro: string) => string;
        };
        dicas: {
            executarLint: string;
            executarBuild: string;
            removerDryRun: string;
            ajustarConfianca: string;
        };
    };
    readonly relatorios: {
        asyncPatterns: {
            titulo: string;
            padroes: string;
            recomendacoes: string;
            critico: string;
            alto: string;
            salvo: (caminho: string) => string;
        };
        fixTypes: {
            analiseSalva: string;
            possibilidades: string;
            sugestao: (texto: string) => string;
            exportado: string;
        };
        guardian: {
            baselineAceito: string;
            exportado: string;
        };
    };
    readonly arquetipos: {
        timeout: string;
        salvo: (caminho: string) => string;
        falha: string;
        falhaEstrategista: string;
        falhaGeral: string;
    };
    readonly plugins: {
        registrado: (nome: string, extensoes: string[]) => string;
        configAtualizada: string;
        erroParsear: (linguagem: string, erro: string) => string;
    };
    readonly executor: {
        analiseCompleta: (tecnica: string, arquivo: string, duracao: string) => string;
        fastModeAtivado: string;
        analiseRapidaConcluida: (total: number, duracao: string) => string;
        tecnicaGlobalSucesso: (nome: string) => string;
        tecnicaGlobalErro: (nome: string, erro: string) => string;
        tecnicaGlobalTimeout: (nome: string) => string;
        tecnicaGlobalTimeoutOcorrencia: (nome: string, timeout: number) => string;
        tecnicaGlobalErroOcorrencia: (nome: string, erro: string) => string;
        tecnicaLocalErro: (nome: string, arquivo: string, erro: string) => string;
        tecnicaLocalTimeoutOcorrencia: (nome: string, arquivo: string, timeout: number) => string;
        tecnicaLocalErroOcorrencia: (nome: string, arquivo: string, erro: string) => string;
        stackTrace: string;
        arquivosAnalisadosProgress: (atual: number, total: number) => string;
        arquivosAnalisadosTotal: (total: number) => string;
        arquivoProcessando: (atual: number, total: number, path: string) => string;
        falhaPersistirMetricas: (erro: string) => string;
    };
};
export default MENSAGENS_CORRECOES;
//# sourceMappingURL=correcoes-messages.d.ts.map