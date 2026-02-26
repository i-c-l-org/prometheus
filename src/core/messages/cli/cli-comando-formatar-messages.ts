// SPDX-License-Identifier: MIT

import { CliCommonMensagens } from './cli-common-messages.js';

export const CliComandoFormatarMensagens = {
  descricao: 'Aplica a formatação interna estilo Prometheus (whitespace, seções, finais de linha)',
  opcoes: {
    check: 'Apenas verifica se arquivos precisariam de formatação (default)',
    write: CliCommonMensagens.opcoes.write,
    engine: 'Motor de formatação: auto|interno|prettier (auto tenta usar Prettier do projeto e cai no interno)',
    include: CliCommonMensagens.opcoes.include,
    exclude: CliCommonMensagens.opcoes.exclude
  },
  erros: {
    falhaFlags: (erro: string) => `Falha ao aplicar flags no comando formatar: ${erro}`,
    falhaFormatar: (erro: string) => `Falha ao formatar: ${erro}`,
    falhaArquivo: (rel: string, erro: string) => `Falha ao formatar ${rel}: ${erro}`,
    falhaExecucaoArquivo: (rel: string, erro: string) => `Falha ao executar formatação para ${rel}: ${erro}`,
    totalErros: (n: number) => `Erros: ${n}`,
    scanOnlyAviso: 'SCAN_ONLY ativo; o comando formatar precisa ler conteúdo.'
  },
  status: {
    titulo: '🧽 FORMATAR',
    precisamFormatacao: (n: number) => `Encontrados ${n} arquivo(s) que precisam de formatação. Use --write para aplicar.`,
    tudoFormatado: 'Tudo formatado.',
    concluidoWrite: (n: number) => `Formatados ${n} arquivo(s).`,
    nenhumaMudanca: 'Nenhuma mudança necessária.'
  }
} as const;
