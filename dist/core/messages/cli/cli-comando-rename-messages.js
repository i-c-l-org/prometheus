export const CliComandoRenameMensagens = {
    descricao: 'Aplica as renomeações de variáveis baseadas no arquivo(s) de mapeamento em names/.',
    erros: {
        falhaFlags: (erro) => `Falha ao aplicar flags no comando rename: ${erro}`,
        nenhumMapeamento: 'Nenhum arquivo de mapeamento em names/. Execute o comando names primeiro.',
        pastaNaoEncontrada: 'Pasta de mapeamento não encontrada: names/. Execute o comando names primeiro.',
        mapeamentoVazio: 'Nenhum mapeamento de tradução encontrado (formato: nomeAntigo = nomeNovo por linha).'
    },
    status: {
        inicio: (total) => `Iniciando renomeação de variáveis (${total} mapeamentos)...`,
        atualizado: (rel) => `Atualizado: ${rel}`,
        concluido: (total) => `Renomeação concluída! ${total} arquivos atualizados.`,
        conflito: (old, rel, nova, anterior) => `Conflito de mapeamento para "${old}": ${rel} usa "${nova}", anterior era "${anterior}" (last wins).`
    }
};
//# sourceMappingURL=cli-comando-rename-messages.js.map