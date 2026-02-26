import { createI18nMessages, i18n } from '../../../shared/helpers/i18n.js';
import { ICONES_ACAO, ICONES_ARQUIVO, ICONES_COMANDO, ICONES_DIAGNOSTICO, ICONES_FEEDBACK, ICONES_RELATORIO, ICONES_STATUS, ICONES_TIPOS } from '../ui/icons.js';
export const CATEGORIAS_TIPOS = createI18nMessages({
    LEGITIMO: {
        icone: ICONES_TIPOS.legitimo,
        nome: 'LEGÍTIMO',
        descricao: 'Uso correto de unknown - nenhuma ação necessária',
        confidenciaMin: 100
    },
    MELHORAVEL: {
        icone: ICONES_TIPOS.melhoravel,
        nome: 'MELHORÁVEL',
        descricao: 'Pode ser mais específico - revisão manual recomendada',
        confidenciaMin: 70
    },
    CORRIGIR: {
        icone: ICONES_TIPOS.corrigir,
        nome: 'CORRIGIR',
        descricao: 'Deve ser substituído - correção automática possível',
        confidenciaMin: 95
    }
}, {
    LEGITIMO: {
        icone: ICONES_TIPOS.legitimo,
        nome: 'LEGITIMATE',
        descricao: 'Correct use of unknown - no action needed',
        confidenciaMin: 100
    },
    MELHORAVEL: {
        icone: ICONES_TIPOS.melhoravel,
        nome: 'IMPROVABLE',
        descricao: 'Can be more specific - manual review recommended',
        confidenciaMin: 70
    },
    CORRIGIR: {
        icone: ICONES_TIPOS.corrigir,
        nome: 'FIX',
        descricao: 'Should be replaced - automatic correction possible',
        confidenciaMin: 95
    }
});
export const MENSAGENS_INICIO = createI18nMessages({
    titulo: `${ICONES_COMANDO.fixTypes} Iniciando análise de tipos inseguros...`,
    analisando: (target) => `${ICONES_ARQUIVO.diretorio} Analisando: ${target}`,
    confianciaMin: (min) => `${ICONES_DIAGNOSTICO.stats} Confiança mínima: ${min}%`,
    modo: (dryRun) => `${dryRun ? ICONES_ACAO.analise : ICONES_ACAO.correcao} Modo: ${dryRun ? 'Análise (dry-run)' : 'Aplicar correções'}`
}, {
    titulo: `${ICONES_COMANDO.fixTypes} Starting unsafe types analysis...`,
    analisando: (target) => `${ICONES_ARQUIVO.diretorio} Analyzing: ${target}`,
    confianciaMin: (min) => `${ICONES_DIAGNOSTICO.stats} Minimum confidence: ${min}%`,
    modo: (dryRun) => `${dryRun ? ICONES_ACAO.analise : ICONES_ACAO.correcao} Mode: ${dryRun ? 'Analysis (dry-run)' : 'Apply corrections'}`
});
export const MENSAGENS_PROGRESSO = createI18nMessages({
    processandoArquivos: (count) => `${ICONES_ARQUIVO.diretorio} Processando ${count} arquivos...`,
    arquivoAtual: (arquivo, count) => `${ICONES_ARQUIVO.arquivo} ${arquivo}: ${count} ocorrência${count !== 1 ? 's' : ''}`
}, {
    processandoArquivos: (count) => `${ICONES_ARQUIVO.diretorio} Processing ${count} files...`,
    arquivoAtual: (arquivo, count) => `${ICONES_ARQUIVO.arquivo} ${arquivo}: ${count} occurrence${count !== 1 ? 's' : ''}`
});
export const MENSAGENS_RESUMO = createI18nMessages({
    encontrados: (count) => `Encontrados ${count} tipos inseguros:`,
    tituloCategorizacao: `${ICONES_DIAGNOSTICO.stats} Análise de Categorização:`,
    confianciaMedia: (media) => `${ICONES_DIAGNOSTICO.stats} Confiança média: ${media}%`,
    porcentagem: (count, total) => {
        const pct = total > 0 ? Math.round(count / total * 100) : 0;
        return `${count} caso${count !== 1 ? 's' : ''} (${pct}%)`;
    }
}, {
    encontrados: (count) => `Found ${count} unsafe types:`,
    tituloCategorizacao: `${ICONES_DIAGNOSTICO.stats} Categorization Analysis:`,
    confianciaMedia: (media) => `${ICONES_DIAGNOSTICO.stats} Average confidence: ${media}%`,
    porcentagem: (count, total) => {
        const pct = total > 0 ? Math.round(count / total * 100) : 0;
        return `${count} case${count !== 1 ? 's' : ''} (${pct}%)`;
    }
});
export const DICAS = createI18nMessages({
    removerDryRun: '[DICA] Para aplicar correções, remova a flag --dry-run',
    usarInterativo: '[DICA] Use --interactive para confirmar cada correção',
    ajustarConfianca: (atual) => `${ICONES_FEEDBACK.dica} Use --confidence <num> para ajustar o limiar (atual: ${atual}%)`,
    revisar: (categoria) => `${ICONES_FEEDBACK.dica} Revise os casos ${categoria} manualmente`
}, {
    removerDryRun: '[TIP] To apply fixes, remove the --dry-run flag',
    usarInterativo: '[TIP] Use --interactive to confirm each correction',
    ajustarConfianca: (atual) => `${ICONES_FEEDBACK.dica} Use --confidence <num> to adjust threshold (current: ${atual}%)`,
    revisar: (categoria) => `${ICONES_FEEDBACK.dica} Review ${categoria} cases manually`
});
export const ACOES_SUGERIDAS = createI18nMessages({
    LEGITIMO: ['Estes casos estão corretos e devem ser mantidos como estão', 'Não requerem nenhuma ação adicional'],
    MELHORAVEL: ['Considere substituir por tipos mais específicos quando possível', 'Revisar durante refatorações futuras', 'Adicionar comentários explicando o uso de unknown'],
    CORRIGIR: ['Priorize a correção destes casos', 'Substituir por tipos TypeScript específicos', 'Usar type guards quando necessário']
}, {
    LEGITIMO: ['These cases are correct and should be kept as they are', 'No further action required'],
    MELHORAVEL: ['Consider replacing with more specific types when possible', 'Review during future refactorings', 'Add comments explaining the use of unknown'],
    CORRIGIR: ['Priorize the correction of these cases', 'Replace with specific TypeScript types', 'Use type guards when necessary']
});
export const MENSAGENS_ERRO = createI18nMessages({
    correcaoNaoImplementada: 'Correção automática completa ainda não implementada',
    sistemaDesenvolvimento: `${ICONES_FEEDBACK.foguete} Sistema de correção automática avançada em desenvolvimento`,
    requisitoAnalise: 'Requer análise de AST e inferência de tipos para ser seguro',
    detectorNaoEncontrado: 'Detector de tipos inseguros não encontrado no registro de analistas',
    modulosNaoEncontrados: 'Módulos de correção não encontrados'
}, {
    correcaoNaoImplementada: 'Full automatic correction not yet implemented',
    sistemaDesenvolvimento: `${ICONES_FEEDBACK.foguete} Advanced automatic correction system under development`,
    requisitoAnalise: 'Requires AST analysis and type inference to be safe',
    detectorNaoEncontrado: 'Unsafe types detector not found in analyst registry',
    modulosNaoEncontrados: 'Correction modules not found'
});
export const MENSAGENS_SUCESSO = createI18nMessages({
    nenhumTipoInseguro: `${ICONES_STATUS.ok} Nenhum tipo inseguro detectado! Código está com boa type safety.`,
    nenhumAltaConfianca: `${ICONES_STATUS.ok} Nenhuma correção de alta confiança encontrada`,
    nenhumaCorrecao: 'Nenhuma correção aplicada (use --confidence para ajustar limiar)'
}, {
    nenhumTipoInseguro: `${ICONES_STATUS.ok} No unsafe types detected! Code has good type safety.`,
    nenhumAltaConfianca: `${ICONES_STATUS.ok} No high-confidence corrections found`,
    nenhumaCorrecao: 'No corrections applied (use --confidence to adjust threshold)'
});
export const MENSAGENS_CLI_CORRECAO_TIPOS = createI18nMessages({
    linhaEmBranco: '',
    erroExecutar: (mensagem) => `Erro ao executar fix-types: ${mensagem}`,
    linhaResumoTipo: (texto) => `  ${texto}`,
    exemplosDryRunTitulo: `${ICONES_RELATORIO.lista} Exemplos encontrados (dry-run):`,
    exemploLinha: (icone, relPath, linha) => `  ${icone} ${relPath}:${linha}`,
    exemploMensagem: (mensagem) => `     └─ ${mensagem}`,
    debugVariavel: (nome) => `     └─ Variável: ${nome}`,
    maisOcorrencias: (qtd) => `  ... e mais ${qtd} ocorrências`,
    aplicandoCorrecoesAuto: `${ICONES_ACAO.correcao} Aplicando correções automáticas...`,
    exportandoRelatorios: `${ICONES_ACAO.export} Exportando relatórios...`,
    verboseAnyDetectado: (arquivo, linha) => `  ${ICONES_TIPOS.any} ${arquivo}:${linha} - any detectado (correção recomendada)`,
    verboseAsAnyCritico: (arquivo, linha) => `  ${ICONES_TIPOS.corrigir} ${arquivo}:${linha} - "as any" detectado (CRÍTICO - correção obrigatória)`,
    verboseAngleAnyCritico: (arquivo, linha) => `  ${ICONES_TIPOS.corrigir} ${arquivo}:${linha} - "<any>" detectado (CRÍTICO - sintaxe legada)`,
    verboseUnknownCategoria: (icone, arquivo, linha, categoria, confianca) => `  ${icone} ${arquivo}:${linha} - ${categoria} (${confianca}%)`,
    verboseMotivo: (motivo) => `     └─ ${motivo}`,
    verboseSugestao: (sugestao) => `     └─ ${ICONES_FEEDBACK.dica} ${sugestao}`,
    verboseVariantesTitulo: `     └─ ${ICONES_DIAGNOSTICO.stats} Possibilidades alternativas:`,
    verboseVarianteItem: (idxBase1, variante) => `        ${idxBase1}. ${variante}`,
    analiseDetalhadaSalva: `${ICONES_ARQUIVO.arquivo} Análise detalhada salva em: .prometheus/fix-types-analise.json`,
    altaConfiancaTitulo: (qtd) => `${ICONES_DIAGNOSTICO.stats} ${qtd} correções de alta confiança (≥85%):`,
    altaConfiancaLinha: (relPath, linha, confianca) => `  ${ICONES_TIPOS.corrigir} ${relPath}:${linha} (${confianca}%)`,
    altaConfiancaDetalhe: (texto) => `     └─ ${texto}`,
    altaConfiancaMais: (qtd) => `  ... e mais ${qtd} correções`,
    incertosTitulo: (qtd) => `${ICONES_FEEDBACK.pergunta} ${qtd} casos com análise incerta (<70% confiança):`,
    incertosIntro: '   Estes casos requerem revisão manual cuidadosa - múltiplas possibilidades detectadas',
    incertosLinha: (relPath, linha, confianca) => `  ${ICONES_TIPOS.melhoravel} ${relPath}:${linha} (${confianca}%)`,
    incertosMais: (qtd) => `  ... e mais ${qtd} casos incertos (veja .prometheus/fix-types-analise.json)`,
    correcoesResumoSucesso: (qtd) => `${ICONES_STATUS.ok} ${qtd} arquivo(s) corrigido(s)`,
    correcoesResumoLinhaOk: (arquivo, linhas) => `   Logging  ${arquivo}: ${linhas} linha(s) modificada(s)`,
    correcoesResumoLinhaErro: (arquivo, erro) => `   ${ICONES_STATUS.falha} ${arquivo}: ${erro}`,
    correcoesResumoFalhas: (qtd) => `${ICONES_STATUS.falha} ${qtd} arquivo(s) com erro`,
    dryRunAviso: (iconeInicio) => `${iconeInicio} Modo dry-run ativo - nenhuma alteração será feita`,
    templatePasso: (passo) => `  ${passo}`
}, {
    linhaEmBranco: '',
    erroExecutar: (mensagem) => `Error executing fix-types: ${mensagem}`,
    linhaResumoTipo: (texto) => `  ${texto}`,
    exemplosDryRunTitulo: `${ICONES_RELATORIO.lista} Examples found (dry-run):`,
    exemploLinha: (icone, relPath, linha) => `  ${icone} ${relPath}:${linha}`,
    exemploMensagem: (mensagem) => `     └─ ${mensagem}`,
    debugVariavel: (nome) => `     └─ Variable: ${nome}`,
    maisOcorrencias: (qtd) => `  ... and ${qtd} more occurrences`,
    aplicandoCorrecoesAuto: `${ICONES_ACAO.correcao} Applying automatic corrections...`,
    exportandoRelatorios: `${ICONES_ACAO.export} Exporting reports...`,
    verboseAnyDetectado: (arquivo, linha) => `  ${ICONES_TIPOS.any} ${arquivo}:${linha} - any detected (correction recommended)`,
    verboseAsAnyCritico: (arquivo, linha) => `  ${ICONES_TIPOS.corrigir} ${arquivo}:${linha} - "as any" detected (CRITICAL - mandatory correction)`,
    verboseAngleAnyCritico: (arquivo, linha) => `  ${ICONES_TIPOS.corrigir} ${arquivo}:${linha} - "<any>" detected (CRITICAL - legacy syntax)`,
    verboseUnknownCategoria: (icone, arquivo, linha, categoria, confianca) => `  ${icone} ${arquivo}:${linha} - ${categoria} (${confianca}%)`,
    verboseMotivo: (motivo) => `     └─ ${motivo}`,
    verboseSugestao: (sugestao) => `     └─ ${ICONES_FEEDBACK.dica} ${sugestao}`,
    verboseVariantesTitulo: `     └─ ${ICONES_DIAGNOSTICO.stats} Alternative possibilities:`,
    verboseVarianteItem: (idxBase1, variante) => `        ${idxBase1}. ${variante}`,
    analiseDetalhadaSalva: `${ICONES_ARQUIVO.arquivo} Detailed analysis saved in: .prometheus/fix-types-analise.json`,
    altaConfiancaTitulo: (qtd) => `${ICONES_DIAGNOSTICO.stats} ${qtd} high-confidence corrections (≥85%):`,
    altaConfiancaLinha: (relPath, linha, confianca) => `  ${ICONES_TIPOS.corrigir} ${relPath}:${linha} (${confianca}%)`,
    altaConfiancaDetalhe: (texto) => `     └─ ${texto}`,
    altaConfiancaMais: (qtd) => `  ... and ${qtd} more corrections`,
    incertosTitulo: (qtd) => `${ICONES_FEEDBACK.pergunta} ${qtd} cases with uncertain analysis (<70% confidence):`,
    incertosIntro: '   These cases require careful manual review - multiple possibilities detected',
    incertosLinha: (relPath, linha, confianca) => `  ${ICONES_TIPOS.melhoravel} ${relPath}:${linha} (${confianca}%)`,
    incertosMais: (qtd) => `  ... and ${qtd} more uncertain cases (see .prometheus/fix-types-analise.json)`,
    correcoesResumoSucesso: (qtd) => `${ICONES_STATUS.ok} ${qtd} file(s) fixed`,
    correcoesResumoLinhaOk: (arquivo, linhas) => `   Logging  ${arquivo}: ${linhas} line(s) modified`,
    correcoesResumoLinhaErro: (arquivo, erro) => `   ${ICONES_STATUS.falha} ${arquivo}: ${erro}`,
    correcoesResumoFalhas: (qtd) => `${ICONES_STATUS.falha} ${qtd} file(s) with error`,
    dryRunAviso: (iconeInicio) => `${iconeInicio} Dry-run mode active - no changes will be made`,
    templatePasso: (passo) => `  ${passo}`
});
export const TEXTOS_CATEGORIZACAO_CORRECAO_TIPOS = createI18nMessages({
    anyMotivo: 'any é inseguro - substituir por tipo específico',
    anySugestao: 'Analisar uso da variável para inferir tipo correto',
    asAnyMotivo: 'Type assertion "as any" desabilita completamente type safety',
    asAnySugestao: 'CRÍTICO: Substituir por tipo específico ou usar unknown com validação runtime',
    angleAnyMotivo: 'Type casting legado <any> desabilita type safety',
    angleAnySugestao: 'CRÍTICO: Migrar para sintaxe "as" moderna e usar tipo específico',
    semContextoMotivo: 'Não foi possível analisar contexto',
    semContextoSugestao: 'Revisar manualmente'
}, {
    anyMotivo: 'any is unsafe - replace with specific type',
    anySugestao: 'Analyze variable usage to infer correct type',
    asAnyMotivo: 'Type assertion "as any" completely disables type safety',
    asAnySugestao: 'CRITICAL: Replace with specific type or use unknown with runtime validation',
    angleAnyMotivo: 'Legacy type casting <any> disables type safety',
    angleAnySugestao: 'CRITICAL: Migrate to modern "as" syntax and use specific type',
    semContextoMotivo: 'Could not analyze context',
    semContextoSugestao: 'Review manually'
});
export const TEMPLATE_RESUMO_FINAL = createI18nMessages({
    titulo: `${ICONES_RELATORIO.detalhado} Para aplicar correções manualmente:`,
    passos: ['Revise os casos categorizados acima', `LEGÍTIMOS (${ICONES_TIPOS.legitimo}): Manter como estão`, `MELHORÁVEIS (${ICONES_TIPOS.melhoravel}): Considere tipos mais específicos`, `CORRIGIR (${ICONES_TIPOS.corrigir}): Substitua por tipos específicos`, 'Execute `npm run lint` após as correções']
}, {
    titulo: `${ICONES_RELATORIO.detalhado} To apply corrections manually:`,
    passos: ['Review the cases categorized above', `LEGITIMATE (${ICONES_TIPOS.legitimo}): Keep as they are`, `IMPROVABLE (${ICONES_TIPOS.melhoravel}): Consider more specific types`, `FIX (${ICONES_TIPOS.corrigir}): Replace with specific types`, 'Run `npm run lint` after corrections']
});
export const ICONES = {
    inicio: ICONES_COMANDO.fixTypes,
    aplicando: '[>]',
    analise: '[>]',
    pasta: '[DIR]',
    arquivo: '[FILE]',
    alvo: '[>]',
    edicao: '[EDIT]',
    grafico: '[GRAPH]',
    lampada: '[DICA]',
    foguete: '[>>]',
    nota: '[NOTE]',
    checkbox: '[OK]',
    setinha: '└─',
    ...CATEGORIAS_TIPOS
};
export function formatarTipoInseguro(tipo, count) {
    const icone = tipo.includes('any') ? ICONES_TIPOS.any : ICONES_TIPOS.unknown;
    const pluralMsg = i18n({ 'pt-BR': 'ocorrência', en: 'occurrence' });
    const s = count !== 1 ? 's' : '';
    return `${icone} ${tipo}: ${count} ${pluralMsg}${s}`;
}
export function formatarOcorrencia(relPath, linha) {
    return `  ${ICONES.setinha} ${relPath}:${linha || '?'}`;
}
export function formatarComContexto(mensagem, indentLevel = 1) {
    const indent = '  '.repeat(indentLevel);
    return `${indent}${ICONES.setinha} ${mensagem}`;
}
export function formatarSugestao(sugestao) {
    return `     ${ICONES.setinha} ${ICONES.lampada} ${sugestao}`;
}
export function gerarResumoCategoria(categoria, count, total) {
    const config = CATEGORIAS_TIPOS[categoria];
    const porcentagem = MENSAGENS_RESUMO.porcentagem(count, total);
    return [`${config.icone} ${config.nome}: ${porcentagem}`, `   ${ICONES.setinha} ${config.descricao}`];
}
export const DEPURACAO = {
    categorizacao: (arquivo, tipo, categoria) => `[DEBUG] ${arquivo} - ${tipo} → ${categoria}`,
    confianca: (tipo, valor) => `[DEBUG] Confiança para ${tipo}: ${valor}%`
};
//# sourceMappingURL=fix-types-messages.js.map