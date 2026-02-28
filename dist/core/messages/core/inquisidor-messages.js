import { createI18nMessages } from '../../../shared/helpers/i18n.js';
export const InquisidorMensagens = createI18nMessages({
    iniciando: (baseDir) => `Iniciando a Inquisicao do Prometheus em: ${baseDir}`,
    parseAstNaoGerada: 'Erro de parsing: AST nao gerada (codigo possivelmente invalido).',
    parseErro: (erro) => `Erro de parsing: ${erro}`,
    parseErrosAgregados: (quantidade) => `Erros de parsing agregados: ${quantidade} ocorrencias suprimidas neste arquivo (exibe 1).`,
    falhaGerarAst: (relPath, erro) => `Falha ao gerar AST para ${relPath}: ${erro}`,
    priorizacaoAplicada: (exibidos) => `[PRIORIDADE] Priorizacao aplicada (top 5 sem meta): ${exibidos}`,
    arquivosMetaMovidos: (quantidade) => `   (INFO: ${quantidade} arquivos meta movidos para o final da fila)`,
    falhaPriorizacao: (erro) => `Falha priorizacao: ${erro}`,
    concluida: (total) => `[CONCLUIDO] Inquisicao concluida. Total de ocorrencias: ${total}`,
    varreduraConcluida: (total) => `Varredura concluida: total de arquivos: ${total}`,
    erroAcaoCaminho: (acao, caminho, mensagem) => `Erro ao ${acao} ${caminho}: ${mensagem}`
}, {
    iniciando: (baseDir) => `Starting Prometheus Inquisition in: ${baseDir}`,
    parseAstNaoGerada: 'Parsing error: AST not generated (possibly invalid code).',
    parseErro: (erro) => `Parsing error: ${erro}`,
    parseErrosAgregados: (quantidade) => `Aggregated parsing errors: ${quantidade} occurrences suppressed in this file (showing 1).`,
    falhaGerarAst: (relPath, erro) => `Failed to generate AST for ${relPath}: ${erro}`,
    priorizacaoAplicada: (exibidos) => `[PRIORITY] Prioritization applied (top 5 without meta): ${exibidos}`,
    arquivosMetaMovidos: (quantidade) => `   (INFO: ${quantidade} meta files moved to the end of the queue)`,
    falhaPriorizacao: (erro) => `Prioritization failure: ${erro}`,
    concluida: (total) => `[COMPLETED] Inquisition concluded. Total occurrences: ${total}`,
    varreduraConcluida: (total) => `Scan concluded: total files: ${total}`,
    erroAcaoCaminho: (acao, caminho, mensagem) => `Error when ${acao} ${caminho}: ${mensagem}`
});
//# sourceMappingURL=inquisidor-messages.js.map