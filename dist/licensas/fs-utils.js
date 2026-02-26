import fs from 'node:fs';
import path from 'node:path';
export function exists(p) {
    try {
        fs.accessSync(p);
        return true;
    }
    catch {
        return false;
    }
}
export function readPackageJsonSync(pkgCaminho) {
    try {
        const data = fs.readFileSync(pkgCaminho, 'utf8');
        return JSON.parse(data);
    }
    catch {
        return null;
    }
}
export function findLicenseFile(dir) {
    try {
        const candidates = fs.readdirSync(dir).filter(f => /^(license|licence|copying)/i.test(f));
        if (!candidates.length)
            return null;
        const sorted = candidates.sort((a, b) => a.length - b.length);
        const file = sorted[0];
        const full = path.join(dir, file);
        try {
            const stat = fs.statSync(full);
            if (stat.isFile() && stat.size < 200 * 1024) {
                return {
                    file,
                    path: full,
                    text: fs.readFileSync(full, 'utf8')
                };
            }
        }
        catch { }
        return {
            file,
            path: full,
            text: null
        };
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=fs-utils.js.map