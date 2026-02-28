import { createI18nMessages } from '../../../shared/helpers/i18n.js';
import { ICONES_ACAO, ICONES_RELATORIO } from '../ui/icons.js';
export const CliExportersMensagens = createI18nMessages({
    poda: {
        relatoriosExportados: (dir) => `Relatórios de poda exportados para: ${dir}`,
        falhaExportar: (erroMensagem) => `Falha ao exportar relatórios de poda: ${erroMensagem}`
    },
    guardian: {
        relatoriosExportadosTitulo: `${ICONES_ACAO.export} ${ICONES_RELATORIO.detalhado} Relatórios Guardian exportados:`,
        caminhoMarkdown: (caminhoMd) => `   Markdown: ${caminhoMd}`,
        caminhoJson: (caminhoJson) => `   JSON: ${caminhoJson}`,
        falhaExportar: (erroMensagem) => `Falha ao exportar relatórios Guardian: ${erroMensagem}`,
        markdown: {
            titulo: '# Relatório Guardian - Verificação de Integridade',
            geradoEm: (ts) => `**Gerado em:** ${ts}`,
            comando: '**Comando:** `prometheus guardian`',
            statusTitulo: (icone, status) => `## ${icone} Status: ${status}`,
            baselineTitulo: '## [INFO] Baseline',
            driftTitulo: '## [ATENCAO] Drift Detectado',
            deltaConfianca: (n) => `- **Delta de confiança:** ${n}%`,
            arquetipoAlterado: (simOuNao) => `- **Arquétipo alterado:** ${simOuNao}`,
            arquivosNovos: '### Arquivos Novos',
            arquivosRemovidos: '### Arquivos Removidos',
            errosTitulo: '## [ERRO] Erros',
            avisosTitulo: '## [AVISO] Avisos',
            recomendacoesTitulo: '## [INFO] Recomendações',
            recomendacaoOk: '- [SUCESSO] Projeto está íntegro - nenhuma ação necessária',
            recomendacaoErro: '- [ERRO] Resolver erros críticos antes de prosseguir',
            recomendacaoErroRevise: '- [INFO] Revisar arquivos listados acima',
            recomendacaoDrift: '- [AVISO] Drift de arquétipo detectado - revisar mudanças',
            recomendacaoDriftInfo: '- [INFO] Considerar atualizar baseline se mudanças forem intencionais'
        }
    },
    fixTypes: {
        relatoriosExportadosTitulo: `${ICONES_ACAO.export} ${ICONES_RELATORIO.detalhado} Relatórios de fix-types exportados:`,
        caminhoMarkdown: (caminhoMd) => `   Markdown: ${caminhoMd}`,
        caminhoJson: (caminhoJson) => `   JSON: ${caminhoJson}`,
        falhaExportar: (erroMensagem) => `Falha ao exportar relatórios de fix-types: ${erroMensagem}`,
        markdown: {
            titulo: '# Relatório de Análise de Tipos Inseguros',
            geradoEm: (ts) => `**Gerado em:** ${ts}`,
            comando: '**Comando:** `prometheus fix-types`',
            confiancaMin: (min) => `**Confiança Mínima:** ${min}%`,
            resumoExecutivo: '## [RESUMO] Resumo Executivo',
            totalCasos: (n) => `- **Total de Casos:** ${n}`,
            confiancaMedia: (n) => `- **Confiança Média:** ${n}%`,
            distribuicaoTitulo: '### Distribuição por Categoria',
            distribuicaoLegitimo: (total, pct) => `| [SUCESSO] LEGÍTIMO | ${total} | ${pct}% | Uso correto - nenhuma ação necessária |`,
            distribuicaoMelhoravel: (total, pct) => `| [AVISO] MELHORÁVEL | ${total} | ${pct}% | Pode ser mais específico - revisão manual recomendada |`,
            distribuicaoCorrigir: (total, pct) => `| [ERRO] CORRIGIR | ${total} | ${pct}% | Deve ser substituído - correção necessária |`,
            distribuicaoTabelaHeader: '| Categoria | Total | Percentual | Descrição |',
            distribuicaoTabelaDivider: '|-----------|-------|------------|-----------|',
            altaPrioridadeTitulo: '## [ERRO] Correções de Alta Prioridade (≥85% confiança)',
            altaPrioridadeItem: (idx, arquivo, linha, conf) => `### ${idx}. ${arquivo}:${linha} (${conf}%)`,
            incertosTitulo: '## [AVISO] Casos com Análise Incerta (<70% confiança)',
            incertosIntro: '*Estes casos requerem revisão manual cuidadosa - múltiplas possibilidades detectadas*',
            incertosItem: (idx, arquivo, linha, conf) => `### ${idx}. ${arquivo}:${linha} (${conf}%)`,
            listaCompletaTitulo: '## [INFO] Lista Completa de Casos',
            listaCompletaCategoria: (prefixo, titulo, qtd) => `### ${prefixo} ${titulo} (${qtd} casos)`,
            listaCompletaItem: (arquivo, linha, conf) => `- **${arquivo}:${linha}** (${conf}%)`
        }
    },
    reestruturacao: {
        relatoriosExportados: (modoPrefixo, dir) => `Relatórios de reestruturação ${modoPrefixo}exportados para: ${dir}`,
        falhaExportar: (modoPrefixo, erroMensagem) => `Falha ao exportar relatórios ${modoPrefixo}de reestruturação: ${erroMensagem}`
    }
}, {
    poda: {
        relatoriosExportados: (dir) => `Pruning reports exported to: ${dir}`,
        falhaExportar: (erroMensagem) => `Failed to export pruning reports: ${erroMensagem}`
    },
    guardian: {
        relatoriosExportadosTitulo: `${ICONES_ACAO.export} ${ICONES_RELATORIO.detalhado} Guardian reports exported:`,
        caminhoMarkdown: (caminhoMd) => `   Markdown: ${caminhoMd}`,
        caminhoJson: (caminhoJson) => `   JSON: ${caminhoJson}`,
        falhaExportar: (erroMensagem) => `Failed to export Guardian reports: ${erroMensagem}`,
        markdown: {
            titulo: '# Guardian Report - Integrity Verification',
            geradoEm: (ts) => `**Generated at:** ${ts}`,
            comando: '**Command:** `prometheus guardian`',
            statusTitulo: (icone, status) => `## ${icone} Status: ${status}`,
            baselineTitulo: '## [INFO] Baseline',
            driftTitulo: '## [ATTENTION] Drift Detected',
            deltaConfianca: (n) => `- **Confidence delta:** ${n}%`,
            arquetipoAlterado: (simOuNao) => `- **Archetype changed:** ${simOuNao}`,
            arquivosNovos: '### New Files',
            arquivosRemovidos: '### Removed Files',
            errosTitulo: '## [ERROR] Errors',
            avisosTitulo: '## [WARNING] Warnings',
            recomendacoesTitulo: '## [INFO] Recommendations',
            recomendacaoOk: '- [SUCCESS] Project is healthy - no action needed',
            recomendacaoErro: '- [ERROR] Resolve critical errors before proceeding',
            recomendacaoErroRevise: '- [INFO] Review files listed above',
            recomendacaoDrift: '- [WARNING] Archetype drift detected - review changes',
            recomendacaoDriftInfo: '- [INFO] Consider updating baseline if changes are intentional'
        }
    },
    fixTypes: {
        relatoriosExportadosTitulo: `${ICONES_ACAO.export} ${ICONES_RELATORIO.detalhado} fix-types reports exported:`,
        caminhoMarkdown: (caminhoMd) => `   Markdown: ${caminhoMd}`,
        caminhoJson: (caminhoJson) => `   JSON: ${caminhoJson}`,
        falhaExportar: (erroMensagem) => `Failed to export fix-types reports: ${erroMensagem}`,
        markdown: {
            titulo: '# Unsafe Types Analysis Report',
            geradoEm: (ts) => `**Generated at:** ${ts}`,
            comando: '**Command:** `prometheus fix-types`',
            confiancaMin: (min) => `**Minimum Confidence:** ${min}%`,
            resumoExecutivo: '## [SUMMARY] Executive Summary',
            totalCasos: (n) => `- **Total Cases:** ${n}`,
            confiancaMedia: (n) => `- **Average Confidence:** ${n}%`,
            distribuicaoTitulo: '### Distribution by Category',
            distribuicaoTabelaHeader: '| Category | Total | Percentage | Description |',
            distribuicaoTabelaDivider: '|-----------|-------|------------|-----------|',
            distribuicaoLegitimo: (total, pct) => `| [SUCCESS] LEGITIMATE | ${total} | ${pct}% | Correct usage - no action needed |`,
            distribuicaoMelhoravel: (total, pct) => `| [WARNING] IMPROVABLE | ${total} | ${pct}% | Can be more specific - manual review recommended |`,
            distribuicaoCorrigir: (total, pct) => `| [ERROR] FIX | ${total} | ${pct}% | Must be replaced - fix required |`,
            altaPrioridadeTitulo: '## [ERROR] High Priority Fixes (≥85% confidence)',
            altaPrioridadeItem: (idx, arquivo, linha, conf) => `### ${idx}. ${arquivo}:${linha} (${conf}%)`,
            incertosTitulo: '## [WARNING] Cases with Uncertain Analysis (<70% confidence)',
            incertosIntro: '*These cases require careful manual review - multiple possibilities detected*',
            incertosItem: (idx, arquivo, linha, conf) => `### ${idx}. ${arquivo}:${linha} (${conf}%)`,
            listaCompletaTitulo: '## [INFO] Full Case List',
            listaCompletaCategoria: (prefixo, titulo, qtd) => `### ${prefixo} ${titulo} (${qtd} cases)`,
            listaCompletaItem: (arquivo, linha, conf) => `- **${arquivo}:${linha}** (${conf}%)`
        }
    },
    reestruturacao: {
        relatoriosExportados: (modoPrefixo, dir) => `Restructuring reports ${modoPrefixo}exported to: ${dir}`,
        falhaExportar: (modoPrefixo, erroMensagem) => `Failed to export ${modoPrefixo}restructuring reports: ${erroMensagem}`
    }
});
//# sourceMappingURL=cli-exporters-messages.js.map