export declare const CliComandoRenameMensagens: {
    readonly descricao: "Aplica as renomeações de variáveis baseadas no arquivo(s) de mapeamento em names/.";
    readonly erros: {
        readonly falhaFlags: (erro: string) => string;
        readonly nenhumMapeamento: "Nenhum arquivo de mapeamento em names/. Execute o comando names primeiro.";
        readonly pastaNaoEncontrada: "Pasta de mapeamento não encontrada: names/. Execute o comando names primeiro.";
        readonly mapeamentoVazio: "Nenhum mapeamento de tradução encontrado (formato: nomeAntigo = nomeNovo por linha).";
    };
    readonly status: {
        readonly inicio: (total: number) => string;
        readonly atualizado: (rel: string) => string;
        readonly concluido: (total: number) => string;
        readonly conflito: (old: string, rel: string, nova: string, anterior: string) => string;
    };
};
//# sourceMappingURL=cli-comando-rename-messages.d.ts.map