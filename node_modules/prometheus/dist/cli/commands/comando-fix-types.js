import { exportarRelatoriosFixTypes } from '../handlers/fix-types-exporter.js';
import { ExitCode, sair } from '../helpers/exit-codes.js';
import { expandIncludePatterns, processPatternList } from '../helpers/pattern-helpers.js';
import { config } from '../../core/config/config.js';
import { CliComandoFixTypesMensagens } from '../../core/messages/cli/cli-comando-fix-types-messages.js';
import { log, MENSAGENS_AUTOFIX } from '../../core/messages/index.js';
import { PROJETO_RAIZ } from '../../core/registry/paths.js';
import { Command } from 'commander';
import { asTecnicas, extrairMensagemErro } from '../../types/index.js';
const { DICAS, formatarTipoInseguro, gerarResumoCategoria, ICONES, MENSAGENS_CLI_CORRECAO_TIPOS, MENSAGENS_ERRO, MENSAGENS_INICIO, MENSAGENS_PROGRESSO, MENSAGENS_RESUMO, MENSAGENS_SUCESSO, TEMPLATE_RESUMO_FINAL, TEXTOS_CATEGORIZACAO_CORRECAO_TIPOS } = CliComandoFixTypesMensagens;
export function criarComandoFixTypes() {
    const cmd = new Command('fix-types');
    cmd.description(CliComandoFixTypesMensagens.descricao)
        .option('--dry-run', CliComandoFixTypesMensagens.opcoes.dryRun, false)
        .option('--target <path>', CliComandoFixTypesMensagens.opcoes.target, 'src')
        .option('--confidence <number>', CliComandoFixTypesMensagens.opcoes.confidence, '85')
        .option('--verbose', CliComandoFixTypesMensagens.opcoes.verbose, false)
        .option('--interactive', CliComandoFixTypesMensagens.opcoes.interactive, false)
        .option('--export', CliComandoFixTypesMensagens.opcoes.export, false)
        .option('--include <padrao>', CliComandoFixTypesMensagens.opcoes.include, (val, prev) => {
        prev.push(val);
        return prev;
    }, [])
        .option('--exclude <padrao>', CliComandoFixTypesMensagens.opcoes.exclude, (val, prev) => {
        prev.push(val);
        return prev;
    }, [])
        .action(async (options) => {
        try {
            await executarFixTypes(options);
        }
        catch (err) {
            const mensagem = err instanceof Error ? err.message : String(err);
            log.erro(MENSAGENS_CLI_CORRECAO_TIPOS.erroExecutar(mensagem));
            if (config.DEV_MODE) {
                console.error(extrairMensagemErro(err));
                if (err && typeof err === 'object' && 'stack' in err) {
                    console.error(err.stack);
                }
            }
            sair(ExitCode.Failure);
            return;
        }
    });
    return cmd;
}
async function executarFixTypes(options) {
    const isDryRun = options.dryRun || false;
    const minConfidence = Number(options.confidence) || 85;
    const target = options.target || 'src';
    const verbose = options.verbose || false;
    const _interactive = options.interactive || false;
    log.fase?.(MENSAGENS_INICIO.titulo);
    const includeListRaw = processPatternList(options.include);
    const includeList = includeListRaw.length ? expandIncludePatterns(includeListRaw) : [];
    const excludeList = processPatternList(options.exclude);
    if (includeList.length)
        config.CLI_INCLUDE_PATTERNS = includeList;
    if (excludeList.length)
        config.CLI_EXCLUDE_PATTERNS = excludeList;
    let iniciarInquisicao;
    let registroAnalistas;
    try {
        const modInq = await import('../../core/execution/inquisidor.js');
        const modReg = await import('../../analistas/registry/registry.js');
        iniciarInquisicao = modInq.iniciarInquisicao;
        registroAnalistas = modReg.registroAnalistas;
    }
    catch (err) {
        log.erro(`Erro ao carregar módulos: ${err instanceof Error ? err.message : String(err)}`);
        sair(ExitCode.Failure);
        return;
    }
    const analistaTiposInseguros = registroAnalistas.find(a => a.nome === 'detector-tipos-inseguros');
    if (!analistaTiposInseguros) {
        log.erro(MENSAGENS_ERRO.detectorNaoEncontrado);
        sair(ExitCode.Failure);
        return;
    }
    log.info(MENSAGENS_INICIO.analisando(target));
    log.info(MENSAGENS_INICIO.confianciaMin(minConfidence));
    log.info(MENSAGENS_INICIO.modo(isDryRun));
    let resultado;
    try {
        const tecnicasParaExec = asTecnicas(registroAnalistas);
        resultado = await iniciarInquisicao(process.cwd(), {
            includeContent: true,
            incluirMetadados: false,
            skipExec: false
        }, tecnicasParaExec);
    }
    catch (err) {
        log.erro(`Erro ao executar análise: ${err instanceof Error ? err.message : String(err)}`);
        sair(ExitCode.Failure);
        return;
    }
    const ocorrencias = resultado.ocorrencias || [];
    const tiposInseguros = ocorrencias.filter((o) => o.tipo && ['tipo-inseguro-any', 'tipo-inseguro-any-assertion', 'tipo-inseguro-any-cast', 'tipo-inseguro-unknown'].includes(o.tipo));
    if (tiposInseguros.length === 0) {
        log.sucesso(MENSAGENS_SUCESSO.nenhumTipoInseguro);
        return;
    }
    log.aviso(MENSAGENS_RESUMO.encontrados(tiposInseguros.length));
    const porTipo = tiposInseguros.reduce((acc, o) => {
        const tipo = o.tipo || 'desconhecido';
        if (!acc[tipo])
            acc[tipo] = [];
        acc[tipo].push(o);
        return acc;
    }, {});
    for (const [tipo, ocorrenciasTipo] of Object.entries(porTipo)) {
        const count = ocorrenciasTipo.length;
        log.info(MENSAGENS_CLI_CORRECAO_TIPOS.linhaResumoTipo(formatarTipoInseguro(tipo, count)));
    }
    console.log();
    if (isDryRun) {
        log.fase?.(MENSAGENS_CLI_CORRECAO_TIPOS.exemplosDryRunTitulo);
        const exemplos = tiposInseguros.slice(0, 10);
        for (const o of exemplos) {
            const prefixo = o.tipo === 'tipo-inseguro-any' ? '[ERRO]' : '[AVISO]';
            log.info(MENSAGENS_CLI_CORRECAO_TIPOS.exemploLinha(prefixo, o.relPath, String(o.linha || '?')));
            if (o.mensagem) {
                log.info(MENSAGENS_CLI_CORRECAO_TIPOS.exemploMensagem(o.mensagem));
            }
            if (verbose && o.mensagem) {
                const match = o.mensagem.match(/variável '([^']+)'/);
                if (match) {
                    log.debug(MENSAGENS_CLI_CORRECAO_TIPOS.debugVariavel(match[1]));
                }
            }
        }
        if (tiposInseguros.length > 10) {
            log.info(MENSAGENS_CLI_CORRECAO_TIPOS.maisOcorrencias(tiposInseguros.length - 10));
        }
        console.log();
        log.info(DICAS.removerDryRun);
        log.info(DICAS.usarInterativo);
        log.info(DICAS.ajustarConfianca(minConfidence));
        return;
    }
    log.fase?.(MENSAGENS_CLI_CORRECAO_TIPOS.aplicandoCorrecoesAuto);
    const { fixAnyToProperTipo } = await import('../../analistas/corrections/quick-fixes/fix-any-to-proper-type.js');
    const { fixUnknownToSpecificTipo } = await import('../../analistas/corrections/quick-fixes/fix-unknown-to-specific-type.js');
    if (!fixAnyToProperTipo || !fixUnknownToSpecificTipo) {
        log.erro(MENSAGENS_ERRO.modulosNaoEncontrados);
        sair(ExitCode.Failure);
        return;
    }
    const _corrigidas = 0;
    let _erros = 0;
    const _arquivosModificados = new Set();
    const porArquivo = tiposInseguros.reduce((acc, o) => {
        const arquivo = o.relPath || 'desconhecido';
        if (!acc[arquivo])
            acc[arquivo] = [];
        acc[arquivo].push(o);
        return acc;
    }, {});
    log.info(MENSAGENS_PROGRESSO.processandoArquivos(Object.keys(porArquivo).length));
    log.info(MENSAGENS_CLI_CORRECAO_TIPOS.linhaEmBranco);
    const { categorizarUnknown, extractLineContext } = await import('../../analistas/corrections/type-safety/context-analyzer.js');
    const stats = {
        legitimo: 0,
        melhoravel: 0,
        corrigir: 0,
        totalConfianca: 0
    };
    const ocorrenciasCategorizadas = [];
    for (const [arquivo, ocorrenciasArquivo] of Object.entries(porArquivo)) {
        if (verbose) {
            log.info(MENSAGENS_PROGRESSO.arquivoAtual(arquivo, ocorrenciasArquivo.length));
        }
        for (const ocorrencia of ocorrenciasArquivo) {
            const tipo = ocorrencia.tipo;
            if (tipo === 'tipo-inseguro-any') {
                ocorrenciasCategorizadas.push({
                    ocorrencia,
                    categoria: 'corrigir',
                    confianca: 95,
                    motivo: TEXTOS_CATEGORIZACAO_CORRECAO_TIPOS.anyMotivo,
                    sugestao: TEXTOS_CATEGORIZACAO_CORRECAO_TIPOS.anySugestao
                });
                stats.corrigir++;
                stats.totalConfianca += 95;
                if (verbose) {
                    log.aviso(MENSAGENS_CLI_CORRECAO_TIPOS.verboseAnyDetectado(arquivo, String(ocorrencia.linha || '?')));
                }
                _erros++;
                continue;
            }
            if (tipo === 'tipo-inseguro-any-assertion') {
                ocorrenciasCategorizadas.push({
                    ocorrencia,
                    categoria: 'corrigir',
                    confianca: 100,
                    motivo: TEXTOS_CATEGORIZACAO_CORRECAO_TIPOS.asAnyMotivo,
                    sugestao: TEXTOS_CATEGORIZACAO_CORRECAO_TIPOS.asAnySugestao
                });
                stats.corrigir++;
                stats.totalConfianca += 100;
                if (verbose) {
                    log.erro(MENSAGENS_CLI_CORRECAO_TIPOS.verboseAsAnyCritico(arquivo, String(ocorrencia.linha || '?')));
                }
                _erros++;
                continue;
            }
            if (tipo === 'tipo-inseguro-any-cast') {
                ocorrenciasCategorizadas.push({
                    ocorrencia,
                    categoria: 'corrigir',
                    confianca: 100,
                    motivo: TEXTOS_CATEGORIZACAO_CORRECAO_TIPOS.angleAnyMotivo,
                    sugestao: TEXTOS_CATEGORIZACAO_CORRECAO_TIPOS.angleAnySugestao
                });
                stats.corrigir++;
                stats.totalConfianca += 100;
                if (verbose) {
                    log.erro(MENSAGENS_CLI_CORRECAO_TIPOS.verboseAngleAnyCritico(arquivo, String(ocorrencia.linha || '?')));
                }
                _erros++;
                continue;
            }
            if (tipo === 'tipo-inseguro-unknown') {
                const fs = await import('node:fs/promises');
                const path = await import('node:path');
                try {
                    const fullCaminho = path.join(PROJETO_RAIZ, arquivo);
                    const codigo = await fs.readFile(fullCaminho, 'utf-8');
                    const lineContext = extractLineContext(codigo, (ocorrencia.linha || 1) * 80);
                    const categorizacao = categorizarUnknown(codigo, arquivo, lineContext);
                    ocorrenciasCategorizadas.push({
                        ocorrencia,
                        ...categorizacao
                    });
                    stats[categorizacao.categoria]++;
                    stats.totalConfianca += categorizacao.confianca;
                    if (verbose) {
                        const prefixos = {
                            legitimo: '[SUCESSO]',
                            melhoravel: '[AVISO]',
                            corrigir: '[ERRO]'
                        };
                        const prefixo = prefixos[categorizacao.categoria];
                        log.info(MENSAGENS_CLI_CORRECAO_TIPOS.verboseUnknownCategoria(prefixo, arquivo, String(ocorrencia.linha || '?'), categorizacao.categoria, categorizacao.confianca));
                        log.info(MENSAGENS_CLI_CORRECAO_TIPOS.verboseMotivo(categorizacao.motivo));
                        if (categorizacao.sugestao) {
                            log.info(MENSAGENS_CLI_CORRECAO_TIPOS.verboseSugestao(categorizacao.sugestao));
                        }
                        if (categorizacao.variantes && categorizacao.confianca < 80) {
                            log.info(MENSAGENS_CLI_CORRECAO_TIPOS.verboseVariantesTitulo);
                            categorizacao.variantes.forEach((variante, idx) => {
                                log.info(MENSAGENS_CLI_CORRECAO_TIPOS.verboseVarianteItem(idx + 1, variante));
                            });
                        }
                    }
                }
                catch {
                    ocorrenciasCategorizadas.push({
                        ocorrencia,
                        categoria: 'melhoravel',
                        confianca: 60,
                        motivo: TEXTOS_CATEGORIZACAO_CORRECAO_TIPOS.semContextoMotivo,
                        sugestao: TEXTOS_CATEGORIZACAO_CORRECAO_TIPOS.semContextoSugestao
                    });
                    stats.melhoravel++;
                    stats.totalConfianca += 60;
                }
            }
        }
    }
    console.log();
    log.fase?.(MENSAGENS_RESUMO.tituloCategorizacao);
    log.info(MENSAGENS_CLI_CORRECAO_TIPOS.linhaEmBranco);
    const total = stats.legitimo + stats.melhoravel + stats.corrigir;
    const mediaConfianca = total > 0 ? Math.round(stats.totalConfianca / total) : 0;
    const linhasLegitimo = gerarResumoCategoria('LEGITIMO', stats.legitimo, total);
    log.sucesso(linhasLegitimo[0]);
    log.info(linhasLegitimo[1]);
    log.info(MENSAGENS_CLI_CORRECAO_TIPOS.linhaEmBranco);
    const linhasMelhoravel = gerarResumoCategoria('MELHORAVEL', stats.melhoravel, total);
    log.aviso(linhasMelhoravel[0]);
    log.info(linhasMelhoravel[1]);
    log.info(MENSAGENS_CLI_CORRECAO_TIPOS.linhaEmBranco);
    const linhasCorrigir = gerarResumoCategoria('CORRIGIR', stats.corrigir, total);
    log.erro(linhasCorrigir[0]);
    log.info(linhasCorrigir[1]);
    log.info(MENSAGENS_CLI_CORRECAO_TIPOS.linhaEmBranco);
    log.info(MENSAGENS_RESUMO.confianciaMedia(mediaConfianca));
    log.info(MENSAGENS_CLI_CORRECAO_TIPOS.linhaEmBranco);
    if (verbose) {
        try {
            const fs = await import('node:fs/promises');
            const path = await import('node:path');
            const reportCaminho = path.join(PROJETO_RAIZ, '.prometheus', 'fix-types-analise.json');
            await fs.mkdir(path.dirname(reportCaminho), {
                recursive: true
            });
            await fs.writeFile(reportCaminho, JSON.stringify({
                timestamp: new Date().toISOString(),
                stats,
                mediaConfianca,
                total,
                casos: ocorrenciasCategorizadas.map(c => ({
                    arquivo: c.ocorrencia.relPath,
                    linha: c.ocorrencia.linha,
                    categoria: c.categoria,
                    confianca: c.confianca,
                    motivo: c.motivo,
                    sugestao: c.sugestao,
                    variantes: c.variantes || []
                }))
            }, null, 2));
            log.info(MENSAGENS_CLI_CORRECAO_TIPOS.analiseDetalhadaSalva);
            log.info(MENSAGENS_CLI_CORRECAO_TIPOS.linhaEmBranco);
        }
        catch (err) {
            log.aviso(`Não foi possível salvar análise detalhada: ${err instanceof Error ? err.message : String(err)}`);
        }
    }
    const altaPrioridade = ocorrenciasCategorizadas.filter(c => c.categoria === 'corrigir' && c.confianca >= 85);
    if (altaPrioridade.length > 0) {
        log.fase?.(MENSAGENS_CLI_CORRECAO_TIPOS.altaConfiancaTitulo(altaPrioridade.length));
        log.info(MENSAGENS_CLI_CORRECAO_TIPOS.linhaEmBranco);
        for (const item of altaPrioridade.slice(0, 5)) {
            log.info(MENSAGENS_CLI_CORRECAO_TIPOS.altaConfiancaLinha(item.ocorrencia.relPath, String(item.ocorrencia.linha || '?'), item.confianca));
            log.info(MENSAGENS_CLI_CORRECAO_TIPOS.altaConfiancaDetalhe(item.sugestao || item.motivo));
        }
        if (altaPrioridade.length > 5) {
            log.info(MENSAGENS_CLI_CORRECAO_TIPOS.altaConfiancaMais(altaPrioridade.length - 5));
        }
        log.info(MENSAGENS_CLI_CORRECAO_TIPOS.linhaEmBranco);
    }
    const casosIncertos = ocorrenciasCategorizadas.filter(c => c.confianca < 70 && c.variantes && c.variantes.length > 0);
    if (casosIncertos.length > 0 && verbose) {
        log.fase?.(MENSAGENS_CLI_CORRECAO_TIPOS.incertosTitulo(casosIncertos.length));
        log.info(MENSAGENS_CLI_CORRECAO_TIPOS.linhaEmBranco);
        log.info(MENSAGENS_CLI_CORRECAO_TIPOS.incertosIntro);
        log.info(MENSAGENS_CLI_CORRECAO_TIPOS.linhaEmBranco);
        for (const item of casosIncertos.slice(0, 3)) {
            log.info(MENSAGENS_CLI_CORRECAO_TIPOS.incertosLinha(item.ocorrencia.relPath, String(item.ocorrencia.linha || '?'), item.confianca));
            log.info(MENSAGENS_CLI_CORRECAO_TIPOS.verboseMotivo(item.motivo));
            if (item.variantes) {
                log.info(MENSAGENS_CLI_CORRECAO_TIPOS.verboseVariantesTitulo);
                item.variantes.forEach((variante, idx) => {
                    log.info(MENSAGENS_CLI_CORRECAO_TIPOS.verboseVarianteItem(idx + 1, variante));
                });
            }
            log.info(MENSAGENS_CLI_CORRECAO_TIPOS.linhaEmBranco);
        }
        if (casosIncertos.length > 3) {
            log.info(MENSAGENS_CLI_CORRECAO_TIPOS.incertosMais(casosIncertos.length - 3));
            log.info(MENSAGENS_CLI_CORRECAO_TIPOS.linhaEmBranco);
        }
    }
    if (!isDryRun && altaPrioridade.length > 0) {
        console.log();
        log.fase?.(MENSAGENS_CLI_CORRECAO_TIPOS.aplicandoCorrecoesAuto);
        log.info(MENSAGENS_CLI_CORRECAO_TIPOS.linhaEmBranco);
        try {
            const { aplicarCorrecoesEmLote } = await import('../../analistas/corrections/auto-fix-engine.js');
            const porArquivo = {};
            for (const item of ocorrenciasCategorizadas) {
                const arquivo = item.ocorrencia.relPath || 'desconhecido';
                if (!porArquivo[arquivo]) {
                    porArquivo[arquivo] = [];
                }
                porArquivo[arquivo].push(item);
            }
            const resultado = await aplicarCorrecoesEmLote(porArquivo, {
                dryRun: false,
                minConfianca: 85,
                verbose: Boolean(verbose),
                interactive: false
            });
            console.log();
            if (resultado.sucesso > 0) {
                log.sucesso(MENSAGENS_CLI_CORRECAO_TIPOS.correcoesResumoSucesso(resultado.sucesso));
                for (const res of resultado.resultados) {
                    if (res.sucesso && res.linhasModificadas > 0) {
                        log.info(MENSAGENS_CLI_CORRECAO_TIPOS.correcoesResumoLinhaOk(res.arquivo, res.linhasModificadas));
                    }
                    else if (!res.sucesso) {
                        log.erro(MENSAGENS_CLI_CORRECAO_TIPOS.correcoesResumoLinhaErro(res.arquivo, res.erro));
                    }
                }
            }
            else {
                log.info(MENSAGENS_SUCESSO.nenhumaCorrecao);
            }
            if (resultado.falhas > 0) {
                console.log();
                log.erro(MENSAGENS_CLI_CORRECAO_TIPOS.correcoesResumoFalhas(resultado.falhas));
            }
            console.log();
            log.info(MENSAGENS_AUTOFIX.dicas.executarLint);
            log.info(MENSAGENS_AUTOFIX.dicas.executarBuild);
        }
        catch (err) {
            log.erro(`Erro ao aplicar correções: ${err instanceof Error ? err.message : String(err)}`);
            sair(ExitCode.Failure);
            return;
        }
    }
    else if (isDryRun) {
        console.log();
        log.aviso(MENSAGENS_CLI_CORRECAO_TIPOS.dryRunAviso(ICONES.inicio));
        log.info(MENSAGENS_CLI_CORRECAO_TIPOS.linhaEmBranco);
        log.info(TEMPLATE_RESUMO_FINAL.titulo);
        for (const passo of TEMPLATE_RESUMO_FINAL.passos) {
            log.info(MENSAGENS_CLI_CORRECAO_TIPOS.templatePasso(passo));
        }
        log.info(MENSAGENS_CLI_CORRECAO_TIPOS.linhaEmBranco);
        log.info(MENSAGENS_AUTOFIX.dicas.removerDryRun);
    }
    else {
        console.log();
        log.info(MENSAGENS_SUCESSO.nenhumAltaConfianca);
        log.info(MENSAGENS_CLI_CORRECAO_TIPOS.linhaEmBranco);
        log.info(MENSAGENS_AUTOFIX.dicas.ajustarConfianca);
    }
    if (options.export || config.REPORT_EXPORT_ENABLED) {
        console.log();
        log.fase?.(MENSAGENS_CLI_CORRECAO_TIPOS.exportandoRelatorios);
        try {
            const casosParaExport = ocorrenciasCategorizadas.map(item => ({
                arquivo: item.ocorrencia.relPath || 'desconhecido',
                linha: item.ocorrencia.linha,
                tipo: item.ocorrencia.tipo,
                categoria: item.categoria,
                confianca: item.confianca,
                motivo: item.motivo,
                sugestao: item.sugestao,
                variantes: item.variantes,
                contexto: 'contexto' in item.ocorrencia ? item.ocorrencia.contexto : undefined
            }));
            const resultado = await exportarRelatoriosFixTypes({
                baseDir: PROJETO_RAIZ,
                casos: casosParaExport,
                stats,
                minConfidence,
                verbose: Boolean(verbose)
            });
            if (resultado) {
                console.log();
            }
        }
        catch (err) {
            log.aviso(`Erro ao exportar relatórios: ${err instanceof Error ? err.message : String(err)}`);
        }
    }
    const temAny = porTipo['tipo-inseguro-any']?.length > 0;
    if (temAny && !isDryRun) {
        sair(ExitCode.Failure);
        return;
    }
}
//# sourceMappingURL=comando-fix-types.js.map