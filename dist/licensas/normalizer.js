let spdxParse = null;
let spdxCorrect = null;
let spdxLicencaList = null;
let spdxLoaded = false;
async function tryLoadSpdx() {
    if (spdxLoaded)
        return;
    spdxLoaded = true;
    try {
        spdxParse = (await import('spdx-expression-parse')).default || (await import('spdx-expression-parse'));
    }
    catch { }
    try {
        spdxCorrect = (await import('spdx-correct')).default || (await import('spdx-correct'));
    }
    catch { }
    try {
        spdxLicencaList = (await import('spdx-license-list')).default || (await import('spdx-license-list'));
    }
    catch { }
}
function fallbackNormalize(raw) {
    if (raw == null)
        return 'UNKNOWN';
    if (Array.isArray(raw))
        return raw.map(r => fallbackNormalize(r)).join(' OR ');
    if (typeof raw === 'object') {
        const obj = raw;
        return obj.type != null ? fallbackNormalize(obj.type) : 'UNKNOWN';
    }
    let s = String(raw).trim();
    s = s.replace(/\s+/g, ' ');
    const map = {
        mit: 'MIT',
        isc: 'ISC',
        'apache-2.0': 'Apache-2.0',
        apache: 'Apache-2.0',
        gpl: 'GPL',
        agpl: 'AGPL',
        lgpl: 'LGPL'
    };
    const parts = s.split(/\s+(OR|AND)\s+/i);
    return parts.map(p => {
        if (/^(OR|AND)$/i.test(p))
            return p.toUpperCase();
        const key = p.toLowerCase();
        if (map[key])
            return map[key];
        let token = p.trim();
        try {
            if (spdxCorrect)
                token = spdxCorrect(token) ?? token;
        }
        catch { }
        try {
            if (spdxLicencaList) {
                const id = String(token).trim();
                if (spdxLicencaList[id])
                    return id;
                const matchId = Object.keys(spdxLicencaList).find(k => k.toLowerCase() === String(token).toLowerCase());
                if (matchId)
                    return matchId;
                const matchByNome = Object.entries(spdxLicencaList).find(([, v]) => v && typeof v === 'object' && v.name && String(v.name).toLowerCase() === String(token).toLowerCase());
                if (matchByNome)
                    return matchByNome[0];
            }
        }
        catch { }
        return token;
    }).join(' ');
}
export async function normalizeLicense(raw) {
    await tryLoadSpdx();
    if (spdxParse && typeof raw === 'string' && /\b(OR|AND)\b/i.test(raw)) {
        return fallbackNormalize(raw);
    }
    if (spdxParse) {
        try {
            if (Array.isArray(raw))
                return raw.map(r => awaitOrFallback(r)).join(' OR ');
            if (typeof raw === 'object')
                raw = raw.type ?? raw;
            return awaitOrFallback(raw);
        }
        catch {
        }
    }
    return fallbackNormalize(raw);
    function awaitOrFallback(value) {
        try {
            const s = String(value).trim();
            const corrected = spdxCorrect ? spdxCorrect(s) ?? s : s;
            if (spdxParse) {
                try {
                    const parsed = spdxParse(corrected);
                    return astToExpression(parsed);
                }
                catch {
                    return corrected;
                }
            }
            return corrected;
        }
        catch {
            return fallbackNormalize(value);
        }
    }
    function astToExpression(ast) {
        if (!ast)
            return 'UNKNOWN';
        if (typeof ast === 'string')
            return ast;
        const node = ast;
        if (node.license)
            return String(node.license);
        if (node.left != null && node.right != null && node.conjunction) {
            return `${astToExpression(node.left)} ${String(node.conjunction).toUpperCase()} ${astToExpression(node.right)}`;
        }
        return JSON.stringify(ast);
    }
}
export default normalizeLicense;
//# sourceMappingURL=normalizer.js.map