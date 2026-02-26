export declare const CliExportersMensagens: {
    poda: {
        relatoriosExportados: (dir: string) => string;
        falhaExportar: (erroMensagem: string) => string;
    };
    guardian: {
        relatoriosExportadosTitulo: string;
        caminhoMarkdown: (caminhoMd: string) => string;
        caminhoJson: (caminhoJson: string) => string;
        falhaExportar: (erroMensagem: string) => string;
        markdown: {
            titulo: string;
            geradoEm: (ts: string) => string;
            comando: string;
            statusTitulo: (icone: string, status: string) => string;
            baselineTitulo: string;
            driftTitulo: string;
            deltaConfianca: (n: number) => string;
            arquetipoAlterado: (simOuNao: string) => string;
            arquivosNovos: string;
            arquivosRemovidos: string;
            errosTitulo: string;
            avisosTitulo: string;
            recomendacoesTitulo: string;
            recomendacaoOk: string;
            recomendacaoErro: string;
            recomendacaoErroRevise: string;
            recomendacaoDrift: string;
            recomendacaoDriftInfo: string;
        };
    };
    fixTypes: {
        relatoriosExportadosTitulo: string;
        caminhoMarkdown: (caminhoMd: string) => string;
        caminhoJson: (caminhoJson: string) => string;
        falhaExportar: (erroMensagem: string) => string;
        markdown: {
            titulo: string;
            geradoEm: (ts: string) => string;
            comando: string;
            confiancaMin: (min: number) => string;
            resumoExecutivo: string;
            totalCasos: (n: number) => string;
            confiancaMedia: (n: number) => string;
            distribuicaoTitulo: string;
            distribuicaoLegitimo: (total: number, pct: number) => string;
            distribuicaoMelhoravel: (total: number, pct: number) => string;
            distribuicaoCorrigir: (total: number, pct: number) => string;
            distribuicaoTabelaHeader: string;
            distribuicaoTabelaDivider: string;
            altaPrioridadeTitulo: string;
            altaPrioridadeItem: (idx: number, arquivo: string, linha: number | string, conf: number) => string;
            incertosTitulo: string;
            incertosIntro: string;
            incertosItem: (idx: number, arquivo: string, linha: number | string, conf: number) => string;
            listaCompletaTitulo: string;
            listaCompletaCategoria: (prefixo: string, titulo: string, qtd: number) => string;
            listaCompletaItem: (arquivo: string, linha: number | string, conf: number) => string;
        };
    };
    reestruturacao: {
        relatoriosExportados: (modoPrefixo: string, dir: string) => string;
        falhaExportar: (modoPrefixo: string, erroMensagem: string) => string;
    };
};
//# sourceMappingURL=cli-exporters-messages.d.ts.map