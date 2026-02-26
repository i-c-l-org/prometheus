import type { RuleConfig, RuleOverride } from '../../types/index.js';
export type { RuleConfig, RuleOverride };
export declare function isRuleSuppressed(ruleName: string, fileCaminho: string): boolean;
export declare function getRuleSeverity(ruleName: string, fileCaminho: string): 'error' | 'warning' | 'info' | undefined;
export declare function shouldSuppressOccurrence(tipo: string, fileCaminho: string, _severity?: string): boolean;
//# sourceMappingURL=rule-config.d.ts.map