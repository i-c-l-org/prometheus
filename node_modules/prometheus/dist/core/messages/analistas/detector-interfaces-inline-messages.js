import { createI18nMessages } from '../../../shared/helpers/i18n.js';
export const DetectorInterfacesInlineMensagens = createI18nMessages({
    moverTipoParaTipos: (nomeTipo, tiposDir = 'src/tipos') => `Mover tipo '${nomeTipo}' para ${tiposDir.endsWith('/') ? tiposDir : `${tiposDir}/`}`,
    interfaceExportadaParaTipos: (nomeInterface, tiposDir = 'src/tipos') => `Interface '${nomeInterface}' exportada deve estar em ${tiposDir.endsWith('/') ? tiposDir : `${tiposDir}/`}`,
    interfaceComplexaParaTipos: (nomeInterface, tiposDir = 'src/tipos') => `Interface '${nomeInterface}' complexa deve ser movida para ${tiposDir.endsWith('/') ? tiposDir : `${tiposDir}/`}`,
    tipoDuplicado: (args) => `Tipo {${args.propriedades.join(', ')}...} duplicado ${args.totalOcorrencias}x ${args.contextoDesc} - extrair como '${args.nomesSugeridos}Type'`
}, {
    moverTipoParaTipos: (nomeTipo, tiposDir = 'src/tipos') => `Move type '${nomeTipo}' to ${tiposDir.endsWith('/') ? tiposDir : `${tiposDir}/`}`,
    interfaceExportadaParaTipos: (nomeInterface, tiposDir = 'src/tipos') => `Exported interface '${nomeInterface}' should be in ${tiposDir.endsWith('/') ? tiposDir : `${tiposDir}/`}`,
    interfaceComplexaParaTipos: (nomeInterface, tiposDir = 'src/tipos') => `Complex interface '${nomeInterface}' should be moved to ${tiposDir.endsWith('/') ? tiposDir : `${tiposDir}/`}`,
    tipoDuplicado: (args) => `Type {${args.propriedades.join(', ')}...} duplicated ${args.totalOcorrencias}x ${args.contextoDesc} - extract as '${args.nomesSugeridos}Type'`
});
//# sourceMappingURL=detector-interfaces-inline-messages.js.map