export function criarOcorrencia(base) {
    return {
        nivel: 'info',
        origem: 'prometheus',
        ...base,
        mensagem: base.mensagem.trim(),
    };
}
export function ocorrenciaErroAnalista(data) {
    return {
        tipo: 'ERRO_ANALISTA',
        nivel: 'erro',
        origem: 'prometheus',
        ...data,
        mensagem: data.mensagem.trim(),
    };
}
export function ocorrenciaFuncaoComplexa(data) {
    return {
        tipo: 'FUNCAO_COMPLEXA',
        nivel: 'aviso',
        origem: 'prometheus',
        ...data,
        mensagem: data.mensagem.trim(),
    };
}
export function ocorrenciaParseErro(data) {
    return {
        tipo: 'PARSE_ERRO',
        nivel: 'erro',
        origem: 'prometheus',
        ...data,
        mensagem: data.mensagem.trim(),
    };
}
//# sourceMappingURL=ocorrencias.js.map