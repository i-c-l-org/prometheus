import { config } from '../../core/config/config.js';
import { minimatch } from 'minimatch';
export function isRuleSuppressed(ruleName, fileCaminho) {
    const normalizedCaminho = fileCaminho.replace(/^\.\//, '').replace(/\\/g, '/');
    const configData = config;
    const suppressRules = configData.suppressRules;
    if (suppressRules?.includes(ruleName)) {
        return true;
    }
    const ruleConfiguracao = configData.rules?.[ruleName];
    if (ruleConfiguracao) {
        if (ruleConfiguracao.severity === 'off') {
            return true;
        }
        if (ruleConfiguracao.exclude) {
            for (const pattern of ruleConfiguracao.exclude) {
                if (minimatch(normalizedCaminho, pattern, {
                    dot: true
                })) {
                    return true;
                }
            }
        }
        if (ruleConfiguracao.allowTestFiles && isTestArquivo(normalizedCaminho, configData)) {
            return true;
        }
    }
    if (ruleName === 'tipo-inseguro' || ruleName === 'tipo-inseguro-any') {
        const testPadroes = configData.testPadroes;
        if (testPadroes?.allowAnyType && isTestArquivo(normalizedCaminho, configData)) {
            return true;
        }
    }
    return false;
}
function isTestArquivo(fileCaminho, configData) {
    const testPadroes = configData.testPadroes?.files || ['**/*.test.*', '**/*.spec.*', 'test/**/*', 'tests/**/*', '**/__tests__/**'];
    return testPadroes.some(pattern => minimatch(fileCaminho, pattern, {
        dot: true
    }));
}
export function getRuleSeverity(ruleName, fileCaminho) {
    const configData = config;
    const ruleConfiguracao = configData.rules?.[ruleName];
    if (!ruleConfiguracao) {
        return undefined;
    }
    if (isRuleSuppressed(ruleName, fileCaminho)) {
        return undefined;
    }
    if (ruleConfiguracao.severity === 'error')
        return 'error';
    if (ruleConfiguracao.severity === 'warning')
        return 'warning';
    if (ruleConfiguracao.severity === 'info')
        return 'info';
    return undefined;
}
export function shouldSuppressOccurrence(tipo, fileCaminho, _severity) {
    const baseRuleNome = tipo.replace(/-(any|unknown|assertion|cast).*$/, '');
    const rulesToCheck = [tipo, baseRuleNome];
    return rulesToCheck.some(rule => isRuleSuppressed(rule, fileCaminho));
}
//# sourceMappingURL=rule-config.js.map