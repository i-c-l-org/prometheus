import { createI18nMessages } from '../../../shared/helpers/i18n.js';
function erroToMessage(erro) {
    return erro instanceof Error ? erro.message : 'Erro desconhecido';
}
function errorToMessageEn(erro) {
    return erro instanceof Error ? erro.message : 'Unknown error';
}
export const DetectorConstrucoesSintaticasMensagens = createI18nMessages({
    identificadas: (mensagemFinal) => `Construções sintáticas identificadas: ${mensagemFinal}`,
    erroAnalisar: (erro) => `Erro ao analisar construções sintáticas: ${erroToMessage(erro)}`
}, {
    identificadas: (mensagemFinal) => `Syntactic constructions identified: ${mensagemFinal}`,
    erroAnalisar: (erro) => `Error analyzing syntactic constructions: ${errorToMessageEn(erro)}`
});
//# sourceMappingURL=detector-construcoes-sintaticas-messages.js.map