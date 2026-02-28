import { createI18nMessages } from '../../../shared/helpers/i18n.js';
import { buildTypesRelPathPosix, getTypesDirectoryDisplay } from '../../config/conventions.js';
import { ICONES } from '../ui/icons.js';
export const MENSAGENS_CORRECAO_TIPOS = createI18nMessages({
    fixAny: {
        title: 'Substituir any por tipos seguros',
        description: `Analisa uso de any e infere/cria tipos corretos em ${getTypesDirectoryDisplay()}`
    },
    fixUnknown: {
        title: 'Substituir unknown por tipos específicos',
        description: 'Detecta padrões de type guards e cria tipos dedicados'
    },
    validacao: {
        falha: (erros) => `Validação falhou: ${erros.join(', ')}`,
        revisar: 'Revise manualmente'
    },
    warnings: {
        confiancaBaixa: (confianca) => `Tipo inseguro (any) com confiança muito baixa (${confianca}%) para correção automática`,
        confiancaMedia: (confianca, tipoSugerido) => `Tipo inseguro detectado. Sugestão: ${tipoSugerido} (confiança: ${confianca}%)`,
        unknownApropriado: 'unknown apropriado aqui (entrada genérica ou baixa confiança)',
        useTiposCentralizados: () => `Use tipos centralizados em diretório dedicado (${getTypesDirectoryDisplay()})`,
        criarTipoDedicado: (caminho) => `Considere criar tipo dedicado em ${buildTypesRelPathPosix(caminho)}`,
        adicioneTypeGuards: () => `Se possível, adicione type guards ou crie tipo dedicado em ${getTypesDirectoryDisplay()}`
    },
    erros: {
        extrairNome: 'Não foi possível extrair nome da variável',
        variavelNaoUsada: 'Variável não utilizada - impossível inferir tipo',
        analise: (erro) => `Erro na análise: ${erro}`
    }
}, {
    fixAny: {
        title: 'Replace any with safe types',
        description: `Analyzes use of any and infers/creates correct types in ${getTypesDirectoryDisplay()}`
    },
    fixUnknown: {
        title: 'Replace unknown with specific types',
        description: 'Detects type guard patterns and creates dedicated types'
    },
    validacao: {
        falha: (erros) => `Validation failed: ${erros.join(', ')}`,
        revisar: 'Manually review'
    },
    warnings: {
        confiancaBaixa: (confianca) => `Unsafe type (any) with very low confidence (${confianca}%) for automatic correction`,
        confiancaMedia: (confianca, tipoSugerido) => `Unsafe type detected. Suggestion: ${tipoSugerido} (confidence: ${confianca}%)`,
        unknownApropriado: 'unknown appropriate here (generic input or low confidence)',
        useTiposCentralizados: () => `Use centralized types in dedicated directory (${getTypesDirectoryDisplay()})`,
        criarTipoDedicado: (caminho) => `Consider creating dedicated type in ${buildTypesRelPathPosix(caminho)}`,
        adicioneTypeGuards: () => `If possible, add type guards or create dedicated type in ${getTypesDirectoryDisplay()}`
    },
    erros: {
        extrairNome: 'Could not extract variable name',
        variavelNaoUsada: 'Variable not used - impossible to infer type',
        analise: (erro) => `Analysis error: ${erro}`
    }
});
export const MENSAGENS_AUTOFIX = createI18nMessages({
    iniciando: (modo) => `${ICONES.acao.correcao} Iniciando auto-fix (modo: ${modo})`,
    dryRun: `${ICONES.feedback.info} Dry-run: simulando correções (nenhuma mudança será aplicada)`,
    aplicando: (count) => `Aplicando ${count} correção${count !== 1 ? 'ões' : ''}...`,
    concluido: (aplicadas, falhas) => `${ICONES.nivel.sucesso} Auto-fix concluído: ${aplicadas} aplicada${aplicadas !== 1 ? 's' : ''}, ${falhas} falha${falhas !== 1 ? 's' : ''}`,
    naoDisponivel: `${ICONES.feedback.info} Nenhuma correção automática disponível`,
    flags: {
        fixSafe: `${ICONES.comando.guardian} Flag --fix-safe detectada: ativando modo conservador`,
        requireMutateFS: `${ICONES.status.falha} Auto-fix indisponível no momento.`
    },
    logs: {
        modoConservador: `${ICONES.comando.guardian} Modo conservador ativado - aplicando apenas correções de alta confiança`,
        validarEslint: `${ICONES.acao.analise} Executando validação ESLint pós-auto-fix...`,
        arquivoMovido: (origem, destino) => `${ICONES.status.ok} Movido: ${origem} → ${destino}`,
        arquivoRevertido: (origem, destino) => `↩️ Arquivo revertido: ${destino} → ${origem}`,
        arquivoRevertidoConteudo: (origem, destino) => `↩️ Arquivo revertido com conteúdo original: ${destino} → ${origem}`
    },
    resultados: {
        sucesso: (count) => `${ICONES.status.ok} ${count} arquivo(s) corrigido(s)`,
        falhas: (count) => `${ICONES.status.falha} ${count} arquivo(s) com erro`,
        erroArquivo: (arquivo, erro) => `${ICONES.status.falha} ${arquivo}: ${erro}`
    },
    dicas: {
        executarLint: `${ICONES.feedback.dica} Execute \`npm run lint\` para verificar as correções`,
        executarBuild: `${ICONES.feedback.dica} Execute \`npm run build\` para verificar se o código compila`,
        removerDryRun: `${ICONES.feedback.dica} Remova --dry-run para aplicar correções automaticamente`,
        ajustarConfianca: `${ICONES.feedback.dica} Use --confidence <num> para ajustar o limiar (atual: 85%)`
    }
}, {
    iniciando: (modo) => `${ICONES.acao.correcao} Starting auto-fix (mode: ${modo})`,
    dryRun: `${ICONES.feedback.info} Dry-run: simulating corrections (no changes will be applied)`,
    aplicando: (count) => `Applying ${count} correction${count !== 1 ? 's' : ''}...`,
    concluido: (aplicadas, falhas) => `${ICONES.nivel.sucesso} Auto-fix concluded: ${aplicadas} applied, ${falhas} failure${falhas !== 1 ? 's' : ''}`,
    naoDisponivel: `${ICONES.feedback.info} No automatic corrections available`,
    flags: {
        fixSafe: `${ICONES.comando.guardian} --fix-safe flag detected: activating conservative mode`,
        requireMutateFS: `${ICONES.status.falha} Auto-fix currently unavailable.`
    },
    logs: {
        modoConservador: `${ICONES.comando.guardian} Conservative mode activated - applying only high-confidence corrections`,
        validarEslint: `${ICONES.acao.analise} Running ESLint validation after auto-fix...`,
        arquivoMovido: (origem, destino) => `${ICONES.status.ok} Moved: ${origem} → ${destino}`,
        arquivoRevertido: (origem, destino) => `↩️ File reverted: ${destino} → ${origem}`,
        arquivoRevertidoConteudo: (origem, destino) => `↩️ File reverted with original content: ${destino} → ${origem}`
    },
    resultados: {
        sucesso: (count) => `${ICONES.status.ok} ${count} file(s) fixed`,
        falhas: (count) => `${ICONES.status.falha} ${count} file(s) with error`,
        erroArquivo: (arquivo, erro) => `${ICONES.status.falha} ${arquivo}: ${erro}`
    },
    dicas: {
        executarLint: `${ICONES.feedback.dica} Run \`npm run lint\` to verify fixes`,
        executarBuild: `${ICONES.feedback.dica} Run \`npm run build\` to verify code compiles`,
        removerDryRun: `${ICONES.feedback.dica} Remove --dry-run to apply corrections automatically`,
        ajustarConfianca: `${ICONES.feedback.dica} Use --confidence <num> to adjust threshold (current: 85%)`
    }
});
export const MENSAGENS_RELATORIOS_ANALISE = createI18nMessages({
    asyncPatterns: {
        titulo: `${ICONES.relatorio.resumo} Análise de Padrões Async/Await`,
        padroes: `\n${ICONES.relatorio.resumo} Padrões de Uso do Código:`,
        recomendacoes: `\n${ICONES.feedback.dica} Recomendações de Correção:\n`,
        critico: `${ICONES.nivel.erro} CRÍTICO (Revisar Imediatamente):`,
        alto: `\n${ICONES.feedback.atencao} ALTO (Revisar em Sprint Atual):`,
        salvo: (caminho) => `${ICONES.nivel.sucesso} Relatório async salvo em: ${caminho}`
    },
    fixTypes: {
        analiseSalva: `${ICONES.arquivo.json} Análise detalhada salva em: .prometheus/fix-types-analise.json`,
        possibilidades: `└─ ${ICONES.acao.analise} Possibilidades alternativas:`,
        sugestao: (texto) => `└─ ${ICONES.feedback.dica} ${texto}`,
        exportado: `${ICONES.arquivo.doc} Relatórios de fix-types exportados:`
    },
    guardian: {
        baselineAceito: `${ICONES.status.ok} Guardian: baseline aceito manualmente (--aceitar).`,
        exportado: `${ICONES.arquivo.doc} Relatórios Guardian exportados:`
    }
}, {
    asyncPatterns: {
        titulo: `${ICONES.relatorio.resumo} Async/Await Patterns Analysis`,
        padroes: `\n${ICONES.relatorio.resumo} Code Usage Patterns:`,
        recomendacoes: `\n${ICONES.feedback.dica} Correction Recommendations:\n`,
        critico: `${ICONES.nivel.erro} CRITICAL (Review Immediately):`,
        alto: `\n${ICONES.feedback.atencao} HIGH (Review in Current Sprint):`,
        salvo: (caminho) => `${ICONES.nivel.sucesso} Async report saved at: ${caminho}`
    },
    fixTypes: {
        analiseSalva: `${ICONES.arquivo.json} Detailed analysis saved at: .prometheus/fix-types-analise.json`,
        possibilidades: `└─ ${ICONES.acao.analise} Alternative possibilities:`,
        sugestao: (texto) => `└─ ${ICONES.feedback.dica} ${texto}`,
        exportado: `${ICONES.arquivo.doc} fix-types reports exported:`
    },
    guardian: {
        baselineAceito: `${ICONES.status.ok} Guardian: baseline manually accepted (--aceitar).`,
        exportado: `${ICONES.arquivo.doc} Guardian reports exported:`
    }
});
export const MENSAGENS_ARQUETIPOS_HANDLER = createI18nMessages({
    timeout: `${ICONES.feedback.atencao} Detecção de arquetipos expirou (timeout)`,
    salvo: (caminho) => `${ICONES.status.ok} Arquétipo personalizado salvo em ${caminho}`,
    falha: `${ICONES.feedback.atencao} Falha ao gerar plano via arquétipos.`,
    falhaEstrategista: `${ICONES.feedback.atencao} Estrategista falhou ao sugerir plano.`,
    falhaGeral: `${ICONES.feedback.atencao} Falha geral no planejamento.`
}, {
    timeout: `${ICONES.feedback.atencao} Archetype detection timed out`,
    salvo: (caminho) => `${ICONES.status.ok} Custom archetype saved at ${caminho}`,
    falha: `${ICONES.feedback.atencao} Failed to generate plan via archetypes.`,
    falhaEstrategista: `${ICONES.feedback.atencao} Strategist failed to suggest plan.`,
    falhaGeral: `${ICONES.feedback.atencao} General failure in planning.`
});
export const MENSAGENS_PLUGINS = createI18nMessages({
    registrado: (nome, extensoes) => `${ICONES.status.ok} Plugin ${nome} registrado com extensões: ${extensoes.join(', ')}`,
    configAtualizada: `${ICONES.acao.correcao} Configuração do registry atualizada`,
    erroParsear: (linguagem, erro) => `${ICONES.feedback.atencao} Erro ao parsear ${linguagem}: ${erro}`
}, {
    registrado: (nome, extensoes) => `${ICONES.status.ok} Plugin ${nome} registered with extensions: ${extensoes.join(', ')}`,
    configAtualizada: `${ICONES.acao.correcao} Registry configuration updated`,
    erroParsear: (linguagem, erro) => `${ICONES.feedback.atencao} Error parsing ${linguagem}: ${erro}`
});
export const MENSAGENS_EXECUTOR = createI18nMessages({
    analiseCompleta: (tecnica, arquivo, duracao) => `${ICONES.arquivo.arquivo} '${tecnica}' analisou ${arquivo} em ${duracao}`,
    fastModeAtivado: '[PERFORMANCE] Modo rapido ativado: processamento paralelo com Workers',
    analiseRapidaConcluida: (total, duracao) => `[SUCESSO] Analise rapida concluida: ${total} arquivos em ${duracao}`,
    tecnicaGlobalSucesso: (nome) => `Tecnica global "${nome}"`,
    tecnicaGlobalErro: (nome, erro) => `[ERRO] Erro na tecnica global '${nome}': ${erro}`,
    tecnicaGlobalTimeout: (nome) => `[TIMEOUT] Analista global '${nome}' excedeu o tempo limite`,
    tecnicaGlobalTimeoutOcorrencia: (nome, timeout) => `Timeout na tecnica global '${nome}': ${timeout}ms excedido`,
    tecnicaGlobalErroOcorrencia: (nome, erro) => `Falha na tecnica global '${nome}': ${erro}`,
    tecnicaLocalErro: (nome, arquivo, erro) => `[ERRO] Erro em '${nome}' para ${arquivo}: ${erro}`,
    tecnicaLocalTimeoutOcorrencia: (nome, arquivo, timeout) => `Timeout na tecnica '${nome}' para ${arquivo}: ${timeout}ms excedido`,
    tecnicaLocalErroOcorrencia: (nome, arquivo, erro) => `Falha na tecnica '${nome}' para ${arquivo}: ${erro}`,
    stackTrace: 'Stack trace:',
    arquivosAnalisadosProgress: (atual, total) => `Arquivos analisados: ${atual}/${total}`,
    arquivosAnalisadosTotal: (total) => `Arquivos analisados: ${total}`,
    arquivoProcessando: (atual, total, path) => `Arquivo ${atual}/${total}: ${path}`,
    falhaPersistirMetricas: (erro) => `Falha ao persistir historico de metricas: ${erro}`
}, {
    analiseCompleta: (tecnica, arquivo, duracao) => `${ICONES.arquivo.arquivo} '${tecnica}' analyzed ${arquivo} in ${duracao}`,
    fastModeAtivado: '[PERFORMANCE] Fast mode activated: parallel processing with Workers',
    analiseRapidaConcluida: (total, duracao) => `[SUCCESS] Fast analysis concluded: ${total} files in ${duracao}`,
    tecnicaGlobalSucesso: (nome) => `Global technique "${nome}"`,
    tecnicaGlobalErro: (nome, erro) => `[ERROR] Error in global technique '${nome}': ${erro}`,
    tecnicaGlobalTimeout: (nome) => `[TIMEOUT] Global analyst '${nome}' exceeded time limit`,
    tecnicaGlobalTimeoutOcorrencia: (nome, timeout) => `Timeout in global technique '${nome}': ${timeout}ms exceeded`,
    tecnicaGlobalErroOcorrencia: (nome, erro) => `Failure in global technique '${nome}': ${erro}`,
    tecnicaLocalErro: (nome, arquivo, erro) => `[ERROR] Error in '${nome}' for ${arquivo}: ${erro}`,
    tecnicaLocalTimeoutOcorrencia: (nome, arquivo, timeout) => `Timeout in technique '${nome}' for ${arquivo}: ${timeout}ms exceeded`,
    tecnicaLocalErroOcorrencia: (nome, arquivo, erro) => `Failure in technique '${nome}' for ${arquivo}: ${erro}`,
    stackTrace: 'Stack trace:',
    arquivosAnalisadosProgress: (atual, total) => `Files analyzed: ${atual}/${total}`,
    arquivosAnalisadosTotal: (total) => `Files analyzed: ${total}`,
    arquivoProcessando: (atual, total, path) => `File ${atual}/${total}: ${path}`,
    falhaPersistirMetricas: (erro) => `Failed to persist metrics history: ${erro}`
});
export const MENSAGENS_CORRECOES = {
    fixTypes: MENSAGENS_CORRECAO_TIPOS,
    autofix: MENSAGENS_AUTOFIX,
    relatorios: MENSAGENS_RELATORIOS_ANALISE,
    arquetipos: MENSAGENS_ARQUETIPOS_HANDLER,
    plugins: MENSAGENS_PLUGINS,
    executor: MENSAGENS_EXECUTOR
};
export default MENSAGENS_CORRECOES;
//# sourceMappingURL=correcoes-messages.js.map