import type { Node } from '@babel/types';
import type { UsagePattern, VariableUsage } from '../../../types/index.js';
export declare function findVariableUsages(varNome: string, ast: Node | null): VariableUsage[];
export declare function analyzeUsagePatterns(usages: VariableUsage[]): UsagePattern;
//# sourceMappingURL=usage-analyzer.d.ts.map