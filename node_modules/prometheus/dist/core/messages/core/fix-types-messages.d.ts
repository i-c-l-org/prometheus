export declare const CATEGORIAS_TIPOS: {
    LEGITIMO: {
        icone: "\u001B[32m[OK]\u001B[0m";
        nome: string;
        descricao: string;
        confidenciaMin: number;
    };
    MELHORAVEL: {
        icone: "\u001B[33m[!]\u001B[0m";
        nome: string;
        descricao: string;
        confidenciaMin: number;
    };
    CORRIGIR: {
        icone: "\u001B[31m[FIX]\u001B[0m";
        nome: string;
        descricao: string;
        confidenciaMin: number;
    };
};
export declare const MENSAGENS_INICIO: {
    titulo: string;
    analisando: (target: string) => string;
    confianciaMin: (min: number) => string;
    modo: (dryRun: boolean) => string;
};
export declare const MENSAGENS_PROGRESSO: {
    processandoArquivos: (count: number) => string;
    arquivoAtual: (arquivo: string, count: number) => string;
};
export declare const MENSAGENS_RESUMO: {
    encontrados: (count: number) => string;
    tituloCategorizacao: string;
    confianciaMedia: (media: number) => string;
    porcentagem: (count: number, total: number) => string;
};
export declare const DICAS: {
    removerDryRun: string;
    usarInterativo: string;
    ajustarConfianca: (atual: number) => string;
    revisar: (categoria: string) => string;
};
export declare const ACOES_SUGERIDAS: {
    LEGITIMO: string[];
    MELHORAVEL: string[];
    CORRIGIR: string[];
};
export declare const MENSAGENS_ERRO: {
    correcaoNaoImplementada: string;
    sistemaDesenvolvimento: string;
    requisitoAnalise: string;
    detectorNaoEncontrado: string;
    modulosNaoEncontrados: string;
};
export declare const MENSAGENS_SUCESSO: {
    nenhumTipoInseguro: string;
    nenhumAltaConfianca: string;
    nenhumaCorrecao: string;
};
export declare const MENSAGENS_CLI_CORRECAO_TIPOS: {
    linhaEmBranco: string;
    erroExecutar: (mensagem: string) => string;
    linhaResumoTipo: (texto: string) => string;
    exemplosDryRunTitulo: string;
    exemploLinha: (icone: string, relPath: string | undefined, linha: string) => string;
    exemploMensagem: (mensagem: string) => string;
    debugVariavel: (nome: string) => string;
    maisOcorrencias: (qtd: number) => string;
    aplicandoCorrecoesAuto: string;
    exportandoRelatorios: string;
    verboseAnyDetectado: (arquivo: string, linha: string) => string;
    verboseAsAnyCritico: (arquivo: string, linha: string) => string;
    verboseAngleAnyCritico: (arquivo: string, linha: string) => string;
    verboseUnknownCategoria: (icone: string, arquivo: string, linha: string, categoria: string, confianca: number) => string;
    verboseMotivo: (motivo: string) => string;
    verboseSugestao: (sugestao: string) => string;
    verboseVariantesTitulo: string;
    verboseVarianteItem: (idxBase1: number, variante: string) => string;
    analiseDetalhadaSalva: string;
    altaConfiancaTitulo: (qtd: number) => string;
    altaConfiancaLinha: (relPath: string | undefined, linha: string, confianca: number) => string;
    altaConfiancaDetalhe: (texto: string) => string;
    altaConfiancaMais: (qtd: number) => string;
    incertosTitulo: (qtd: number) => string;
    incertosIntro: string;
    incertosLinha: (relPath: string | undefined, linha: string, confianca: number) => string;
    incertosMais: (qtd: number) => string;
    correcoesResumoSucesso: (qtd: number) => string;
    correcoesResumoLinhaOk: (arquivo: string, linhas: number) => string;
    correcoesResumoLinhaErro: (arquivo: string, erro: string | undefined) => string;
    correcoesResumoFalhas: (qtd: number) => string;
    dryRunAviso: (iconeInicio: string) => string;
    templatePasso: (passo: string) => string;
};
export declare const TEXTOS_CATEGORIZACAO_CORRECAO_TIPOS: {
    anyMotivo: string;
    anySugestao: string;
    asAnyMotivo: string;
    asAnySugestao: string;
    angleAnyMotivo: string;
    angleAnySugestao: string;
    semContextoMotivo: string;
    semContextoSugestao: string;
};
export declare const TEMPLATE_RESUMO_FINAL: {
    titulo: string;
    passos: string[];
};
export declare const ICONES: {
    readonly LEGITIMO: {
        icone: "\u001B[32m[OK]\u001B[0m";
        nome: string;
        descricao: string;
        confidenciaMin: number;
    };
    readonly MELHORAVEL: {
        icone: "\u001B[33m[!]\u001B[0m";
        nome: string;
        descricao: string;
        confidenciaMin: number;
    };
    readonly CORRIGIR: {
        icone: "\u001B[31m[FIX]\u001B[0m";
        nome: string;
        descricao: string;
        confidenciaMin: number;
    };
    readonly inicio: "[FIX]";
    readonly aplicando: "[>]";
    readonly analise: "[>]";
    readonly pasta: "[DIR]";
    readonly arquivo: "[FILE]";
    readonly alvo: "[>]";
    readonly edicao: "[EDIT]";
    readonly grafico: "[GRAPH]";
    readonly lampada: "[DICA]";
    readonly foguete: "[>>]";
    readonly nota: "[NOTE]";
    readonly checkbox: "[OK]";
    readonly setinha: "└─";
};
export declare function formatarTipoInseguro(tipo: string, count: number): string;
export declare function formatarOcorrencia(relPath: string, linha: number | undefined): string;
export declare function formatarComContexto(mensagem: string, indentLevel?: number): string;
export declare function formatarSugestao(sugestao: string): string;
export declare function gerarResumoCategoria(categoria: keyof typeof CATEGORIAS_TIPOS, count: number, total: number): string[];
export declare const DEPURACAO: {
    readonly categorizacao: (arquivo: string, tipo: string, categoria: string) => string;
    readonly confianca: (tipo: string, valor: number) => string;
};
//# sourceMappingURL=fix-types-messages.d.ts.map