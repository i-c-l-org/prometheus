import { createI18nMessages, i18n } from '../../../shared/helpers/i18n.js';
import { ICONES_ACAO, ICONES_STATUS, ICONES_ZELADOR as ICONES_ZELADOR_CENTRAL } from '../ui/icons.js';
export const ICONES_ZELADOR = {
    ...ICONES_ZELADOR_CENTRAL
};
export const MENSAGENS_IMPORTS = createI18nMessages({
    titulo: `${ICONES_ACAO.correcao} Zelador de Imports - Iniciando correções...`,
    resumo: `${ICONES_ZELADOR.resumo} Resumo:`,
    dryRunAviso: `${ICONES_ZELADOR.dryRun} Modo dry-run: nenhum arquivo foi modificado`,
    sucessoFinal: `${ICONES_STATUS.ok} Correções aplicadas com sucesso!`
}, {
    titulo: `${ICONES_ACAO.correcao} Import Janitor - Starting corrections...`,
    resumo: `${ICONES_ZELADOR.resumo} Summary:`,
    dryRunAviso: `${ICONES_ZELADOR.dryRun} Dry-run mode: no files were modified`,
    sucessoFinal: `${ICONES_STATUS.ok} Corrections applied successfully!`
});
export const PROGRESSO_IMPORTS = createI18nMessages({
    diretorioNaoEncontrado: (dir) => `${ICONES_ZELADOR.aviso} Diretório não encontrado: ${dir}`,
    arquivoProcessado: (arquivo, count) => `${ICONES_ZELADOR.sucesso} ${arquivo} (${count} correção${count !== 1 ? 'ões' : ''})`,
    arquivoErro: (arquivo, erro) => `${ICONES_ZELADOR.erro} ${arquivo}: ${erro}`,
    lendoDiretorio: (dir) => `Lendo diretório: ${dir}`
}, {
    diretorioNaoEncontrado: (dir) => `${ICONES_ZELADOR.aviso} Directory not found: ${dir}`,
    arquivoProcessado: (arquivo, count) => `${ICONES_ZELADOR.sucesso} ${arquivo} (${count} correction${count !== 1 ? 's' : ''})`,
    arquivoErro: (arquivo, erro) => `${ICONES_ZELADOR.erro} ${arquivo}: ${erro}`,
    lendoDiretorio: (dir) => `Reading directory: ${dir}`
});
export const ERROS_IMPORTS = createI18nMessages({
    lerDiretorio: (dir, error) => {
        const mensagem = error instanceof Error ? error.message : String(error);
        return `Erro ao ler diretório ${dir}: ${mensagem}`;
    },
    processar: (arquivo, error) => {
        const mensagem = error instanceof Error ? error.message : String(error);
        return `Erro ao processar ${arquivo}: ${mensagem}`;
    }
}, {
    lerDiretorio: (dir, error) => {
        const mensagem = error instanceof Error ? error.message : String(error);
        return `Error reading directory ${dir}: ${mensagem}`;
    },
    processar: (arquivo, error) => {
        const mensagem = error instanceof Error ? error.message : String(error);
        return `Error processing ${arquivo}: ${mensagem}`;
    }
});
export function formatarEstatistica(label, valor, icone) {
    const prefixo = icone ? `${icone} ` : '   ';
    return `${prefixo}${label}: ${valor}`;
}
export function gerarResumoImports(stats) {
    const labels = {
        processed: i18n({ 'pt-BR': 'Arquivos processados', en: 'Processed files' }),
        modified: i18n({ 'pt-BR': 'Arquivos modificados', en: 'Modified files' }),
        total: i18n({ 'pt-BR': 'Total de correções', en: 'Total corrections' }),
        errors: i18n({ 'pt-BR': 'Erros', en: 'Errors' })
    };
    const linhas = ['', MENSAGENS_IMPORTS.resumo, formatarEstatistica(labels.processed, stats.processados), formatarEstatistica(labels.modified, stats.modificados), formatarEstatistica(labels.total, stats.totalCorrecoes)];
    if (stats.erros > 0) {
        linhas.push(formatarEstatistica(labels.errors, stats.erros, ICONES_ZELADOR.aviso));
    }
    linhas.push('');
    if (stats.dryRun) {
        linhas.push(MENSAGENS_IMPORTS.dryRunAviso);
    }
    else {
        linhas.push(MENSAGENS_IMPORTS.sucessoFinal);
    }
    return linhas;
}
export const MENSAGENS_TIPOS = createI18nMessages({
    titulo: `${ICONES_ACAO.correcao} Zelador de Tipos - Iniciando correções...`,
    analisandoTipo: (tipo) => `Analisando tipo: ${tipo}`,
    tipoCorrigido: (antes, depois) => `Corrigido: ${antes} → ${depois}`
}, {
    titulo: `${ICONES_ACAO.correcao} Type Janitor - Starting corrections...`,
    analisandoTipo: (tipo) => `Analyzing type: ${tipo}`,
    tipoCorrigido: (antes, depois) => `Fixed: ${antes} → ${depois}`
});
export const MENSAGENS_ESTRUTURA = createI18nMessages({
    titulo: `${ICONES_ACAO.organizacao} Zelador de Estrutura - Reorganizando arquivos...`,
    movendo: (origem, destino) => `Movendo: ${origem} → ${destino}`,
    criandoDiretorio: (dir) => `Criando diretório: ${dir}`
}, {
    titulo: `${ICONES_ACAO.organizacao} Structure Janitor - Reorganizing files...`,
    movendo: (origem, destino) => `Moving: ${origem} → ${destino}`,
    criandoDiretorio: (dir) => `Creating directory: ${dir}`
});
export const MENSAGENS_ZELADOR_GERAL = createI18nMessages({
    iniciando: (zelador) => `${ICONES_ZELADOR.inicio} ${zelador} - Iniciando...`,
    concluido: (zelador) => `${ICONES_ZELADOR.sucesso} ${zelador} - Concluído!`,
    erro: (zelador, mensagem) => `${ICONES_ZELADOR.erro} ${zelador} - Erro: ${mensagem}`
}, {
    iniciando: (zelador) => `${ICONES_ZELADOR.inicio} ${zelador} - Starting...`,
    concluido: (zelador) => `${ICONES_ZELADOR.sucesso} ${zelador} - Completed!`,
    erro: (zelador, mensagem) => `${ICONES_ZELADOR.erro} ${zelador} - Error: ${mensagem}`
});
export const MODELOS_SAIDA = createI18nMessages({
    compacto: {
        inicio: (nome) => `${ICONES_ZELADOR.inicio} ${nome}`,
        progresso: (atual, total) => `[${atual}/${total}]`,
        fim: (sucesso) => sucesso ? ICONES_ZELADOR.sucesso : ICONES_ZELADOR.erro
    },
    detalhado: {
        inicio: (nome, descricao) => `${ICONES_ZELADOR.inicio} ${nome}\n   ${descricao}`,
        progresso: (arquivo, atual, total) => `   [${atual}/${total}] ${arquivo}`,
        fim: (stats) => `\n${ICONES_ZELADOR.resumo} Sucesso: ${stats.sucesso}, Falha: ${stats.falha}`
    }
}, {
    compacto: {
        inicio: (nome) => `${ICONES_ZELADOR.inicio} ${nome}`,
        progresso: (atual, total) => `[${atual}/${total}]`,
        fim: (sucesso) => sucesso ? ICONES_ZELADOR.sucesso : ICONES_ZELADOR.erro
    },
    detalhado: {
        inicio: (nome, descricao) => `${ICONES_ZELADOR.inicio} ${nome}\n   ${descricao}`,
        progresso: (arquivo, atual, total) => `   [${atual}/${total}] ${arquivo}`,
        fim: (stats) => `\n${ICONES_ZELADOR.resumo} Success: ${stats.sucesso}, Failure: ${stats.falha}`
    }
});
export const SAIDA_CODIGOS = {
    SUCESSO: 0,
    ERRO_GERAL: 1,
    ERRO_ARQUIVO: 2,
    ERRO_PERMISSAO: 3,
    CANCELADO_USUARIO: 4
};
export function formatarListaArquivos(arquivos, maxExibir = 10) {
    const linhas = [];
    const mostrar = arquivos.slice(0, maxExibir);
    for (const arquivo of mostrar) {
        linhas.push(`   ${ICONES_ZELADOR.arquivo} ${arquivo}`);
    }
    const restantes = arquivos.length - maxExibir;
    if (restantes > 0) {
        linhas.push(`   ${i18n({ 'pt-BR': `... e mais ${restantes} arquivos`, en: `... and ${restantes} more files` })}`);
    }
    return linhas;
}
export function formatarDuracao(ms) {
    if (ms < 1000) {
        return `${ms}ms`;
    }
    if (ms < 60000) {
        return `${(ms / 1000).toFixed(1)}s`;
    }
    const minutos = Math.floor(ms / 60000);
    const segundos = Math.floor(ms % 60000 / 1000);
    return `${minutos}m ${segundos}s`;
}
export function formatarComTimestamp(mensagem) {
    const timestamp = new Date().toISOString().substring(11, 19);
    return `[${timestamp}] ${mensagem}`;
}
//# sourceMappingURL=zelador-messages.js.map