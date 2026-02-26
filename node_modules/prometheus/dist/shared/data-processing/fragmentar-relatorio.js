import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { config } from '../../core/config/config.js';
import { salvarBinario, salvarEstado } from '../persistence/persistencia.js';
function chunkArray(arr, size) {
    const out = [];
    for (let i = 0; i < arr.length; i += size)
        out.push(arr.slice(i, i + size));
    return out;
}
export async function fragmentarRelatorio(relatorioFull, dir, ts, options) {
    const maxOcorrencias = options?.maxOcorrenciasPerShard ?? config.REPORT_FRAGMENT_OCCURRENCES ?? 2000;
    const maxArquivoEntries = options?.maxFileEntriesPerShard ?? config.REPORT_FRAGMENT_FILEENTRIES ?? 500;
    const topN = config.REPORT_FRAGMENT_SUMMARY_TOPN ?? 5;
    const rel = relatorioFull;
    const resultado = rel && 'resultado' in rel ? rel.resultado : rel;
    const ocorrencias = resultado && Array.isArray(resultado.ocorrencias) ? resultado.ocorrencias : [];
    const fileEntries = resultado && Array.isArray(resultado.fileEntries) ? resultado.fileEntries : [];
    const salvar = salvarEstado;
    const manifest = {
        generatedAt: new Date().toISOString(),
        baseNome: `prometheus-relatorio-full-${ts}`,
        parts: []
    };
    const meta = {
        ...rel
    };
    if (meta.resultado && typeof meta.resultado === 'object') {
        const r = meta.resultado;
        delete r.ocorrencias;
        delete r.fileEntries;
    }
    const metaFilename = `prometheus-relatorio-full-${ts}-meta.json.gz`;
    const metaBuf = Buffer.from(JSON.stringify(meta, null, 2), 'utf-8');
    const metaGz = gzipSync(metaBuf);
    await salvarBinario(path.join(dir, metaFilename), metaGz);
    manifest.parts.push({
        kind: 'meta',
        file: metaFilename,
        bytes: metaGz.length
    });
    if (ocorrencias.length > 0) {
        const occPedacos = chunkArray(ocorrencias, maxOcorrencias);
        for (let i = 0; i < occPedacos.length; i++) {
            const fname = `prometheus-relatorio-full-${ts}-ocorrencias-part-${i + 1}.json.gz`;
            const payload = {
                shard: {
                    kind: 'ocorrencias',
                    index: i + 1,
                    total: occPedacos.length
                },
                count: occPedacos[i].length,
                ocorrencias: occPedacos[i]
            };
            const buf = Buffer.from(JSON.stringify(payload, null, 2), 'utf-8');
            const gz = gzipSync(buf);
            await salvarBinario(path.join(dir, fname), gz);
            const tiposContagem = {};
            const arquivosContagem = {};
            for (const o of occPedacos[i]) {
                const oLegacy = o;
                const t = o && (o.tipo || oLegacy.type) ? String(o.tipo ?? oLegacy.type) : 'desconhecido';
                tiposContagem[t] = (tiposContagem[t] || 0) + 1;
                const relp = o && (o.relPath || oLegacy.path) ? String(o.relPath ?? oLegacy.path) : 'desconhecido';
                arquivosContagem[relp] = (arquivosContagem[relp] || 0) + 1;
            }
            const topTipos = Object.entries(tiposContagem).sort((a, b) => b[1] - a[1]).slice(0, topN).map(([k, v]) => ({
                tipo: k,
                count: v
            }));
            const topArquivos = Object.entries(arquivosContagem).sort((a, b) => b[1] - a[1]).slice(0, topN).map(([k, v]) => ({
                arquivo: k,
                count: v
            }));
            manifest.parts.push({
                kind: 'ocorrencias',
                file: fname,
                index: i + 1,
                total: occPedacos.length,
                count: occPedacos[i].length,
                bytes: gz.length,
                summary: {
                    topTipos,
                    topArquivos
                }
            });
        }
    }
    if (fileEntries.length > 0) {
        const fePedacos = chunkArray(fileEntries, maxArquivoEntries);
        for (let i = 0; i < fePedacos.length; i++) {
            const fname = `prometheus-relatorio-full-${ts}-fileentries-part-${i + 1}.json.gz`;
            const payload = {
                shard: {
                    kind: 'fileEntries',
                    index: i + 1,
                    total: fePedacos.length
                },
                count: fePedacos[i].length,
                fileEntries: fePedacos[i]
            };
            const buf = Buffer.from(JSON.stringify(payload, null, 2), 'utf-8');
            const gz = gzipSync(buf);
            await salvarBinario(path.join(dir, fname), gz);
            const arquivosResumo = [];
            for (const fe of fePedacos[i]) {
                const feLegacy = fe;
                const rel = fe && (fe.relPath || fe.fullCaminho || feLegacy.path) ? String(fe.relPath ?? fe.fullCaminho ?? feLegacy.path) : 'desconhecido';
                let linhas = undefined;
                try {
                    if (fe && typeof fe.content === 'string')
                        linhas = fe.content.split(/\r?\n/).length;
                }
                catch { }
                arquivosResumo.push({
                    arquivo: rel,
                    linhas
                });
            }
            const topArquivosByLinhas = arquivosResumo.filter(a => typeof a.linhas === 'number').sort((a, b) => (b.linhas ?? 0) - (a.linhas ?? 0)).slice(0, topN);
            manifest.parts.push({
                kind: 'fileEntries',
                file: fname,
                index: i + 1,
                total: fePedacos.length,
                count: fePedacos[i].length,
                bytes: gz.length,
                summary: {
                    topArquivosByLinhas
                }
            });
        }
    }
    const manifestFilename = `prometheus-relatorio-full-${ts}-manifest.json`;
    await salvar(path.join(dir, manifestFilename), manifest);
    return {
        manifestFile: manifestFilename,
        manifest
    };
}
export default fragmentarRelatorio;
//# sourceMappingURL=fragmentar-relatorio.js.map