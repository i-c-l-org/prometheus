export declare const ICONES_ZELADOR: {
    readonly inicio: "[START]";
    readonly sucesso: "\u001B[32m[OK]\u001B[0m";
    readonly erro: "\u001B[31m[ERR]\u001B[0m";
    readonly aviso: "\u001B[33m[!]\u001B[0m";
    readonly resumo: "[SUMMARY]";
    readonly arquivo: "[FILE]";
    readonly diretorio: "[DIR]";
    readonly correcao: "[FIX]";
    readonly dryRun: "[DRY]";
    readonly estatistica: "[STATS]";
};
export declare const MENSAGENS_IMPORTS: {
    titulo: string;
    resumo: string;
    dryRunAviso: string;
    sucessoFinal: string;
};
export declare const PROGRESSO_IMPORTS: {
    diretorioNaoEncontrado: (dir: string) => string;
    arquivoProcessado: (arquivo: string, count: number) => string;
    arquivoErro: (arquivo: string, erro: string) => string;
    lendoDiretorio: (dir: string) => string;
};
export declare const ERROS_IMPORTS: {
    lerDiretorio: (dir: string, error: unknown) => string;
    processar: (arquivo: string, error: unknown) => string;
};
export declare function formatarEstatistica(label: string, valor: number | string, icone?: string): string;
export declare function gerarResumoImports(stats: {
    processados: number;
    modificados: number;
    totalCorrecoes: number;
    erros: number;
    dryRun: boolean;
}): string[];
export declare const MENSAGENS_TIPOS: {
    titulo: string;
    analisandoTipo: (tipo: string) => string;
    tipoCorrigido: (antes: string, depois: string) => string;
};
export declare const MENSAGENS_ESTRUTURA: {
    titulo: string;
    movendo: (origem: string, destino: string) => string;
    criandoDiretorio: (dir: string) => string;
};
export declare const MENSAGENS_ZELADOR_GERAL: {
    iniciando: (zelador: string) => string;
    concluido: (zelador: string) => string;
    erro: (zelador: string, mensagem: string) => string;
};
export declare const MODELOS_SAIDA: {
    compacto: {
        inicio: (nome: string) => string;
        progresso: (atual: number, total: number) => string;
        fim: (sucesso: boolean) => "\u001B[32m[OK]\u001B[0m" | "\u001B[31m[ERR]\u001B[0m";
    };
    detalhado: {
        inicio: (nome: string, descricao: string) => string;
        progresso: (arquivo: string, atual: number, total: number) => string;
        fim: (stats: {
            sucesso: number;
            falha: number;
        }) => string;
    };
};
export declare const SAIDA_CODIGOS: {
    readonly SUCESSO: 0;
    readonly ERRO_GERAL: 1;
    readonly ERRO_ARQUIVO: 2;
    readonly ERRO_PERMISSAO: 3;
    readonly CANCELADO_USUARIO: 4;
};
export declare function formatarListaArquivos(arquivos: string[], maxExibir?: number): string[];
export declare function formatarDuracao(ms: number): string;
export declare function formatarComTimestamp(mensagem: string): string;
//# sourceMappingURL=zelador-messages.d.ts.map