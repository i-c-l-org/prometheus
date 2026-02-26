const CONFIANCA = {
    PADRAO: 0.3,
    FULLSTACK: 0.95,
    MONOREPO: 0.99,
    LANDING: 0.92,
    API: 0.88,
    CLI: 0.85,
    LIB: 0.8,
};
export function diagnosticarProjeto(sinais) {
    const positivos = Object.entries(sinais)
        .filter(([, valor]) => valor === true)
        .map(([chave]) => chave);
    let tipo = 'desconhecido';
    let confianca = CONFIANCA.PADRAO;
    if ('ehFullstack' in sinais && sinais.ehFullstack) {
        tipo = 'fullstack';
        confianca = CONFIANCA.FULLSTACK;
    }
    else if ('ehMonorepo' in sinais && sinais.ehMonorepo) {
        tipo = 'monorepo';
        confianca = CONFIANCA.MONOREPO;
    }
    else if (ehLanding(sinais)) {
        tipo = 'landing';
        confianca = CONFIANCA.LANDING;
    }
    else if (ehApi(sinais)) {
        tipo = 'api';
        confianca = CONFIANCA.API;
    }
    else if (ehCli(sinais)) {
        tipo = 'cli';
        confianca = CONFIANCA.CLI;
    }
    else if (ehLib(sinais)) {
        tipo = 'lib';
        confianca = CONFIANCA.LIB;
    }
    return { tipo, sinais: positivos, confiabilidade: confianca };
}
function ehLanding(s) {
    return !!(s.temPages === true);
}
function ehApi(s) {
    return !!(s.temApi ?? s.temControllers ?? s.temExpress);
}
function ehLib(s) {
    return !!(s.temSrc && !s.temComponents && !(s.temApi ?? false));
}
function ehCli(s) {
    return !!s.temCli;
}
//# sourceMappingURL=diagnostico-projeto.js.map