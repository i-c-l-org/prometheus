export declare const CliComandoGuardianMensagens: {
    readonly descricao: "Gerencia e verifica a integridade do ambiente do Prometheus.";
    readonly opcoes: {
        readonly acceptBaseline: "Aceita o baseline atual como o novo baseline de integridade";
        readonly diff: "Mostra as diferenças entre o estado atual e o baseline";
        readonly fullScan: "Executa verificação sem aplicar GUARDIAN_IGNORE_PATTERNS (não persistir baseline)";
        readonly json: string;
    };
    readonly erroFlags: (erro: string) => string;
    readonly baselineNaoPermitidoFullScan: "Não é permitido aceitar baseline com --full-scan ativo.";
    readonly diffMudancasDetectadas: (drift: number) => string;
    readonly diffComoAceitarMudancas: "Dica: Para aceitar as mudanças no ambiente, use: prometheus guardian --accept-baseline";
    readonly baselineCriadoComoAceitar: "Dica: Use --accept-baseline ou execute com --accept para confirmar as mudanças atuais.";
};
//# sourceMappingURL=cli-comando-guardian-messages.d.ts.map