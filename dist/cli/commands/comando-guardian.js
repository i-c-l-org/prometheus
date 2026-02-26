import { executarGuardian as executarGuardianModular } from '../diagnostico/handlers/guardian-handler.js';
import { ExitCode, sair } from '../helpers/exit-codes.js';
import { config } from '../../core/config/config.js';
import { iniciarInquisicao } from '../../core/execution/inquisidor.js';
import { CliComandoGuardianMensagens } from '../../core/messages/cli/cli-comando-guardian-messages.js';
import { log, logGuardian } from '../../core/messages/index.js';
import { acceptNewBaseline } from '../../guardian/sentinela.js';
import { Command } from 'commander';
import { asTecnicas, extrairMensagemErro, IntegridadeStatus } from '../../types/index.js';
export function comandoGuardian(aplicarFlagsGlobais) {
    return new Command('guardian')
        .description(CliComandoGuardianMensagens.descricao)
        .allowUnknownOption(true)
        .allowExcessArguments(true)
        .option('-a, --accept-baseline', CliComandoGuardianMensagens.opcoes.acceptBaseline)
        .option('-d, --diff', CliComandoGuardianMensagens.opcoes.diff)
        .option('--full-scan', CliComandoGuardianMensagens.opcoes.fullScan)
        .option('--json', CliComandoGuardianMensagens.opcoes.json)
        .action(async function (opts) {
        try {
            await aplicarFlagsGlobais(this.parent && typeof this.parent.opts === 'function' ? this.parent.opts() : {});
        }
        catch (err) {
            log.erro(CliComandoGuardianMensagens.erroFlags(err instanceof Error ? err.message : String(err)));
            sair(ExitCode.Failure);
            return;
        }
        const baseDir = process.cwd();
        let fileEntries = [];
        try {
            const { registroAnalistas } = await import('../../analistas/registry/registry.js');
            const tecnicas = asTecnicas(registroAnalistas);
            const resultadoInquisicao = await iniciarInquisicao(baseDir, {
                incluirMetadados: false
            }, tecnicas);
            fileEntries = resultadoInquisicao.fileEntries;
            const ignoradosOriginaisRaw = config.GUARDIAN_IGNORE_PATTERNS;
            const ignoradosOriginais = Array.isArray(ignoradosOriginaisRaw) ? [...ignoradosOriginaisRaw] : [];
            if (opts.fullScan) {
                config.GUARDIAN_IGNORE_PATTERNS = [];
                if (!opts.acceptBaseline) {
                    logGuardian.fullScanAviso();
                }
            }
            if (opts.acceptBaseline) {
                if (opts.fullScan) {
                    log.aviso(CliComandoGuardianMensagens.baselineNaoPermitidoFullScan);
                    config.GUARDIAN_IGNORE_PATTERNS = ignoradosOriginais;
                    sair(ExitCode.Failure);
                    return;
                }
                logGuardian.aceitandoBaseline();
                await acceptNewBaseline(fileEntries);
                if (opts.json) {
                    console.log(JSON.stringify({
                        status: IntegridadeStatus.Aceito,
                        baseline: true
                    }));
                }
                else {
                    logGuardian.baselineAceitoSucesso();
                }
            }
            else {
                const guardianOpts = {
                    enabled: true,
                    fullScan: Boolean(opts.fullScan),
                    saveBaseline: false,
                    silent: Boolean(opts.json)
                };
                const guardianResultado = await executarGuardianModular(fileEntries.map(e => ({
                    relPath: e.relPath,
                    fullCaminho: e.fullCaminho,
                    content: e.content
                })), guardianOpts);
                if (opts.diff) {
                    if (guardianResultado.drift && guardianResultado.drift > 0) {
                        if (opts.json) {
                            console.log(JSON.stringify({
                                status: 'alteracoes-detectadas',
                                drift: guardianResultado.drift
                            }));
                        }
                        else {
                            logGuardian.diferencasDetectadas();
                            log.aviso(CliComandoGuardianMensagens.diffMudancasDetectadas(guardianResultado.drift));
                            log.aviso(CliComandoGuardianMensagens.diffComoAceitarMudancas);
                        }
                        sair(ExitCode.Failure);
                        return;
                    }
                    else {
                        if (opts.json) {
                            console.log(JSON.stringify({
                                status: 'ok',
                                drift: 0
                            }));
                        }
                        else {
                            logGuardian.integridadePreservada();
                        }
                    }
                }
                else {
                    const statusNorm = guardianResultado.status || IntegridadeStatus.Ok;
                    switch (statusNorm) {
                        case IntegridadeStatus.Ok:
                            if (opts.json)
                                console.log(JSON.stringify({
                                    status: 'ok',
                                    cacheDiffHits: globalThis.__PROMETHEUS_DIFF_CACHE_HITS__ || 0
                                }));
                            else
                                logGuardian.integridadeOk();
                            break;
                        case IntegridadeStatus.Criado:
                            if (opts.json)
                                console.log(JSON.stringify({
                                    status: 'baseline-criado',
                                    cacheDiffHits: globalThis.__PROMETHEUS_DIFF_CACHE_HITS__ || 0
                                }));
                            else
                                logGuardian.baselineCriadoConsole();
                            log.aviso(CliComandoGuardianMensagens.baselineCriadoComoAceitar);
                            break;
                        case IntegridadeStatus.Aceito:
                            if (opts.json)
                                console.log(JSON.stringify({
                                    status: 'baseline-aceito',
                                    cacheDiffHits: globalThis.__PROMETHEUS_DIFF_CACHE_HITS__ || 0
                                }));
                            else
                                logGuardian.baselineAtualizado();
                            break;
                        case IntegridadeStatus.AlteracoesDetectadas:
                            {
                                if (opts.json) {
                                    console.log(JSON.stringify({
                                        status: 'alteracoes-detectadas',
                                        temProblemas: guardianResultado.temProblemas,
                                        drift: guardianResultado.drift
                                    }));
                                }
                                else {
                                    logGuardian.alteracoesSuspeitas();
                                }
                                sair(ExitCode.Failure);
                                return;
                            }
                    }
                }
            }
            if (opts.fullScan) {
                config.GUARDIAN_IGNORE_PATTERNS = ignoradosOriginais;
            }
        }
        catch (err) {
            logGuardian.erroGuardian(err.message ?? String(err));
            if (config.DEV_MODE) {
                console.error(extrairMensagemErro(err));
                if (err && typeof err === 'object' && 'stack' in err) {
                    console.error(err.stack);
                }
            }
            if (opts.json)
                console.log(JSON.stringify({
                    status: 'erro',
                    mensagem: extrairMensagemErro(err)
                }));
            sair(ExitCode.Failure);
            return;
        }
    });
}
//# sourceMappingURL=comando-guardian.js.map