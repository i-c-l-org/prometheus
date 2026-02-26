import { createI18nMessages } from '../../../shared/helpers/i18n.js';
function erroToMessage(erro) {
    return erro instanceof Error ? erro.message : 'Erro desconhecido';
}
function errorToMessageEn(erro) {
    return erro instanceof Error ? erro.message : 'Unknown error';
}
export const DetectorAgregadosMensagens = createI18nMessages({
    problemasSegurancaResumo: (severidade, resumo, total) => `Problemas de segurança (${severidade}): ${resumo}${total > 3 ? ` (+${total - 3} mais)` : ''}`,
    erroAnalisarSeguranca: (erro) => `Erro ao analisar segurança: ${erroToMessage(erro)}`,
    problemasPerformanceResumo: (impacto, resumo, total) => `Problemas de performance (${impacto}): ${resumo}${total > 3 ? ` (+${total - 3} mais)` : ''}`,
    erroAnalisarPerformance: (erro) => `Erro ao analisar performance: ${erroToMessage(erro)}`,
    problemasDocumentacaoResumo: (prioridade, resumo, total) => `Problemas de documentação (${prioridade}): ${resumo}${total > 3 ? ` (+${total - 3} mais)` : ''}`,
    erroAnalisarDocumentacao: (erro) => `Erro ao analisar documentação: ${erroToMessage(erro)}`,
    duplicacoesResumo: (tipo, resumo, total) => `Duplicações ${tipo}: ${resumo}${total > 3 ? ` (+${total - 3} mais)` : ''}`,
    erroAnalisarDuplicacoes: (erro) => `Erro ao analisar duplicações: ${erroToMessage(erro)}`,
    problemasTesteResumo: (severidade, resumo, total) => `Problemas de teste (${severidade}): ${resumo}${total > 3 ? ` (+${total - 3} mais)` : ''}`,
    erroAnalisarQualidadeTestes: (erro) => `Erro ao analisar qualidade de testes: ${erroToMessage(erro)}`
}, {
    problemasSegurancaResumo: (severidade, resumo, total) => `Security issues (${severidade}): ${resumo}${total > 3 ? ` (+${total - 3} more)` : ''}`,
    erroAnalisarSeguranca: (erro) => `Error analyzing security: ${errorToMessageEn(erro)}`,
    problemasPerformanceResumo: (impacto, resumo, total) => `Performance issues (${impacto}): ${resumo}${total > 3 ? ` (+${total - 3} more)` : ''}`,
    erroAnalisarPerformance: (erro) => `Error analyzing performance: ${errorToMessageEn(erro)}`,
    problemasDocumentacaoResumo: (prioridade, resumo, total) => `Documentation issues (${prioridade}): ${resumo}${total > 3 ? ` (+${total - 3} more)` : ''}`,
    erroAnalisarDocumentacao: (erro) => `Error analyzing documentation: ${errorToMessageEn(erro)}`,
    duplicacoesResumo: (tipo, resumo, total) => `${tipo} duplications: ${resumo}${total > 3 ? ` (+${total - 3} more)` : ''}`,
    erroAnalisarDuplicacoes: (erro) => `Error analyzing duplications: ${errorToMessageEn(erro)}`,
    problemasTesteResumo: (severidade, resumo, total) => `Test issues (${severidade}): ${resumo}${total > 3 ? ` (+${total - 3} more)` : ''}`,
    erroAnalisarQualidadeTestes: (erro) => `Error analyzing test quality: ${errorToMessageEn(erro)}`
});
//# sourceMappingURL=detector-agregados-messages.js.map