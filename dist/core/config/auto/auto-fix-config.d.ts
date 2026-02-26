import type { AutoFixConfig } from '../../../types/index.js';
export type { AutoFixConfig };
export declare const PADRAO_AUTO_CORRECAO_CONFIGURACAO: AutoFixConfig;
export declare const CONSERVADORA_AUTO_CORRECAO_CONFIGURACAO: AutoFixConfig;
export declare const AGRESSIVA_AUTO_CORRECAO_CONFIGURACAO: AutoFixConfig;
export declare const AUTO_CORRECAO_CONFIGURACAO_PADROES: AutoFixConfig;
export default AUTO_CORRECAO_CONFIGURACAO_PADROES;
export declare function shouldExcludeFile(fileCaminho: string, config: AutoFixConfig): boolean;
export declare function shouldExcludeFunction(functionName: string, config: AutoFixConfig): boolean;
export declare function isCategoryAllowed(category: string, config: AutoFixConfig): boolean;
export declare function hasMinimumConfidence(confidence: number, config: AutoFixConfig): boolean;
export declare function getAutoFixConfig(mode?: string): AutoFixConfig;
//# sourceMappingURL=auto-fix-config.d.ts.map