import { analistaAngular } from '../detectores/detector-angular.js';
import { analistaArquitetura } from '../detectores/detector-arquitetura.js';
import { analistaCodigoFragil } from '../detectores/detector-codigo-fragil.js';
import { analistaConstrucoesSintaticas } from '../detectores/detector-construcoes-sintaticas.js';
import * as detectorDependenciasMod from '../detectores/detector-dependencias.js';
import { analistaDuplicacoes } from '../detectores/detector-duplicacoes.js';
import { analistaEstiloModerno } from '../detectores/detector-estilo-moderno.js';
import * as detectorEstruturaMod from '../detectores/detector-estrutura.js';
import detectorInterfacesInline from '../detectores/detector-interfaces-inline.js';
import { analistaDesempenho } from '../detectores/detector-performance.js';
import { analistaSeguranca } from '../detectores/detector-seguranca.js';
import detectorTiposInseguros from '../detectores/detector-tipos-inseguros.js';
import { analistaSugestoesContextuais } from '../estrategistas/sugestoes-contextuais.js';
import { analistaComandosCli } from '../js-ts/analista-comandos-cli.js';
import { analistaFuncoesLongas } from '../js-ts/analista-funcoes-longas.js';
import { analistaPadroesUso } from '../js-ts/analista-padroes-uso.js';
import { analistaTodoComentarios } from '../js-ts/analista-todo-comments.js';
import { analistaDocumentacao } from '../plugins/detector-documentacao.js';
import { detectorMarkdown } from '../plugins/detector-markdown.js';
import { comSupressaoInline } from '../../shared/helpers/analista-wrapper.js';
import { discoverAnalistasPlugins } from './autodiscovery.js';
let analistaCorrecaoAutomatica = undefined;
try {
    const mod = await import('../corrections/analista-pontuacao.js');
    const dynamicMod = mod;
    analistaCorrecaoAutomatica = dynamicMod.analistaCorrecaoAutomatica ?? dynamicMod.analistas?.[0] ?? dynamicMod.default ?? undefined;
}
catch {
}
const pluginsAutodiscovered = await discoverAnalistasPlugins();
const detectorDependencias = detectorDependenciasMod.detectorDependencias ?? detectorDependenciasMod.default ?? detectorDependenciasMod;
const detectorEstrutura = detectorEstruturaMod.detectorEstrutura ?? detectorEstruturaMod.default ?? detectorEstruturaMod;
export const registroAnalistas = [
    comSupressaoInline(detectorDependencias), comSupressaoInline(detectorEstrutura), comSupressaoInline(analistaFuncoesLongas), comSupressaoInline(analistaPadroesUso), comSupressaoInline(analistaComandosCli), comSupressaoInline(analistaTodoComentarios),
    comSupressaoInline(analistaConstrucoesSintaticas), comSupressaoInline(analistaCodigoFragil), comSupressaoInline(analistaDuplicacoes), comSupressaoInline(analistaAngular),
    comSupressaoInline(analistaArquitetura),
    comSupressaoInline(analistaDesempenho),
    comSupressaoInline(analistaEstiloModerno),
    comSupressaoInline(analistaSeguranca), comSupressaoInline(analistaDocumentacao), comSupressaoInline(detectorMarkdown), comSupressaoInline(detectorTiposInseguros), comSupressaoInline(detectorInterfacesInline),
    ...pluginsAutodiscovered.map(p => comSupressaoInline(p)),
    analistaSugestoesContextuais,
    ...(analistaCorrecaoAutomatica ? [analistaCorrecaoAutomatica] : [])
];
export function listarAnalistas() {
    return registroAnalistas.map(a => ({
        nome: a.nome || 'desconhecido',
        categoria: a.categoria || 'n/d',
        descricao: a.descricao || ''
    }));
}
//# sourceMappingURL=registry.js.map