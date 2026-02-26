export declare const InquisidorMensagens: {
    iniciando: (baseDir: string) => string;
    parseAstNaoGerada: string;
    parseErro: (erro: string) => string;
    parseErrosAgregados: (quantidade: number) => string;
    falhaGerarAst: (relPath: string, erro: string) => string;
    priorizacaoAplicada: (exibidos: string) => string;
    arquivosMetaMovidos: (quantidade: number) => string;
    falhaPriorizacao: (erro: string) => string;
    concluida: (total: number) => string;
    varreduraConcluida: (total: number) => string;
    erroAcaoCaminho: (acao: string, caminho: string, mensagem: string) => string;
};
//# sourceMappingURL=inquisidor-messages.d.ts.map