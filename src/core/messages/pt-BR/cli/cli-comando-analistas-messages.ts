// SPDX-License-Identifier: MIT-0

import { CliCommonMensagens } from './cli-common-messages.js';

export const CliComandoAnalistasMensagens = {
  descricao: 'Lista analistas registrados e seus metadados atuais',
  opcoes: {
    json: CliCommonMensagens.opcoes.json,
    output: 'Arquivo para exportar JSON de analistas',
    doc: 'Gera documentação Markdown dos analistas'
  },
  erroListar: (erro: string) => `Falha ao listar analistas: ${erro}`,
  fastModeTitulo: '\n?? Analistas registrados (FAST MODE):\n',
  fastModeTotalZero: '\nTotal: 0',
  docMdTitulo: 'CABECALHOS.analistas.mdTitulo',
  docGeradoEm: (iso: string) => `Gerado em: ${iso}`,
  docTabelaHeader: '| Nome | Categoria | Descrição | Limites |',
  docTabelaSeparador: '| ---- | --------- | --------- | ------- |',
  docLinhaAnalista: (nome: string, categoria: string, descricao: string, limitesStr: string) => `| ${nome} | ${categoria} | ${descricao} | ${limitesStr} |`,
  docGerada: (destinoDoc: string) => `?? Documentação de analistas gerada em ${destinoDoc}`,
  jsonExportado: (destino: string) => `?? Exportado JSON de analistas para ${destino}`,
  titulo: '\n?? Analistas registrados:\n',
  linhaAnalista: (nome: string, categoria: string, descricao?: string) => `- ${nome} (${categoria}) ${descricao ? `: ${descricao}` : ''}`,
  tituloComIcone: (iconeInfo: string) => `${iconeInfo} Analistas registrados:`,
  total: (n: number) => `\nTotal: ${n}`
} as const;