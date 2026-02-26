import { CliCommonMensagens } from './cli-common-messages.js';
export const CliComandoDesempMensagens = {
    descricao: 'Operações de baseline e comparação de performance sintética',
    opcoes: {
        dir: 'Diretório de snapshots',
        json: CliCommonMensagens.opcoes.json,
        limite: 'Limite para regressão (%)'
    },
    subcomandos: {
        baseline: {
            descricao: 'Gera uma nova baseline. Usa métricas globais da última execução se disponíveis.',
            erro: (msg) => `Falha na geração de baseline: ${msg}`
        },
        compare: {
            descricao: 'Compara os dois últimos snapshots e sinaliza regressão',
            erroSnapshots: (msg) => `Falha ao carregar snapshots: ${msg}`,
            erroMenosDeDois: 'Menos de dois snapshots para comparar'
        }
    },
    tituloComparacaoSnapshots: '\n?? Comparação de snapshots de performance:\n',
    tituloComparacaoSnapshotsComIcone: (icone) => `${icone} Comparação entre snapshots:`
};
//# sourceMappingURL=cli-comando-perf-messages.js.map