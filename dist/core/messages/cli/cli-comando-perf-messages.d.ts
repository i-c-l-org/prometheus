export declare const CliComandoDesempMensagens: {
    readonly descricao: "Operações de baseline e comparação de performance sintética";
    readonly opcoes: {
        readonly dir: "Diretório de snapshots";
        readonly json: string;
        readonly limite: "Limite para regressão (%)";
    };
    readonly subcomandos: {
        readonly baseline: {
            readonly descricao: "Gera uma nova baseline. Usa métricas globais da última execução se disponíveis.";
            readonly erro: (msg: string) => string;
        };
        readonly compare: {
            readonly descricao: "Compara os dois últimos snapshots e sinaliza regressão";
            readonly erroSnapshots: (msg: string) => string;
            readonly erroMenosDeDois: "Menos de dois snapshots para comparar";
        };
    };
    readonly tituloComparacaoSnapshots: "\n?? Comparação de snapshots de performance:\n";
    readonly tituloComparacaoSnapshotsComIcone: (icone: string) => string;
};
//# sourceMappingURL=cli-comando-perf-messages.d.ts.map