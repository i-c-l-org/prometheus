export declare const CliComandoOtimizarSvgMensagens: {
    readonly descricao: "Otimiza SVGs do projeto usando o otimizador interno (svgo-like).";
    readonly opcoes: {
        readonly dir: string;
        readonly write: string;
        readonly dry: string;
        readonly include: string;
        readonly exclude: string;
    };
    readonly erros: {
        readonly falhaFlags: (erro: string) => string;
        readonly falhaOtimizar: (erro: string) => string;
    };
    readonly status: {
        readonly titulo: "OTIMIZAR SVG";
        readonly linhaLogOtimizacao: (rel: string, original: string, otimizado: string, economia: string) => string;
        readonly linhaLogDry: (rel: string, original: string, otimizado: string, economia: string) => string;
        readonly nenhumSugerido: "Nenhum SVG acima do limiar de otimização.";
        readonly resumoCandidatos: (candidatos: number, economia: string, total: number) => string;
        readonly concluidoWrite: (otimizados: number, candidatos: number) => string;
        readonly avisoDicaWrite: "Use --write para aplicar as otimizações.";
    };
};
//# sourceMappingURL=cli-comando-otimizar-svg-messages.d.ts.map