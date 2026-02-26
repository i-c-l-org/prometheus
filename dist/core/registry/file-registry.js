import { promises as fs } from 'node:fs';
import path from 'node:path';
import { ExcecoesMensagens } from '../messages/core/excecoes-messages.js';
import { log } from '../messages/log/log.js';
import { MIGRACAO_MAPA, PROMETHEUS_ARQUIVOS, PROMETHEUS_DIRS } from './paths.js';
async function fileExists(fileCaminho) {
    try {
        await fs.access(fileCaminho);
        return true;
    }
    catch {
        return false;
    }
}
async function ensureDir(fileCaminho) {
    const dir = path.dirname(fileCaminho);
    await fs.mkdir(dir, {
        recursive: true
    });
}
async function tryMigrate(targetPath) {
    const legacyCaminho = Object.entries(MIGRACAO_MAPA).find(([_, target]) => target === targetPath)?.[0];
    if (!legacyCaminho) {
        return {
            migrated: false
        };
    }
    const legacyExists = await fileExists(legacyCaminho);
    if (!legacyExists) {
        return {
            migrated: false
        };
    }
    try {
        const content = await fs.readFile(legacyCaminho, 'utf-8');
        await ensureDir(targetPath);
        await fs.writeFile(targetPath, content, 'utf-8');
        const backupCaminho = `${legacyCaminho}.migrated`;
        await fs.rename(legacyCaminho, backupCaminho);
        log.info(`Migração automática: ${path.basename(legacyCaminho)} → ${path.basename(targetPath)}`);
        return {
            migrated: true,
            from: legacyCaminho,
            to: targetPath
        };
    }
    catch (erro) {
        log.aviso(`Falha na migração de ${legacyCaminho}: ${erro.message}`);
        return {
            migrated: false
        };
    }
}
export async function readJSON(fileCaminho, options = {}) {
    const { default: defaultValue, migrate = true, validate } = options;
    try {
        if (migrate) {
            const migration = await tryMigrate(fileCaminho);
            if (migration.migrated && migration.to) {
                fileCaminho = migration.to;
            }
        }
        const exists = await fileExists(fileCaminho);
        if (!exists) {
            if (defaultValue !== undefined) {
                return defaultValue;
            }
            throw new Error(ExcecoesMensagens.arquivoNaoEncontrado(String(fileCaminho)));
        }
        const content = await fs.readFile(fileCaminho, 'utf-8');
        const parsed = JSON.parse(content);
        if (validate && !validate(parsed)) {
            throw new Error(ExcecoesMensagens.validacaoFalhouPara(String(fileCaminho)));
        }
        return parsed;
    }
    catch (erro) {
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        throw new Error(ExcecoesMensagens.erroAoLer(String(fileCaminho), erro.message));
    }
}
export async function writeJSON(fileCaminho, data, options = {}) {
    const { createDirs = true, backup = false, pretty = true } = options;
    try {
        if (createDirs) {
            await ensureDir(fileCaminho);
        }
        if (backup && (await fileExists(fileCaminho))) {
            const backupCaminho = `${fileCaminho}.backup`;
            await fs.copyFile(fileCaminho, backupCaminho);
        }
        const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
        await fs.writeFile(fileCaminho, content, 'utf-8');
    }
    catch (erro) {
        throw new Error(ExcecoesMensagens.erroAoEscrever(String(fileCaminho), erro.message));
    }
}
export async function deleteJSON(fileCaminho, options = {}) {
    const { backup = true } = options;
    try {
        const exists = await fileExists(fileCaminho);
        if (!exists) {
            return;
        }
        if (backup) {
            const backupCaminho = `${fileCaminho}.deleted`;
            await fs.rename(fileCaminho, backupCaminho);
        }
        else {
            await fs.unlink(fileCaminho);
        }
    }
    catch (erro) {
        throw new Error(ExcecoesMensagens.erroAoDeletar(String(fileCaminho), erro.message));
    }
}
export async function listJSONFiles(dirPath) {
    try {
        const exists = await fileExists(dirPath);
        if (!exists) {
            return [];
        }
        const entries = await fs.readdir(dirPath, {
            withFileTypes: true
        });
        const jsonArquivos = entries.filter(entry => entry.isFile() && entry.name.endsWith('.json')).map(entry => path.join(dirPath, entry.name));
        return jsonArquivos;
    }
    catch (erro) {
        log.aviso(`Erro ao listar arquivos em ${dirPath}: ${erro.message}`);
        return [];
    }
}
export const ArquivoRegistro = {
    read: readJSON,
    write: writeJSON,
    delete: deleteJSON,
    list: listJSONFiles,
    paths: PROMETHEUS_ARQUIVOS,
    dirs: PROMETHEUS_DIRS
};
//# sourceMappingURL=file-registry.js.map