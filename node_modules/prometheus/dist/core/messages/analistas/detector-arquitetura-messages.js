import { createI18nMessages } from '../../../shared/helpers/i18n.js';
function erroToMessage(erro) {
    return erro instanceof Error ? erro.message : 'Erro desconhecido';
}
function errorToMessageEn(erro) {
    return erro instanceof Error ? erro.message : 'Unknown error';
}
export const DetectorArquiteturaMensagens = createI18nMessages({
    padraoArquitetural: (padraoIdentificado, confianca) => `Padrão arquitetural: ${padraoIdentificado} (${confianca}% confiança)`,
    caracteristicas: (caracteristicas) => `Características: ${caracteristicas.slice(0, 3).join(', ')}`,
    violacao: (violacao) => `Violação arquitetural: ${violacao}`,
    metricas: (acoplamento, coesao) => `Métricas: Acoplamento=${(acoplamento * 100).toFixed(0)}%, Coesão=${(coesao * 100).toFixed(0)}%`,
    erroAnalisarArquitetura: (erro) => `Erro ao analisar arquitetura: ${erroToMessage(erro)}`
}, {
    padraoArquitetural: (padraoIdentificado, confianca) => `Architectural pattern: ${padraoIdentificado} (${confianca}% confidence)`,
    caracteristicas: (caracteristicas) => `Characteristics: ${caracteristicas.slice(0, 3).join(', ')}`,
    violacao: (violacao) => `Architectural violation: ${violacao}`,
    metricas: (acoplamento, coesao) => `Metrics: Coupling=${(acoplamento * 100).toFixed(0)}%, Cohesion=${(coesao * 100).toFixed(0)}%`,
    erroAnalisarArquitetura: (erro) => `Error analyzing architecture: ${errorToMessageEn(erro)}`
});
//# sourceMappingURL=detector-arquitetura-messages.js.map