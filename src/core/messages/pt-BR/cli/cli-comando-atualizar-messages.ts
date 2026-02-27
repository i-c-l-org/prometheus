// SPDX-License-Identifier: MIT

export const CliComandoAtualizarMensagens = {
  descricao: 'Atualiza o Prometheus se a integridade estiver preservada',
  opcoes: {
    global: 'atualiza globalmente via npm i -g'
  },
  erros: {
    falhaFlags: (erro: string) => `Falha ao aplicar flags no comando atualizar: ${erro}`
  },
  status: {
    inicio: '\n🔄 Iniciando processo de atualização...\n',
    guardianOk: (iconeSucesso: string) => `${iconeSucesso} Guardian: integridade validada. Prosseguindo atualização.`,
    guardianAviso: '🌀 Guardian gerou novo baseline ou detectou alterações. Prosseguindo com cautela.',
    guardianDica: 'Recomendado: `prometheus guardian --diff` e `prometheus guardian --accept-baseline` antes de atualizar.'
  }
} as const;
