import { toKebabCase } from './context-analyzer.js';
export function inferTypeFromUsage(varNome, patterns, _filePath) {
    const result = {
        confidence: 0,
        inferredTipo: 'unknown',
        isSimpleType: false,
        typeName: '',
        typeDefinition: '',
        suggestedPath: ''
    };
    if (patterns.allUsagesAreString) {
        result.inferredTipo = 'string';
        result.isSimpleType = true;
        result.confidence = 95;
        return result;
    }
    if (patterns.allUsagesAreNumber) {
        result.inferredTipo = 'number';
        result.isSimpleType = true;
        result.confidence = 95;
        return result;
    }
    if (patterns.allUsagesAreBoolean) {
        result.inferredTipo = 'boolean';
        result.isSimpleType = true;
        result.confidence = 95;
        return result;
    }
    if (patterns.isArray) {
        const elementTipo = inferArrayElementType(patterns);
        result.inferredTipo = `${elementTipo}[]`;
        result.isSimpleType = elementTipo === 'string' || elementTipo === 'number' || elementTipo === 'boolean';
        result.confidence = 85;
        return result;
    }
    if (patterns.isFunction) {
        result.inferredTipo = 'Function';
        result.isSimpleType = true;
        result.confidence = 80;
        result.suggestion = 'Considere usar tipo de função específico: (param: T) => R';
        return result;
    }
    if (patterns.hasObjectStructure && patterns.objectProperties) {
        const inferredInterface = inferInterfaceFromProperties(varNome, patterns.objectProperties);
        result.inferredTipo = inferredInterface.name;
        result.typeName = inferredInterface.name;
        result.typeDefinition = inferredInterface.definition;
        result.isSimpleType = false;
        result.confidence = inferredInterface.confidence;
        result.suggestedPath = `${toKebabCase(inferredInterface.name)}.ts`;
        result.createdNewType = true;
        result.requiresImport = true;
        return result;
    }
    if (patterns.hasTypeGuards && patterns.typeGuards) {
        const guardTipo = extractTypeFromGuards(patterns.typeGuards);
        result.inferredTipo = guardTipo.type;
        result.isSimpleType = isPrimitiveType(guardTipo.type);
        result.confidence = guardTipo.confidence;
        return result;
    }
    if (patterns.unionTypes && patterns.unionTypes.length > 0) {
        result.inferredTipo = patterns.unionTypes.join(' | ');
        result.isSimpleType = false;
        result.confidence = 70;
        result.suggestion = 'Considere criar type alias para união complexa';
        return result;
    }
    result.inferredTipo = 'unknown';
    result.confidence = 30;
    result.suggestion = 'Adicione type guards ou crie tipo dedicado manualmente';
    return result;
}
export function inferInterfaceFromProperties(varNome, properties) {
    const interfaceNome = toPascalCase(varNome);
    const confidence = calculateInterfaceConfidence(properties);
    const propertiesCodigo = properties.map(prop => {
        const optional = prop.isOptional ? '?' : '';
        return `  ${prop.name}${optional}: ${prop.inferredTipo};`;
    }).join('\n');
    const definition = `export interface ${interfaceNome} {\n${propertiesCodigo}\n}`;
    return {
        name: interfaceNome,
        definition,
        confidence,
        properties
    };
}
export function extractTypeFromGuards(typeGuards) {
    if (typeGuards.length === 0) {
        return {
            type: 'unknown',
            confidence: 0
        };
    }
    const types = typeGuards.map(g => g.inferredTipo);
    const uniqueTipos = [...new Set(types)];
    if (uniqueTipos.length === 1) {
        const avgConfidence = typeGuards.reduce((sum, g) => sum + g.confidence, 0) / typeGuards.length;
        return {
            type: uniqueTipos[0],
            confidence: avgConfidence
        };
    }
    const avgConfidence = typeGuards.reduce((sum, g) => sum + g.confidence, 0) / typeGuards.length;
    return {
        type: uniqueTipos.join(' | '),
        confidence: avgConfidence * 0.9
    };
}
function calculateInterfaceConfidence(properties) {
    if (properties.length === 0) {
        return 30;
    }
    const avgConfidence = properties.reduce((sum, prop) => sum + prop.confidence, 0) / properties.length;
    let bonus = 0;
    if (properties.length >= 3)
        bonus = 5;
    if (properties.length >= 5)
        bonus = 10;
    return Math.min(100, Math.round(avgConfidence + bonus));
}
function inferArrayElementType(patterns) {
    if (patterns.allUsagesAreString)
        return 'string';
    if (patterns.allUsagesAreNumber)
        return 'number';
    if (patterns.allUsagesAreBoolean)
        return 'boolean';
    return 'unknown';
}
function isPrimitiveType(type) {
    const primitives = ['string', 'number', 'boolean', 'null', 'undefined', 'symbol', 'bigint'];
    return primitives.includes(type.toLowerCase());
}
function toPascalCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1 $2').split(/[\s_-]+/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('');
}
//# sourceMappingURL=type-inference.js.map