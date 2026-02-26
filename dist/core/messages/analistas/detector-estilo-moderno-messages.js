import { createI18nMessages } from '../../../shared/helpers/i18n.js';
export const DetectorEstiloModernoMensagens = createI18nMessages({
    satisfiesSugerido: (nome) => `💡 Sugestão: Use o operador 'satisfies' para '${nome}' em vez de anotação de tipo fixa para preservar a tipagem literal.`,
    usingSugerido: (recurso) => `💡 Sugestão: Use 'using' (Explicit Resource Management) para o recurso '${recurso}' para garantir o cleanup automático.`,
    waterfallDetectado: '⏰ Possível waterfall de Promises: múltiplos awaits sequenciais detectados. Considere Promise.all() para execução paralela.',
    hasOwnSugerido: "💡 Sugestão: Use 'Object.hasOwn()' em vez de 'hasOwnProperty()' (mais seguro em 2026).",
    ternarioAninhado: '🧩 Ternários aninhados detectados: prejudicam a legibilidade. Considere refatorar para blocks if/else ou guard clauses.',
    constSugerido: (nome) => `💡 Sugestão: Variável '${nome}' é declarada com 'let' mas nunca reatribuída. Use 'const'.`,
    redundantType: (nome) => `💡 Sugestão: Anotação de tipo redundante em '${nome}'. O TypeScript já infere este tipo perfeitamente.`
}, {
    satisfiesSugerido: (nome) => `💡 Suggestion: Use the 'satisfies' operator for '${nome}' instead of fixed type annotation to preserve literal typing.`,
    usingSugerido: (recurso) => `💡 Suggestion: Use 'using' (Explicit Resource Management) for the resource '${recurso}' to ensure automatic cleanup.`,
    waterfallDetectado: '⏰ Possible Promise waterfall: multiple sequential awaits detected. Consider Promise.all() for parallel execution.',
    hasOwnSugerido: "💡 Suggestion: Use 'Object.hasOwn()' instead of 'hasOwnProperty()' (safer in 2026).",
    ternarioAninhado: '🧩 Nested ternaries detected: they hurt readability. Consider refactoring to if/else blocks or guard clauses.',
    constSugerido: (nome) => `💡 Suggestion: Variable '${nome}' is declared with 'let' but never reassigned. Use 'const'.`,
    redundantType: (nome) => `💡 Suggestion: Redundant type annotation in '${nome}'. TypeScript already infers this type perfectly.`
});
//# sourceMappingURL=detector-estilo-moderno-messages.js.map