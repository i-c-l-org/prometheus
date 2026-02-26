import { OperarioEstrutura } from '../../analistas/estrategistas/operario-estrutura.js';
import { exportarRelatoriosReestruturacao } from '../handlers/reestruturacao-exporter.js';
import { exibirMolduraConflitos, exibirMolduraPlano } from '../helpers/exibir-moldura.js';
import { ExitCode, sair } from '../helpers/exit-codes.js';
import { parsearCategorias } from '../helpers/flags-helpers.js';
import chalk from '../../core/config/chalk-safe.js';
import { config } from '../../core/config/config.js';
import { executarInquisicao, prepararComAst } from '../../core/execution/inquisidor.js';
import { CliComandoReestruturarMensagens } from '../../core/messages/cli/cli-comando-reestruturar-messages.js';
import { CABECALHOS, log } from '../../core/messages/index.js';
import { Command } from 'commander';
import ora from 'ora';
import { asTecnicas, extrairMensagemErro } from '../../types/index.js';
export function comandoReestruturar(aplicarFlagsGlobais) {
    return new Command('reestruturar')
        .description(CliComandoReestruturarMensagens.descricao)
        .option('-a, --auto', CliComandoReestruturarMensagens.opcoes.auto, false)
        .option('--aplicar', CliComandoReestruturarMensagens.opcoes.aplicar, false)
        .option('--somente-plano', CliComandoReestruturarMensagens.opcoes.somentePlano, false)
        .option('--domains', CliComandoReestruturarMensagens.opcoes.domains, false)
        .option('--flat', CliComandoReestruturarMensagens.opcoes.flat, false)
        .option('--prefer-estrategista', CliComandoReestruturarMensagens.opcoes.preferEstrategista, false)
        .option('--preset <nome>', CliComandoReestruturarMensagens.opcoes.preset)
        .option('--categoria <pair>', CliComandoReestruturarMensagens.opcoes.categoria, (val, prev) => {
        prev.push(val);
        return prev;
    }, [])
        .option('--include <padrao>', CliComandoReestruturarMensagens.opcoes.include, (val, prev) => {
        prev.push(val);
        return prev;
    }, [])
        .option('--exclude <padrao>', CliComandoReestruturarMensagens.opcoes.exclude, (val, prev) => {
        prev.push(val);
        return prev;
    }, [])
        .action(async function (opts) {
        try {
            await aplicarFlagsGlobais(this.parent?.opts && typeof this.parent.opts === 'function' ? this.parent.opts() : {});
        }
        catch (err) {
            log.erro(`Falha ao aplicar flags: ${err instanceof Error ? err.message : String(err)}`);
            sair(ExitCode.Failure);
            return;
        }
        log.info(chalk.bold(CliComandoReestruturarMensagens.inicio));
        const spinner = ora({
            text: CliComandoReestruturarMensagens.spinnerCalculandoPlano,
            spinner: 'dots'
        }).start();
        const baseDir = process.cwd();
        try {
            if (process.env.PROMETHEUS_TEST_FAST === '1') {
                const fileEntriesComAst = [];
                const map = parsearCategorias(opts.categoria);
                if (opts.domains && opts.flat) {
                    log.aviso(CABECALHOS.reestruturar.prioridadeDomainsFlat);
                }
                const criarSubpastasPorEntidade = opts.domains ? true : opts.flat ? false : undefined;
                const { plano, origem } = await OperarioEstrutura.planejar(baseDir, fileEntriesComAst, {
                    preferEstrategista: opts.preferEstrategista,
                    criarSubpastasPorEntidade,
                    categoriasMapa: Object.keys(map).length ? map : undefined,
                    preset: opts.preset
                });
                if (opts.domains && opts.flat) {
                    log.aviso(CABECALHOS.reestruturar.prioridadeDomainsFlat);
                }
                if (plano) {
                    if (!plano.mover.length) {
                        log.info(CABECALHOS.reestruturar.planoVazioFast);
                    }
                    else {
                        log.info(CliComandoReestruturarMensagens.planoSugeridoFast(origem, plano.mover.length));
                    }
                    if (plano.conflitos?.length) {
                        log.aviso(CABECALHOS.reestruturar.conflitosDetectadosFast(plano.conflitos.length));
                    }
                }
                if (opts.somentePlano) {
                    log.info(CliComandoReestruturarMensagens.dryRunFast);
                    return;
                }
                if (!plano || !plano.mover.length) {
                    log.sucesso(CABECALHOS.reestruturar.nenhumNecessarioFast);
                    return;
                }
                if (opts.domains && opts.flat) {
                    log.aviso(CABECALHOS.reestruturar.prioridadeDomainsFlat);
                }
                const aplicar = opts.auto || opts.aplicar;
                if (aplicar) {
                    await OperarioEstrutura.aplicar(OperarioEstrutura.toMapaMoves(plano), fileEntriesComAst, baseDir);
                    log.sucesso(CliComandoReestruturarMensagens.reestruturacaoConcluidaFast(plano.mover.length));
                    return;
                }
                log.info(CliComandoReestruturarMensagens.planoCalculadoFastSemAplicar);
                return;
            }
            let fileEntriesComAst = [];
            let analiseParaCorrecao = {
                ocorrencias: []
            };
            try {
                const { scanRepository } = await import('../../core/execution/scanner.js');
                const fileMap = await scanRepository(baseDir, {});
                const fileEntries = Object.values(fileMap);
                fileEntriesComAst = typeof prepararComAst === 'function' ? await prepararComAst(fileEntries, baseDir) : fileEntries.map(entry => ({
                    ...entry,
                    ast: undefined
                }));
                let analise;
                try {
                    const { iniciarInquisicao } = await import('../../core/execution/inquisidor.js');
                    const { registroAnalistas } = await import('../../analistas/registry/registry.js');
                    const tecnicasDyn = asTecnicas(registroAnalistas);
                    if (typeof iniciarInquisicao === 'function') {
                        analise = await iniciarInquisicao(baseDir, { skipExec: false }, tecnicasDyn);
                        if (analise && analise.fileEntries) {
                            analiseParaCorrecao = analise;
                        }
                        else if (analise && 'ocorrencias' in analise) {
                            analiseParaCorrecao = await executarInquisicao(fileEntriesComAst, tecnicasDyn, baseDir, undefined, {
                                verbose: false,
                                compact: true
                            });
                        }
                        else {
                            analiseParaCorrecao = analise;
                        }
                    }
                    else {
                        analiseParaCorrecao = await executarInquisicao(fileEntriesComAst, tecnicasDyn, baseDir, undefined, {
                            verbose: false,
                            compact: true
                        });
                    }
                }
                catch (err) {
                    if (process.env.VITEST) {
                        analiseParaCorrecao = {
                            ocorrencias: []
                        };
                    }
                    else {
                        if (process.env.VITEST && err.message.includes('falha') || err.message.includes('erro')) {
                            throw err;
                        }
                        throw err;
                    }
                }
            }
            catch (err) {
                log.erro(CliComandoReestruturarMensagens.erroDuranteReestruturacao(typeof err === 'object' && err && 'message' in err ? err.message : String(err)));
                if (config.DEV_MODE) {
                    console.error(extrairMensagemErro(err));
                    if (err && typeof err === 'object' && 'stack' in err) {
                        console.error(err.stack);
                    }
                }
                if (process.env.VITEST) {
                    throw new Error('exit:1');
                }
                else {
                    sair(ExitCode.Failure);
                    return;
                }
            }
            const map = parsearCategorias(opts.categoria);
            if (opts.domains && opts.flat) {
                log.aviso(CABECALHOS.reestruturar.prioridadeDomainsFlat);
            }
            const criarSubpastasPorEntidade = opts.domains ? true : opts.flat ? false : undefined;
            const { plano, origem } = await OperarioEstrutura.planejar(baseDir, fileEntriesComAst, {
                preferEstrategista: opts.preferEstrategista,
                criarSubpastasPorEntidade,
                categoriasMapa: Object.keys(map).length ? map : undefined,
                preset: opts.preset
            });
            if (plano) {
                if (!plano.mover.length) {
                    spinner.info(CliComandoReestruturarMensagens.spinnerPlanoVazio);
                }
                else {
                    spinner.succeed(CliComandoReestruturarMensagens.spinnerPlanoSugerido(origem, plano.mover.length));
                    exibirMolduraPlano(plano.mover, 10);
                }
                if (plano.conflitos?.length) {
                    spinner.warn(CliComandoReestruturarMensagens.spinnerConflitosDetectados(plano.conflitos.length));
                    exibirMolduraConflitos(plano.conflitos, 10);
                }
            }
            else {
                spinner.warn(CliComandoReestruturarMensagens.spinnerSemPlanoSugestao);
            }
            if (opts.somentePlano) {
                await exportarRelatoriosReestruturacao({
                    baseDir,
                    movimentos: plano?.mover?.length ? plano.mover : [],
                    simulado: true,
                    origem,
                    preset: opts.preset,
                    conflitos: Array.isArray(plano?.conflitos) ? plano.conflitos.length : 0
                });
                log.info(CliComandoReestruturarMensagens.dryRunCompleto);
                log.info(chalk.yellow(CliComandoReestruturarMensagens.dicaParaAplicar));
                return;
            }
            const fallbackOcorrencias = analiseParaCorrecao.ocorrencias;
            const usarFallback = (!plano || !plano.mover.length) && !!(fallbackOcorrencias && fallbackOcorrencias.length > 0);
            let mapaMoves = [];
            if (plano && plano.mover.length) {
                mapaMoves = OperarioEstrutura.toMapaMoves(plano);
            }
            else if (usarFallback) {
                log.aviso(CliComandoReestruturarMensagens.fallbackProblemasEstruturais(fallbackOcorrencias.length));
                fallbackOcorrencias.forEach((occ) => {
                    const rel = occ.relPath ?? occ.arquivo ?? 'arquivo desconhecido';
                    log.info(CliComandoReestruturarMensagens.fallbackLinhaOcorrencia(occ.tipo ?? 'ocorrencia', rel, occ.mensagem ?? ''));
                });
                mapaMoves = OperarioEstrutura.ocorrenciasParaMapa(fallbackOcorrencias);
            }
            if (!mapaMoves.length) {
                spinner.succeed(CliComandoReestruturarMensagens.nenhumNecessario);
                return;
            }
            const aplicar = opts.auto || opts.aplicar;
            if (!aplicar) {
                let answer = '';
                if (process.env.VITEST) {
                    answer = process.env.PROMETHEUS_REESTRUTURAR_ANSWER ?? 's';
                }
                else {
                    try {
                        const readline = await import('node:readline/promises');
                        const rl = readline.createInterface({
                            input: process.stdin,
                            output: process.stdout
                        });
                        const { CliCommonMensagens } = await import('../../core/messages/cli/cli-common-messages.js');
                        answer = await rl.question(chalk.yellow(CliCommonMensagens.confirmacao.certeza));
                        rl.close();
                    }
                    catch {
                        log.info(CliComandoReestruturarMensagens.canceladoErroPrompt);
                        if (process.env.VITEST) {
                            throw new Error('exit:1');
                        }
                        else {
                            sair(ExitCode.Failure);
                            return;
                        }
                    }
                }
                if (answer.trim().toLowerCase() !== 's') {
                    log.info(CliComandoReestruturarMensagens.canceladoUseAuto);
                    if (process.env.VITEST) {
                        await new Promise(resolve => setTimeout(resolve, 10));
                        throw new Error('exit:1');
                    }
                    return;
                }
            }
            spinner.start(CliComandoReestruturarMensagens.spinnerAplicando);
            await OperarioEstrutura.aplicar(mapaMoves, fileEntriesComAst, baseDir);
            const frase = usarFallback ? 'correções aplicadas' : 'movimentos solicitados';
            spinner.succeed(CliComandoReestruturarMensagens.reestruturacaoConcluida(mapaMoves.length, frase));
            await exportarRelatoriosReestruturacao({
                baseDir,
                movimentos: mapaMoves,
                simulado: false,
                origem,
                preset: opts.preset
            });
        }
        catch (error) {
            try {
                ora().fail(CliComandoReestruturarMensagens.falhaReestruturacao);
            }
            catch (err) {
                if (config.DEV_MODE) {
                    console.debug('Falha ao atualizar spinner:', err);
                }
                else {
                    log.aviso('Falha ao atualizar spinner durante reestruturação.');
                }
            }
            log.erro(CliComandoReestruturarMensagens.erroDuranteReestruturacao(typeof error === 'object' && error && 'message' in error ? error.message : String(error)));
            if (config.DEV_MODE)
                console.error(error);
            if (process.env.VITEST) {
                return Promise.reject(new Error('exit:1'));
            }
            else {
                sair(ExitCode.Failure);
                return;
            }
        }
    });
}
//# sourceMappingURL=comando-reestruturar.js.map