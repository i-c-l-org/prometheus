import { createI18nMessages } from '../../../shared/helpers/i18n.js';
export const DetectorEstruturaMensagens = createI18nMessages({
    monorepoDetectado: 'Estrutura de monorepo detectada.',
    monorepoSemPackages: 'Monorepo sem pasta packages/.',
    fullstackDetectado: 'Estrutura fullstack detectada.',
    pagesSemApi: 'Projeto possui pages/ mas não possui api/.',
    estruturaMista: 'Projeto possui src/ e packages/ (monorepo) ao mesmo tempo. Avalie a organização.',
    muitosArquivosRaiz: 'Muitos arquivos na raiz do projeto. Considere organizar em pastas.',
    sinaisBackend: 'Sinais de backend detectados (controllers/, prisma/, api/).',
    sinaisFrontend: 'Sinais de frontend detectados (components/, pages/).',
    projetoGrandeSemSrc: 'Projeto grande sem pasta src/. Considere organizar o código fonte.',
    arquivosConfigDetectados: (detectados) => `Arquivos de configuração detectados: ${detectados.join(', ')}`,
    multiplosEntrypointsAgrupados: ({ previewGrupos, sufixoOcultos }) => sufixoOcultos && sufixoOcultos.length > 0 ? `Projeto possui múltiplos entrypoints (agrupados por diretório): ${previewGrupos} … (${sufixoOcultos} ocultos)` : `Projeto possui múltiplos entrypoints (agrupados por diretório): ${previewGrupos}`,
    multiplosEntrypointsLista: (preview, resto) => resto > 0 ? `Projeto possui múltiplos entrypoints: ${preview.join(', ')} … (+${resto} ocultos)` : `Projeto possui múltiplos entrypoints: ${preview.join(', ')}`
}, {
    monorepoDetectado: 'Monorepo structure detected.',
    monorepoSemPackages: 'Monorepo without packages/ folder.',
    fullstackDetectado: 'Fullstack structure detected.',
    pagesSemApi: 'Project has pages/ but no api/.',
    estruturaMista: 'Project has both src/ and packages/ (monorepo). Consider organization.',
    muitosArquivosRaiz: 'Many files at the project root. Consider organizing into folders.',
    sinaisBackend: 'Backend signs detected (controllers/, prisma/, api/).',
    sinaisFrontend: 'Frontend signs detected (components/, pages/).',
    projetoGrandeSemSrc: 'Large project without src/ folder. Consider organizing source code.',
    arquivosConfigDetectados: (detectados) => `Configuration files detected: ${detectados.join(', ')}`,
    multiplosEntrypointsAgrupados: ({ previewGrupos, sufixoOcultos }) => sufixoOcultos && sufixoOcultos.length > 0 ? `Project has multiple entrypoints (grouped by directory): ${previewGrupos} … (${sufixoOcultos} hidden)` : `Project has multiple entrypoints (grouped by directory): ${previewGrupos}`,
    multiplosEntrypointsLista: (preview, resto) => resto > 0 ? `Project has multiple entrypoints: ${preview.join(', ')} … (+${resto} hidden)` : `Project has multiple entrypoints: ${preview.join(', ')}`
});
//# sourceMappingURL=detector-estrutura-messages.js.map