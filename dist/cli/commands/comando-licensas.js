import path from 'node:path';
import { ExitCode, sair } from '../helpers/exit-codes.js';
import { CliComandoLicensasMensagens } from '../../core/messages/cli/cli-comando-licensas-messages.js';
import { log } from '../../core/messages/index.js';
import * as licensas from '../../licensas/licensas.js';
import { Command } from 'commander';
export function comandoLicencas() {
    const cmd = new Command('licencas').description(CliComandoLicensasMensagens.descricao);
    cmd.allowUnknownOption(true);
    cmd.allowExcessArguments(true);
    cmd.command('scan')
        .description(CliComandoLicensasMensagens.subcomandos.scan.descricao)
        .option('--root <path>', CliComandoLicensasMensagens.subcomandos.scan.opcoes.root)
        .action(async (opts) => {
        try {
            const root = opts.root ? path.resolve(opts.root) : process.cwd();
            const result = await licensas.scanCommand({
                root
            });
            console.log(JSON.stringify(result, null, 2));
            process.exitCode = result.problematic && result.problematic.length > 0 ? 2 : 0;
        }
        catch (err) {
            log.erro(CliComandoLicensasMensagens.subcomandos.scan.falha(err instanceof Error ? err.message : String(err)));
            sair(ExitCode.Failure);
        }
    });
    const notices = cmd.command('notices').description(CliComandoLicensasMensagens.subcomandos.notices.descricao);
    notices.command('generate')
        .description(CliComandoLicensasMensagens.subcomandos.notices.generate.descricao)
        .option('--pt-br', CliComandoLicensasMensagens.subcomandos.notices.generate.opcoes.ptBr)
        .option('--output <file>', CliComandoLicensasMensagens.subcomandos.notices.generate.opcoes.output)
        .option('--root <path>', CliComandoLicensasMensagens.subcomandos.notices.generate.opcoes.root)
        .action(async (opts) => {
        try {
            const root = opts.root ? path.resolve(opts.root) : process.cwd();
            const res = await licensas.generateNotices({
                root,
                ptBr: Boolean(opts.ptBr),
                output: opts.output
            });
            log.info(CliComandoLicensasMensagens.subcomandos.notices.generate.concluido(res));
            sair(ExitCode.Ok);
        }
        catch (err) {
            log.erro(CliComandoLicensasMensagens.subcomandos.notices.generate.falha(err instanceof Error ? err.message : String(err)));
            sair(ExitCode.Failure);
        }
    });
    const disclaimer = cmd.command('disclaimer').description(CliComandoLicensasMensagens.subcomandos.disclaimer.descricao);
    disclaimer.command('add')
        .description(CliComandoLicensasMensagens.subcomandos.disclaimer.add.descricao)
        .option('--disclaimer-path <path>', CliComandoLicensasMensagens.subcomandos.disclaimer.add.opcoes.disclaimerPath)
        .option('--root <path>', CliComandoLicensasMensagens.subcomandos.disclaimer.add.opcoes.root)
        .option('--dry-run', CliComandoLicensasMensagens.subcomandos.disclaimer.add.opcoes.dryRun)
        .action(async (opts) => {
        try {
            const root = opts.root ? path.resolve(opts.root) : process.cwd();
            const res = await licensas.addDisclaimer({
                root,
                disclaimerPath: opts.disclaimerPath,
                dryRun: Boolean(opts.dryRun)
            });
            log.info(CliComandoLicensasMensagens.subcomandos.disclaimer.add.concluido(res.updatedArquivos.length));
            sair(ExitCode.Ok);
        }
        catch (err) {
            log.erro(CliComandoLicensasMensagens.subcomandos.disclaimer.add.falha(err instanceof Error ? err.message : String(err)));
            sair(ExitCode.Failure);
        }
    });
    disclaimer.command('verify')
        .description(CliComandoLicensasMensagens.subcomandos.disclaimer.verify.descricao)
        .option('--disclaimer-path <path>')
        .option('--root <path>')
        .action(async (opts) => {
        try {
            const root = opts.root ? path.resolve(opts.root) : process.cwd();
            const res = await licensas.verifyDisclaimer({
                root,
                disclaimerPath: opts.disclaimerPath
            });
            if (res.missing.length) {
                log.erro(CliComandoLicensasMensagens.subcomandos.disclaimer.verify.ausente);
                for (const f of res.missing)
                    log.erro(`- ${f}`);
                sair(ExitCode.Failure);
                return;
            }
            log.info(CliComandoLicensasMensagens.subcomandos.disclaimer.verify.todosOk);
            sair(ExitCode.Ok);
        }
        catch (err) {
            log.erro(CliComandoLicensasMensagens.subcomandos.disclaimer.verify.falha(err instanceof Error ? err.message : String(err)));
            sair(ExitCode.Failure);
        }
    });
    return cmd;
}
//# sourceMappingURL=comando-licensas.js.map