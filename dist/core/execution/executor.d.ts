import type { FileEntryWithAst, GuardianResult, MetricaExecucao, ReporterFn, ResultadoInquisicao, Tecnica } from '../../types/index.js';
export interface ExecutorEventEmitter {
    emit(event: string, data?: unknown): void;
}
export declare function executarInquisicao(fileEntriesComAst: FileEntryWithAst[], tecnicas: Tecnica[], baseDir: string, guardianResultado: GuardianResult, opts?: {
    verbose?: boolean;
    compact?: boolean;
    fast?: boolean;
    events?: ExecutorEventEmitter;
    reporter?: ReporterFn;
}): Promise<ResultadoInquisicao>;
export declare function registrarUltimasMetricas(metricas: MetricaExecucao | undefined): void;
//# sourceMappingURL=executor.d.ts.map