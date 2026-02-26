import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';
function isEntry(x) {
    if (!x || typeof x !== 'object')
        return false;
    const o = x;
    return typeof o.nome === 'string' && typeof o.aplicar === 'function';
}
function extrairEntradasDeModulo(mod) {
    const m = mod;
    const out = [];
    const candidates = [];
    candidates.push(m.default);
    if (Array.isArray(m.analistas))
        candidates.push(...m.analistas);
    for (const v of Object.values(m))
        candidates.push(v);
    for (const c of candidates) {
        if (Array.isArray(c)) {
            for (const item of c)
                if (isEntry(item))
                    out.push(item);
            continue;
        }
        if (isEntry(c))
            out.push(c);
    }
    const byName = new Map();
    for (const e of out) {
        if (e.nome)
            byName.set(e.nome, e);
    }
    return Array.from(byName.values());
}
export async function discoverAnalistasPlugins() {
    try {
        const dirUrl = new URL('../plugins/', import.meta.url);
        const dirFsPath = fileURLToPath(dirUrl);
        const entries = await fs.readdir(dirFsPath, { withFileTypes: true });
        const arquivos = entries
            .filter((e) => e.isFile())
            .map((e) => e.name)
            .filter((n) => n !== 'index.ts' && n !== 'index.js')
            .filter((n) => /^(analista|detector)-.+\.(ts|js)$/i.test(n));
        const results = [];
        for (const fname of arquivos) {
            const base = fname.replace(/\.(ts|js)$/i, '');
            const spec = `@analistas/plugins/${base}.js`;
            try {
                const mod = (await import(spec));
                const extracted = extrairEntradasDeModulo(mod);
                results.push(...extracted);
            }
            catch {
                try {
                    const fileUrl = new URL(fname, dirUrl);
                    const mod2 = (await import(fileUrl.toString()));
                    const extracted2 = extrairEntradasDeModulo(mod2);
                    results.push(...extracted2);
                }
                catch {
                }
            }
        }
        const byName = new Map();
        for (const r of results) {
            const entry = r;
            if (entry?.nome)
                byName.set(entry.nome, r);
        }
        return Array.from(byName.values());
    }
    catch {
        return [];
    }
}
//# sourceMappingURL=autodiscovery.js.map