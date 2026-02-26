import { buildTypesRelPathPosix } from '../../../core/config/conventions.js';
import { MENSAGENS_CORRECAO_TIPOS } from '../../../core/messages/index.js';
import { isAnyInGenericFunction, isInStringOrComment, isLegacyOrVendorFile, isTypeScriptContext } from '../type-safety/context-analyzer.js';
import { analyzeTypeUsage } from '../type-safety/type-analyzer.js';
import { createTypeDefinition } from '../type-safety/type-creator.js';
import { validateTypeReplacement } from '../type-safety/type-validator.js';
const CONFIANCA_NIVEIS = {
    HIGH: 85,
    MEDIUM: 60,
    DEFAULT: 70
};
export const fixAnyToProperTipo = {
    id: 'fix-any-to-proper-type',
    title: MENSAGENS_CORRECAO_TIPOS.fixAny.title,
    description: MENSAGENS_CORRECAO_TIPOS.fixAny.description,
    pattern: /:\s*any\b/g,
    category: 'style',
    confidence: CONFIANCA_NIVEIS.DEFAULT,
    shouldApply: (match, fullCode, lineContext, fileCaminho) => {
        if (isInStringOrComment(fullCode, match.index || 0)) {
            return false;
        }
        if (isTypeScriptContext(fullCode, match.index || 0)) {
            return false;
        }
        if (fileCaminho?.includes('.d.ts') || fileCaminho?.includes('/@types/')) {
            return false;
        }
        if (isLegacyOrVendorFile(fileCaminho)) {
            return false;
        }
        if (isAnyInGenericFunction(fullCode, match.index || 0)) {
            return false;
        }
        return true;
    },
    fix: (match, fullCode) => {
        return fullCode;
    }
};
export async function fixAnyToProperTypeAsync(match, fullCode, fileCaminho, ast) {
    try {
        const typeAnalise = await analyzeTypeUsage(match, fullCode, fileCaminho, ast);
        if (typeAnalise.confidence >= CONFIANCA_NIVEIS.HIGH) {
            if (typeAnalise.isSimpleType) {
                const fixedCodigo = fullCode.replace(match[0], `: ${typeAnalise.inferredTipo}`);
                const validation = await validateTypeReplacement(fullCode, fixedCodigo, typeAnalise);
                if (!validation.isCompatible) {
                    return {
                        code: fullCode,
                        applied: false,
                        reason: `Validação falhou: ${validation.errors.join(', ')}`,
                        warnings: validation.warnings.map(w => ({
                            type: 'unsafe-type',
                            message: w,
                            suggestion: 'Revise manualmente'
                        }))
                    };
                }
                return {
                    code: fixedCodigo,
                    applied: true,
                    warnings: validation.warnings.map(w => ({
                        type: 'type-suggestion',
                        message: w,
                        suggestion: MENSAGENS_CORRECAO_TIPOS.validacao.revisar
                    }))
                };
            }
            else {
                const typeCaminho = await createTypeDefinition(typeAnalise, fileCaminho);
                const importStatement = `import type { ${typeAnalise.typeName} } from '${typeCaminho}';\n`;
                const lines = fullCode.split('\n');
                const importIndex = findImportInsertionPoint(lines);
                lines.splice(importIndex, 0, importStatement);
                let fixedCodigo = lines.join('\n');
                fixedCodigo = fixedCodigo.replace(match[0], `: ${typeAnalise.typeName}`);
                const validation = await validateTypeReplacement(fullCode, fixedCodigo, typeAnalise);
                if (!validation.isCompatible) {
                    return {
                        code: fullCode,
                        applied: false,
                        reason: `Validação falhou: ${validation.errors.join(', ')}`
                    };
                }
                return {
                    code: fixedCodigo,
                    applied: true,
                    additionalChanges: [{
                            type: 'add-import',
                            content: importStatement
                        }, {
                            type: 'create-type-file',
                            content: typeAnalise.typeDefinition,
                            path: buildTypesRelPathPosix(typeAnalise.suggestedPath)
                        }]
                };
            }
        }
        else if (typeAnalise.confidence >= CONFIANCA_NIVEIS.MEDIUM) {
            const warning = {
                type: 'type-suggestion',
                message: MENSAGENS_CORRECAO_TIPOS.warnings.confiancaMedia(typeAnalise.confidence, typeAnalise.inferredTipo),
                suggestion: MENSAGENS_CORRECAO_TIPOS.warnings.criarTipoDedicado(typeAnalise.suggestedPath),
                confidence: typeAnalise.confidence
            };
            return {
                code: fullCode,
                applied: false,
                reason: `Confiança média (${typeAnalise.confidence}%) - sugestão apenas`,
                warnings: [warning]
            };
        }
        else {
            const warning = {
                type: 'unsafe-type',
                message: MENSAGENS_CORRECAO_TIPOS.warnings.confiancaBaixa(typeAnalise.confidence),
                suggestion: MENSAGENS_CORRECAO_TIPOS.warnings.useTiposCentralizados(),
                needsManualReview: true
            };
            return {
                code: fullCode,
                applied: false,
                reason: `Confiança baixa (${typeAnalise.confidence}%)`,
                warnings: [warning]
            };
        }
    }
    catch (error) {
        return {
            code: fullCode,
            applied: false,
            reason: MENSAGENS_CORRECAO_TIPOS.erros.analise(error instanceof Error ? error.message : String(error))
        };
    }
}
function findImportInsertionPoint(lines) {
    let lastImportIndex = -1;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) {
            continue;
        }
        if (line.startsWith('import ')) {
            lastImportIndex = i;
        }
        if (line && !line.startsWith('import ') && lastImportIndex !== -1) {
            break;
        }
    }
    return lastImportIndex + 1;
}
//# sourceMappingURL=fix-any-to-proper-type.js.map