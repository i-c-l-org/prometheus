export declare const CliComandoPodarMensagens: {
    readonly descricao: "Remove arquivos órfãos e lixo do repositório.";
    readonly opcoes: {
        readonly force: "Remove arquivos sem confirmação (CUIDADO!)";
        readonly include: string;
        readonly exclude: string;
    };
    readonly inicio: "\n[CLEAN] Iniciando processo de poda...\n";
    readonly nenhumaSujeira: (iconeSucesso: string) => string;
    readonly orfaosDetectados: (qtd: number) => string;
    readonly linhaArquivoOrfao: (arquivo: string) => string;
    readonly confirmarRemocao: "Tem certeza que deseja remover esses arquivos? (s/N) ";
    readonly erroDurantePoda: (erroMensagem: string) => string;
};
//# sourceMappingURL=cli-comando-podar-messages.d.ts.map