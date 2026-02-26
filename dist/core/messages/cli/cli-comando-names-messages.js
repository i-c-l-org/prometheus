export const CliComandoNamesMensagens = {
    descricao: 'Varre o repositório em busca de nomes de variáveis e gera arquivos de mapeamento (estrutura fragmentada em names/).',
    opcoes: {
        legacy: 'Gera também names/name.txt único (compatibilidade com fluxo antigo).'
    },
    erros: {
        falhaFlags: (erro) => `Falha ao aplicar flags no comando names: ${erro}`,
        erroProcessar: (rel) => `[Aviso] Erro ao processar ${rel}`
    },
    status: {
        inicio: 'Iniciando varredura de nomes de variáveis...',
        concluidoLegacy: (totalNomes, totalArquivos, saidaArquivo) => `Varredura concluída! ${totalNomes} variáveis em ${totalArquivos} arquivos. Mapeamento fragmentado em names/ e agregado em ${saidaArquivo}.`,
        concluido: (totalNomes, totalArquivos) => `Varredura concluída! ${totalNomes} variáveis em ${totalArquivos} arquivos. Mapeamento em names/ (estrutura espelhada).`
    }
};
//# sourceMappingURL=cli-comando-names-messages.js.map