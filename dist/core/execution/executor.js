import crypto from 'node:crypto';
import { config } from '../config/config.js';
import { formatMs } from '../config/format.js';
import { log, logCore, MENSAGENS_EXECUTOR } from '../messages/index.js';
import { logAnalistas } from '../messages/log/log-helper.js';
import { createDefaultReporter } from '../reporting/default-reporter.js';
import { WorkerPool } from '../workers/worker-pool.js';
import { lerEstado, salvarEstado } from '../../shared/persistence/persistencia.js';
import XXH from 'xxhashjs';
import { ocorrenciaErroAnalista } from '../../types/index.js';
const __infoD = (msg) => {
    const l = log;
    if (typeof l.infoDestaque === 'function')
        return l.infoDestaque(msg);
    return l.info(msg);
};
export async function executarInquisicao(fileEntriesComAst, tecnicas, baseDir, guardianResultado, opts) {
    const ocorrencias = [];
    const metricasAnalistas = [];
    const arquivosValidosSet = new Set(fileEntriesComAst.map(f => f.relPath));
    const emitter = opts?.events;
    const contextoGlobalBase = {
        baseDir,
        arquivos: fileEntriesComAst,
        ambiente: {
            arquivosValidosSet,
            guardian: guardianResultado
        }
    };
    const reporter = opts?.reporter ?? createDefaultReporter();
    const inicioExecucao = performance.now();
    function isNodePath(x) {
        if (typeof x !== 'object' || x === null)
            return false;
        const maybe = x;
        if (!('node' in maybe))
            return false;
        const node = maybe.node;
        if (typeof node !== 'object' || node === null)
            return false;
        return 'type' in node;
    }
    let estadoIncremental = null;
    if (config.ANALISE_INCREMENTAL_ENABLED) {
        const lido = await lerEstado(config.ANALISE_INCREMENTAL_STATE_PATH).catch(() => null);
        if (lido && lido.versao === config.ANALISE_INCREMENTAL_VERSION)
            estadoIncremental = lido;
    }
    const novoEstado = {
        versao: config.ANALISE_INCREMENTAL_VERSION,
        arquivos: {},
        estatisticas: {
            totalReaproveitamentos: 0,
            totalArquivosProcessados: 0,
            ultimaDuracaoMs: 0
        }
    };
    function hashConteudo(c) {
        try {
            return XXH.h64(c, 0xabcd).toString(16);
        }
        catch {
            return crypto.createHash('sha1').update(c).digest('hex');
        }
    }
    for (const tecnica of tecnicas) {
        if (tecnica.global) {
            const timeoutMs = config.ANALISE_TIMEOUT_POR_ANALISTA_MS;
            try {
                const inicioAnalista = performance.now();
                let resultado;
                if (timeoutMs > 0) {
                    const execPromise = tecnica.aplicar('', '', null, undefined, contextoGlobalBase);
                    resultado = await (async () => {
                        let timer = null;
                        try {
                            const race = Promise.race([execPromise, new Promise((_, reject) => {
                                    timer = setTimeout(() => reject(new Error(`Timeout: analista global '${tecnica.nome}' excedeu ${timeoutMs}ms`)), timeoutMs);
                                })]);
                            return await race;
                        }
                        finally {
                            if (timer)
                                clearTimeout(timer);
                        }
                    })();
                }
                else {
                    resultado = await tecnica.aplicar('', '', null, undefined, contextoGlobalBase);
                }
                if (Array.isArray(resultado)) {
                    ocorrencias.push(...resultado);
                }
                const duracaoMs = performance.now() - inicioAnalista;
                if (config.ANALISE_METRICAS_ENABLED) {
                    metricasAnalistas.push({
                        nome: tecnica.nome || 'desconhecido',
                        duracaoMs,
                        ocorrencias: Array.isArray(resultado) ? resultado.length : resultado ? 1 : 0,
                        global: true
                    });
                }
                if (opts?.verbose) {
                    log.sucesso(MENSAGENS_EXECUTOR.tecnicaGlobalSucesso(tecnica.nome || 'desconhecido'));
                }
                if (config.LOG_ESTRUTURADO) {
                    log.info(JSON.stringify({
                        tipo: 'analista',
                        escopo: 'global',
                        nome: tecnica.nome,
                        duracaoMs,
                        ocorrencias: metricasAnalistas.at(-1)?.ocorrencias
                    }));
                }
            }
            catch (error) {
                const err = error;
                const isTempoLimite = err.message.includes('Timeout: analista global');
                const nivelLog = isTempoLimite ? 'aviso' : 'erro';
                if (nivelLog === 'aviso') {
                    log.aviso(MENSAGENS_EXECUTOR.tecnicaGlobalTimeout(tecnica.nome || 'desconhecido'));
                }
                else {
                    log.erro(MENSAGENS_EXECUTOR.tecnicaGlobalErro(tecnica.nome || 'desconhecido', err.message));
                    if (err.stack) {
                        if (opts?.verbose || config.DEV_MODE) {
                            log.info(MENSAGENS_EXECUTOR.stackTrace);
                            log.info(err.stack);
                        }
                    }
                }
                ocorrencias.push(ocorrenciaErroAnalista({
                    mensagem: isTempoLimite
                        ? MENSAGENS_EXECUTOR.tecnicaGlobalTimeoutOcorrencia(tecnica.nome || 'desconhecido', timeoutMs)
                        : MENSAGENS_EXECUTOR.tecnicaGlobalErroOcorrencia(tecnica.nome || 'desconhecido', err.message),
                    relPath: '[execução global]',
                    origem: tecnica.nome,
                    stack: !isTempoLimite && err.stack ? err.stack : undefined
                }));
            }
        }
    }
    if (opts?.fast && fileEntriesComAst.length > 0) {
        log.info(MENSAGENS_EXECUTOR.fastModeAtivado);
        const workerPool = new WorkerPool({
            enabled: true,
            maxWorkers: config.WORKER_POOL_MAX_WORKERS || undefined,
            batchSize: 10,
            timeoutMs: config.ANALISE_TIMEOUT_POR_ANALISTA_MS
        });
        const resultadoWorkers = await workerPool.processFiles(fileEntriesComAst, tecnicas.filter(t => !t.global), contextoGlobalBase);
        ocorrencias.push(...resultadoWorkers.occurrences);
        metricasAnalistas.push(...resultadoWorkers.metrics);
        const duracaoTotal = performance.now() - inicioExecucao;
        log.sucesso(MENSAGENS_EXECUTOR.analiseRapidaConcluida(fileEntriesComAst.length, formatMs(duracaoTotal)));
        if (config.ANALISE_INCREMENTAL_ENABLED) {
            try {
                for (const entry of fileEntriesComAst) {
                    const hash = hashConteudo(entry.content ?? '');
                    novoEstado.arquivos[entry.relPath] = {
                        hash,
                        ocorrencias: [],
                        reaproveitadoCount: 0
                    };
                }
                if (novoEstado.estatisticas) {
                    novoEstado.estatisticas.totalArquivosProcessados = fileEntriesComAst.length;
                    novoEstado.estatisticas.ultimaDuracaoMs = duracaoTotal;
                }
                await salvarEstado(config.ANALISE_INCREMENTAL_STATE_PATH, novoEstado);
            }
            catch {
            }
        }
        const metricasExecucao = {
            totalArquivos: fileEntriesComAst.length,
            tempoTotal: duracaoTotal,
            ocorrenciasEncontradas: ocorrencias.length,
            analistas: metricasAnalistas,
            workerPool: {
                workersAtivos: resultadoWorkers.totalProcessed,
                duracaoTotalMs: resultadoWorkers.duration
            }
        };
        const resultadoFast = {
            totalArquivos: fileEntriesComAst.length,
            arquivosAnalisados: fileEntriesComAst.map(e => e.relPath),
            ocorrencias,
            timestamp: Date.now(),
            duracaoMs: duracaoTotal,
            metricas: metricasExecucao
        };
        if (emitter) {
            emitter.emit('analysis:complete', resultadoFast);
        }
        return resultadoFast;
    }
    const contextoGlobal = {
        ...contextoGlobalBase,
        report: (event) => {
            try {
                const oc = reporter(event);
                if (oc)
                    ocorrencias.push(oc);
            }
            catch (e) {
                ocorrencias.push(ocorrenciaErroAnalista({
                    mensagem: `Falha no reporter: ${e.message}`,
                    relPath: event?.relPath || '[report]',
                    origem: 'reporter'
                }));
            }
        }
    };
    let arquivoAtual = 0;
    const totalArquivos = fileEntriesComAst.length;
    const LIMIAR_DETALHE_TOTAL = 100;
    const LIMIAR_DETALHE_LIMITADO_MAX = 250;
    function passoDeLog(total) {
        if (total <= 100)
            return 1;
        if (total <= 250)
            return 10;
        if (total <= 500)
            return 25;
        return 100;
    }
    const stepVerbose = passoDeLog(totalArquivos);
    const detalharPorArquivo = (opts?.verbose ?? false) && totalArquivos <= LIMIAR_DETALHE_TOTAL;
    const permitirArquivoXY = (opts?.verbose ?? false) && totalArquivos <= LIMIAR_DETALHE_LIMITADO_MAX;
    logAnalistas.iniciarBatch(totalArquivos);
    for (const entry of fileEntriesComAst) {
        arquivoAtual++;
        if (opts?.compact) {
            if (arquivoAtual === totalArquivos) {
                log.info(MENSAGENS_EXECUTOR.arquivosAnalisadosTotal(totalArquivos));
            }
        }
        else if (opts?.verbose) {
            if (permitirArquivoXY) {
                if (arquivoAtual === 1 || arquivoAtual % stepVerbose === 0 || arquivoAtual === totalArquivos) {
                    log.info(MENSAGENS_EXECUTOR.arquivoProcessando(arquivoAtual, totalArquivos, entry.relPath));
                }
            }
            else {
                if (arquivoAtual === 1 || arquivoAtual % stepVerbose === 0 || arquivoAtual === totalArquivos) {
                    log.info(MENSAGENS_EXECUTOR.arquivosAnalisadosProgress(arquivoAtual, totalArquivos));
                }
            }
        }
        else if (arquivoAtual % 50 === 0 || arquivoAtual === totalArquivos) {
            if (arquivoAtual === totalArquivos) {
                __infoD(MENSAGENS_EXECUTOR.arquivosAnalisadosProgress(arquivoAtual, totalArquivos));
            }
        }
        const conteudo = entry.content ?? '';
        const h = hashConteudo(conteudo);
        const cacheAnterior = estadoIncremental?.arquivos[entry.relPath];
        let reaproveitou = false;
        if (config.ANALISE_INCREMENTAL_ENABLED && cacheAnterior && cacheAnterior.hash === h) {
            ocorrencias.push(...cacheAnterior.ocorrencias);
            novoEstado.arquivos[entry.relPath] = cacheAnterior;
            novoEstado.arquivos[entry.relPath].reaproveitadoCount = (cacheAnterior.reaproveitadoCount || 0) + 1;
            if (novoEstado.estatisticas) {
                novoEstado.estatisticas.totalReaproveitamentos = (novoEstado.estatisticas.totalReaproveitamentos || 0) + 1;
            }
            reaproveitou = true;
            if (detalharPorArquivo)
                logCore.reaproveitadoIncremental(entry.relPath);
            if (config.LOG_ESTRUTURADO) {
                log.info(JSON.stringify({
                    tipo: 'incremental-reuse',
                    arquivo: entry.relPath,
                    ocorrencias: cacheAnterior.ocorrencias.length
                }));
            }
        }
        if (reaproveitou)
            continue;
        for (const tecnica of tecnicas) {
            if (tecnica.global)
                continue;
            if (tecnica.test && !tecnica.test(entry.relPath))
                continue;
            const timeoutMs = config.ANALISE_TIMEOUT_POR_ANALISTA_MS;
            try {
                const inicioAnalista = performance.now();
                const tamanhoArquivo = entry.content ? Math.round(entry.content.length / 1024) : 0;
                logAnalistas.iniciandoAnalista(tecnica.nome || 'analista-desconhecido', entry.relPath, tamanhoArquivo);
                let resultado;
                if (timeoutMs > 0) {
                    const astParam = isNodePath(entry.ast) ? entry.ast : null;
                    const execPromise = tecnica.aplicar(entry.content ?? '', entry.relPath, astParam, entry.fullCaminho, contextoGlobal);
                    resultado = await (async () => {
                        let timer = null;
                        try {
                            const race = Promise.race([execPromise, new Promise((_, reject) => {
                                    timer = setTimeout(() => reject(new Error(`Timeout: analista '${tecnica.nome}' excedeu ${timeoutMs}ms para ${entry.relPath}`)), timeoutMs);
                                })]);
                            return await race;
                        }
                        finally {
                            if (timer)
                                clearTimeout(timer);
                        }
                    })();
                }
                else {
                    const astParam2 = isNodePath(entry.ast) ? entry.ast : null;
                    resultado = await tecnica.aplicar(entry.content ?? '', entry.relPath, astParam2, entry.fullCaminho, contextoGlobal);
                }
                if (Array.isArray(resultado)) {
                    ocorrencias.push(...resultado);
                }
                const duracaoMs = performance.now() - inicioAnalista;
                if (config.ANALISE_METRICAS_ENABLED) {
                    metricasAnalistas.push({
                        nome: tecnica.nome || 'desconhecido',
                        duracaoMs,
                        ocorrencias: Array.isArray(resultado) ? resultado.length : resultado ? 1 : 0,
                        global: false
                    });
                }
                const ocorrenciasContagem = Array.isArray(resultado) ? resultado.length : resultado ? 1 : 0;
                logAnalistas.concluido(tecnica.nome || 'analista-desconhecido', entry.relPath, ocorrenciasContagem, duracaoMs);
                if (detalharPorArquivo) {
                    log.info(MENSAGENS_EXECUTOR.analiseCompleta(tecnica.nome || 'desconhecido', entry.relPath, formatMs(duracaoMs)));
                }
                if (config.LOG_ESTRUTURADO) {
                    log.info(JSON.stringify({
                        tipo: 'analista',
                        arquivo: entry.relPath,
                        nome: tecnica.nome,
                        duracaoMs,
                        ocorrencias: metricasAnalistas.at(-1)?.ocorrencias
                    }));
                }
            }
            catch (error) {
                const err = error;
                const isTempoLimite = err.message.includes('Timeout: analista');
                const nivelLog = isTempoLimite ? 'aviso' : 'erro';
                if (isTempoLimite) {
                    const duracaoEstimada = config.ANALISE_TIMEOUT_POR_ANALISTA_MS || 30000;
                    logAnalistas.timeout(tecnica.nome || 'analista-desconhecido', duracaoEstimada);
                }
                else {
                    logAnalistas.erro(tecnica.nome || 'analista-desconhecido', err.message);
                }
                if (nivelLog === 'aviso') {
                    log.aviso(MENSAGENS_EXECUTOR.tecnicaLocalErro(tecnica.nome || 'desconhecido', entry.relPath, err.message));
                }
                else {
                    log.erro(MENSAGENS_EXECUTOR.tecnicaLocalErro(tecnica.nome || 'desconhecido', entry.relPath, err.message));
                    if (err.stack) {
                        if (opts?.verbose || config.DEV_MODE) {
                            log.info(MENSAGENS_EXECUTOR.stackTrace);
                            log.info(err.stack);
                        }
                    }
                }
                ocorrencias.push(ocorrenciaErroAnalista({
                    mensagem: isTempoLimite
                        ? MENSAGENS_EXECUTOR.tecnicaLocalTimeoutOcorrencia(tecnica.nome || 'desconhecido', entry.relPath, timeoutMs)
                        : MENSAGENS_EXECUTOR.tecnicaLocalErroOcorrencia(tecnica.nome || 'desconhecido', entry.relPath, err.message),
                    relPath: entry.relPath,
                    origem: tecnica.nome,
                    stack: !isTempoLimite && err.stack ? err.stack : undefined
                }));
            }
        }
        if (config.ANALISE_INCREMENTAL_ENABLED) {
            const ocorrArq = ocorrencias.filter(o => o.relPath === entry.relPath);
            const analistasArquivo = {};
            for (const m of metricasAnalistas.filter(m => !m.global)) {
                analistasArquivo[m.nome] = {
                    ocorrencias: m.ocorrencias,
                    duracaoMs: m.duracaoMs
                };
            }
            novoEstado.arquivos[entry.relPath] = {
                hash: h,
                ocorrencias: ocorrArq,
                analistas: analistasArquivo,
                ultimaExecucaoMs: Date.now(),
                reaproveitadoCount: 0
            };
            if (novoEstado.estatisticas) {
                novoEstado.estatisticas.totalArquivosProcessados = (novoEstado.estatisticas.totalArquivosProcessados || 0) + 1;
            }
        }
        logAnalistas.arquivoProcessado();
        if (emitter) {
            const ocorrArquivo = ocorrencias.filter(o => o.relPath === entry.relPath);
            emitter.emit('file:processed', { relPath: entry.relPath, ocorrencias: ocorrArquivo.length });
        }
    }
    const fimExecucao = performance.now();
    const duracaoMs = Math.round(fimExecucao - inicioExecucao);
    logAnalistas.finalizarBatch(ocorrencias.length, duracaoMs);
    let metricasExecucao = null;
    if (config.ANALISE_METRICAS_ENABLED) {
        const metricasGlobais = globalThis.__PROMETHEUS_METRICAS__ || {
            parsingTimeMs: 0,
            cacheHits: 0,
            cacheMiss: 0
        };
        metricasExecucao = {
            totalArquivos: fileEntriesComAst.length,
            tempoParsingMs: Math.round(metricasGlobais.parsingTimeMs),
            tempoAnaliseMs: duracaoMs,
            cacheAstHits: metricasGlobais.cacheHits,
            cacheAstMiss: metricasGlobais.cacheMiss,
            analistas: metricasAnalistas
        };
        if (config.LOG_ESTRUTURADO) {
            log.info(JSON.stringify({
                tipo: 'metricas',
                ...metricasExecucao
            }));
        }
        try {
            const historicoCaminho = config.ANALISE_METRICAS_HISTORICO_PATH;
            if (historicoCaminho) {
                const anterior = await lerEstado(historicoCaminho).catch(() => []);
                const lista = Array.isArray(anterior) ? anterior : [];
                lista.push({
                    ...metricasExecucao,
                    timestamp: Date.now()
                });
                const max = config.ANALISE_METRICAS_HISTORICO_MAX || 200;
                const recortado = lista.slice(-max);
                await salvarEstado(historicoCaminho, recortado);
            }
        }
        catch (e) {
            log.erro(MENSAGENS_EXECUTOR.falhaPersistirMetricas(e.message));
        }
    }
    if (config.ANALISE_INCREMENTAL_ENABLED) {
        if (novoEstado.estatisticas) {
            novoEstado.estatisticas.ultimaDuracaoMs = duracaoMs;
        }
        await salvarEstado(config.ANALISE_INCREMENTAL_STATE_PATH, novoEstado);
        if (config.LOG_ESTRUTURADO) {
            log.info(JSON.stringify({
                tipo: 'incremental-salvo',
                arquivos: Object.keys(novoEstado.arquivos).length,
                totalReaproveitamentos: novoEstado.estatisticas?.totalReaproveitamentos,
                processados: novoEstado.estatisticas?.totalArquivosProcessados
            }));
        }
    }
    const resultado = {
        totalArquivos: fileEntriesComAst.length,
        arquivosAnalisados: fileEntriesComAst.map(e => e.relPath),
        ocorrencias,
        timestamp: Date.now(),
        duracaoMs,
        metricas: metricasExecucao || undefined
    };
    if (emitter) {
        emitter.emit('analysis:complete', resultado);
    }
    return resultado;
}
export function registrarUltimasMetricas(metricas) {
    try {
        globalThis.__ULTIMAS_METRICAS_PROMETHEUS__ = metricas || null;
    }
    catch {
    }
}
//# sourceMappingURL=executor.js.map