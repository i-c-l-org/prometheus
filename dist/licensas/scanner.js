import path from 'node:path';
import { exists, findLicenseFile, readPackageJsonSync } from './fs-utils.js';
import { normalizeLicense } from './normalizer.js';
export async function scan({ root = process.cwd(), includeDev: _includeDev = false } = {}) {
    const nmDir = path.join(root, 'node_modules');
    const result = {
        generatedAt: new Date().toISOString(),
        totalPackages: 0,
        totalFiltered: 0,
        licenseCounts: {},
        packages: [],
        problematic: []
    };
    if (!exists(nmDir)) {
        return result;
    }
    const entries = [];
    try {
        const dirEntries = await fsReaddir(nmDir);
        for (const e of dirEntries)
            entries.push(e);
    }
    catch {
        return result;
    }
    for (const entryNome of entries) {
        if (entryNome === '.bin')
            continue;
        const full = path.join(nmDir, entryNome);
        if (entryNome.startsWith('@')) {
            try {
                const scoped = await fsReaddir(full);
                for (const s of scoped) {
                    const p = path.join(full, s);
                    if (await fsStatIsDir(p))
                        await processPackage(p, result);
                }
            }
            catch {
            }
        }
        else {
            if (await fsStatIsDir(full))
                await processPackage(full, result);
        }
    }
    const filtered = result.packages.filter(p => !p.name.startsWith('@types/'));
    result.totalPackages = result.packages.length;
    result.totalFiltered = filtered.length;
    for (const p of filtered)
        result.licenseCounts[p.license] = (result.licenseCounts[p.license] || 0) + 1;
    return result;
    async function processPackage(pkgDir, resObj) {
        const pkgJsonCaminho = path.join(pkgDir, 'package.json');
        if (!exists(pkgJsonCaminho))
            return;
        const data = readPackageJsonSync(pkgJsonCaminho);
        if (!data)
            return;
        const name = (typeof data.name === 'string' ? data.name : path.basename(pkgDir));
        const version = (typeof data.version === 'string' ? data.version : '0.0.0');
        const rawLicenca = data.license ?? data.licenses ?? null;
        const licenseValor = await normalizeLicense(rawLicenca || 'UNKNOWN');
        const licenseArquivo = findLicenseFile(pkgDir);
        const repo = data.repository;
        const repository = repo == null ? null : typeof repo === 'string' ? repo : (typeof repo === 'object' && repo != null && 'url' in repo ? String(repo.url) : null);
        resObj.packages.push({
            name,
            version,
            license: licenseValor,
            repository,
            private: !!data.private,
            licenseArquivo: licenseArquivo ? licenseArquivo.file : null,
            licenseText: licenseArquivo ? licenseArquivo.text : null,
            path: pkgDir
        });
    }
}
export async function fsReaddir(p) {
    const fs = await import('node:fs');
    return fs.promises.readdir(p, {
        withFileTypes: false
    }).catch(() => []);
}
async function fsStatIsDir(p) {
    const fs = await import('node:fs');
    try {
        const stat = await fs.promises.stat(p);
        return stat.isDirectory();
    }
    catch {
        return false;
    }
}
export async function scanCommand(opts = {}) {
    const res = await scan(opts);
    const problematic = res.packages.filter(p => p.license === 'UNKNOWN');
    res.problematic = problematic;
    return res;
}
//# sourceMappingURL=scanner.js.map