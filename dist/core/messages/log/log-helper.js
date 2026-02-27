import { config } from '../../config/config.js';
import { logEngine } from './log-engine.js';
import { LogMensagens } from './log-messages.js';
export const logAnalistas = {
    ultimoProgressoGlobal: 0,
    contadorArquivos: 0,
    totalArquivos: 0,
    ultimoEmitMs: 0,
    iniciarBatch(totalArquivos) {
        this.totalArquivos = totalArquivos;
        this.contadorArquivos = 0;
        this.ultimoProgressoGlobal = 0;
        this.ultimoEmitMs = 0;
        if (logEngine.contexto === 'complexo' || config.VERBOSE) {
            logEngine.log('info', LogMensagens.analistas.execucao.inicio_detalhado, {
                totalArquivos: totalArquivos.toString()
            });
        }
    },
    iniciandoAnalista(nomeAnalista, arquivo, tamanho) {
        const deveLogarIndividual = logEngine.contexto === 'complexo' || config.DEV_MODE || process.env.VERBOSE === 'true';
        if (deveLogarIndividual) {
            logEngine.log('debug', LogMensagens.analistas.execucao.inicio_detalhado, {
                analista: nomeAnalista,
                arquivo,
                tamanho: tamanho.toString()
            });
        }
    },
    arquivoProcessado() {
        this.contadorArquivos++;
        if (logEngine.contexto !== 'complexo' && !config.DEV_MODE) {
            this.logProgressoGrupado();
        }
    },
    concluido(nomeAnalista, arquivo, ocorrencias, duracao) {
        const deveLogarIndividual = logEngine.contexto === 'complexo' || config.DEV_MODE || process.env.VERBOSE === 'true';
        if (deveLogarIndividual) {
            logEngine.log('info', LogMensagens.analistas.execucao.sucesso_detalhado, {
                analista: nomeAnalista,
                ocorrencias: ocorrencias.toString(),
                tempo: duracao.toFixed(2)
            });
        }
    },
    logProgressoGrupado() {
        const porcentagem = Math.round(this.contadorArquivos / this.totalArquivos * 100);
        const agora = Date.now();
        const passo = this.totalArquivos < 200 ? 5 : 10;
        const minIntervalMs = 500;
        if (porcentagem - this.ultimoProgressoGlobal >= passo || this.contadorArquivos === this.totalArquivos) {
            if (agora - this.ultimoEmitMs >= minIntervalMs || this.contadorArquivos === this.totalArquivos) {
                logEngine.log('info', LogMensagens.analistas.execucao.batch_progresso, {
                    arquivos: this.contadorArquivos.toString(),
                    total: this.totalArquivos.toString(),
                    percentual: porcentagem.toString()
                });
                this.ultimoProgressoGlobal = porcentagem;
                this.ultimoEmitMs = agora;
            }
        }
    },
    finalizarBatch(totalOcorrencias, duracaoTotal) {
        if (logEngine.contexto === 'simples') {
            logEngine.log('info', LogMensagens.analistas.execucao.batch_concluido_simples, {
                total: totalOcorrencias.toString()
            });
        }
        else {
            logEngine.log('info', LogMensagens.analistas.execucao.batch_concluido_detalhado, {
                total: totalOcorrencias.toString(),
                duracao: (duracaoTotal / 1000).toFixed(1)
            });
        }
    },
    timeout(nomeAnalista, duracao) {
        logEngine.log('aviso', LogMensagens.analistas.execucao.timeout, {
            analista: nomeAnalista,
            tempo: duracao.toString()
        });
    },
    erro(nomeAnalista, erro) {
        logEngine.log('erro', LogMensagens.analistas.execucao.erro, {
            analista: nomeAnalista,
            erro
        });
    },
    performance(dados) {
        if (logEngine.contexto === 'complexo' || config.DEV_MODE) {
            logEngine.log('info', LogMensagens.analistas.metricas.performance, {
                analistas: dados.analistas.toString(),
                media: dados.media.toFixed(1)
            });
        }
    }
};
export const logVarredor = {
    iniciarVarredura(diretorio) {
        if (logEngine.contexto !== 'simples') {
            logEngine.log('info', LogMensagens.scanner.inicio, {
                diretorio
            });
        }
    },
    progresso(diretorio, arquivos) {
        if (logEngine.contexto === 'complexo' || config.VERBOSE) {
            const nomeDiretorio = diretorio.split('/').pop() || diretorio;
            logEngine.log('info', LogMensagens.scanner.progresso, {
                diretorio: nomeDiretorio,
                arquivos: arquivos.toString()
            });
        }
    },
    filtros(includeCount, excludeCount) {
        if (logEngine.contexto !== 'simples' && (includeCount > 0 || excludeCount > 0)) {
            logEngine.log('info', LogMensagens.scanner.filtros, {
                include: includeCount.toString(),
                exclude: excludeCount.toString()
            });
        }
    },
    completo(arquivos, diretorios) {
        logEngine.log('info', LogMensagens.scanner.completo, {
            arquivos: arquivos.toString(),
            diretorios: diretorios.toString()
        });
    },
    arquivoLido(arquivo) {
        if (config.VERBOSE) {
            logEngine.log('info', LogMensagens.scanner.arquivo_lido, {
                arquivo
            });
        }
    }
};
export const logSistema = {
    inicializacao() {
        if (logEngine.contexto !== 'simples') {
            logEngine.log('info', LogMensagens.sistema.inicializacao.sucesso, {});
        }
    },
    shutdown() {
        if (logEngine.contexto !== 'simples') {
            logEngine.log('info', LogMensagens.sistema.shutdown, {});
        }
    },
    erro(mensagem, detalhes) {
        const detalhesStr = detalhes ? ` - ${detalhes}` : '';
        logEngine.log('erro', LogMensagens.sistema.inicializacao.erro_generico, {
            mensagem: `${mensagem}${detalhesStr}`
        });
    },
    autoFixNenhumaCorrecao() {
        logEngine.log('info', LogMensagens.sistema.correcoes.nenhuma_disponivel, {});
    },
    autoFixAplicando(modo) {
        logEngine.log('info', LogMensagens.sistema.correcoes.aplicando, {
            modo
        });
    },
    autoFixArquivoNaoEncontrado(arquivo) {
        logEngine.log('aviso', LogMensagens.sistema.correcoes.arquivo_nao_encontrado, {
            arquivo
        });
    },
    autoFixAplicada(titulo, confianca) {
        if (config.VERBOSE) {
            logEngine.log('info', LogMensagens.sistema.correcoes.aplicada, {
                titulo,
                confianca: confianca.toString()
            });
        }
    },
    autoFixCorrigido(arquivo) {
        if (config.VERBOSE) {
            logEngine.log('info', LogMensagens.sistema.correcoes.corrigido, {
                arquivo
            });
        }
    },
    autoFixFalha(id, erro) {
        logEngine.log('aviso', LogMensagens.sistema.correcoes.falha, {
            id,
            erro
        });
    },
    autoFixNenhumaAplicada() {
        logEngine.log('aviso', LogMensagens.sistema.correcoes.nenhuma_aplicada, {});
    },
    autoFixEstatisticas(estatisticas) {
        logEngine.log('info', LogMensagens.sistema.correcoes.estatisticas, {
            estatisticas: estatisticas.join(', ')
        });
    },
    autoFixESLintHarmonia() {
        logEngine.log('info', LogMensagens.sistema.correcoes.eslint_harmonia, {});
    },
    autoFixESLintAjustes() {
        logEngine.log('info', LogMensagens.sistema.correcoes.eslint_ajustes, {});
    },
    autoFixESLintFalha(erro) {
        logEngine.log('aviso', LogMensagens.sistema.correcoes.eslint_falha, {
            erro
        });
    },
    processamentoFixDetectada() {
        logEngine.log('info', LogMensagens.sistema.processamento.fix_detectada, {});
    },
    processamentoESLintOutput(output) {
        logEngine.log('info', LogMensagens.sistema.processamento.eslint_output, {
            output
        });
    },
    processamentoResumoOcorrencias(total) {
        logEngine.log('info', LogMensagens.sistema.processamento.resumo_ocorrencias, {
            total: total.toString()
        });
    },
    processamentoDicasContextuais() {
        logEngine.log('info', LogMensagens.sistema.processamento.dicas_contextuais, {});
    },
    processamentoDetalhamentoOcorrencias(total) {
        logEngine.log('info', LogMensagens.sistema.processamento.detalhamento_ocorrencias, {
            total: total.toString()
        });
    },
    processamentoErrosCriticos(total) {
        logEngine.log('info', LogMensagens.sistema.processamento.erros_criticos, {
            total: total.toString()
        });
    },
    processamentoAvisosEncontrados(total) {
        logEngine.log('info', LogMensagens.sistema.processamento.avisos_encontrados, {
            total: total.toString()
        });
    },
    processamentoQuickFixesMuitos(total) {
        logEngine.log('info', LogMensagens.sistema.processamento.quick_fixes_muitos, {
            total: total.toString()
        });
    },
    processamentoQuickFixesComando() {
        logEngine.log('info', LogMensagens.sistema.processamento.quick_fixes_comando, {});
    },
    processamentoQuickFixesExecutar() {
        logEngine.log('info', LogMensagens.sistema.processamento.quick_fixes_executar, {});
    },
    processamentoTodosMuitos(total) {
        logEngine.log('info', LogMensagens.sistema.processamento.todos_muitos, {
            total: total.toString()
        });
    },
    processamentoTodosPoucos(total) {
        logEngine.log('info', LogMensagens.sistema.processamento.todos_poucos, {
            total: total.toString()
        });
    },
    processamentoMuitasOcorrencias() {
        logEngine.log('info', LogMensagens.sistema.processamento.muitas_ocorrencias, {});
    },
    processamentoFiltrarPasta() {
        logEngine.log('info', LogMensagens.sistema.processamento.filtrar_pasta, {});
    },
    processamentoUsarFull() {
        logEngine.log('info', LogMensagens.sistema.processamento.usar_full, {});
    },
    processamentoUsarJson() {
        logEngine.log('info', LogMensagens.sistema.processamento.usar_json, {});
    },
    processamentoProjetoLimpo() {
        logEngine.log('info', LogMensagens.sistema.processamento.projeto_limpo, {});
    },
    processamentoAnalistasProblemas(quantidade) {
        logEngine.log('info', LogMensagens.sistema.processamento.analistas_problemas, {
            quantidade: quantidade.toString()
        });
    },
    atualizacaoExecutando(comando) {
        logEngine.log('info', LogMensagens.sistema.atualizacao.executando, {
            comando
        });
    },
    atualizacaoSucesso() {
        logEngine.log('info', LogMensagens.sistema.atualizacao.sucesso, {});
    },
    atualizacaoFalha() {
        logEngine.log('erro', LogMensagens.sistema.atualizacao.falha, {});
    },
    atualizacaoDetalhes(detalhe) {
        logEngine.log('aviso', LogMensagens.sistema.atualizacao.detalhes, {
            detalhe
        });
    },
    performanceRegressaoDetectada(limite) {
        logEngine.log('aviso', LogMensagens.sistema.performance.regressao_detectada, {
            limite: limite.toString()
        });
    },
    performanceSemRegressoes() {
        logEngine.log('info', LogMensagens.sistema.performance.sem_regressoes, {});
    },
    podaCancelada() {
        logEngine.log('info', LogMensagens.sistema.poda.cancelada, {});
    },
    podaConcluida() {
        logEngine.log('info', LogMensagens.sistema.poda.concluida, {});
    },
    reversaoNenhumMove(arquivo) {
        logEngine.log('erro', LogMensagens.sistema.reversao.nenhum_move, {
            arquivo
        });
    },
    reversaoRevertendo(arquivo) {
        logEngine.log('info', LogMensagens.sistema.reversao.revertendo, {
            arquivo
        });
    },
    reversaoSucesso(arquivo) {
        logEngine.log('info', LogMensagens.sistema.reversao.sucesso, {
            arquivo
        });
    },
    reversaoFalha(arquivo) {
        logEngine.log('erro', LogMensagens.sistema.reversao.falha, {
            arquivo
        });
    }
};
export const logFiltros = {
    incluindo(pattern, matches) {
        if (config.VERBOSE || logEngine.contexto === 'complexo') {
            logEngine.log('info', LogMensagens.filtros.incluindo, {
                pattern,
                matches: matches.toString()
            });
        }
    },
    excluindo(pattern, matches) {
        if (config.VERBOSE || logEngine.contexto === 'complexo') {
            logEngine.log('info', LogMensagens.filtros.excluindo, {
                pattern,
                matches: matches.toString()
            });
        }
    },
    supressao(count, motivo) {
        if (count > 0) {
            logEngine.log('info', LogMensagens.filtros.supressao, {
                count: count.toString(),
                motivo
            });
        }
    }
};
export const logProjeto = {
    detectado(tipo, confianca) {
        logEngine.log('info', LogMensagens.projeto.detectado, {
            tipo,
            confianca: confianca.toString()
        });
    },
    estrutura(arquivos, linguagens) {
        if (logEngine.contexto !== 'simples') {
            logEngine.log('info', LogMensagens.projeto.estrutura, {
                arquivos: arquivos.toString(),
                linguagens: linguagens.toString()
            });
        }
    },
    complexidade(nivel, metricas) {
        if (logEngine.contexto === 'complexo') {
            logEngine.log('info', LogMensagens.projeto.complexidade, {
                nivel,
                metricas
            });
        }
    },
    recomendacao(acao) {
        logEngine.log('info', LogMensagens.projeto.recomendacao, {
            acao
        });
    },
    performance(dados) {
        if (logEngine.contexto === 'complexo' || config.DEV_MODE) {
            const throughput = dados.throughput ? ` (${dados.throughput.toFixed(1)} arq/s)` : '';
            logEngine.log('info', LogMensagens.analistas.metricas.performance, {
                analistas: dados.analistas.toString(),
                duracao: (dados.duracao / 1000).toFixed(1),
                throughput
            });
        }
    }
};
export const logOcorrencias = {
    critica(mensagem, arquivo, linha) {
        logEngine.log('erro', LogMensagens.ocorrencias.critica, {
            mensagem,
            arquivo,
            linha: linha?.toString() || ''
        });
    },
    resumo(total, criticos, avisos) {
        logEngine.log('info', LogMensagens.relatorio.resumo, {
            total: total.toString(),
            criticos: criticos.toString(),
            avisos: avisos.toString()
        });
    }
};
export const logRelatorio = {
    gerado(caminho, formato) {
        logEngine.log('info', LogMensagens.relatorio.gerado, {
            formato,
            caminho
        });
    },
    erro(erro) {
        logEngine.log('erro', LogMensagens.relatorio.erro_geracao, {
            erro
        });
    },
    repositorioImpecavel() {
        logEngine.log('info', LogMensagens.relatorio.repositorio_impecavel, {});
    },
    ocorrenciasEncontradas(total) {
        logEngine.log('aviso', LogMensagens.relatorio.ocorrencias_encontradas, {
            total: total.toString()
        });
    },
    fimPadroesUso() {
        logEngine.log('info', LogMensagens.relatorio.fim_padroes_uso, {});
    },
    funcoesLongas() {
        logEngine.log('aviso', LogMensagens.relatorio.funcoes_longas, {});
    }
};
export const logAuto = {
    mapaReversaoErroCarregar(erro) {
        logEngine.log('erro', LogMensagens.sistema.auto.mapa_reversao.erro_carregar, {
            erro
        });
    },
    mapaReversaoErroSalvar(erro) {
        logEngine.log('erro', LogMensagens.sistema.auto.mapa_reversao.erro_salvar, {
            erro
        });
    },
    mapaReversaoMoveNaoEncontrado(id) {
        logEngine.log('erro', LogMensagens.sistema.auto.mapa_reversao.move_nao_encontrado, {
            id
        });
    },
    mapaReversaoArquivoDestinoNaoEncontrado(destino) {
        logEngine.log('erro', LogMensagens.sistema.auto.mapa_reversao.arquivo_destino_nao_encontrado, {
            destino
        });
    },
    mapaReversaoArquivoExisteOrigem(origem) {
        logEngine.log('aviso', LogMensagens.sistema.auto.mapa_reversao.arquivo_existe_origem, {
            origem
        });
    },
    mapaReversaoErroReverter(erro) {
        logEngine.log('erro', LogMensagens.sistema.auto.mapa_reversao.erro_reverter, {
            erro
        });
    },
    mapaReversaoNenhumMove(arquivo) {
        logEngine.log('aviso', LogMensagens.sistema.auto.mapa_reversao.nenhum_move, {
            arquivo
        });
    },
    mapaReversaoRevertendoMove(id) {
        logEngine.log('info', LogMensagens.sistema.auto.mapa_reversao.revertendo_move, {
            id
        });
    },
    mapaReversaoMoveRevertido(id) {
        logEngine.log('info', LogMensagens.sistema.auto.mapa_reversao.move_revertido, {
            id
        });
    },
    mapaReversaoFalhaReverterMove(id) {
        logEngine.log('erro', LogMensagens.sistema.auto.mapa_reversao.falha_reverter_move, {
            id
        });
    },
    mapaReversaoCarregado(moves) {
        logEngine.log('info', LogMensagens.sistema.auto.mapa_reversao.carregado, {
            moves: moves.toString()
        });
    },
    mapaReversaoNenhumEncontrado() {
        logEngine.log('info', LogMensagens.sistema.auto.mapa_reversao.nenhum_encontrado, {});
    },
    podaNenhumArquivo() {
        logEngine.log('info', LogMensagens.sistema.auto.poda.nenhum_arquivo, {});
    },
    podaPodando(quantidade) {
        logEngine.log('aviso', LogMensagens.sistema.auto.poda.podando, {
            quantidade: quantidade.toString()
        });
    },
    podaPodandoSimulado(quantidade) {
        logEngine.log('aviso', LogMensagens.sistema.auto.poda.podando_simulado, {
            quantidade: quantidade.toString()
        });
    },
    podaArquivoMovido(arquivo) {
        logEngine.log('info', LogMensagens.sistema.auto.poda.arquivo_movido, {
            arquivo
        });
    },
    corretorErroCriarDiretorio(destino, erro) {
        logEngine.log('erro', LogMensagens.sistema.auto.corretor.erro_criar_diretorio, {
            destino,
            erro
        });
    },
    corretorDestinoExiste(arquivo, destino) {
        logEngine.log('aviso', LogMensagens.sistema.auto.corretor.destino_existe, {
            arquivo,
            destino
        });
    },
    corretorErroMover(arquivo, erro) {
        logEngine.log('erro', LogMensagens.sistema.auto.corretor.erro_mover, {
            arquivo,
            erro
        });
    },
    pluginIgnorado(plugin, erro) {
        logEngine.log('aviso', LogMensagens.auto.plugin_ignorado, {
            plugin,
            erro
        });
    },
    caminhoNaoResolvido(plugin) {
        logEngine.log('aviso', LogMensagens.auto.caminho_nao_resolvido, {
            plugin
        });
    },
    pluginFalhou(plugin, erro) {
        logEngine.log('aviso', LogMensagens.auto.plugin_falhou, {
            plugin,
            erro
        });
    },
    moveRemovido(id) {
        logEngine.log('info', LogMensagens.auto.move_removido, {
            id
        });
    }
};
export const logGuardian = {
    integridadeOk() {
        logEngine.log('info', LogMensagens.guardian.integridade_ok, {});
    },
    baselineCriado() {
        logEngine.log('info', LogMensagens.guardian.baseline_criado, {});
    },
    baselineAceito() {
        logEngine.log('aviso', LogMensagens.guardian.baseline_aceito, {});
    },
    alteracoesDetectadas() {
        logEngine.log('aviso', LogMensagens.guardian.alteracoes_detectadas, {});
    },
    bloqueado() {
        logEngine.log('erro', LogMensagens.guardian.bloqueado, {});
    },
    modoPermissivo() {
        logEngine.log('aviso', LogMensagens.guardian.modo_permissivo, {});
    },
    scanOnly(arquivos) {
        logEngine.log('info', LogMensagens.guardian.scan_only, {
            arquivos: arquivos.toString()
        });
    },
    avisosEncontrados() {
        logEngine.log('aviso', LogMensagens.guardian.avisos_encontrados, {});
    },
    fullScanAviso() {
        logEngine.log('aviso', LogMensagens.guardian.full_scan_aviso, {});
    },
    fullScanWarningBaseline() {
        logEngine.log('aviso', LogMensagens.guardian.full_scan_warning_baseline, {});
    },
    aceitandoBaseline() {
        logEngine.log('info', LogMensagens.guardian.aceitando_baseline, {});
    },
    baselineAceitoSucesso() {
        logEngine.log('info', LogMensagens.guardian.baseline_aceito_sucesso, {});
    },
    comparandoIntegridade() {
        logEngine.log('info', LogMensagens.guardian.comparando_integridade, {});
    },
    diferencasDetectadas() {
        logEngine.log('aviso', LogMensagens.guardian.diferencas_detectadas, {});
    },
    diferencaItem(diferenca) {
        logEngine.log('info', LogMensagens.guardian.diferenca_item, {
            diferenca
        });
    },
    comandoDiffRecomendado() {
        logEngine.log('aviso', LogMensagens.guardian.comando_diff_recomendado, {});
    },
    integridadePreservada() {
        logEngine.log('info', LogMensagens.guardian.integridade_preservada, {});
    },
    verificandoIntegridade() {
        logEngine.log('info', LogMensagens.guardian.verificando_integridade, {});
    },
    baselineCriadoConsole() {
        logEngine.log('info', LogMensagens.guardian.baseline_criado_console, {});
    },
    baselineAtualizado() {
        logEngine.log('info', LogMensagens.guardian.baseline_atualizado, {});
    },
    alteracoesSuspeitas() {
        logEngine.log('aviso', LogMensagens.guardian.alteracoes_suspeitas, {});
    },
    erroGuardian(erro) {
        logEngine.log('erro', LogMensagens.guardian.erro_guardian, {
            erro
        });
    },
    info(mensagem) {
        logEngine.log('info', LogMensagens.guardian.info, {
            mensagem
        });
    },
    aviso(mensagem) {
        logEngine.log('aviso', LogMensagens.guardian.aviso, {
            mensagem
        });
    }
};
export const logConselheiro = {
    volumeAlto() {
        logEngine.log('aviso', LogMensagens.conselheiro.volume_alto, {});
    },
    respira() {
        logEngine.log('aviso', LogMensagens.conselheiro.respira, {});
    },
    cuidado() {
        logEngine.log('aviso', LogMensagens.conselheiro.cuidado, {});
    },
    madrugada(hora) {
        logEngine.log('aviso', LogMensagens.conselheiro.madrugada, {
            hora
        });
    }
};
export const logMetricas = {
    execucoesRegistradas(quantidade) {
        logEngine.log('info', LogMensagens.metricas.execucoes_registradas, {
            quantidade: quantidade.toString()
        });
    },
    nenhumHistorico() {
        logEngine.log('aviso', LogMensagens.metricas.nenhum_historico, {});
    }
};
export const logCore = {
    erroBabel(erro, arquivo) {
        logEngine.log('debug', LogMensagens.core.parsing.erro_babel, {
            erro,
            arquivo: arquivo || 'desconhecido'
        });
    },
    erroTs(erro, arquivo) {
        logEngine.log('debug', LogMensagens.core.parsing.erro_ts, {
            erro,
            arquivo: arquivo || 'desconhecido'
        });
    },
    erroCss(erro, arquivo) {
        logEngine.log('debug', LogMensagens.core.parsing.erro_css, {
            erro,
            arquivo: arquivo || 'desconhecido'
        });
    },
    erroXml(erro, arquivo) {
        logEngine.log('debug', LogMensagens.core.parsing.erro_xml, {
            erro,
            arquivo: arquivo || 'desconhecido'
        });
    },
    erroHtml(erro, arquivo) {
        logEngine.log('debug', LogMensagens.core.parsing.erro_html, {
            erro,
            arquivo: arquivo || 'desconhecido'
        });
    },
    nenhumParser(extensao) {
        logEngine.log('debug', LogMensagens.core.parsing.nenhum_parser, {
            extensao
        });
    },
    timeoutParsing(timeout, extensao) {
        logEngine.log('debug', LogMensagens.core.parsing.timeout_parsing, {
            timeout: timeout.toString(),
            extensao
        });
    },
    pluginNaoEncontrado(extensao) {
        logEngine.log('debug', LogMensagens.core.parsing.plugin_nao_encontrado, {
            extensao
        });
    },
    sistemaPluginsFalhou(erro) {
        logEngine.log('debug', LogMensagens.core.parsing.sistema_plugins_falhou, {
            erro
        });
    },
    erroCarregarPlugin(nome, erro) {
        logEngine.log('debug', LogMensagens.core.plugins.erro_carregar, {
            nome,
            erro
        });
    },
    tentandoAutoload(extensao) {
        logEngine.log('debug', LogMensagens.core.plugins.tentando_autoload, {
            extensao
        });
    },
    autoloadFalhou(nome) {
        logEngine.log('debug', LogMensagens.core.plugins.autoload_falhou, {
            nome
        });
    },
    extensaoNaoSuportada(extensao) {
        logEngine.log('debug', LogMensagens.core.plugins.extensao_nao_suportada, {
            extensao
        });
    },
    pluginsRegistrados() {
        logEngine.log('debug', LogMensagens.core.parsing.plugins_registrados, {});
    },
    usandoPlugin(nome, extensao) {
        logEngine.log('debug', LogMensagens.core.parsing.usando_plugin, {
            nome,
            extensao
        });
    },
    registrandoPlugin(nome, versao) {
        logEngine.log('debug', LogMensagens.core.plugins.registrando, {
            nome,
            versao
        });
    },
    reaproveitadoIncremental(arquivo) {
        logEngine.log('info', LogMensagens.core.executor.reaproveitado_incremental, {
            arquivo
        });
    }
};
//# sourceMappingURL=log-helper.js.map