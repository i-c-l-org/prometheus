export declare const CliComandoNamesMensagens: {
    readonly descricao: "Varre o repositório em busca de nomes de variáveis e gera arquivos de mapeamento (estrutura fragmentada em names/).";
    readonly opcoes: {
        readonly legacy: "Gera também names/name.txt único (compatibilidade com fluxo antigo).";
    };
    readonly erros: {
        readonly falhaFlags: (erro: string) => string;
        readonly erroProcessar: (rel: string) => string;
    };
    readonly status: {
        readonly inicio: "Iniciando varredura de nomes de variáveis...";
        readonly concluidoLegacy: (totalNomes: number, totalArquivos: number, saidaArquivo: string) => string;
        readonly concluido: (totalNomes: number, totalArquivos: number) => string;
    };
};
//# sourceMappingURL=cli-comando-names-messages.d.ts.map