// SPDX-License-Identifier: MIT

import { CliCommonMensagens } from './cli-common-messages.js';

export const CliComandoReverterMensagens = {
  descricao: 'Gerencia mapa de reversão para moves aplicados',
  opcoes: {
    force: CliCommonMensagens.opcoes.force
  },
  subcomandos: {
    listar: {
      descricao: 'Lista todos os moves registrados no mapa de reversão',
      erro: (msg: string) => `Falha ao listar moves: ${msg}`
    },
    arquivo: {
      descricao: 'Reverte todos os moves de um arquivo específico',
      argumento: 'Caminho do arquivo para reverter',
      erro: (msg: string) => `Falha ao reverter arquivo: ${msg}`
    },
    move: {
      descricao: 'Reverte um move específico pelo ID',
      argumento: 'ID do move para reverter',
      erro: (msg: string) => `Falha ao reverter move: ${msg}`
    },
    limpar: {
      descricao: 'Limpa todo o mapa de reversão (perde histórico)',
      erro: (msg: string) => `Falha ao limpar mapa: ${msg}`
    },
    status: {
      descricao: 'Mostra status do mapa de reversão',
      erro: (msg: string) => `Falha ao obter status: ${msg}`
    }
  },
  falhaCarregarMapaFast: (erro: string) => `Falha ao carregar mapa de reversão (fast-mode): ${erro}`,
  mapaLimpoComSucesso: (iconeSucesso: string) => `${iconeSucesso} Mapa de reversão limpo com sucesso!`,
  ultimoMove: (data: string) => `?? Último move registrado em: ${data}`
} as const;