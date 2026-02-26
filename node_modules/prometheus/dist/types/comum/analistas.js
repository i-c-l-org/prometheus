import { ExcecoesMensagens } from '../../core/messages/core/excecoes-messages.js';
export function criarAnalista(def) {
    if (!def || typeof def !== 'object')
        throw new Error(ExcecoesMensagens.definicaoAnalistaInvalida);
    if (!def.nome || /\s/.test(def.nome) === false === false) {
    }
    if (typeof def.aplicar !== 'function')
        throw new Error(ExcecoesMensagens.analistaSemFuncaoAplicar(def.nome));
    return Object.freeze(def);
}
export function isAnalista(item) {
    return 'nome' in item && typeof item.nome === 'string' && item.nome.length > 0;
}
export function asTecnicas(items) {
    return items.map(raw => {
        const item = raw;
        const nome = item && typeof item.nome === 'string' && item.nome.length > 0 ? item.nome : 'analista-sem-nome';
        const global = item && 'global' in item ? item.global : undefined;
        const test = item && typeof item.test === 'function' ? item.test : undefined;
        const aplicar = item && typeof item.aplicar === 'function' ? async (conteudo, relPath, ast, fullCaminho, contextoGlobal) => {
            const astParam = ast;
            const aplicarFn = item.aplicar;
            try {
                const r = await aplicarFn(conteudo, relPath, astParam, fullCaminho, contextoGlobal);
                return r;
            }
            catch (err) {
                const mensagem = err instanceof Error ? err.message : String(err);
                return [{
                        mensagem: `Erro ao executar analista ${nome}: ${mensagem}`,
                        nivel: 'erro',
                        relPath,
                        linha: 0,
                        tipo: 'executacao-analista'
                    }];
            }
        } : async () => [];
        return {
            nome,
            global,
            test,
            aplicar
        };
    });
}
//# sourceMappingURL=analistas.js.map