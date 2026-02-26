export declare const CliComandoAtualizarMensagens: {
    readonly descricao: "Atualiza o Prometheus se a integridade estiver preservada";
    readonly opcoes: {
        readonly global: "atualiza globalmente via npm i -g";
    };
    readonly erros: {
        readonly falhaFlags: (erro: string) => string;
    };
    readonly status: {
        readonly inicio: "\n🔄 Iniciando processo de atualização...\n";
        readonly guardianOk: (iconeSucesso: string) => string;
        readonly guardianAviso: "🌀 Guardian gerou novo baseline ou detectou alterações. Prosseguindo com cautela.";
        readonly guardianDica: "Recomendado: `prometheus guardian --diff` e `prometheus guardian --accept-baseline` antes de atualizar.";
    };
};
//# sourceMappingURL=cli-comando-atualizar-messages.d.ts.map