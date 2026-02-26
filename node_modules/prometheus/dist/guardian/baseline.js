import path from 'node:path';
import { lerEstado, salvarEstado } from '../shared/persistence/persistencia.js';
import { LINHA_BASE_CAMINHO } from './constantes.js';
export async function carregarBaseline() {
    try {
        const json = await lerEstado(LINHA_BASE_CAMINHO);
        if (json && typeof json === 'object' && !Array.isArray(json)) {
            const entries = Object.entries(json).filter(([k, v]) => typeof k === 'string' && typeof v === 'string');
            return Object.fromEntries(entries);
        }
        return null;
    }
    catch {
        return null;
    }
}
export async function salvarBaseline(snapshot) {
    const fs = await import('node:fs');
    await fs.promises.mkdir(path.dirname(LINHA_BASE_CAMINHO), {
        recursive: true
    });
    await salvarEstado(LINHA_BASE_CAMINHO, snapshot);
}
//# sourceMappingURL=baseline.js.map