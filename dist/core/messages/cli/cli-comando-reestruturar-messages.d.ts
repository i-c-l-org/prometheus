export declare const CliComandoReestruturarMensagens: {
    readonly descricao: "Aplica correções estruturais e otimizações ao repositório.";
    readonly opcoes: {
        readonly auto: "Aplica correções automaticamente sem confirmação (CUIDADO!)";
        readonly aplicar: "Alias de --auto (deprecated futuramente)";
        readonly somentePlano: "Exibe apenas o plano sugerido e sai (dry-run)";
        readonly domains: "Organiza por domains/<entidade>/<categoria>s (opcional; preset prometheus usa flat)";
        readonly flat: "Organiza por src/<categoria>s (sem domains)";
        readonly preferEstrategista: "Força uso do estrategista (ignora plano de arquitetos)";
        readonly preset: "Preset de estrutura (prometheus|node-community|ts-lib). Se omitido, não sugere estrutura automaticamente.";
        readonly categoria: "Override de categoria no formato chave=valor (ex.: controller=handlers). Pode repetir a flag.";
        readonly include: string;
        readonly exclude: string;
    };
    readonly inicio: "\n[ORG] Iniciando processo de reestruturação...\n";
    readonly erroDuranteReestruturacao: (erroMensagem: string) => string;
    readonly dryRunCompleto: "Modo simulado concluído (nenhum arquivo foi movido).";
    readonly dicaParaAplicar: "Dica: Para aplicar essas mudanças no disco, use a flag --auto ou --aplicar.";
    readonly planoSugeridoFast: (origem: string, moverLen: number) => string;
    readonly dryRunFast: "Dry-run solicitado (--somente-plano). (FAST MODE)";
    readonly reestruturacaoConcluidaFast: (moverLen: number) => string;
    readonly planoCalculadoFastSemAplicar: "Plano calculado em modo FAST. Use --auto para aplicar.";
    readonly spinnerCalculandoPlano: "[...] Calculando plano de reestruturação...";
    readonly spinnerPlanoVazio: "Plano vazio: nenhuma movimentação sugerida.";
    readonly spinnerPlanoSugerido: (origem: string, moverLen: number) => string;
    readonly spinnerConflitosDetectados: (qtd: number) => string;
    readonly spinnerSemPlanoSugestao: "Não foi possível sugerir um plano de reestruturação.";
    readonly dryRunCompletoFull: "Dry-run concluído. Nenhum arquivo foi modificado.";
    readonly fallbackProblemasEstruturais: (qtd: number) => string;
    readonly fallbackLinhaOcorrencia: (tipo: string, arq: string, msg: string) => string;
    readonly nenhumNecessario: "Nenhuma reestruturação necessária no momento.";
    readonly canceladoErroPrompt: "Cancelado devido a erro no prompt de confirmação.";
    readonly canceladoUseAuto: "Operação cancelada. Use --auto para aplicar automaticamente.";
    readonly spinnerAplicando: "Aplicando reestruturação...";
    readonly reestruturacaoConcluida: (total: number, frase: string) => string;
    readonly falhaReestruturacao: "Falha crítica na reestruturação.";
};
//# sourceMappingURL=cli-comando-reestruturar-messages.d.ts.map