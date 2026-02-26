export declare const CliComandoFormatarMensagens: {
    readonly descricao: "Aplica a formatação interna estilo Prometheus (whitespace, seções, finais de linha)";
    readonly opcoes: {
        readonly check: "Apenas verifica se arquivos precisariam de formatação (default)";
        readonly write: string;
        readonly engine: "Motor de formatação: auto|interno|prettier (auto tenta usar Prettier do projeto e cai no interno)";
        readonly include: string;
        readonly exclude: string;
    };
    readonly erros: {
        readonly falhaFlags: (erro: string) => string;
        readonly falhaFormatar: (erro: string) => string;
        readonly falhaArquivo: (rel: string, erro: string) => string;
        readonly falhaExecucaoArquivo: (rel: string, erro: string) => string;
        readonly totalErros: (n: number) => string;
        readonly scanOnlyAviso: "SCAN_ONLY ativo; o comando formatar precisa ler conteúdo.";
    };
    readonly status: {
        readonly titulo: "🧽 FORMATAR";
        readonly precisamFormatacao: (n: number) => string;
        readonly tudoFormatado: "Tudo formatado.";
        readonly concluidoWrite: (n: number) => string;
        readonly nenhumaMudanca: "Nenhuma mudança necessária.";
    };
};
//# sourceMappingURL=cli-comando-formatar-messages.d.ts.map