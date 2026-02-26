import { createI18nMessages } from '../../../shared/helpers/i18n.js';
export const DetectorDependenciasMensagens = createI18nMessages({
    importDependenciaExterna: (val) => `Importação de dependência externa: '${val}'`,
    importRelativoLongo: (val) => `Import relativo sobe muitos diretórios: '${val}'`,
    importJsEmTs: (val) => `Importação de arquivo .js em TypeScript: '${val}'`,
    importArquivoInexistente: (val) => `Importação de arquivo inexistente: '${val}'`,
    requireDependenciaExterna: (val) => `Require de dependência externa: '${val}'`,
    requireRelativoLongo: (val) => `Require relativo sobe muitos diretórios: '${val}'`,
    requireJsEmTs: (val) => `Require de arquivo .js em TypeScript: '${val}'`,
    requireArquivoInexistente: (val) => `Require de arquivo inexistente: '${val}'`,
    importUsadoRegistroDinamico: (nome) => `Import '${nome}' usado via registro dinâmico (heurística)`,
    usoMistoRequireImport: 'Uso misto de require e import no mesmo arquivo. Padronize para um só estilo.',
    importCircularSelf: 'Importação circular detectada: o arquivo importa a si mesmo.',
    dependenciaCircular: (totalArquivos, caminhoCompleto) => `Dependência circular detectada (${totalArquivos} arquivo(s)): ${caminhoCompleto}`
}, {
    importDependenciaExterna: (val) => `External dependency import: '${val}'`,
    importRelativoLongo: (val) => `Relative import goes up too many directories: '${val}'`,
    importJsEmTs: (val) => `.js file import in TypeScript: '${val}'`,
    importArquivoInexistente: (val) => `Import of non-existent file: '${val}'`,
    requireDependenciaExterna: (val) => `External dependency require: '${val}'`,
    requireRelativoLongo: (val) => `Relative require goes up too many directories: '${val}'`,
    requireJsEmTs: (val) => `.js file require in TypeScript: '${val}'`,
    requireArquivoInexistente: (val) => `Require of non-existent file: '${val}'`,
    importUsadoRegistroDinamico: (nome) => `Import '${nome}' used via dynamic registry (heuristic)`,
    usoMistoRequireImport: 'Mixed use of require and import in the same file. Standardize to a single style.',
    importCircularSelf: 'Circular import detected: the file imports itself.',
    dependenciaCircular: (totalArquivos, caminhoCompleto) => `Circular dependency detected (${totalArquivos} file(s)): ${caminhoCompleto}`
});
//# sourceMappingURL=detector-dependencias-messages.js.map