// SPDX-License-Identifier: MIT-0

import { CliCommonMensagens } from './cli-common-messages.js';

export const CliComandoLicensasMensagens = {
  descricao: 'Ferramentas relacionadas a licença',
  subcomandos: {
    scan: {
      descricao: 'Escaneia dependências em busca de licenças desconhecidas',
      opcoes: {
        root: CliCommonMensagens.opcoes.root
      },
      falha: (erro: string) => `Falha ao escanear licenças: ${erro}`
    },
    notices: {
      descricao: 'Gerenciar avisos/terceiros',
      generate: {
        descricao: 'Gerar arquivo THIRD-PARTY/AVISOS',
        opcoes: {
          ptBr: 'usar cabeçalho em português',
          output: CliCommonMensagens.opcoes.output,
          root: CliCommonMensagens.opcoes.root
        },
        falha: (erro: string) => `Falha ao gerar notices: ${erro}`,
        concluido: (res: unknown) => `Generated notices: ${res}`
      }
    },
    disclaimer: {
      descricao: 'Adicionar/verificar disclaimer em markdown',
      add: {
        descricao: 'Inserir aviso de proveniência nos arquivos markdown',
        opcoes: {
          disclaimerPath: 'caminho do arquivo de disclaimer',
          root: CliCommonMensagens.opcoes.root,
          dryRun: CliCommonMensagens.opcoes.dryRun
        },
        falha: (erro: string) => `Falha ao adicionar disclaimer: ${erro}`,
        concluido: (total: number) => `Disclaimer inserted into files: ${total}`
      },
      verify: {
        descricao: 'Verificar se todos os markdown possuem o disclaimer',
        falha: (erro: string) => `Falha ao verificar disclaimer: ${erro}`,
        ausente: 'Missing disclaimer in files:',
        todosOk: 'All markdown files include the disclaimer.'
      }
    }
  }
} as const;
