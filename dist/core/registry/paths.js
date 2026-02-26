import path from 'node:path';
export const PROJETO_RAIZ = process.cwd();
export const PROMETHEUS_DIRS = {
    STATE: path.join(PROJETO_RAIZ, '.prometheus'),
    METRICS_HISTORY: path.join(PROJETO_RAIZ, '.prometheus', 'historico-metricas'),
    REPORTS: path.join(PROJETO_RAIZ, 'relatorios'),
    PERF: path.join(PROJETO_RAIZ, 'docs', 'perf')
};
export const PROMETHEUS_ARQUIVOS = {
    CONFIG: path.join(PROJETO_RAIZ, 'prometheus.config.json'),
    CONFIG_SAFE: path.join(PROJETO_RAIZ, 'prometheus.config.safe.json'),
    GUARDIAN_BASELINE: path.join(PROMETHEUS_DIRS.STATE, 'guardian.baseline.json'),
    ESTRUTURA_BASELINE: path.join(PROMETHEUS_DIRS.STATE, 'estrutura.baseline.json'),
    ESTRUTURA_ARQUETIPO: path.join(PROMETHEUS_DIRS.STATE, 'estrutura.arquetipo.json'),
    MAPA_REVERSAO: path.join(PROMETHEUS_DIRS.STATE, 'mapa-reversao.json'),
    REGISTRO_VIGIA: path.join(PROMETHEUS_DIRS.STATE, 'integridade.json'),
    METRICAS_HISTORICO: path.join(PROMETHEUS_DIRS.METRICS_HISTORY, 'metricas-historico.json'),
    GUARDIAN_BASELINE_LEGACY: path.join(PROMETHEUS_DIRS.STATE, 'baseline.json'),
    ESTRUTURA_BASELINE_LEGACY: path.join(PROMETHEUS_DIRS.STATE, 'baseline-estrutura.json'),
    ESTRUTURA_ARQUETIPO_LEGACY_ROOT: path.join(PROJETO_RAIZ, 'prometheus.repo.arquetipo.json')
};
export const REPORT_PADROES = {
    DIAGNOSTICO: (timestamp) => path.join(PROMETHEUS_DIRS.REPORTS, `prometheus-diagnostico-${timestamp}.md`),
    SUMMARY_JSON: (timestamp) => path.join(PROMETHEUS_DIRS.REPORTS, `prometheus-relatorio-summary-${timestamp}.json`),
    ASYNC_ANALYSIS: path.join(PROMETHEUS_DIRS.REPORTS, 'async-analysis-report.json'),
    PERF_BASELINE: (timestamp) => path.join(PROMETHEUS_DIRS.PERF, `baseline-${timestamp}.json`),
    PERF_DIFF: path.join(PROMETHEUS_DIRS.PERF, 'ultimo-diff.json')
};
export const MIGRACAO_MAPA = {
    [PROMETHEUS_ARQUIVOS.GUARDIAN_BASELINE_LEGACY]: PROMETHEUS_ARQUIVOS.GUARDIAN_BASELINE,
    [PROMETHEUS_ARQUIVOS.ESTRUTURA_BASELINE_LEGACY]: PROMETHEUS_ARQUIVOS.ESTRUTURA_BASELINE,
    [PROMETHEUS_ARQUIVOS.ESTRUTURA_ARQUETIPO_LEGACY_ROOT]: PROMETHEUS_ARQUIVOS.ESTRUTURA_ARQUETIPO
};
export function resolveFilePath(newPath) {
    const legacyCaminho = Object.entries(MIGRACAO_MAPA).find(([_, target]) => target === newPath)?.[0];
    return legacyCaminho || newPath;
}
//# sourceMappingURL=paths.js.map