import { getTypesDirectoryDisplay } from '../../../core/config/conventions.js';
import { MENSAGENS_CORRECAO_TIPOS } from '../../../core/messages/index.js';
import { extractVariableName, getDomainFromFilePath, isDefinitionFile, isLegacyOrVendorFile, isTypeScriptFile } from './context-analyzer.js';
import { inferTypeFromUsage } from './type-inference.js';
import { analyzeUsagePatterns, findVariableUsages } from './usage-analyzer.js';
export async function analyzeTypeUsage(match, fullCode, fileCaminho, ast) {
    const context = {
        fileCaminho,
        domain: getDomainFromFilePath(fileCaminho),
        isTypeScript: isTypeScriptFile(fileCaminho),
        isDefinitionFile: isDefinitionFile(fileCaminho),
        isLegacy: isLegacyOrVendorFile(fileCaminho),
        ast,
        code: fullCode
    };
    const varNome = extractVariableName(match, fullCode);
    if (!varNome) {
        return {
            confidence: 0,
            inferredTipo: 'unknown',
            isSimpleType: false,
            typeName: '',
            typeDefinition: '',
            suggestedPath: '',
            suggestion: MENSAGENS_CORRECAO_TIPOS.erros.extrairNome
        };
    }
    const usages = findVariableUsages(varNome, ast);
    if (usages.length === 0) {
        return {
            confidence: 20,
            inferredTipo: 'unknown',
            isSimpleType: false,
            typeName: '',
            typeDefinition: '',
            suggestedPath: '',
            suggestion: MENSAGENS_CORRECAO_TIPOS.erros.variavelNaoUsada
        };
    }
    const patterns = analyzeUsagePatterns(usages);
    const typeAnalise = inferTypeFromUsage(varNome, patterns, fileCaminho);
    if (typeAnalise.suggestedPath) {
        typeAnalise.suggestedPath = `${context.domain}/${typeAnalise.suggestedPath}`;
    }
    return typeAnalise;
}
export async function analyzeUnknownUsage(match, fullCode, fileCaminho, ast) {
    const analysis = await analyzeTypeUsage(match, fullCode, fileCaminho, ast);
    analysis.confidence = Math.max(0, analysis.confidence - 10);
    if (analysis.confidence < 70) {
        analysis.suggestion = 'Confiança baixa para substituir unknown. ' + `Considere adicionar type guards ou criar tipo dedicado em ${getTypesDirectoryDisplay()}`;
    }
    return analysis;
}
//# sourceMappingURL=type-analyzer.js.map