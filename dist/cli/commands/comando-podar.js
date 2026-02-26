import { removerArquivosOrfaos } from '../../analistas/corrections/poda.js';
import { exportarRelatoriosPoda } from '../handlers/poda-exporter.js';
import { ExitCode, sair } from '../helpers/exit-codes.js';
import { expandIncludePatterns, processPatternList } from '../helpers/pattern-helpers.js';
import chalk from '../../core/config/chalk-safe.js';
import { config } from '../../core/config/config.js';
import { iniciarInquisicao } from '../../core/execution/inquisidor.js';
import { CliComandoPodarMensagens } from '../../core/messages/cli/cli-comando-podar-messages.js';
import { ICONES_DIAGNOSTICO, log, logSistema } from '../../core/messages/index.js';
import { Command } from 'commander';
import { asTecnicas } from '../../types/index.js';
export function comandoPodar(aplicarFlagsGlobais) {
    return new Command('podar')
        .description(CliComandoPodarMensagens.descricao)
        .option('-f, --force', CliComandoPodarMensagens.opcoes.force, false)
        .option('--include <padrao>', CliComandoPodarMensagens.opcoes.include, (val, prev) => {
        prev.push(val);
        return prev;
    }, [])
        .option('--exclude <padrao>', CliComandoPodarMensagens.opcoes.exclude, (val, prev) => {
        prev.push(val);
        return prev;
    }, [])
        .action(async function (opts) {
        try {
            await aplicarFlagsGlobais(this.parent && typeof this.parent.opts === 'function' ? this.parent.opts() : {});
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            log.erro(CliComandoPodarMensagens.erroDurantePoda(msg));
            sair(ExitCode.Failure);
            return;
        }
        log.info(chalk.bold(CliComandoPodarMensagens.inicio));
        const baseDir = process.cwd();
        try {
            const includeListRaw = processPatternList(opts.include);
            const includeList = includeListRaw.length ? expandIncludePatterns(includeListRaw) : [];
            const excludeList = processPatternList(opts.exclude);
            if (includeList.length)
                config.CLI_INCLUDE_PATTERNS = includeList;
            if (excludeList.length)
                config.CLI_EXCLUDE_PATTERNS = excludeList;
            const { registroAnalistas } = await import('../../analistas/registry/registry.js');
            const tecnicas = asTecnicas(registroAnalistas);
            const { fileEntries } = await iniciarInquisicao(baseDir, {
                incluirMetadados: false
            }, tecnicas);
            const resultadoPoda = await removerArquivosOrfaos(fileEntries);
            if (resultadoPoda.arquivosOrfaos.length === 0) {
                log.sucesso(CliComandoPodarMensagens.nenhumaSujeira(ICONES_DIAGNOSTICO.sucesso));
                await exportarRelatoriosPoda({
                    baseDir,
                    podados: [],
                    pendentes: [],
                    simulado: !opts.force
                });
                return;
            }
            log.aviso(CliComandoPodarMensagens.orfaosDetectados(resultadoPoda.arquivosOrfaos.length));
            resultadoPoda.arquivosOrfaos.forEach((file) => {
                log.info(CliComandoPodarMensagens.linhaArquivoOrfao(file.arquivo));
            });
            if (!opts.force) {
                const readline = await import('node:readline/promises');
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });
                const answer = await rl.question(chalk.yellow(CliComandoPodarMensagens.confirmarRemocao));
                rl.close();
                if (answer.toLowerCase() !== 's') {
                    logSistema.podaCancelada();
                    return;
                }
            }
            if (opts.force) {
                await removerArquivosOrfaos(fileEntries);
                logSistema.podaConcluida();
                const podados = resultadoPoda.arquivosOrfaos.map(f => ({
                    arquivo: f.arquivo,
                    motivo: f.referenciado ? 'inativo' : 'órfão',
                    detectedAt: Date.now(),
                    scheduleAt: Date.now()
                }));
                await exportarRelatoriosPoda({
                    baseDir,
                    podados,
                    pendentes: [],
                    simulado: false
                });
            }
        }
        catch (error) {
            const errMsg = typeof error === 'object' && error && 'message' in error ? error.message : String(error);
            log.erro(CliComandoPodarMensagens.erroDurantePoda(errMsg));
            if (config.DEV_MODE)
                console.error(error);
            sair(ExitCode.Failure);
            return;
        }
    });
}
//# sourceMappingURL=comando-podar.js.map