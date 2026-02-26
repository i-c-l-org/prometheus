import type { FileEntry, FileEntryWithAst, InquisicaoOptions, ReporterFn, ResultadoInquisicaoCompleto, Tecnica } from '../../types/index.js';
import { executarInquisicao as executarExecucao, registrarUltimasMetricas } from './executor.js';
export declare function prepararComAst(entries: FileEntry[], baseDir: string): Promise<FileEntryWithAst[]>;
export declare function iniciarInquisicao(baseDir?: string, options?: InquisicaoOptions, tecnicas?: Tecnica[], executorOpts?: {
    events?: import('./executor.js').ExecutorEventEmitter;
    reporter?: ReporterFn;
    verbose?: boolean;
    compact?: boolean;
    fast?: boolean;
}): Promise<ResultadoInquisicaoCompleto>;
export { executarExecucao as executarInquisicao, registrarUltimasMetricas };
//# sourceMappingURL=inquisidor.d.ts.map