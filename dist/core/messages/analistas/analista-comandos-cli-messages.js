import { createI18nMessages } from '../../../shared/helpers/i18n.js';
function comandoLabel(comandoNome) {
    return comandoNome ? ` "${comandoNome}"` : "";
}
export const ComandosCliMensagens = createI18nMessages({
    padraoAusente: 'Possível arquivo de comando sem registro detectado. Se este arquivo deveria conter comandos, considere usar padrões como "onCommand", "registerCommand", ou métodos específicos do framework (ex: SlashCommandBuilder para Discord.js).',
    comandosDuplicados: (duplicados) => `Comandos duplicados detectados: ${[...new Set(duplicados)].join(", ")}`,
    handlerAnonimo: (comandoNome) => `Handler do comando "${comandoNome}" é função anônima. Prefira funções nomeadas para facilitar debugging e rastreabilidade.`,
    handlerMuitosParametros: (comandoNome, paramContagem) => `Handler do comando${comandoLabel(comandoNome)} possui muitos parâmetros (${paramContagem}). Avalie simplificar a interface.`,
    handlerMuitoLongo: (comandoNome, statements) => `Handler do comando${comandoLabel(comandoNome)} é muito longo (${statements} statements). Considere extrair funções auxiliares.`,
    handlerSemTryCatch: (comandoNome) => `Handler do comando${comandoLabel(comandoNome)} não possui bloco try/catch. Recomenda-se tratar erros explicitamente.`,
    handlerSemFeedback: (comandoNome) => `Handler do comando${comandoLabel(comandoNome)} não faz log nem responde ao usuário. Considere adicionar feedback/logging.`,
    multiplosComandos: (count) => `Múltiplos comandos registrados neste arquivo (${count}). Avalie separar cada comando em seu próprio módulo para melhor manutenção.`
}, {
    padraoAusente: 'Possible unregistered command file detected. If this file should contain commands, consider using patterns like "onCommand", "registerCommand", or framework-specific methods (e.g., SlashCommandBuilder for Discord.js).',
    comandosDuplicados: (duplicados) => `Duplicate commands detected: ${[...new Set(duplicados)].join(", ")}`,
    handlerAnonimo: (comandoNome) => `Command handler for "${comandoNome}" is an anonymous function. Prefer named functions to facilitate debugging and traceability.`,
    handlerMuitosParametros: (comandoNome, paramContagem) => `Command handler${comandoLabel(comandoNome)} has too many parameters (${paramContagem}). Consider simplifying the interface.`,
    handlerMuitoLongo: (comandoNome, statements) => `Command handler${comandoLabel(comandoNome)} is too long (${statements} statements). Consider extracting auxiliary functions.`,
    handlerSemTryCatch: (comandoNome) => `Command handler${comandoLabel(comandoNome)} lacks a try/catch block. It is recommended to handle errors explicitly.`,
    handlerSemFeedback: (comandoNome) => `Command handler${comandoLabel(comandoNome)} does not log or respond to the user. Consider adding feedback/logging.`,
    multiplosComandos: (count) => `Multiple commands registered in this file (${count}). Consider separating each command into its own module for better maintenance.`
});
//# sourceMappingURL=analista-comandos-cli-messages.js.map