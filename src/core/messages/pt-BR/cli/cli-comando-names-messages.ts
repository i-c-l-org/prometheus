// SPDX-License-Identifier: MIT-0

export const CliComandoNamesMensagens = {
  descricao: 'Varre o repositório em busca de nomes de variáveis e gera arquivos de mapeamento (estrutura fragmentada em names/).',
  opcoes: {
    legacy: 'Gera também names/name.txt único (compatibilidade com fluxo antigo).'
  },
  erros: {
    falhaFlags: (erro: string) => `Falha ao aplicar flags no comando names: ${erro}`,
    erroProcessar: (rel: string) => `[Aviso] Erro ao processar ${rel}`
  },
  status: {
    inicio: 'Iniciando varredura de nomes de variáveis...',
    concluidoLegacy: (totalNomes: number, totalArquivos: number, saidaArquivo: string) =>
      `Varredura concluída! ${totalNomes} variáveis em ${totalArquivos} arquivos. Mapeamento fragmentado em names/ e agregado em ${saidaArquivo}.`,
    concluido: (totalNomes: number, totalArquivos: number) =>
      `Varredura concluída! ${totalNomes} variáveis em ${totalArquivos} arquivos. Mapeamento em names/ (estrutura espelhada).`
  }
} as const;
