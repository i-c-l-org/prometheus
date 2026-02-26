import { DetectorArquiteturaMensagens } from '../messages/analistas/detector-arquitetura-messages.js';
import { criarOcorrencia } from '../../types/index.js';
export function createDefaultReporter() {
    return (event) => {
        const { code, tipo, nivel = 'info', mensagem, data, relPath, linha = 1, coluna, origem, } = event;
        if (mensagem && typeof mensagem === 'string') {
            return criarOcorrencia({
                tipo,
                nivel,
                mensagem,
                relPath,
                linha,
                coluna,
                origem,
            });
        }
        if (code === 'ARQ_PADRAO') {
            const padrao = String(data?.padraoIdentificado ?? '');
            const confianca = Number(data?.confianca ?? 0);
            return criarOcorrencia({
                tipo,
                nivel,
                mensagem: DetectorArquiteturaMensagens.padraoArquitetural(padrao, confianca),
                relPath,
                linha,
                coluna,
                origem,
            });
        }
        if (code === 'ARQ_CARACTERISTICAS') {
            const items = Array.isArray(data?.caracteristicas)
                ? data?.caracteristicas
                : [];
            return criarOcorrencia({
                tipo,
                nivel,
                mensagem: DetectorArquiteturaMensagens.caracteristicas(items),
                relPath,
                linha,
                coluna,
                origem,
            });
        }
        if (code === 'ARQ_VIOLACAO') {
            const violacao = String(data?.violacao ?? '');
            return criarOcorrencia({
                tipo,
                nivel,
                mensagem: DetectorArquiteturaMensagens.violacao(violacao),
                relPath,
                linha,
                coluna,
                origem,
            });
        }
        if (code === 'ARQ_METRICAS') {
            const acoplamento = Number(data?.acoplamento ?? 0);
            const coesao = Number(data?.coesao ?? 0);
            return criarOcorrencia({
                tipo,
                nivel,
                mensagem: DetectorArquiteturaMensagens.metricas(acoplamento, coesao),
                relPath,
                linha,
                coluna,
                origem,
            });
        }
        if (code === 'ARQ_ERRO') {
            return criarOcorrencia({
                tipo,
                nivel,
                mensagem: DetectorArquiteturaMensagens.erroAnalisarArquitetura(data?.erro),
                relPath,
                linha,
                coluna,
                origem,
            });
        }
        const fallbackMsg = code
            ? `${code}${data ? ` ${JSON.stringify(data)}` : ''}`
            : data
                ? JSON.stringify(data)
                : 'Ocorrência reportada';
        return criarOcorrencia({
            tipo,
            nivel,
            mensagem: fallbackMsg,
            relPath,
            linha,
            coluna,
            origem,
        });
    };
}
//# sourceMappingURL=default-reporter.js.map