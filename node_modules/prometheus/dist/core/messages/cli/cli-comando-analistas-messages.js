import { CliCommonMensagens } from './cli-common-messages.js';
export const CliComandoAnalistasMensagens = {
    descricao: 'Lista analistas registrados e seus metadados atuais',
    opcoes: {
        json: CliCommonMensagens.opcoes.json,
        output: 'Arquivo para exportar JSON de analistas',
        doc: 'Gera documentação Markdown dos analistas'
    },
    erroListar: (erro) => `Falha ao listar analistas: ${erro}`,
    fastModeTitulo: '\n?? Analistas registrados (FAST MODE):\n',
    fastModeTotalZero: '\nTotal: 0',
    docMdTitulo: 'CABECALHOS.analistas.mdTitulo',
    docGeradoEm: (iso) => `Gerado em: ${iso}`,
    docTabelaHeader: '| Nome | Categoria | Descrição | Limites |',
    docTabelaSeparador: '| ---- | --------- | --------- | ------- |',
    docLinhaAnalista: (nome, categoria, descricao, limitesStr) => `| ${nome} | ${categoria} | ${descricao} | ${limitesStr} |`,
    docGerada: (destinoDoc) => `?? Documentação de analistas gerada em ${destinoDoc}`,
    jsonExportado: (destino) => `?? Exportado JSON de analistas para ${destino}`,
    titulo: '\n?? Analistas registrados:\n',
    linhaAnalista: (nome, categoria, descricao) => `- ${nome} (${categoria}) ${descricao ? `: ${descricao}` : ''}`,
    tituloComIcone: (iconeInfo) => `${iconeInfo} Analistas registrados:`,
    total: (n) => `\nTotal: ${n}`
};
//# sourceMappingURL=cli-comando-analistas-messages.js.map