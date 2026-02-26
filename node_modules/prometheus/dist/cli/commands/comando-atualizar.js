import { ExitCode, sair } from '../helpers/exit-codes.js';
import chalk from '../../core/config/chalk-safe.js';
import { config } from '../../core/config/config.js';
import { iniciarInquisicao } from '../../core/execution/inquisidor.js';
import { CliComandoAtualizarMensagens } from '../../core/messages/cli/cli-comando-atualizar-messages.js';
import { ICONES_DIAGNOSTICO, log, logSistema } from '../../core/messages/index.js';
import { executarShellSeguro } from '../../core/utils/exec-safe.js';
import { scanSystemIntegrity } from '../../guardian/sentinela.js';
import { Command } from 'commander';
import { asTecnicas } from '../../types/index.js';
export function comandoAtualizar(aplicarFlagsGlobais) {
    return new Command('atualizar')
        .description(CliComandoAtualizarMensagens.descricao)
        .option('--global', CliComandoAtualizarMensagens.opcoes.global)
        .action(async function (opts) {
        try {
            await aplicarFlagsGlobais(this.parent && typeof this.parent.opts === 'function'
                ? this.parent.opts()
                : {});
        }
        catch (err) {
            log.erro(CliComandoAtualizarMensagens.erros.falhaFlags(err instanceof Error ? err.message : String(err)));
            sair(ExitCode.Failure);
            return;
        }
        log.info(chalk.bold(CliComandoAtualizarMensagens.status.inicio));
        const baseDir = process.cwd();
        let fileEntries = [];
        try {
            const { registroAnalistas } = await import('../../analistas/registry/registry.js');
            const tecnicas = asTecnicas(registroAnalistas);
            const resultado = await iniciarInquisicao(baseDir, {
                incluirMetadados: false,
            }, tecnicas);
            fileEntries = resultado.fileEntries;
            const guardianResultado = await scanSystemIntegrity(fileEntries);
            if (guardianResultado.status ===
                'ok' ||
                guardianResultado.status ===
                    'baseline-aceito') {
                log.sucesso(CliComandoAtualizarMensagens.status.guardianOk(ICONES_DIAGNOSTICO.sucesso));
            }
            else {
                log.aviso(CliComandoAtualizarMensagens.status.guardianAviso);
                log.info(CliComandoAtualizarMensagens.status.guardianDica);
            }
            const cmd = opts.global
                ? 'npm install -g prometheus@latest'
                : 'npm install prometheus@latest';
            logSistema.atualizacaoExecutando(cmd);
            executarShellSeguro(cmd, { stdio: 'inherit' });
            logSistema.atualizacaoSucesso();
        }
        catch (err) {
            logSistema.atualizacaoFalha();
            if (typeof err === 'object' &&
                err &&
                'detalhes' in err &&
                Array.isArray(err.detalhes)) {
                err.detalhes.forEach((d) => {
                    logSistema.atualizacaoDetalhes(d);
                });
            }
            if (config.DEV_MODE)
                log.erro(err instanceof Error ? err.message : String(err));
            sair(ExitCode.Failure);
            return;
        }
    });
}
//# sourceMappingURL=comando-atualizar.js.map