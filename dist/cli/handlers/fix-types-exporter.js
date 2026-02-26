import { promises as fs } from 'node:fs';
import path from 'node:path';
import { config } from '../../core/config/config.js';
import { CliExportersMensagens } from '../../core/messages/cli/cli-exporters-messages.js';
import { log } from '../../core/messages/index.js';
async function gerarRelatorioJson(caminho, options) {
    const { casos, stats, minConfidence, verbose } = options;
    const total = stats.legitimo + stats.melhoravel + stats.corrigir;
    const mediaConfianca = total > 0 ? Math.round(stats.totalConfianca / total) : 0;
    const relatorio = {
        metadata: {
            timestamp: new Date().toISOString(),
            comando: 'fix-types',
            schemaVersion: '1.0.0',
            configuracao: {
                confianciaMinima: minConfidence,
                modoVerbose: verbose
            }
        },
        resumo: {
            totalCasos: total,
            mediaConfianca,
            distribuicao: {
                legitimo: {
                    total: stats.legitimo,
                    percentual: total > 0 ? Math.round(stats.legitimo / total * 100) : 0
                },
                melhoravel: {
                    total: stats.melhoravel,
                    percentual: total > 0 ? Math.round(stats.melhoravel / total * 100) : 0
                },
                corrigir: {
                    total: stats.corrigir,
                    percentual: total > 0 ? Math.round(stats.corrigir / total * 100) : 0
                }
            }
        },
        casos: casos.map(c => ({
            arquivo: c.arquivo,
            linha: c.linha,
            tipo: c.tipo,
            categoria: c.categoria,
            confianca: c.confianca,
            motivo: c.motivo,
            sugestao: c.sugestao,
            variantes: c.variantes || [],
            contexto: c.contexto
        })),
        analise: {
            porArquivo: agruparPorArquivo(casos),
            porCategoria: agruparPorCategoria(casos),
            altaPrioridade: casos.filter(c => c.categoria === 'corrigir' && c.confianca >= 85).map(c => ({
                arquivo: c.arquivo,
                linha: c.linha,
                confianca: c.confianca,
                sugestao: c.sugestao || c.motivo
            })),
            casosIncertos: casos.filter(c => c.confianca < 70 && c.variantes && c.variantes.length > 0).map(c => ({
                arquivo: c.arquivo,
                linha: c.linha,
                confianca: c.confianca,
                motivo: c.motivo,
                variantes: c.variantes
            }))
        }
    };
    await fs.writeFile(caminho, JSON.stringify(relatorio, null, 2));
}
async function gerarRelatorioMarkdown(caminho, options) {
    const { casos, stats, minConfidence } = options;
    const total = stats.legitimo + stats.melhoravel + stats.corrigir;
    const mediaConfianca = total > 0 ? Math.round(stats.totalConfianca / total) : 0;
    const lines = [];
    const msg = CliExportersMensagens.fixTypes.markdown;
    lines.push(msg.titulo);
    lines.push('');
    lines.push(msg.geradoEm(new Date().toISOString()));
    lines.push(msg.comando);
    lines.push(msg.confiancaMin(minConfidence));
    lines.push('');
    lines.push(msg.resumoExecutivo);
    lines.push('');
    lines.push(msg.totalCasos(total));
    lines.push(msg.confiancaMedia(mediaConfianca));
    lines.push('');
    lines.push(msg.distribuicaoTitulo);
    lines.push('');
    lines.push(msg.distribuicaoTabelaHeader);
    lines.push(msg.distribuicaoTabelaDivider);
    lines.push(msg.distribuicaoLegitimo(stats.legitimo, total > 0 ? Math.round(stats.legitimo / total * 100) : 0));
    lines.push(msg.distribuicaoMelhoravel(stats.melhoravel, total > 0 ? Math.round(stats.melhoravel / total * 100) : 0));
    lines.push(msg.distribuicaoCorrigir(stats.corrigir, total > 0 ? Math.round(stats.corrigir / total * 100) : 0));
    lines.push('');
    const altaPrioridade = casos.filter(c => c.categoria === 'corrigir' && c.confianca >= 85);
    if (altaPrioridade.length > 0) {
        lines.push(msg.altaPrioridadeTitulo);
        lines.push('');
        altaPrioridade.forEach((caso, idx) => {
            lines.push(msg.altaPrioridadeItem(idx + 1, caso.arquivo, caso.linha || '?', caso.confianca));
            lines.push('');
            lines.push(`**Motivo:** ${caso.motivo}`);
            if (caso.sugestao) {
                lines.push(`**Sugestão:** ${caso.sugestao}`);
            }
            if (caso.contexto) {
                lines.push('');
                lines.push('```typescript');
                lines.push(caso.contexto);
                lines.push('```');
            }
            lines.push('');
        });
    }
    const casosIncertos = casos.filter(c => c.confianca < 70 && c.variantes && c.variantes.length > 0);
    if (casosIncertos.length > 0) {
        lines.push(msg.incertosTitulo);
        lines.push('');
        lines.push(msg.incertosIntro);
        lines.push('');
        casosIncertos.forEach((caso, idx) => {
            lines.push(msg.incertosItem(idx + 1, caso.arquivo, caso.linha || '?', caso.confianca));
            lines.push('');
            lines.push(`**Motivo:** ${caso.motivo}`);
            if (caso.sugestao) {
                lines.push(`**Sugestão:** ${caso.sugestao}`);
            }
            if (caso.variantes && caso.variantes.length > 0) {
                lines.push('');
                lines.push('**Possibilidades Alternativas:**');
                caso.variantes.forEach((variante, vIdx) => {
                    lines.push(`${vIdx + 1}. ${variante}`);
                });
            }
            if (caso.contexto) {
                lines.push('');
                lines.push('```typescript');
                lines.push(caso.contexto);
                lines.push('```');
            }
            lines.push('');
        });
    }
    lines.push(msg.listaCompletaTitulo);
    lines.push('');
    for (const categoria of ['legitimo', 'melhoravel', 'corrigir']) {
        const casosPorCategoria = casos.filter(c => c.categoria === categoria);
        if (casosPorCategoria.length === 0)
            continue;
        const prefixo = categoria === 'legitimo' ? '[SUCESSO]' : categoria === 'melhoravel' ? '[AVISO]' : '[ERRO]';
        const titulo = categoria.toUpperCase();
        lines.push(msg.listaCompletaCategoria(prefixo, titulo, casosPorCategoria.length));
        lines.push('');
        casosPorCategoria.forEach(caso => {
            lines.push(msg.listaCompletaItem(caso.arquivo, caso.linha || '?', caso.confianca));
            lines.push(`  - ${caso.motivo}`);
            if (caso.sugestao) {
                lines.push(`  - [INFO] ${caso.sugestao}`);
            }
        });
        lines.push('');
    }
    await fs.writeFile(caminho, lines.join('\n'));
}
function agruparPorArquivo(casos) {
    return casos.reduce((acc, caso) => {
        acc[caso.arquivo] = (acc[caso.arquivo] || 0) + 1;
        return acc;
    }, {});
}
function agruparPorCategoria(casos) {
    return casos.reduce((acc, caso) => {
        if (!acc[caso.categoria])
            acc[caso.categoria] = [];
        acc[caso.categoria].push({
            arquivo: caso.arquivo,
            linha: caso.linha
        });
        return acc;
    }, {});
}
export async function exportarRelatoriosFixTypes(options) {
    if (!config.REPORT_EXPORT_ENABLED) {
        return null;
    }
    try {
        const { baseDir } = options;
        const dir = typeof config.REPORT_OUTPUT_DIR === 'string' ? config.REPORT_OUTPUT_DIR : path.join(baseDir, 'relatorios');
        await fs.mkdir(dir, {
            recursive: true
        });
        const ts = new Date().toISOString().replace(/[:.]/g, '-');
        const nomeBase = `prometheus-fix-types-${ts}`;
        const caminhoMd = path.join(dir, `${nomeBase}.md`);
        await gerarRelatorioMarkdown(caminhoMd, options);
        const caminhoJson = path.join(dir, `${nomeBase}.json`);
        await gerarRelatorioJson(caminhoJson, options);
        log.sucesso(CliExportersMensagens.fixTypes.relatoriosExportadosTitulo);
        log.info(CliExportersMensagens.fixTypes.caminhoMarkdown(caminhoMd));
        log.info(CliExportersMensagens.fixTypes.caminhoJson(caminhoJson));
        return {
            markdown: caminhoMd,
            json: caminhoJson,
            dir
        };
    }
    catch (error) {
        log.erro(CliExportersMensagens.fixTypes.falhaExportar(error.message));
        return null;
    }
}
//# sourceMappingURL=fix-types-exporter.js.map