import type { SvgoMinimoResult } from '../../types/index.js';
export type { SvgoMinimoMudanca, SvgoMinimoResult } from '../../types/index.js';
export declare const SVG_OPT_MIN_BYTES_SALVO = 40;
export declare const SVG_OPT_MIN_PORCENTAGEM_SALVO = 5;
export declare function shouldSugerirOtimizacaoSvg(originalBytes: number, optimizedBytes: number): boolean;
export declare function otimizarSvgLikeSvgo(params: {
    svg: string;
}): SvgoMinimoResult;
//# sourceMappingURL=svgs.d.ts.map