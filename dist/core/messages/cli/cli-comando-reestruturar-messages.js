import { ICONES_ACAO, ICONES_COMANDO, ICONES_DIAGNOSTICO, ICONES_STATUS } from '../ui/icons.js';
import { CliCommonMensagens } from './cli-common-messages.js';
export const CliComandoReestruturarMensagens = {
    descricao: 'Aplica correções estruturais e otimizações ao repositório.',
    opcoes: {
        auto: 'Aplica correções automaticamente sem confirmação (CUIDADO!)',
        aplicar: 'Alias de --auto (deprecated futuramente)',
        somentePlano: 'Exibe apenas o plano sugerido e sai (dry-run)',
        domains: 'Organiza por domains/<entidade>/<categoria>s (opcional; preset prometheus usa flat)',
        flat: 'Organiza por src/<categoria>s (sem domains)',
        preferEstrategista: 'Força uso do estrategista (ignora plano de arquitetos)',
        preset: 'Preset de estrutura (prometheus|node-community|ts-lib). Se omitido, não sugere estrutura automaticamente.',
        categoria: 'Override de categoria no formato chave=valor (ex.: controller=handlers). Pode repetir a flag.',
        include: CliCommonMensagens.opcoes.include,
        exclude: CliCommonMensagens.opcoes.exclude
    },
    inicio: `\n${ICONES_COMANDO.reestruturar} Iniciando processo de reestruturação...\n`,
    erroDuranteReestruturacao: (erroMensagem) => `${ICONES_STATUS.falha} Erro durante a reestruturação: ${erroMensagem}`,
    dryRunCompleto: 'Modo simulado concluído (nenhum arquivo foi movido).',
    dicaParaAplicar: 'Dica: Para aplicar essas mudanças no disco, use a flag --auto ou --aplicar.',
    planoSugeridoFast: (origem, moverLen) => `${ICONES_STATUS.ok} Plano sugerido (${origem}) FAST: ${moverLen} movimentação(ões)`,
    dryRunFast: 'Dry-run solicitado (--somente-plano). (FAST MODE)',
    reestruturacaoConcluidaFast: (moverLen) => `${ICONES_STATUS.ok} Reestruturação concluída: ${moverLen} movimentos. (FAST MODE)`,
    planoCalculadoFastSemAplicar: 'Plano calculado em modo FAST. Use --auto para aplicar.',
    spinnerCalculandoPlano: `${ICONES_DIAGNOSTICO.progresso} Calculando plano de reestruturação...`,
    spinnerPlanoVazio: 'Plano vazio: nenhuma movimentação sugerida.',
    spinnerPlanoSugerido: (origem, moverLen) => `Plano sugerido (${origem}): ${moverLen} movimentação(ões)`,
    spinnerConflitosDetectados: (qtd) => `Conflitos detectados: ${qtd}`,
    spinnerSemPlanoSugestao: 'Não foi possível sugerir um plano de reestruturação.',
    dryRunCompletoFull: 'Dry-run concluído. Nenhum arquivo foi modificado.',
    fallbackProblemasEstruturais: (qtd) => `${ICONES_ACAO.correcao} Reestruturando baseado em ${qtd} problemas estruturais encontrados:`,
    fallbackLinhaOcorrencia: (tipo, arq, msg) => `  [${tipo}] ${arq}: ${msg}`,
    nenhumNecessario: 'Nenhuma reestruturação necessária no momento.',
    canceladoErroPrompt: 'Cancelado devido a erro no prompt de confirmação.',
    canceladoUseAuto: 'Operação cancelada. Use --auto para aplicar automaticamente.',
    spinnerAplicando: 'Aplicando reestruturação...',
    reestruturacaoConcluida: (total, frase) => `${ICONES_STATUS.ok} Reestruturação concluída: ${total} ${frase}.`,
    falhaReestruturacao: 'Falha crítica na reestruturação.'
};
//# sourceMappingURL=cli-comando-reestruturar-messages.js.map