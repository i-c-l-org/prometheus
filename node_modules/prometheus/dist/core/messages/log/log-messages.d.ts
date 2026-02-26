export declare const LogMensagens: {
    sistema: {
        inicializacao: {
            sucesso: string;
            falha: string;
            configuracao: string;
            erro_generico: string;
        };
        shutdown: string;
        atualizacao: {
            executando: string;
            sucesso: string;
            falha: string;
            detalhes: string;
        };
        performance: {
            regressao_detectada: string;
            sem_regressoes: string;
        };
        poda: {
            cancelada: string;
            concluida: string;
        };
        reversao: {
            nenhum_move: string;
            revertendo: string;
            sucesso: string;
            falha: string;
        };
        auto: {
            mapa_reversao: {
                erro_carregar: string;
                erro_salvar: string;
                move_nao_encontrado: string;
                arquivo_destino_nao_encontrado: string;
                arquivo_existe_origem: string;
                erro_reverter: string;
                nenhum_move: string;
                revertendo_move: string;
                move_revertido: string;
                falha_reverter_move: string;
                carregado: string;
                nenhum_encontrado: string;
            };
            poda: {
                nenhum_arquivo: string;
                podando: string;
                podando_simulado: string;
                arquivo_movido: string;
            };
            corretor: {
                erro_criar_diretorio: string;
                destino_existe: string;
                erro_mover: string;
            };
        };
        correcoes: {
            nenhuma_disponivel: string;
            aplicando: string;
            arquivo_nao_encontrado: string;
            aplicada: string;
            corrigido: string;
            falha: string;
            nenhuma_aplicada: string;
            estatisticas: string;
            eslint_harmonia: string;
            eslint_ajustes: string;
            eslint_falha: string;
        };
        processamento: {
            fix_detectada: string;
            eslint_output: string;
            resumo_ocorrencias: string;
            dicas_contextuais: string;
            detalhamento_ocorrencias: string;
            erros_criticos: string;
            avisos_encontrados: string;
            quick_fixes_muitos: string;
            quick_fixes_comando: string;
            quick_fixes_executar: string;
            todos_muitos: string;
            todos_poucos: string;
            muitas_ocorrencias: string;
            filtrar_pasta: string;
            usar_full: string;
            usar_json: string;
            projeto_limpo: string;
            analistas_problemas: string;
        };
    };
    scanner: {
        inicio: string;
        progresso: string;
        filtros: string;
        completo: string;
        arquivo_lido: string;
    };
    analistas: {
        execucao: {
            inicio_simples: string;
            sucesso_simples: string;
            inicio_detalhado: string;
            sucesso_detalhado: string;
            timeout: string;
            erro: string;
            skip: string;
            batch_progresso: string;
            batch_concluido_simples: string;
            batch_concluido_detalhado: string;
        };
        metricas: {
            performance: string;
            cache_hit: string;
            worker_pool: string;
        };
    };
    filtros: {
        incluindo: string;
        excluindo: string;
        supressao: string;
        cli_override: string;
    };
    projeto: {
        detectado: string;
        estrutura: string;
        complexidade: string;
        recomendacao: string;
    };
    contexto: {
        desenvolvedor_novo: string;
        equipe_experiente: string;
        ci_cd: string;
        debug_mode: string;
    };
    ocorrencias: {
        critica: string;
        aviso: string;
        info: string;
        sugestao: string;
    };
    relatorio: {
        resumo: string;
        categorias: string;
        arquivo_problema: string;
        tendencia: string;
        repositorio_impecavel: string;
        ocorrencias_encontradas: string;
        fim_padroes_uso: string;
        funcoes_longas: string;
        gerado: string;
        erro_geracao: string;
    };
    conselheiro: {
        volume_alto: string;
        respira: string;
        cuidado: string;
        madrugada: string;
    };
    guardian: {
        integridade_ok: string;
        baseline_criado: string;
        baseline_aceito: string;
        alteracoes_detectadas: string;
        bloqueado: string;
        modo_permissivo: string;
        scan_only: string;
        avisos_encontrados: string;
        full_scan_aviso: string;
        full_scan_warning_baseline: string;
        aceitando_baseline: string;
        baseline_aceito_sucesso: string;
        comparando_integridade: string;
        diferencas_detectadas: string;
        diferenca_item: string;
        comando_diff_recomendado: string;
        integridade_preservada: string;
        verificando_integridade: string;
        baseline_criado_console: string;
        baseline_atualizado: string;
        alteracoes_suspeitas: string;
        erro_guardian: string;
        info: string;
        aviso: string;
    };
    metricas: {
        execucoes_registradas: string;
        nenhum_historico: string;
    };
    auto: {
        plugin_ignorado: string;
        caminho_nao_resolvido: string;
        plugin_falhou: string;
        move_removido: string;
    };
    core: {
        parsing: {
            erro_babel: string;
            erro_ts: string;
            erro_xml: string;
            erro_html: string;
            erro_css: string;
            nenhum_parser: string;
            timeout_parsing: string;
            plugin_nao_encontrado: string;
            sistema_plugins_falhou: string;
            plugins_registrados: string;
            usando_plugin: string;
        };
        plugins: {
            erro_carregar: string;
            tentando_autoload: string;
            autoload_falhou: string;
            extensao_nao_suportada: string;
            registrando: string;
        };
        executor: {
            reaproveitado_incremental: string;
        };
    };
};
export declare const LogContextConfiguracao: {
    readonly simples: {
        readonly nivel_detalhamento: "basico";
        readonly mostrar_performance: false;
        readonly mostrar_cache: false;
        readonly mostrar_workers: false;
        readonly formato_arquivo: "nome_apenas";
        readonly agrupar_ocorrencias: true;
    };
    readonly medio: {
        readonly nivel_detalhamento: "moderado";
        readonly mostrar_performance: true;
        readonly mostrar_cache: false;
        readonly mostrar_workers: false;
        readonly formato_arquivo: "relativo";
        readonly agrupar_ocorrencias: true;
    };
    readonly complexo: {
        readonly nivel_detalhamento: "completo";
        readonly mostrar_performance: true;
        readonly mostrar_cache: true;
        readonly mostrar_workers: true;
        readonly formato_arquivo: "completo";
        readonly agrupar_ocorrencias: false;
    };
    readonly ci: {
        readonly nivel_detalhamento: "estruturado";
        readonly mostrar_performance: true;
        readonly mostrar_cache: true;
        readonly mostrar_workers: true;
        readonly formato_arquivo: "relativo";
        readonly agrupar_ocorrencias: false;
        readonly formato_saida: "json_lines";
    };
};
//# sourceMappingURL=log-messages.d.ts.map