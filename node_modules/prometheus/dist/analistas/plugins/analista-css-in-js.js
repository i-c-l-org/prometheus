import { AnalystOrigens, AnalystTipos, CssInJsMensagens, SeverityNiveis } from '../../core/messages/core/plugin-messages.js';
import { criarAnalista, criarOcorrencia } from '../../types/index.js';
const disableEnv = process.env.PROMETHEUS_DISABLE_PLUGIN_CSS_IN_JS === '1';
function findLine(src, index = 0) {
    return src.slice(0, index).split(/\n/).length;
}
function emitir(message, relPath, nivel, line = 1) {
    return criarOcorrencia({
        relPath,
        mensagem: message,
        linha: line,
        nivel,
        origem: AnalystOrigens.cssInJs,
        tipo: AnalystTipos.cssInJs
    });
}
function detectarStyledComponents(src) {
    const indices = [];
    for (const m of src.matchAll(/from\s+['"]styled-components['"]/g)) {
        if (typeof m.index === 'number')
            indices.push(m.index);
    }
    for (const m of src.matchAll(/require\(\s*['"]styled-components['"]\s*\)/g)) {
        if (typeof m.index === 'number')
            indices.push(m.index);
    }
    for (const m of src.matchAll(/\bstyled\s*\./g)) {
        if (typeof m.index === 'number')
            indices.push(m.index);
    }
    for (const m of src.matchAll(/\bstyled\s*\(/g)) {
        if (typeof m.index === 'number')
            indices.push(m.index);
    }
    for (const m of src.matchAll(/\bcreateGlobalStyle\b/g)) {
        if (typeof m.index === 'number')
            indices.push(m.index);
    }
    for (const m of src.matchAll(/\bcss\s*`/g)) {
        if (typeof m.index === 'number')
            indices.push(m.index);
    }
    const detected = indices.length > 0;
    const global = /\bcreateGlobalStyle\b/.test(src);
    return {
        detected,
        global,
        indices
    };
}
function detectarStyledJsx(src) {
    const indices = [];
    for (const m of src.matchAll(/<style\b[^>]*\bjsx\b[^>]*>/gi)) {
        if (typeof m.index === 'number')
            indices.push(m.index);
    }
    for (const m of src.matchAll(/from\s+['"]styled-jsx\/css['"]/g)) {
        if (typeof m.index === 'number')
            indices.push(m.index);
    }
    for (const m of src.matchAll(/from\s+['"]styled-jsx['"]/g)) {
        if (typeof m.index === 'number')
            indices.push(m.index);
    }
    const detected = indices.length > 0;
    const global = /<style\b[^>]*\bjsx\b[^>]*\bglobal\b[^>]*>/i.test(src);
    return {
        detected,
        global,
        indices
    };
}
export const analistaCssInJs = criarAnalista({
    nome: 'analista-css-in-js',
    categoria: 'estilo',
    descricao: 'Detecta padrões de CSS-in-JS (styled-components, styled-jsx).',
    global: false,
    test: (relPath) => /\.(js|jsx|ts|tsx|mjs|cjs)$/i.test(relPath),
    aplicar: async (src, relPath) => {
        if (disableEnv)
            return null;
        if (!/styled-components|styled-jsx|<style\b[^>]*\bjsx\b|\bcreateGlobalStyle\b|\bstyled\b/i.test(src)) {
            return null;
        }
        const ocorrencias = [];
        const sc = detectarStyledComponents(src);
        const sj = detectarStyledJsx(src);
        if (!sc.detected && !sj.detected)
            return null;
        if (sc.detected) {
            const first = sc.indices[0] ?? 0;
            ocorrencias.push(emitir(CssInJsMensagens.detectedStyledComponents, relPath, SeverityNiveis.info, findLine(src, first)));
            if (sc.global) {
                ocorrencias.push(emitir(CssInJsMensagens.globalStyles('styled-components'), relPath, SeverityNiveis.warning, findLine(src, first)));
            }
        }
        if (sj.detected) {
            const first = sj.indices[0] ?? 0;
            ocorrencias.push(emitir(CssInJsMensagens.detectedStyledJsx, relPath, SeverityNiveis.info, findLine(src, first)));
            if (sj.global) {
                ocorrencias.push(emitir(CssInJsMensagens.globalStyles('styled-jsx'), relPath, SeverityNiveis.warning, findLine(src, first)));
            }
        }
        if (/!important/.test(src)) {
            ocorrencias.push(emitir(CssInJsMensagens.importantUsage, relPath, SeverityNiveis.warning, 1));
        }
        if (/url\(\s*['"]?http:\/\//i.test(src)) {
            ocorrencias.push(emitir(CssInJsMensagens.httpUrl, relPath, SeverityNiveis.warning, 1));
        }
        return ocorrencias.length ? ocorrencias : null;
    }
});
export default analistaCssInJs;
//# sourceMappingURL=analista-css-in-js.js.map