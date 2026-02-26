import type { AutoFixConfig, PatternBasedQuickFix } from '../../../types/index.js';
export type { PatternBasedQuickFix };
export declare const quickCorrecaoRegistro: PatternBasedQuickFix[];
export declare function findQuickFixes(code: string, problemTipo?: string, config?: AutoFixConfig, fileCaminho?: string): Array<PatternBasedQuickFix & {
    matches: RegExpMatchArray[];
}>;
export declare function applyQuickFix(code: string, fix: PatternBasedQuickFix, match: RegExpMatchArray): string;
//# sourceMappingURL=fix-config.d.ts.map