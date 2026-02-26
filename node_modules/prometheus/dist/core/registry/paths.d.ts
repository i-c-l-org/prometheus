export declare const PROJETO_RAIZ: string;
export declare const PROMETHEUS_DIRS: {
    readonly STATE: string;
    readonly METRICS_HISTORY: string;
    readonly REPORTS: string;
    readonly PERF: string;
};
export declare const PROMETHEUS_ARQUIVOS: {
    readonly CONFIG: string;
    readonly CONFIG_SAFE: string;
    readonly GUARDIAN_BASELINE: string;
    readonly ESTRUTURA_BASELINE: string;
    readonly ESTRUTURA_ARQUETIPO: string;
    readonly MAPA_REVERSAO: string;
    readonly REGISTRO_VIGIA: string;
    readonly METRICAS_HISTORICO: string;
    readonly GUARDIAN_BASELINE_LEGACY: string;
    readonly ESTRUTURA_BASELINE_LEGACY: string;
    readonly ESTRUTURA_ARQUETIPO_LEGACY_ROOT: string;
};
export declare const REPORT_PADROES: {
    readonly DIAGNOSTICO: (timestamp: string) => string;
    readonly SUMMARY_JSON: (timestamp: string) => string;
    readonly ASYNC_ANALYSIS: string;
    readonly PERF_BASELINE: (timestamp: string) => string;
    readonly PERF_DIFF: string;
};
export declare const MIGRACAO_MAPA: {
    readonly [PROMETHEUS_ARQUIVOS.GUARDIAN_BASELINE_LEGACY]: string;
    readonly [PROMETHEUS_ARQUIVOS.ESTRUTURA_BASELINE_LEGACY]: string;
    readonly [PROMETHEUS_ARQUIVOS.ESTRUTURA_ARQUETIPO_LEGACY_ROOT]: string;
};
export declare function resolveFilePath(newPath: string): string;
export type PrometheusFilePath = (typeof PROMETHEUS_ARQUIVOS)[keyof typeof PROMETHEUS_ARQUIVOS];
export type PrometheusDirPath = (typeof PROMETHEUS_DIRS)[keyof typeof PROMETHEUS_DIRS];
//# sourceMappingURL=paths.d.ts.map