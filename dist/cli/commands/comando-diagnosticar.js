import { optionsDiagnosticar } from '../options-diagnosticar.js';
import { processarDiagnostico } from '../processamento-diagnostico.js';
import { CliComandoDiagnosticarMensagens } from '../../core/messages/cli/cli-comando-diagnosticar-messages.js';
import { CABECALHOS, log } from '../../core/messages/index.js';
import { ativarModoJson } from '../../shared/helpers/json-mode.js';
import { Command } from 'commander';
import ora from 'ora';
export function comandoDiagnosticar(aplicarFlagsGlobais) {
    const cmd = new Command('diagnosticar').alias('diag').description(CliComandoDiagnosticarMensagens.descricao);
    cmd.allowUnknownOption(true);
    cmd.allowExcessArguments(true);
    for (const opt of optionsDiagnosticar) {
        if ('parser' in opt && opt.parser) {
            cmd.option(opt.flags, opt.desc, opt.parser, opt.defaultValue);
        }
        else if ('defaultValue' in opt) {
            cmd.option(opt.flags, opt.desc, opt.defaultValue);
        }
        else {
            cmd.option(opt.flags, opt.desc);
        }
    }
    cmd.action(async (opts, command) => {
        try {
            const parentObj = command.parent;
            const parentFlags = parentObj && typeof parentObj.opts === 'function' ? parentObj.opts() : {};
            const localFlags = typeof command.opts === 'function' ? command.opts() : {};
            const merged = {
                ...(parentFlags || {}),
                ...(localFlags || {}),
                ...(opts || {})
            };
            await aplicarFlagsGlobais(merged);
        }
        catch {
            try {
                await aplicarFlagsGlobais(opts);
            }
            catch {
            }
        }
        if (process.env.PROMETHEUS_TEST_FAST === '1') {
            if (opts.json) {
                console.log(JSON.stringify({
                    meta: {
                        fast: true,
                        tipo: CliComandoDiagnosticarMensagens.fastModeTipo
                    },
                    totalArquivos: 0,
                    ocorrencias: []
                }, null, 2));
                return;
            }
            return;
        }
        if (opts.json) {
            ativarModoJson();
        }
        const logNivel = opts.logNivel || 'info';
        const isVerbose = opts.full || logNivel === 'debug' || opts.detalhado;
        if (!opts.json && isVerbose) {
            try {
                const { default: chalk } = await import('../../core/config/chalk-safe.js');
                const { config } = await import('../../core/config/config.js');
                const activeFlags = [];
                const details = [];
                const parent = command.parent;
                const parentOpts = parent && typeof parent.opts === 'function' ? parent.opts() : {};
                if (opts.json) {
                    activeFlags.push('--json');
                    details.push(CliComandoDiagnosticarMensagens.detalheSaidaEstruturada);
                }
                if (opts.guardianCheck) {
                    activeFlags.push('--guardian-check');
                    details.push(CliComandoDiagnosticarMensagens.detalheGuardian);
                }
                if (opts.executive) {
                    activeFlags.push('--executive');
                    details.push(CliComandoDiagnosticarMensagens.detalheExecutive);
                }
                if (opts.full) {
                    activeFlags.push('--full');
                    details.push(CliComandoDiagnosticarMensagens.detalheFull);
                }
                if (opts.fast) {
                    activeFlags.push('--fast');
                    details.push(CliComandoDiagnosticarMensagens.detalheFast);
                }
                const localCompact = Boolean(opts['compact']);
                const effectiveCompact = localCompact || !opts.full && !localCompact;
                if (effectiveCompact && !opts.full) {
                    activeFlags.push('--compact');
                    details.push(CliComandoDiagnosticarMensagens.detalheCompact);
                }
                if (opts.listarAnalistas) {
                    activeFlags.push('--listar-analistas');
                }
                if (opts.autoFix) {
                    activeFlags.push('--auto-fix');
                    details.push(CliComandoDiagnosticarMensagens.detalheAutoFix);
                }
                if (opts.autoFixConservative) {
                    activeFlags.push('--auto-fix-conservative');
                    details.push(CliComandoDiagnosticarMensagens.detalheAutoFixConservative);
                }
                const includes = opts.include || [];
                const excludes = opts.exclude || [];
                if (includes.length)
                    details.push(CliComandoDiagnosticarMensagens.detalheIncludePatterns(includes.length, includes.join(', ')));
                if (excludes.length)
                    details.push(CliComandoDiagnosticarMensagens.detalheExcludePatterns(excludes.length, excludes.join(', ')));
                const parentExport = Boolean(parentOpts && Object.prototype.hasOwnProperty.call(parentOpts, 'export') && Boolean(parentOpts['export']));
                const parentExportFull = Boolean(parentOpts && Object.prototype.hasOwnProperty.call(parentOpts, 'exportFull') && Boolean(parentOpts['exportFull']));
                const localExport = Boolean(opts['export']);
                const localExportFull = Boolean(opts['exportFull']);
                if (parentExport || localExport) {
                    activeFlags.push('--export');
                    const relDir = config && config['RELATORIOS_DIR'] || 'relatorios';
                    details.push(CliComandoDiagnosticarMensagens.detalheExport(String(relDir)));
                }
                if (parentExportFull || localExportFull) {
                    activeFlags.push('--export-full');
                    details.push(CliComandoDiagnosticarMensagens.detalheExportFull);
                }
                const resolvedParentLogNivel = parentOpts && Object.prototype.hasOwnProperty.call(parentOpts, 'logLevel') ? String(parentOpts['logLevel']) : undefined;
                const logNivel = opts.logNivel || resolvedParentLogNivel || 'info';
                details.push(CliComandoDiagnosticarMensagens.detalheLogLevel(String(logNivel)));
                details.push(CliComandoDiagnosticarMensagens.dicaPrefiraLogLevelDebug);
                details.push(CliComandoDiagnosticarMensagens.dicaAutoFixConservative);
                if (activeFlags.length || details.length) {
                    const header = chalk.cyan(CliComandoDiagnosticarMensagens.sugestoesHeader);
                    const footer = chalk.cyan(CliComandoDiagnosticarMensagens.sugestoesFooter);
                    log.info(header);
                    if (activeFlags.length)
                        log.info(chalk.yellow(`${CABECALHOS.diagnostico.flagsAtivas} `) + activeFlags.join(' '));
                    else
                        log.info(chalk.gray(CliComandoDiagnosticarMensagens.nenhumaFlagRelevante));
                    log.info(CliComandoDiagnosticarMensagens.linhaEmBranco);
                    log.info(chalk.green(CABECALHOS.diagnostico.informacoesUteis));
                    for (const d of details)
                        log.info(CliComandoDiagnosticarMensagens.detalheLinha(String(d)));
                    log.info(footer);
                }
            }
            catch {
            }
        }
        const spinner = opts.json ? {
            text: '',
            start: () => spinner,
            succeed: () => { },
            fail: () => { }
        } : ora({
            text: CliComandoDiagnosticarMensagens.spinnerExecutando,
            spinner: 'dots'
        }).start();
        try {
            const logWithFase = log;
            logWithFase.fase = (t) => {
                if (typeof t === 'string' && t.trim()) {
                    spinner.text = CliComandoDiagnosticarMensagens.spinnerFase(t);
                }
            };
        }
        catch {
        }
        try {
            await processarDiagnostico(opts);
            spinner.succeed(CliComandoDiagnosticarMensagens.spinnerConcluido);
        }
        catch (err) {
            spinner.fail(CliComandoDiagnosticarMensagens.spinnerFalhou);
            throw err;
        }
    });
    return cmd;
}
//# sourceMappingURL=comando-diagnosticar.js.map