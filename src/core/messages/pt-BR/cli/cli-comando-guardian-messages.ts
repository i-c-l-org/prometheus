// SPDX-License-Identifier: MIT-0

import { CliCommonMensagens } from './cli-common-messages.js';

export const CliComandoGuardianMensagens = {
  descricao: 'Gerencia e verifica a integridade do ambiente do Prometheus.',
  opcoes: {
    acceptBaseline: 'Aceita o baseline atual como o novo baseline de integridade',
    diff: 'Mostra as diferenças entre o estado atual e o baseline',
    fullScan: 'Executa verificação sem aplicar GUARDIAN_IGNORE_PATTERNS (não persistir baseline)',
    json: CliCommonMensagens.opcoes.json
  },
  erroFlags: (erro: string) => `Falha ao aplicar flags no Guardian: ${erro}`,
  baselineNaoPermitidoFullScan: 'Não é permitido aceitar baseline com --full-scan ativo.',
  diffMudancasDetectadas: (drift: number) => `Detecção de drift: ${drift} alterações encontradas no ambiente.`,
  diffComoAceitarMudancas: 'Dica: Para aceitar as mudanças no ambiente, use: prometheus guardian --accept-baseline',
  baselineCriadoComoAceitar: 'Dica: Use --accept-baseline ou execute com --accept para confirmar as mudanças atuais.'
} as const;