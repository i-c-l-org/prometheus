import { findQuickFixes } from '../../core/config/auto/fix-config.js';
import { criarOcorrencia } from '../../types/index.js';
export const analistaQuickFixes = {
    nome: 'quick-fixes',
    categoria: 'melhorias',
    descricao: 'Detecta problemas comuns e oferece correções automáticas',
    test: (relPath) => {
        return /\.(js|jsx|ts|tsx|mjs|cjs|svg)$/.test(relPath);
    },
    aplicar: (src, relPath, _ast) => {
        if (!src)
            return [];
        const ocorrencias = [];
        const quickFixes = findQuickFixes(src, undefined, undefined, relPath);
        const problemaTipos = ['unhandled-async', 'console-log', 'memory-leak', 'dangerous-html', 'eval-usage', 'complex-regex'];
        for (const problemTipo of problemaTipos) {
            const specificFixes = findQuickFixes(src, problemTipo, undefined, relPath);
            quickFixes.push(...specificFixes);
        }
        const uniqueFixes = quickFixes.filter((fix, index, arr) => arr.findIndex(f => f.id === fix.id) === index);
        for (const fixResultado of uniqueFixes) {
            for (const match of fixResultado.matches) {
                const beforeMatch = src.substring(0, match.index || 0);
                const linha = beforeMatch.split('\n').length;
                const previewCorrecao = fixResultado.fix(match, src);
                const originalLine = src.split('\n')[linha - 1] || '';
                const fixedLine = previewCorrecao.split('\n')[linha - 1] || '';
                const sugestao = [fixResultado.description, '', `🔧 Correção sugerida:`, `❌ Antes: ${originalLine.trim()}`, `✅ Depois: ${fixedLine.trim()}`, '', `Confiança: ${fixResultado.confidence}%`, `Categoria: ${fixResultado.category}`, `ID do Fix: ${fixResultado.id}`].join('\n');
                const nivel = mapearCategoriaNivel(fixResultado.category);
                const ocorrencia = criarOcorrencia({
                    tipo: 'auto-fix-disponivel',
                    nivel,
                    mensagem: `${fixResultado.title}`,
                    relPath,
                    linha
                });
                const ocorrenciaGenerica = ocorrencia;
                ocorrenciaGenerica.sugestao = sugestao;
                ocorrenciaGenerica.quickFixId = fixResultado.id;
                ocorrenciaGenerica.confidence = fixResultado.confidence;
                ocorrenciaGenerica.category = fixResultado.category;
                ocorrenciaGenerica.matchIndex = match.index;
                ocorrenciaGenerica.matchLength = match[0].length;
                ocorrencias.push(ocorrencia);
            }
        }
        return ocorrencias;
    }
};
function mapearCategoriaNivel(category) {
    switch (category) {
        case 'security':
            return 'erro';
        case 'performance':
            return 'aviso';
        case 'style':
        case 'documentation':
            return 'info';
        default:
            return 'info';
    }
}
//# sourceMappingURL=analista-quick-fixes.js.map