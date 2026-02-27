// SPDX-License-Identifier: MIT

export const CliComandoRenameMensagens = {
  descricao: 'Aplica as renomeações de variáveis baseadas no arquivo(s) de mapeamento em names/.',
  erros: {
    falhaFlags: (erro: string) => `Falha ao aplicar flags no comando rename: ${erro}`,
    nenhumMapeamento: 'Nenhum arquivo de mapeamento em names/. Execute o comando names primeiro.',
    pastaNaoEncontrada: 'Pasta de mapeamento não encontrada: names/. Execute o comando names primeiro.',
    mapeamentoVazio: 'Nenhum mapeamento de tradução encontrado (formato: nomeAntigo = nomeNovo por linha).'
  },
  status: {
    inicio: (total: number) => `Iniciando renomeação de variáveis (${total} mapeamentos)...`,
    atualizado: (rel: string) => `Atualizado: ${rel}`,
    concluido: (total: number) => `Renomeação concluída! ${total} arquivos atualizados.`,
    conflito: (old: string, rel: string, nova: string, anterior: string) =>
      `Conflito de mapeamento para "${old}": ${rel} usa "${nova}", anterior era "${anterior}" (last wins).`
  }
} as const;
