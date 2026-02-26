export declare const CliComandoLicensasMensagens: {
    readonly descricao: "Ferramentas relacionadas a licença";
    readonly subcomandos: {
        readonly scan: {
            readonly descricao: "Escaneia dependências em busca de licenças desconhecidas";
            readonly opcoes: {
                readonly root: string;
            };
            readonly falha: (erro: string) => string;
        };
        readonly notices: {
            readonly descricao: "Gerenciar avisos/terceiros";
            readonly generate: {
                readonly descricao: "Gerar arquivo THIRD-PARTY/AVISOS";
                readonly opcoes: {
                    readonly ptBr: "usar cabeçalho em português";
                    readonly output: string;
                    readonly root: string;
                };
                readonly falha: (erro: string) => string;
                readonly concluido: (res: unknown) => string;
            };
        };
        readonly disclaimer: {
            readonly descricao: "Adicionar/verificar disclaimer em markdown";
            readonly add: {
                readonly descricao: "Inserir aviso de proveniência nos arquivos markdown";
                readonly opcoes: {
                    readonly disclaimerPath: "caminho do arquivo de disclaimer";
                    readonly root: string;
                    readonly dryRun: string;
                };
                readonly falha: (erro: string) => string;
                readonly concluido: (total: number) => string;
            };
            readonly verify: {
                readonly descricao: "Verificar se todos os markdown possuem o disclaimer";
                readonly falha: (erro: string) => string;
                readonly ausente: "Missing disclaimer in files:";
                readonly todosOk: "All markdown files include the disclaimer.";
            };
        };
    };
};
//# sourceMappingURL=cli-comando-licensas-messages.d.ts.map