import { buildTypesRelPathPosix, getTypesDirectoryDisplay } from '../../../core/config/conventions.js';
import { MENSAGENS_CORRECAO_TIPOS } from '../../../core/messages/index.js';
import { isInStringOrComment, isLegacyOrVendorFile, isUnknownInGenericContext } from '../type-safety/context-analyzer.js';
import { analyzeUnknownUsage } from '../type-safety/type-analyzer.js';
import { createTypeDefinition } from '../type-safety/type-creator.js';
import { validateTypeReplacement } from '../type-safety/type-validator.js';
export const fixUnknownToSpecificTipo = {
    id: 'fix-unknown-to-specific-type',
    title: MENSAGENS_CORRECAO_TIPOS.fixUnknown.title,
    description: MENSAGENS_CORRECAO_TIPOS.fixUnknown.description,
    pattern: /:\s*unknown\b/g,
    category: 'style',
    confidence: 75,
    shouldApply: (match, fullCode, lineContext, fileCaminho) => {
        if (isInStringOrComment(fullCode, match.index || 0)) {
            return false;
        }
        if (fileCaminho?.includes('.d.ts') || fileCaminho?.includes('/@types/')) {
            return false;
        }
        if (isLegacyOrVendorFile(fileCaminho)) {
            return false;
        }
        if (isUnknownInGenericContext(fullCode, match.index || 0)) {
            return false;
        }
        return true;
    },
    fix: (match, fullCode) => {
        return fullCode;
    }
};
export async function fixUnknownToSpecificTypeAsync(match, fullCode, fileCaminho, ast) {
    try {
        const typeAnalise = await analyzeUnknownUsage(match, fullCode, fileCaminho, ast);
        if (typeAnalise.confidence >= 90) {
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
        else if (typeAnalise.confidence >= 70) {
            const warning = {
                type: 'type-suggestion',
                message: `unknown pode ser substituído por tipo específico: ${typeAnalise.inferredTipo}`,
                suggestion: `Crie interface em ${buildTypesRelPathPosix(typeAnalise.suggestedPath)}`,
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
                type: 'keep-unknown',
                message: 'unknown apropriado aqui (entrada genérica ou baixa confiança)',
                suggestion: `Se possível, adicione type guards ou crie tipo dedicado em ${getTypesDirectoryDisplay()}`
            };
            return {
                code: fullCode,
                applied: false,
                reason: `Confiança baixa (${typeAnalise.confidence}%) - manter unknown`,
                warnings: [warning]
            };
        }
    }
    catch (error) {
        return {
            code: fullCode,
            applied: false,
            reason: `Erro na análise: ${error instanceof Error ? error.message : String(error)}`
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
//# sourceMappingURL=fix-unknown-to-specific-type.js.map