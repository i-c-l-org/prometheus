import { createI18nMessages } from '../../../shared/helpers/i18n.js';
function erroToMessage(erro) {
    return erro instanceof Error ? erro.message : 'Erro desconhecido';
}
function errorToMessageEn(erro) {
    return erro instanceof Error ? erro.message : 'Unknown error';
}
export const DetectorCodigoFragilMensagens = createI18nMessages({
    fragilidadesResumo: (severidade, resumo, detalhes) => `Fragilidades ${severidade}: ${resumo} | Detalhes: ${JSON.stringify(detalhes)}`,
    erroAnalisarCodigoFragil: (erro) => `Erro ao analisar código frágil: ${erroToMessage(erro)}`
}, {
    fragilidadesResumo: (severidade, resumo, detalhes) => `Fragilities ${severidade}: ${resumo} | Details: ${JSON.stringify(detalhes)}`,
    erroAnalisarCodigoFragil: (erro) => `Error analyzing fragile code: ${errorToMessageEn(erro)}`
});
//# sourceMappingURL=detector-codigo-fragil-messages.js.map