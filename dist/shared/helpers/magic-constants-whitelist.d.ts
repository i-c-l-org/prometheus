import type { MagicConstantRule } from '../../types/index.js';
export type { MagicConstantRule };
export declare const DISCORD_LIMITES: MagicConstantRule[];
export declare const HTTP_STATUS_CODIGOS: MagicConstantRule[];
export declare const COMUM_LIMITES: MagicConstantRule[];
export declare const MATH_CONSTANTES: MagicConstantRule[];
export declare const FRAMEWORK_WHITELISTS: Record<string, MagicConstantRule[]>;
export declare function isWhitelistedConstant(value: number, frameworks: string[], userWhitelist?: number[]): boolean;
export declare function getConstantDescription(value: number, frameworks: string[]): string | undefined;
//# sourceMappingURL=magic-constants-whitelist.d.ts.map