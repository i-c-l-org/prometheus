import { formatMs } from '../../config/format.js';
import { i18n } from '../../../shared/helpers/i18n.js';
import { RelatorioMensagens } from './relatorio-messages.js';
export function gerarHeaderRelatorio(metadados) {
    const lines = [];
    const { principal } = RelatorioMensagens;
    lines.push(`# ${principal.titulo}`);
    lines.push('');
    lines.push(`**${principal.secoes.metadados.data}:** ${metadados.dataISO}  `);
    lines.push(`**${principal.secoes.metadados.duracao}:** ${formatMs(metadados.duracao)}  `);
    lines.push(`**${principal.secoes.metadados.arquivos}:** ${metadados.totalArquivos}  `);
    lines.push(`**${principal.secoes.metadados.ocorrencias}:** ${metadados.totalOcorrencias}  `);
    lines.push('');
    lines.push(RelatorioMensagens.comum.separadores.secao);
    lines.push('');
    lines.push('');
    if (metadados.manifestFile && metadados.relatoriosDir) {
        lines.push(`**${principal.secoes.metadados.arquivoManifest}:** \`${metadados.manifestFile}\`  `);
        lines.push('');
        lines.push(`> ${principal.secoes.metadados.notaManifest}`);
        lines.push('');
        lines.push(RelatorioMensagens.comum.separadores.secao);
        lines.push('');
        lines.push('');
    }
    return lines;
}
export function gerarSecaoGuardian(guardian) {
    const lines = [];
    const { guardian: msg } = RelatorioMensagens.principal.secoes;
    lines.push(`## ${msg.titulo}`);
    lines.push('');
    lines.push(`  - **${msg.status}:** ${guardian.status}`);
    lines.push(`  - **${msg.timestamp}:** ${guardian.timestamp}`);
    lines.push(`  - **${msg.totalArquivos}:** ${guardian.totalArquivos}`);
    lines.push('');
    lines.push(RelatorioMensagens.comum.separadores.secao);
    lines.push('');
    lines.push('');
    return lines;
}
export function gerarTabelaResumoTipos(tiposContagem, limite = 10) {
    const lines = [];
    const { resumoTipos } = RelatorioMensagens.principal.secoes;
    lines.push(`## ${resumoTipos.titulo}`);
    lines.push('');
    lines.push(`| ${resumoTipos.tipo} | ${resumoTipos.quantidade} |`);
    lines.push('|-------------------|----------|');
    const sorted = Object.entries(tiposContagem).sort(([, a], [, b]) => b - a).slice(0, limite);
    for (const [tipo, count] of sorted) {
        lines.push(`| ${tipo.padEnd(17)} | ${String(count).padStart(8)} |`);
    }
    lines.push('');
    lines.push(RelatorioMensagens.comum.separadores.secao);
    lines.push('');
    lines.push('');
    return lines;
}
function escapeMarkdownTableCell(value) {
    return value.replace(/\\/g, '\\\\').replace(/\|/g, '\\|');
}
export function gerarTabelaOcorrencias(ocorrencias) {
    const lines = [];
    const { ocorrencias: msg } = RelatorioMensagens.principal.secoes;
    lines.push(`## ${msg.titulo}`);
    lines.push('');
    lines.push(`| ${msg.colunas.arquivo} | ${msg.colunas.linha} | ${msg.colunas.nivel}  | ${msg.colunas.mensagem} |`);
    lines.push('|---------|-------|--------|----------|');
    for (const o of ocorrencias) {
        const arquivo = String(o.relPath || '');
        const linha = o.linha ? String(o.linha) : '';
        const nivel = String(o.nivel || '');
        const mensagem = escapeMarkdownTableCell(String(o.mensagem || ''));
        lines.push(`| ${arquivo} | ${linha} | ${nivel} | ${mensagem} |`);
    }
    lines.push('');
    return lines;
}
export function gerarSecaoProblemasAgrupados(titulo, problemas, mostrarExemplos = true) {
    const lines = [];
    const { labels } = RelatorioMensagens.resumo;
    lines.push(`## ${titulo}`);
    lines.push('');
    if (problemas.length === 0) {
        lines.push(`> ${RelatorioMensagens.comum.vazios.nenhumResultado}`);
        lines.push('');
        return lines;
    }
    for (const prob of problemas) {
        lines.push(`### ${prob.icone} ${prob.titulo}`);
        lines.push('');
        lines.push(`**${labels.quantidade}:** ${prob.quantidade}  `);
        lines.push(`**${i18n({ 'pt-BR': 'Resumo:', en: 'Summary:' })}** ${prob.resumo}  `);
        if (prob.acaoSugerida) {
            lines.push(`**${labels.acaoSugerida}:** ${prob.acaoSugerida}  `);
        }
        lines.push('');
        if (mostrarExemplos && prob.ocorrencias.length > 0) {
            lines.push(`**${labels.exemplos}:**`);
            const exemplos = prob.ocorrencias.slice(0, 3);
            for (const ex of exemplos) {
                const local = ex.relPath ? `${ex.relPath}${ex.linha ? `:${ex.linha}` : ''}` : '';
                const msg = ex.mensagem ? ` - ${ex.mensagem}` : '';
                lines.push(`  - \`${local}\`${msg}`);
            }
            if (prob.ocorrencias.length > 3) {
                const count = prob.ocorrencias.length - 3;
                lines.push(`  - _${i18n({ 'pt-BR': `...e mais ${count} ocorrências`, en: `...and ${count} more occurrences` })}_`);
            }
            lines.push('');
        }
        lines.push(RelatorioMensagens.comum.separadores.subsecao);
        lines.push('');
    }
    return lines;
}
export function gerarTabelaDuasColunas(dados, cabecalhos) {
    const lines = [];
    lines.push(`| ${cabecalhos[0]} | ${cabecalhos[1]} |`);
    lines.push('|------------------|----------|');
    for (const [col1, col2] of dados) {
        lines.push(`| ${col1.padEnd(16)} | ${String(col2).padStart(8)} |`);
    }
    lines.push('');
    return lines;
}
export function gerarSecaoEstatisticas(stats) {
    const lines = [];
    const { estatisticas } = RelatorioMensagens.principal.secoes;
    lines.push(`## ${estatisticas.titulo}`);
    lines.push('');
    for (const [chave, valor] of Object.entries(stats)) {
        lines.push(`  - **${chave}:** ${valor}`);
    }
    lines.push('');
    return lines;
}
export function gerarFooterRelatorio(timestampISO) {
    const lines = [];
    lines.push(RelatorioMensagens.comum.separadores.secao);
    lines.push('');
    lines.push(`_${i18n({ 'pt-BR': 'Gerado por Prometheus CLI', en: 'Generated by Prometheus CLI' })}_`);
    if (timestampISO) {
        lines.push(`_${timestampISO}_`);
    }
    lines.push('');
    return lines;
}
export async function escreverRelatorioMarkdown(outputCaminho, lines) {
    const { salvarEstado } = await import('../../../shared/persistence/persistencia.js');
    await salvarEstado(outputCaminho, lines.join('\n'));
}
//# sourceMappingURL=relatorio-templates.js.map