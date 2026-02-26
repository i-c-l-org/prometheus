import { createI18nMessages } from '../../../shared/helpers/i18n.js';
export const InquisidorMensagens = createI18nMessages({
    iniciando: (baseDir) => `Iniciando a Inquisição do Prometheus em: ${baseDir}`,
    parseAstNaoGerada: 'Erro de parsing: AST não gerada (código possivelmente inválido).',
    parseErro: (erro) => `Erro de parsing: ${erro}`,
    parseErrosAgregados: (quantidade) => `Erros de parsing agregados: ${quantidade} ocorrências suprimidas neste arquivo (exibe 1).`,
    falhaGerarAst: (relPath, erro) => `Falha ao gerar AST para ${relPath}: ${erro}`,
    priorizacaoAplicada: (exibidos) => `🧮 Priorização aplicada (top 5 sem meta): ${exibidos}`,
    arquivosMetaMovidos: (quantidade) => `   (ℹ️ ${quantidade} arquivos meta movidos para o final da fila)`,
    falhaPriorizacao: (erro) => `Falha priorização: ${erro}`,
    concluida: (total) => `🔮 Inquisição concluída. Total de ocorrências: ${total}`,
    varreduraConcluida: (total) => `Varredura concluída: total de arquivos: ${total}`,
    erroAcaoCaminho: (acao, caminho, mensagem) => `Erro ao ${acao} ${caminho}: ${mensagem}`
}, {
    iniciando: (baseDir) => `Starting Prometheus Inquisition in: ${baseDir}`,
    parseAstNaoGerada: 'Parsing error: AST not generated (possibly invalid code).',
    parseErro: (erro) => `Parsing error: ${erro}`,
    parseErrosAgregados: (quantidade) => `Aggregated parsing errors: ${quantidade} occurrences suppressed in this file (showing 1).`,
    falhaGerarAst: (relPath, erro) => `Failed to generate AST for ${relPath}: ${erro}`,
    priorizacaoAplicada: (exibidos) => `🧮 Prioritization applied (top 5 without meta): ${exibidos}`,
    arquivosMetaMovidos: (quantidade) => `   (ℹ️ ${quantidade} meta files moved to the end of the queue)`,
    falhaPriorizacao: (erro) => `Prioritization failure: ${erro}`,
    concluida: (total) => `🔮 Inquisition concluded. Total occurrences: ${total}`,
    varreduraConcluida: (total) => `Scan concluded: total files: ${total}`,
    erroAcaoCaminho: (acao, caminho, mensagem) => `Error when ${acao} ${caminho}: ${mensagem}`
});
//# sourceMappingURL=inquisidor-messages.js.map