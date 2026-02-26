import { formatarTipoInseguro, gerarResumoCategoria } from '../core/index.js';
export declare const CliComandoFixTypesMensagens: {
    readonly descricao: "Detecta e corrige tipos inseguros (any/unknown) no código";
    readonly opcoes: {
        readonly dryRun: string;
        readonly target: "Diretório ou arquivo específico para analisar (default: src)";
        readonly confidence: "Nível mínimo de confiança para aplicar correções (0-100) (default: 85)";
        readonly verbose: string;
        readonly interactive: "Modo interativo: confirma cada correção";
        readonly export: "Exporta relatórios JSON e Markdown para pasta relatorios/";
        readonly include: string;
        readonly exclude: string;
    };
    readonly MENSAGENS_INICIO: {
        titulo: string;
        analisando: (target: string) => string;
        confianciaMin: (min: number) => string;
        modo: (dryRun: boolean) => string;
    };
    readonly MENSAGENS_PROGRESSO: {
        processandoArquivos: (count: number) => string;
        arquivoAtual: (arquivo: string, count: number) => string;
    };
    readonly MENSAGENS_RESUMO: {
        encontrados: (count: number) => string;
        tituloCategorizacao: string;
        confianciaMedia: (media: number) => string;
        porcentagem: (count: number, total: number) => string;
    };
    readonly MENSAGENS_ERRO: {
        correcaoNaoImplementada: string;
        sistemaDesenvolvimento: string;
        requisitoAnalise: string;
        detectorNaoEncontrado: string;
        modulosNaoEncontrados: string;
    };
    readonly MENSAGENS_SUCESSO: {
        nenhumTipoInseguro: string;
        nenhumAltaConfianca: string;
        nenhumaCorrecao: string;
    };
    readonly MENSAGENS_CLI_CORRECAO_TIPOS: {
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
    readonly TEXTOS_CATEGORIZACAO_CORRECAO_TIPOS: {
        anyMotivo: string;
        anySugestao: string;
        asAnyMotivo: string;
        asAnySugestao: string;
        angleAnyMotivo: string;
        angleAnySugestao: string;
        semContextoMotivo: string;
        semContextoSugestao: string;
    };
    readonly TEMPLATE_RESUMO_FINAL: {
        titulo: string;
        passos: string[];
    };
    readonly DICAS: {
        removerDryRun: string;
        usarInterativo: string;
        ajustarConfianca: (atual: number) => string;
        revisar: (categoria: string) => string;
    };
    readonly CATEGORIAS_TIPOS: {
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
    readonly ACOES_SUGERIDAS: {
        LEGITIMO: string[];
        MELHORAVEL: string[];
        CORRIGIR: string[];
    };
    readonly DEPURACAO: {
        readonly categorizacao: (arquivo: string, tipo: string, categoria: string) => string;
        readonly confianca: (tipo: string, valor: number) => string;
    };
    readonly ICONES: {
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
    readonly formatarTipoInseguro: typeof formatarTipoInseguro;
    readonly gerarResumoCategoria: typeof gerarResumoCategoria;
};
//# sourceMappingURL=cli-comando-fix-types-messages.d.ts.map