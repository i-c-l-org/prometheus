import { AnalystOrigens, AnalystTipos, SeverityNiveis, XmlMensagens } from '../../core/messages/core/plugin-messages.js';
import { createLineLookup } from '../../shared/helpers/line-lookup.js';
import { maskXmlNonCode } from '../../shared/helpers/masking.js';
import { criarAnalista, criarOcorrencia } from '../../types/index.js';
const disableEnv = process.env.PROMETHEUS_DISABLE_PLUGIN_XML === '1';
function warn(message, relPath, line, nivel = SeverityNiveis.warning) {
    return criarOcorrencia({
        relPath,
        mensagem: message,
        linha: line,
        nivel,
        origem: AnalystOrigens.xml,
        tipo: AnalystTipos.xml
    });
}
function collectXmlIssues(src, relPath) {
    const ocorrencias = [];
    const scan = maskXmlNonCode(src);
    const lineOf = createLineLookup(scan).lineAt;
    const trimmed = src.trimStart();
    const seemsCompleteDocument = /^<\w/i.test(trimmed) && !trimmed.includes('<?xml');
    if (seemsCompleteDocument && /^</.test(trimmed)) {
        ocorrencias.push(warn(XmlMensagens.xmlPrologAusente, relPath, 1, SeverityNiveis.info));
    }
    const tagRegex = /<\/?([a-zA-Z_][\w.-]*(?::[a-zA-Z_][\w.-]*)?)(?:\s[^>]*)?>/g;
    let match;
    const tagStack = [];
    while ((match = tagRegex.exec(scan)) !== null) {
        const fullTag = match[0];
        const tagNome = match[1];
        const line = lineOf(match.index);
        if (fullTag.startsWith('</')) {
            const expected = tagStack.pop();
            if (expected !== tagNome) {
                ocorrencias.push(warn(XmlMensagens.invalidXmlStructure, relPath, line, SeverityNiveis.error));
                break;
            }
        }
        else if (!fullTag.endsWith('/>')) {
            tagStack.push(tagNome);
        }
    }
    if (tagStack.length > 0) {
        ocorrencias.push(warn(XmlMensagens.invalidXmlStructure, relPath, lineOf(scan.length), SeverityNiveis.error));
    }
    const xmlnsRegex = /xmlns(?::([a-zA-Z_][\w.-]*))?\s*=\s*['"][^'"]*['"]/g;
    const declaredNamespaces = new Set();
    while ((match = xmlnsRegex.exec(scan)) !== null) {
        const prefix = match[1];
        if (prefix)
            declaredNamespaces.add(prefix);
    }
    const prefixRegex = /([a-zA-Z_][\w.-]*):[a-zA-Z_][\w.-]*/g;
    while ((match = prefixRegex.exec(scan)) !== null) {
        const prefix = match[1];
        if (!declaredNamespaces.has(prefix) && prefix !== 'xml' && prefix !== 'xmlns') {
            const line = lineOf(match.index);
            ocorrencias.push(warn(XmlMensagens.namespaceUndeclared(prefix), relPath, line, SeverityNiveis.warning));
        }
    }
    for (const m of scan.matchAll(/<!DOCTYPE\b[\s\S]*?(?:\]\s*>|>)/gi)) {
        const chunk = m[0] ?? '';
        const hasExternalId = /\b(SYSTEM|PUBLIC)\b/i.test(chunk);
        const line = lineOf(m.index);
        ocorrencias.push(warn(XmlMensagens.doctypeDetectado, relPath, line));
        if (hasExternalId) {
            ocorrencias.push(warn(XmlMensagens.doctypeExternoDetectado, relPath, line, SeverityNiveis.error));
        }
    }
    for (const m of scan.matchAll(/<!ENTITY\b[\s\S]*?>/gi)) {
        const chunk = m[0] ?? '';
        const hasExternal = /\b(SYSTEM|PUBLIC)\b/i.test(chunk);
        const isParamEntity = /<!ENTITY\s+%/i.test(chunk);
        const hasDangerousSystemId = /\bSYSTEM\b[\s\S]*?['"]\s*(file:|ftp:|gopher:|jar:|php:|data:)/i.test(chunk);
        const line = lineOf(m.index);
        if (isParamEntity) {
            ocorrencias.push(warn(XmlMensagens.entidadeParametroDetectada, relPath, line, SeverityNiveis.warning));
        }
        const entityValor = chunk.match(/<!ENTITY\s+[^'"]*\s+['"]([^'"]*)['"]/i)?.[1];
        if (entityValor && entityValor.includes('&') && entityValor.length > 100) {
            ocorrencias.push(warn(XmlMensagens.largeEntityExpansion, relPath, line, SeverityNiveis.error));
        }
        ocorrencias.push(warn(hasExternal ? XmlMensagens.entidadeExternaDetectada : XmlMensagens.entidadeDetectada, relPath, line, hasExternal || hasDangerousSystemId ? SeverityNiveis.error : SeverityNiveis.warning));
    }
    for (const m of scan.matchAll(/<\s*(?:xi|xinclude):include\b[^>]*>/gi)) {
        ocorrencias.push(warn(XmlMensagens.xincludeDetectado, relPath, lineOf(m.index)));
    }
    for (const m of scan.matchAll(/=\s*['"]\s*<![CDATA[[^]]*]]>\s*['"]/gi)) {
        ocorrencias.push(warn(XmlMensagens.cdataInAttribute, relPath, lineOf(m.index), SeverityNiveis.error));
    }
    return ocorrencias;
}
export const analistaXml = criarAnalista({
    nome: 'analista-xml',
    categoria: 'markup',
    descricao: 'Heurísticas leves para XML (foco em segurança/XXE e compatibilidade).',
    global: false,
    test: (relPath) => /\.xml$/i.test(relPath),
    aplicar: async (src, relPath) => {
        if (disableEnv)
            return null;
        const msgs = collectXmlIssues(src, relPath);
        return msgs.length ? msgs : null;
    }
});
export default analistaXml;
//# sourceMappingURL=analista-xml.js.map