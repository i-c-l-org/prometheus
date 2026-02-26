import crypto from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { ExitCode, sair } from '../helpers/exit-codes.js';
import { config } from '../../core/config/config.js';
import { formatPct } from '../../core/config/format.js';
import { CliComandoDesempMensagens } from '../../core/messages/cli/cli-comando-perf-messages.js';
import { ICONES_DIAGNOSTICO, log, logSistema } from '../../core/messages/index.js';
import { lerEstado, salvarEstado } from '../../shared/persistence/persistencia.js';
import { Command } from 'commander';
async function obterCommit() {
    try {
        const { executarShellSeguro } = await import('../../core/utils/exec-safe.js');
        return executarShellSeguro('git rev-parse --short HEAD', {
            stdio: ['ignore', 'pipe', 'ignore']
        }).toString().trim();
    }
    catch {
        return undefined;
    }
}
function calcularHash(snapshot) {
    return crypto.createHash('sha1').update(JSON.stringify(snapshot, Object.keys(snapshot).sort())).digest('hex').slice(0, 10);
}
async function gerarBaseline(destDir, metricas) {
    const commit = await obterCommit();
    const base = {
        tipo: 'baseline',
        timestamp: new Date().toISOString(),
        commit,
        node: process.version,
        totalArquivos: metricas?.totalArquivos,
        tempoParsingMs: metricas?.tempoParsingMs,
        tempoAnaliseMs: metricas?.tempoAnaliseMs,
        cacheAstHits: metricas?.cacheAstHits,
        cacheAstMiss: metricas?.cacheAstMiss,
        analistasTop: Array.isArray(metricas?.analistas) ? metricas.analistas.slice().sort((a, b) => b.duracaoMs - a.duracaoMs).slice(0, 5).map(a => ({
            nome: a.nome,
            duracaoMs: a.duracaoMs,
            ocorrencias: a.ocorrencias
        })) : undefined
    };
    const hashConteudo = calcularHash(base);
    const snapshot = {
        ...base,
        hashConteudo
    };
    await fs.mkdir(destDir, {
        recursive: true
    });
    const nome = `baseline-${Date.now()}.json`;
    await salvarEstado(path.join(destDir, nome), snapshot);
    return snapshot;
}
async function carregarSnapshots(dir) {
    try {
        const arquivos = await fs.readdir(dir);
        const jsons = arquivos.filter(f => f.endsWith('.json'));
        const out = [];
        for (const f of jsons) {
            try {
                const parsed = await lerEstado(path.join(dir, f));
                if (parsed && parsed.tipo === 'baseline')
                    out.push(parsed);
            }
            catch {
            }
        }
        return out.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    }
    catch {
        return [];
    }
}
function diffPercent(a, b) {
    if (!a && !b)
        return 0;
    if (!a || !b)
        return 0;
    if (a === 0)
        return 0;
    return (b - a) / a * 100;
}
function compararSnapshots(base, atual) {
    const campos = ['tempoParsingMs', 'tempoAnaliseMs', 'cacheAstHits', 'cacheAstMiss', 'totalArquivos'];
    const diffs = campos.map(c => {
        const anterior = base[c];
        const novo = atual[c];
        return {
            campo: c,
            anterior,
            novo,
            variacaoPct: diffPercent(anterior, novo)
        };
    });
    return diffs;
}
export function comandoPerf() {
    if (false)
        0;
    return new Command('perf')
        .description(CliComandoDesempMensagens.descricao)
        .option('-d, --dir <dir>', CliComandoDesempMensagens.opcoes.dir, config.PERF_SNAPSHOT_DIR)
        .option('-j, --json', CliComandoDesempMensagens.opcoes.json)
        .option('-l, --limite <n>', CliComandoDesempMensagens.opcoes.limite, v => Number(v), 30)
        .addCommand(new Command('baseline')
        .description(CliComandoDesempMensagens.subcomandos.baseline.descricao)
        .action(async (opts, cmd) => {
        try {
            const parent = cmd.parent?.opts?.() || {};
            const dir = parent.dir ? String(parent.dir) : config.PERF_SNAPSHOT_DIR;
            const metricas = globalThis.__ULTIMAS_METRICAS_PROMETHEUS__;
            const snap = await gerarBaseline(dir, metricas || undefined);
            if (parent.json) {
                console.log(JSON.stringify({
                    gerado: true,
                    snapshot: snap
                }, null, 2));
            }
            else {
                log.sucesso(`Baseline gerada: commit=${snap.commit || 'n/a'} parsing=${snap.tempoParsingMs}ms analise=${snap.tempoAnaliseMs}ms`);
            }
        }
        catch (err) {
            log.erro(CliComandoDesempMensagens.subcomandos.baseline.erro(err instanceof Error ? err.message : String(err)));
            sair(ExitCode.Failure);
            return;
        }
    }))
        .addCommand(new Command('compare')
        .description(CliComandoDesempMensagens.subcomandos.compare.descricao)
        .action(async (opts, cmd) => {
        const parent = cmd.parent?.opts?.() || {};
        const dir = parent.dir ? String(parent.dir) : config.PERF_SNAPSHOT_DIR;
        const limite = parent.limite;
        let snaps;
        try {
            snaps = await carregarSnapshots(dir);
        }
        catch (err) {
            log.erro(CliComandoDesempMensagens.subcomandos.compare.erroSnapshots(err instanceof Error ? err.message : String(err)));
            sair(ExitCode.Failure);
            return;
        }
        if (snaps.length < 2) {
            const msg = CliComandoDesempMensagens.subcomandos.compare.erroMenosDeDois;
            if (parent.json)
                console.log(JSON.stringify({
                    erro: msg
                }));
            else
                log.aviso(msg);
            return;
        }
        const anterior = snaps[snaps.length - 2];
        const atual = snaps[snaps.length - 1];
        const diffs = compararSnapshots(anterior, atual);
        const regressao = diffs.filter(d => d.campo === 'tempoAnaliseMs' || d.campo === 'tempoParsingMs').some(d => d.variacaoPct > limite);
        if (parent.json) {
            console.log(JSON.stringify({
                base: anterior.hashConteudo,
                atual: atual.hashConteudo,
                limite,
                diffs,
                regressao
            }, null, 2));
        }
        else {
            log.info(CliComandoDesempMensagens.tituloComparacaoSnapshotsComIcone(ICONES_DIAGNOSTICO.info));
            diffs.forEach(d => {
                log.info(`  ${d.campo}: ${d.anterior ?? '-'} => ${d.novo ?? '-'} (${formatPct(d.variacaoPct)})`);
            });
            if (regressao)
                logSistema.performanceRegressaoDetectada(limite);
            else
                logSistema.performanceSemRegressoes();
        }
        if (regressao) {
            sair(ExitCode.Failure);
            return;
        }
    }));
}
//# sourceMappingURL=comando-perf.js.map