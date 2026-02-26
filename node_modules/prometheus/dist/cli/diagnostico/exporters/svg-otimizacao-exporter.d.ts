import type { FileEntryWithAst, SvgCandidate, SvgExportResult } from '../../../types/index.js';
export type { SvgCandidate, SvgExportResult };
export declare function exportarRelatorioSvgOtimizacao(params: {
    entries: FileEntryWithAst[];
    relatoriosDir: string;
    ts: string;
}): Promise<SvgExportResult>;
//# sourceMappingURL=svg-otimizacao-exporter.d.ts.map