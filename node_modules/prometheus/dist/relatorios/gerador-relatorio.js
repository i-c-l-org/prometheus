import { gerarHeaderRelatorio, gerarSecaoGuardian, gerarTabelaOcorrencias, gerarTabelaResumoTipos, RelatorioMensagens } from '../core/messages/index.js';
export async function gerarRelatorioMarkdown(resultado, outputCaminho, modoBrief = false, options) {
    const { totalArquivos = 0, ocorrencias = [], guardian, timestamp = Date.now(), duracaoMs = 0 } = (resultado || {});
    const dataISO = new Date(timestamp).toISOString();
    if (modoBrief) {
        const { processarRelatorioResumo, gerarRelatorioMarkdownResumo } = await import('./filtro-inteligente.js');
        const relatorioResumo = processarRelatorioResumo(ocorrencias);
        await gerarRelatorioMarkdownResumo(relatorioResumo, outputCaminho);
        return;
    }
    const ocorrenciasOrdenadas = [...ocorrencias].sort((a, b) => {
        const ra = String(a.relPath ?? '');
        const rb = String(b.relPath ?? '');
        const cmp = ra.localeCompare(rb);
        if (cmp !== 0)
            return cmp;
        const la = typeof a.linha === 'number' ? a.linha : Number.MAX_SAFE_INTEGER;
        const lb = typeof b.linha === 'number' ? b.linha : Number.MAX_SAFE_INTEGER;
        return la - lb;
    });
    const guardianData = guardian && typeof guardian === 'object' ? {
        status: 'status' in guardian ? String(guardian.status) : 'não executada',
        timestamp: 'timestamp' in guardian ? String(guardian.timestamp) : '—',
        totalArquivos: 'totalArquivos' in guardian ? String(guardian.totalArquivos) : '—'
    } : {
        status: 'não executada',
        timestamp: '—',
        totalArquivos: '—'
    };
    const lines = [];
    lines.push(...gerarHeaderRelatorio({
        dataISO,
        duracao: duracaoMs,
        totalArquivos,
        totalOcorrencias: ocorrencias.length
    }));
    if (options && options.manifestFile && options.relatoriosDir) {
        const relPath = options.manifestFile;
        lines.push(`**${RelatorioMensagens.principal.secoes.metadados.arquivoManifest}:** \`${relPath}\`  `);
        lines.push('');
        lines.push(`> ${RelatorioMensagens.principal.secoes.metadados.notaManifest}`);
        lines.push('');
        lines.push('---');
        lines.push('');
    }
    lines.push(...gerarSecaoGuardian(guardianData));
    const tiposContagem = {};
    for (const ocorrencia of ocorrencias) {
        const tipo = ocorrencia && ocorrencia.tipo || 'desconhecido';
        tiposContagem[String(tipo)] = (tiposContagem[String(tipo)] || 0) + 1;
    }
    lines.push(...gerarTabelaResumoTipos(tiposContagem, 10));
    lines.push('---');
    lines.push('');
    lines.push(`## ${RelatorioMensagens.principal.secoes.ocorrencias.titulo} (amostra)`);
    lines.push('');
    const AMOSTRA_MAX = 2000;
    const sample = ocorrenciasOrdenadas.slice(0, AMOSTRA_MAX);
    lines.push(...gerarTabelaOcorrencias(sample));
    if (ocorrenciasOrdenadas.length > AMOSTRA_MAX) {
        lines.push('');
        lines.push(`> Mostrando apenas ${AMOSTRA_MAX} ocorrências. Para ver todas, consulte os shards listados no manifest.`);
    }
    const { salvarEstado } = await import('../shared/persistence/persistencia.js');
    await salvarEstado(outputCaminho, lines.join('\n'));
}
export async function gerarRelatorioJson(resultado, outputCaminho) {
    const { criarRelatorioComVersao } = await import('../core/schema/version.js');
    const relatorioVersionado = criarRelatorioComVersao(resultado, undefined, 'Relatório completo de diagnóstico do Prometheus');
    const { salvarEstado } = await import('../shared/persistence/persistencia.js');
    await salvarEstado(outputCaminho, relatorioVersionado.dados ?? resultado);
}
//# sourceMappingURL=gerador-relatorio.js.map