export declare const CliComandoReverterMensagens: {
    readonly descricao: "Gerencia mapa de reversão para moves aplicados";
    readonly opcoes: {
        readonly force: string;
    };
    readonly subcomandos: {
        readonly listar: {
            readonly descricao: "Lista todos os moves registrados no mapa de reversão";
            readonly erro: (msg: string) => string;
        };
        readonly arquivo: {
            readonly descricao: "Reverte todos os moves de um arquivo específico";
            readonly argumento: "Caminho do arquivo para reverter";
            readonly erro: (msg: string) => string;
        };
        readonly move: {
            readonly descricao: "Reverte um move específico pelo ID";
            readonly argumento: "ID do move para reverter";
            readonly erro: (msg: string) => string;
        };
        readonly limpar: {
            readonly descricao: "Limpa todo o mapa de reversão (perde histórico)";
            readonly erro: (msg: string) => string;
        };
        readonly status: {
            readonly descricao: "Mostra status do mapa de reversão";
            readonly erro: (msg: string) => string;
        };
    };
    readonly falhaCarregarMapaFast: (erro: string) => string;
    readonly mapaLimpoComSucesso: (iconeSucesso: string) => string;
    readonly ultimoMove: (data: string) => string;
};
//# sourceMappingURL=cli-comando-reverter-messages.d.ts.map