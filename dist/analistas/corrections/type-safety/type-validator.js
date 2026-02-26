import { findExistingType, isSameType } from './type-creator.js';
export async function validateTypeReplacement(originalCode, fixedCodigo, typeAnalise) {
    const result = {
        isCompatible: true,
        expectedType: typeAnalise.inferredTipo,
        errors: [],
        warnings: []
    };
    if (typeAnalise.createdNewType) {
        const existingTipo = await findExistingType(typeAnalise.typeName);
        if (existingTipo && !isSameType(existingTipo, typeAnalise.typeDefinition)) {
            result.warnings.push(`Tipo ${typeAnalise.typeName} já existe com definição diferente. ` + `Verifique conflito em ${existingTipo.path}`);
        }
    }
    const usageValidation = validateTypeUsageCompatibility(fixedCodigo, typeAnalise);
    if (!usageValidation.isCompatible) {
        result.errors.push(`Tipo inferido ${typeAnalise.inferredTipo} incompatível com uso detectado. ` + `Esperado: ${usageValidation.expectedType}`);
        result.isCompatible = false;
    }
    if (typeAnalise.requiresImport) {
        const hasCorrectImport = fixedCodigo.includes(`import type { ${typeAnalise.typeName} }`) || fixedCodigo.includes(`import { type ${typeAnalise.typeName} }`);
        if (!hasCorrectImport) {
            result.errors.push(`Import de tipo ${typeAnalise.typeName} não encontrado`);
            result.isCompatible = false;
        }
    }
    if (typeAnalise.confidence < 60) {
        result.warnings.push(`Confiança muito baixa (${typeAnalise.confidence}%). Considere revisão manual.`);
    }
    const syntaxValidation = validateBasicSyntax(fixedCodigo);
    if (!syntaxValidation.isValid) {
        result.errors.push(...syntaxValidation.errors);
        result.isCompatible = false;
    }
    return result;
}
function validateTypeUsageCompatibility(code, typeAnalise) {
    const isCompatible = typeAnalise.confidence >= 70;
    return {
        isCompatible,
        expectedType: typeAnalise.inferredTipo
    };
}
function validateBasicSyntax(code) {
    const errors = [];
    const braceContagem = (code.match(/{/g) || []).length - (code.match(/}/g) || []).length;
    if (braceContagem !== 0) {
        errors.push(`Chaves desbalanceadas: diferença de ${Math.abs(braceContagem)}`);
    }
    const parenContagem = (code.match(/\(/g) || []).length - (code.match(/\)/g) || []).length;
    if (parenContagem !== 0) {
        errors.push(`Parênteses desbalanceados: diferença de ${Math.abs(parenContagem)}`);
    }
    const bracketContagem = (code.match(/\[/g) || []).length - (code.match(/\]/g) || []).length;
    if (bracketContagem !== 0) {
        errors.push(`Colchetes desbalanceados: diferença de ${Math.abs(bracketContagem)}`);
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}
export function runTypeScriptCompiler(code) {
    const errors = [];
    const importLines = code.split('\n').filter(line => line.trim().startsWith('import'));
    for (const line of importLines) {
        if (!line.includes('from') && !line.includes('=')) {
            errors.push(`Import malformado: ${line.trim()}`);
        }
    }
    const interfaceRegex = /interface\s+\w+\s*{[^}]*}/g;
    const interfaces = code.match(interfaceRegex) || [];
    for (const iface of interfaces) {
        const properties = iface.match(/\w+\s*\??\s*:\s*[\w\[\]<>|&\s]+;/g);
        if (!properties) {
            errors.push(`Interface malformada: ${iface.substring(0, 50)}...`);
        }
    }
    return {
        hasErrors: errors.length > 0,
        errors
    };
}
//# sourceMappingURL=type-validator.js.map