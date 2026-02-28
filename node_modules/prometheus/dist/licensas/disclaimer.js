import { execFile as _execFile } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
function execFileAsync(cmd, args, opts = {}) {
    return new Promise((resolve, reject) => {
        _execFile(cmd, args, {
            shell: false,
            ...opts
        }, (err, stdout, stderr) => {
            if (err)
                return reject(Object.assign(err, {
                    stdout,
                    stderr
                }));
            resolve({
                stdout: String(stdout || ''),
                stderr: String(stderr || '')
            });
        });
    });
}
const defaultDisclaimerCaminho = 'docs/partials/AVISO-PROVENIENCIA.md';
const marker = /Proveni[eê]ncia e Autoria/i;
async function listMarkdown(root) {
    try {
        const { stdout } = await execFileAsync('git', ['ls-files', '*.md'], {
            cwd: root
        });
        return stdout.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    }
    catch {
        const out = [];
        async function walk(dir) {
            const entries = await fs.readdir(dir, {
                withFileTypes: true
            });
            for (const e of entries) {
                const p = path.join(dir, e.name);
                if (e.isDirectory()) {
                    if (/^(node_modules|dist|\.git|pre-public|preview-prometheus|preview-i-c-l-org|coverage|relatorios|\.prometheus)$/i.test(e.name))
                        continue;
                    out.push(...(await walk(p)));
                }
                else if (/\.md$/i.test(e.name)) {
                    out.push(path.relative(root, p));
                }
            }
            return out;
        }
        return walk(root);
    }
}
export async function addDisclaimer({ root = process.cwd(), disclaimerPath = defaultDisclaimerCaminho, dryRun = false } = {}) {
    const absDisclaimer = path.join(root, disclaimerPath);
    await fs.access(absDisclaimer).catch(() => {
        throw new Error(`Disclaimer not found: ${disclaimerPath}`);
    });
    const disclaimerText = await fs.readFile(absDisclaimer, 'utf8');
    const files = (await listMarkdown(root)).filter(f => f !== disclaimerPath && !f.startsWith('pre-public/')).filter(f => !f.startsWith('.abandonados/') && !f.startsWith('.deprecados/') && !f.startsWith('coverage/') && !f.startsWith('relatorios/'));
    const updatedArquivos = [];
    for (const rel of files) {
        const abs = path.join(root, rel);
        try {
            await fs.access(abs);
        }
        catch {
            continue;
        }
        const content = await fs.readFile(abs, 'utf8');
        const head = content.split('\n').slice(0, 30).join('\n');
        if (marker.test(head))
            continue;
        const updated = `${disclaimerText}\n\n${content.trimStart()}\n`;
        if (!dryRun)
            await fs.writeFile(abs, updated, 'utf8');
        updatedArquivos.push(rel);
    }
    return {
        updatedArquivos
    };
}
export async function verifyDisclaimer({ root = process.cwd(), disclaimerPath = defaultDisclaimerCaminho } = {}) {
    const files = (await listMarkdown(root)).filter(f => f !== disclaimerPath && !f.startsWith('pre-public/') && !f.startsWith('preview-prometheus|preview-i-c-l-org/')).filter(f => !f.startsWith('.abandonados/') && !f.startsWith('.deprecados/') && !f.startsWith('coverage/') && !f.startsWith('relatorios/'));
    const missing = [];
    for (const rel of files) {
        const abs = path.join(root, rel);
        try {
            await fs.access(abs);
        }
        catch {
            continue;
        }
        const content = await fs.readFile(abs, 'utf8');
        const head = content.split('\n').slice(0, 30).join('\n');
        if (!marker.test(head))
            missing.push(rel);
    }
    return {
        missing
    };
}
const disclaimerModule = {
    addDisclaimer,
    verifyDisclaimer
};
export default disclaimerModule;
//# sourceMappingURL=disclaimer.js.map