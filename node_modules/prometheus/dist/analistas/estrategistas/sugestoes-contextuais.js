import { detectarContextoInteligente } from '../detectores/detector-contexto-inteligente.js';
import { log } from '../../core/messages/index.js';
import { SugestoesContextuaisMensagens } from '../../core/messages/ui/sugestoes-contextuais-messages.js';
export const analistaSugestoesContextuais = {
    nome: 'sugestoes-contextuais',
    categoria: 'estrategia',
    descricao: 'Gera sugestões específicas baseadas no contexto real do projeto detectado',
    global: true,
    async aplicar(_src, _relPath, _ast, _fullPath, contexto) {
        const ocorrencias = [];
        if (!contexto) {
            return ocorrencias;
        }
        try {
            let packageJson;
            try {
                const pkgArquivo = contexto.arquivos.find(f => f.relPath === 'package.json');
                if (pkgArquivo?.content) {
                    packageJson = JSON.parse(pkgArquivo.content);
                }
            }
            catch {
            }
            const estruturaDetectada = Array.from(new Set(contexto.arquivos.map(f => f.relPath.includes('/') ? f.relPath.split('/')[0] : '').filter(dir => dir && dir !== '.')));
            const resultados = detectarContextoInteligente(estruturaDetectada, contexto.arquivos, packageJson);
            if (resultados.length === 0) {
                ocorrencias.push({
                    tipo: 'sugestoes_arquitetura',
                    nivel: 'info',
                    mensagem: SugestoesContextuaisMensagens.arquetipoNaoIdentificado,
                    relPath: '',
                    linha: 0
                });
                return ocorrencias;
            }
            const melhorResultado = resultados[0];
            const confiancaPercent = Math.round(melhorResultado.confiancaTotal * 100);
            ocorrencias.push({
                tipo: 'identificacao_projeto',
                nivel: 'info',
                mensagem: SugestoesContextuaisMensagens.projetoIdentificado(melhorResultado.tecnologia, confiancaPercent),
                relPath: '',
                linha: 0,
                detalhes: {
                    tecnologia: melhorResultado.tecnologia,
                    confianca: melhorResultado.confiancaTotal,
                    evidencias: melhorResultado.evidencias.length
                }
            });
            for (const sugestao of melhorResultado.sugestoesMelhoria || []) {
                ocorrencias.push({
                    tipo: 'sugestao_melhoria',
                    nivel: 'info',
                    mensagem: sugestao,
                    relPath: '',
                    linha: 0,
                    detalhes: {
                        tecnologia: melhorResultado.tecnologia,
                        categoria: 'melhoria'
                    }
                });
            }
            for (const problema of melhorResultado.problemasDetectados || []) {
                ocorrencias.push({
                    tipo: 'problema_seguranca',
                    nivel: 'aviso',
                    mensagem: problema,
                    relPath: '',
                    linha: 0,
                    detalhes: {
                        tecnologia: melhorResultado.tecnologia,
                        categoria: 'problema'
                    }
                });
            }
            const evidenciasTop = melhorResultado.evidencias.filter(e => e.confianca > 0.8).slice(0, 5);
            for (const evidencia of evidenciasTop) {
                let mensagem = '';
                const nivel = 'info';
                switch (evidencia.tipo) {
                    case 'dependencia':
                        mensagem = SugestoesContextuaisMensagens.evidenciaDependencia(evidencia.valor, melhorResultado.tecnologia);
                        break;
                    case 'import':
                        mensagem = SugestoesContextuaisMensagens.evidenciaImport(evidencia.valor, evidencia.localizacao);
                        break;
                    case 'codigo':
                        mensagem = SugestoesContextuaisMensagens.evidenciaCodigo(evidencia.localizacao);
                        break;
                    case 'estrutura':
                        mensagem = SugestoesContextuaisMensagens.evidenciaEstrutura(evidencia.valor, melhorResultado.tecnologia);
                        break;
                    default:
                        continue;
                }
                ocorrencias.push({
                    tipo: 'evidencia_contextual',
                    nivel,
                    mensagem,
                    relPath: evidencia.localizacao || '',
                    linha: 0,
                    detalhes: {
                        tecnologia: melhorResultado.tecnologia,
                        tipoEvidencia: evidencia.tipo,
                        confianca: evidencia.confianca
                    }
                });
            }
            if (resultados.length > 1) {
                const alternativas = resultados.slice(1, 3).map(r => `${r.tecnologia} (${Math.round(r.confiancaTotal * 100)}%)`).join(', ');
                ocorrencias.push({
                    tipo: 'tecnologias_alternativas',
                    nivel: 'info',
                    mensagem: SugestoesContextuaisMensagens.tecnologiasAlternativas(alternativas),
                    relPath: '',
                    linha: 0,
                    detalhes: {
                        alternativas: resultados.slice(1, 3)
                    }
                });
            }
        }
        catch (error) {
            const mensagem = SugestoesContextuaisMensagens.erroAnaliseContextual(error instanceof Error ? error.message : String(error));
            const ev = {
                tipo: 'sugestoes-contextuais-erro',
                nivel: 'aviso',
                mensagem,
                relPath: ''
            };
            if (contexto && typeof contexto.report === 'function') {
                try {
                    contexto.report(ev);
                }
                catch {
                    log.aviso(mensagem);
                }
            }
            else {
                log.aviso(mensagem);
                ocorrencias.push({
                    tipo: 'erro_analise',
                    nivel: 'aviso',
                    mensagem: SugestoesContextuaisMensagens.erroDuranteAnalise,
                    relPath: '',
                    linha: 0
                });
            }
        }
        return ocorrencias;
    }
};
//# sourceMappingURL=sugestoes-contextuais.js.map