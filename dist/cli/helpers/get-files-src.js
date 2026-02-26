import * as fs from 'fs';
import * as path from 'path';
const DIRS_IGNORADOS = new Set(['node_modules', 'dist', 'names', '.git', '.prometheus']);
export function getSourceFiles(dir) {
    const files = [];
    if (!fs.existsSync(dir))
        return files;
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
        if (item.isDirectory()) {
            if (DIRS_IGNORADOS.has(item.name))
                continue;
            files.push(...getSourceFiles(path.join(dir, item.name)));
        }
        else if (item.name.endsWith('.ts') || item.name.endsWith('.js')) {
            files.push(path.join(dir, item.name));
        }
    }
    return files;
}
export function getFilesWithExtension(dir, ext) {
    const files = [];
    if (!fs.existsSync(dir))
        return files;
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
        if (item.isDirectory()) {
            files.push(...getFilesWithExtension(path.join(dir, item.name), ext));
        }
        else if (item.name.endsWith(ext)) {
            files.push(path.join(dir, item.name));
        }
    }
    return files;
}
//# sourceMappingURL=get-files-src.js.map