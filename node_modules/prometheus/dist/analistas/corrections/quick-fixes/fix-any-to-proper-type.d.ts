import type { Node } from '@babel/types';
import type { QuickFix, QuickFixResult } from '../../../types/index.js';
export declare const fixAnyToProperTipo: QuickFix;
export declare function fixAnyToProperTypeAsync(match: RegExpMatchArray, fullCode: string, fileCaminho: string, ast: Node | null): Promise<QuickFixResult>;
//# sourceMappingURL=fix-any-to-proper-type.d.ts.map