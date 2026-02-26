export const PADRAO_AUTO_CORRECAO_CONFIGURACAO = {
    mode: 'balanced',
    minConfidence: 75,
    allowedCategories: ['security', 'performance', 'style', 'documentation'],
    excludePadroes: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/coverage/**', '**/*.min.js', '**/src/nucleo/configuracao/**', '**/src/shared/persistence/**', '**/operario-estrutura.ts', '**/corretor-estrutura.ts', '**/mapa-reversao.ts', '**/quick-fix-registry.ts', '**/config.ts', '**/executor.ts'],
    excludeFunctionPatterns: ['planejar', 'aplicar', 'corrigir', 'executar', 'processar', 'salvar.*Estado', 'ler.*Estado', 'gerarPlano.*', 'detectar.*', 'analisar.*', 'validar.*'],
    maxFixesPerArquivo: 5,
    createBackup: true,
    validateAfterFix: true,
    allowMutateFs: false,
    backupSuffix: '.local.bak',
    conservative: true
};
export const CONSERVADORA_AUTO_CORRECAO_CONFIGURACAO = {
    ...PADRAO_AUTO_CORRECAO_CONFIGURACAO,
    mode: 'conservative',
    minConfidence: 90,
    allowedCategories: ['security', 'performance'],
    maxFixesPerArquivo: 2,
    excludePadroes: [...(PADRAO_AUTO_CORRECAO_CONFIGURACAO.excludePadroes || []), '**/src/analistas/**', '**/src/arquitetos/**', '**/src/zeladores/**', '**/src/guardian/**', '**/src/cli/**']
};
export const AGRESSIVA_AUTO_CORRECAO_CONFIGURACAO = {
    ...PADRAO_AUTO_CORRECAO_CONFIGURACAO,
    mode: 'aggressive',
    minConfidence: 60,
    maxFixesPerArquivo: 10,
    excludePadroes: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/coverage/**', '**/*.min.js']
};
export const AUTO_CORRECAO_CONFIGURACAO_PADROES = PADRAO_AUTO_CORRECAO_CONFIGURACAO;
export default AUTO_CORRECAO_CONFIGURACAO_PADROES;
export function shouldExcludeFile(fileCaminho, config) {
    if (!config || !config.excludePadroes)
        return false;
    return config.excludePadroes.some(pattern => {
        const regexPadrao = pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*').replace(/\?/g, '.');
        return new RegExp(regexPadrao).test(fileCaminho);
    });
}
export function shouldExcludeFunction(functionName, config) {
    if (!config || !config.excludeFunctionPatterns)
        return false;
    return config.excludeFunctionPatterns.some(pattern => new RegExp(pattern, 'i').test(functionName));
}
export function isCategoryAllowed(category, config) {
    if (!config || !config.allowedCategories)
        return true;
    return config.allowedCategories.includes(category);
}
export function hasMinimumConfidence(confidence, config) {
    if (typeof config?.minConfidence !== 'number')
        return true;
    return confidence >= config.minConfidence;
}
export function getAutoFixConfig(mode) {
    switch (mode) {
        case 'conservative':
            return CONSERVADORA_AUTO_CORRECAO_CONFIGURACAO;
        case 'aggressive':
            return AGRESSIVA_AUTO_CORRECAO_CONFIGURACAO;
        case 'balanced':
        default:
            return PADRAO_AUTO_CORRECAO_CONFIGURACAO;
    }
}
//# sourceMappingURL=auto-fix-config.js.map