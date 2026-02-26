import type { InferredInterface, PropertyUsage, TypeAnalysis, UsagePattern } from '../../../types/index.js';
export declare function inferTypeFromUsage(varNome: string, patterns: UsagePattern, _filePath: string): TypeAnalysis;
export declare function inferInterfaceFromProperties(varNome: string, properties: PropertyUsage[]): InferredInterface;
export declare function extractTypeFromGuards(typeGuards: Array<{
    type: string;
    inferredTipo: string;
    confidence: number;
}>): {
    type: string;
    confidence: number;
};
//# sourceMappingURL=type-inference.d.ts.map