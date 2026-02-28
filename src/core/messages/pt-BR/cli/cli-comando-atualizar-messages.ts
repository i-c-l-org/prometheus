// SPDX-License-Identifier: MIT-0

export const CliComandoAtualizarMensagens = {
  descricao: 'Atualiza o Prometheus se a integridade estiver preservada',
  opcoes: {
    global: 'atualiza globalmente via npm i -g'
  },
  erros: {
    falhaFlags: (erro: string) => `Falha ao aplicar flags no comando atualizar: ${erro}`
  },
  status: {
    inicio: '\n[ATUALIZANDO] Iniciando processo de atualizacao...\n',
    guardianOk: (iconeSucesso: string) => `${iconeSucesso} Guardian: integridade validada. Prosseguindo atualizacao.`,
    guardianAviso: '[AVISO] Guardian gerou novo baseline ou detectou alteracoes. Prosseguindo com cautela.',
    guardianDica: 'Recomendado: `prometheus guardian --diff` e `prometheus guardian --accept-baseline` antes de atualizar.'
  }
} as const;
