import type { Dirent } from 'node:fs';
import type { FileEntryWithAst, Ocorrencia } from '../../index.js';
import type { GuardianResult } from '../../guardian/resultado.js';
export interface AmbienteExecucao {
    arquivosValidosSet: Set<string>;
    guardian: GuardianResult;
}
export type ReportNivel = 'info' | 'aviso' | 'erro' | 'sucesso';
export interface ReportEvent {
    code?: string;
    tipo: string;
    nivel?: ReportNivel;
    mensagem?: string;
    data?: Record<string, unknown>;
    relPath: string;
    linha?: number;
    coluna?: number;
    origem?: string;
}
export type ReporterFn = (event: ReportEvent) => Ocorrencia | void;
export interface ContextoExecucao {
    baseDir: string;
    arquivos: FileEntryWithAst[];
    ambiente?: AmbienteExecucao;
    report?: ReporterFn;
}
export interface InquisicaoOptions {
    includeContent?: boolean;
    incluirMetadados?: boolean;
    skipExec?: boolean;
}
export interface ScanOptions {
    includeContent?: boolean;
    includeAst?: boolean;
    filter?: (relPath: string, entry: Dirent) => boolean;
    onProgress?: (msg: string) => void;
}
//# sourceMappingURL=ambiente.d.ts.map