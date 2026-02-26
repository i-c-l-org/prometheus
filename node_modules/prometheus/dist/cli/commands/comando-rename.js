import generateModule from '@babel/generator';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
import { ExitCode, sair } from '../helpers/exit-codes.js';
import { getFilesWithExtension, getSourceFiles } from '../helpers/get-files-src.js';
import chalk from '../../core/config/chalk-safe.js';
import { config } from '../../core/config/config.js';
import { CliComandoRenameMensagens } from '../../core/messages/cli/cli-comando-rename-messages.js';
import { log } from '../../core/messages/index.js';
import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
const traverse = traverseModule.default || traverseModule;
const generate = generateModule.default || generateModule;
function parseMappingLine(line) {
    const parts = line.split('=');
    if (parts.length < 2)
        return null;
    const oldName = parts[0].trim();
    const newNome = parts[1].trim();
    if (!oldName || !newNome || oldName === newNome)
        return null;
    return { oldName, newName: newNome };
}
function loadMappingsFromFile(filePath, mappings, raizDir) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    for (const line of lines) {
        const parsed = parseMappingLine(line);
        if (parsed) {
            const existing = mappings.get(parsed.oldName);
            if (existing !== undefined && existing !== parsed.newName && config.VERBOSE) {
                log.info(CliComandoRenameMensagens.status.conflito(parsed.oldName, path.relative(raizDir, filePath), parsed.newName, existing));
            }
            mappings.set(parsed.oldName, parsed.newName);
        }
    }
}
export function comandoRename(aplicarFlagsGlobais) {
    return new Command('rename')
        .description(CliComandoRenameMensagens.descricao)
        .action(async function () {
        try {
            await aplicarFlagsGlobais(this.parent && typeof this.parent.opts === 'function'
                ? this.parent.opts()
                : {});
        }
        catch (err) {
            log.erro(CliComandoRenameMensagens.erros.falhaFlags(err instanceof Error ? err.message : String(err)));
            sair(ExitCode.Failure);
            return;
        }
        const RAIZ_DIR = process.cwd();
        const SRC_DIR = path.resolve(RAIZ_DIR, 'src');
        const NAMES_DIR = path.resolve(RAIZ_DIR, 'names');
        const MAPPING_ARQUIVO = path.resolve(NAMES_DIR, 'name.txt');
        const mappings = new Map();
        if (fs.existsSync(MAPPING_ARQUIVO)) {
            loadMappingsFromFile(MAPPING_ARQUIVO, mappings, RAIZ_DIR);
        }
        else if (fs.existsSync(NAMES_DIR)) {
            const txtFiles = getFilesWithExtension(NAMES_DIR, '.txt');
            if (txtFiles.length === 0) {
                log.erro(CliComandoRenameMensagens.erros.nenhumMapeamento);
                sair(ExitCode.Failure);
                return;
            }
            for (const f of txtFiles) {
                loadMappingsFromFile(f, mappings, RAIZ_DIR);
            }
        }
        else {
            log.erro(CliComandoRenameMensagens.erros.pastaNaoEncontrada);
            sair(ExitCode.Failure);
            return;
        }
        if (mappings.size === 0) {
            log.aviso(CliComandoRenameMensagens.erros.mapeamentoVazio);
            return;
        }
        const files = getSourceFiles(SRC_DIR);
        let totalArquivosUpdated = 0;
        log.info(chalk.cyan(CliComandoRenameMensagens.status.inicio(mappings.size)));
        for (const file of files) {
            try {
                const code = fs.readFileSync(file, 'utf-8');
                const ast = parse(code, {
                    sourceType: 'module',
                    plugins: ['typescript', 'decorators-legacy'],
                });
                let changed = false;
                traverse(ast, {
                    Identifier(path) {
                        const newNome = mappings.get(path.node.name);
                        if (newNome && newNome !== path.node.name) {
                            path.node.name = newNome;
                            changed = true;
                        }
                    },
                });
                if (changed) {
                    const output = generate(ast, {
                        retainLines: false,
                        comments: true,
                        compact: false,
                    }, code);
                    fs.writeFileSync(file, output.code);
                    if (config.VERBOSE)
                        log.info(CliComandoRenameMensagens.status.atualizado(path.relative(RAIZ_DIR, file)));
                    totalArquivosUpdated++;
                }
            }
            catch {
            }
        }
        log.sucesso(CliComandoRenameMensagens.status.concluido(totalArquivosUpdated));
    });
}
//# sourceMappingURL=comando-rename.js.map