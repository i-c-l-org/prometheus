import { CliComandoDiagnosticarMensagens, CliCommonMensagens } from '../core/messages/index.js';
export const optionsDiagnosticar = [
    {
        flags: '--listar-analistas',
        desc: CliComandoDiagnosticarMensagens.opcoes.listarAnalistas,
        defaultValue: false,
    },
    {
        flags: '-g, --guardian-check',
        desc: CliComandoDiagnosticarMensagens.opcoes.guardianCheck,
        defaultValue: false,
    },
    {
        flags: '--json',
        desc: CliComandoDiagnosticarMensagens.opcoes.json,
        defaultValue: false,
    },
    {
        flags: '--json-ascii',
        desc: CliComandoDiagnosticarMensagens.opcoes.jsonAscii,
        defaultValue: false,
    },
    {
        flags: '--fast',
        desc: CliComandoDiagnosticarMensagens.opcoes.fast,
        defaultValue: false,
    },
    {
        flags: '--trust-compiler',
        desc: CliComandoDiagnosticarMensagens.opcoes.trustCompiler,
        defaultValue: false,
    },
    {
        flags: '--verify-cycles',
        desc: CliComandoDiagnosticarMensagens.opcoes.verifyCycles,
        defaultValue: false,
    },
    {
        flags: '--criar-arquetipo',
        desc: CliComandoDiagnosticarMensagens.opcoes.criarArquetipo,
        defaultValue: false,
    },
    {
        flags: '--salvar-arquetipo',
        desc: CliComandoDiagnosticarMensagens.opcoes.salvarArquetipo,
        defaultValue: false,
    },
    {
        flags: '--include <padrao>',
        desc: CliCommonMensagens.opcoes.include,
        parser: (val, prev) => {
            prev.push(val);
            return prev;
        },
        defaultValue: [],
    },
    {
        flags: '--exclude <padrao>',
        desc: CliCommonMensagens.opcoes.exclude,
        parser: (val, prev) => {
            prev.push(val);
            return prev;
        },
        defaultValue: [],
    },
    {
        flags: '--exclude-tests',
        desc: CliComandoDiagnosticarMensagens.opcoes.excludeTests,
        defaultValue: false,
    },
    {
        flags: '--full',
        desc: CliComandoDiagnosticarMensagens.opcoes.full,
        defaultValue: false,
    },
    {
        flags: '--compact',
        desc: CliComandoDiagnosticarMensagens.opcoes.compact,
        defaultValue: false,
    },
    {
        flags: '--log-level <nivel>',
        desc: CliComandoDiagnosticarMensagens.opcoes.logLevel,
        defaultValue: 'info',
    },
    {
        flags: '--executive',
        desc: CliComandoDiagnosticarMensagens.opcoes.executive,
        defaultValue: false,
    },
    {
        flags: '--auto-fix',
        desc: CliComandoDiagnosticarMensagens.opcoes.autoFix,
        defaultValue: false,
    },
    {
        flags: '--auto-fix-mode <modo>',
        desc: CliComandoDiagnosticarMensagens.opcoes.autoFixMode,
        defaultValue: 'balanced',
    },
    {
        flags: '--auto-fix-conservative',
        desc: CliComandoDiagnosticarMensagens.opcoes.autoFixConservative,
        defaultValue: false,
    },
    {
        flags: '--fix',
        desc: CliComandoDiagnosticarMensagens.opcoes.fix,
        defaultValue: false,
    },
    {
        flags: '--fix-safe',
        desc: CliComandoDiagnosticarMensagens.opcoes.fixSafe,
        defaultValue: false,
    },
    {
        flags: '--show-fixes',
        desc: CliComandoDiagnosticarMensagens.opcoes.showFixes,
        defaultValue: false,
    },
    {
        flags: '--export',
        desc: CliComandoDiagnosticarMensagens.opcoes.export,
        defaultValue: false,
    },
    {
        flags: '--export-full',
        desc: CliComandoDiagnosticarMensagens.opcoes.exportFull,
        defaultValue: false,
    },
    {
        flags: '--export-to <dir>',
        desc: CliComandoDiagnosticarMensagens.opcoes.exportTo,
        defaultValue: 'relatorios',
    },
];
//# sourceMappingURL=options-diagnosticar.js.map