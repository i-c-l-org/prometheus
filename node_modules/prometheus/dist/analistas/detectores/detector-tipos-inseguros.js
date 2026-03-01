import { categorizarUnknown, extractVariableName, isAnyInGenericFunction, isInStringOrComment, isLegacyOrVendorFile, isTypeScriptContext, isUnknownInGenericContext } from '../corrections/type-safety/context-analyzer.js';
import { config } from '../../core/config/config.js';
import { shouldSuppressOccurrence } from '../../shared/helpers/rule-config.js';
const ANALISTA = {
    nome: 'detector-tipos-inseguros',
    categoria: 'code-quality',
    descricao: 'Detecta uso de any e unknown que podem ser substituídos por tipos específicos',
    test: (relPath) => {
        return relPath.endsWith('.ts') || relPath.endsWith('.tsx');
    },
    aplicar: async (srcParam, relPath, _ast, fullCaminho) => {
        const ocorrencias = [];
        const src = srcParam.replace(/\r\n/g, '\n');
        const isTestArquivo = (p) => {
            const rel = p.replace(/\\/g, '/').toLowerCase();
            return /(^|\/)tests?(\/|\.)/.test(rel) || /__tests__/.test(rel) || /\.(test|spec)\.(ts|tsx|js|jsx)$/.test(rel);
        };
        const allowAnyInTests = Boolean(config.testPadroes?.allowAnyType);
        if (allowAnyInTests && isTestArquivo(fullCaminho || relPath)) {
            return ocorrencias;
        }
        if (isLegacyOrVendorFile(fullCaminho || relPath)) {
            return ocorrencias;
        }
        const anyPadrao = /:\s*any\b/g;
        let anyMatch;
        while ((anyMatch = anyPadrao.exec(src)) !== null) {
            const position = anyMatch.index || 0;
            if (isInStringOrComment(src, position)) {
                continue;
            }
            if (isTypeScriptContext(src, position)) {
                continue;
            }
            if (isAnyInGenericFunction(src, position)) {
                continue;
            }
            const varNome = extractVariableName(anyMatch, src);
            const linha = src.substring(0, position).split('\n').length;
            const lineContext = src.split('\n')[linha - 1]?.trim() || '';
            let mensagem = '';
            let sugestao = '';
            if (/catch\s*\(\s*\w+\s*:\s*any\s*\)/.test(lineContext)) {
                mensagem = varNome ? `'any' em catch block '${varNome}' - TypeScript recomenda 'unknown'` : "'any' em catch block - TypeScript recomenda 'unknown'";
                sugestao = 'Substitua por: catch (error: unknown) { ... }';
            }
            else if (/callback\s*:\s*\([^)]*:\s*any/.test(lineContext)) {
                mensagem = varNome ? `Callback '${varNome}' com parâmetro 'any' - tipagem fraca` : "Callback com parâmetro 'any' - tipagem fraca";
                sugestao = 'Defina interface do callback: (param: TipoEspecifico) => void';
            }
            else if (/event\s*:\s*any|e\s*:\s*any/.test(lineContext)) {
                mensagem = varNome ? `Event handler '${varNome}' com 'any' - pode usar Event types` : "Event handler com 'any' - pode usar Event types";
                sugestao = 'Use tipos do DOM: MouseEvent, KeyboardEvent, etc ou React.SyntheticEvent<T>';
            }
            else if (/\[\s*key\s*:\s*string\s*\]\s*:\s*any/.test(lineContext)) {
                mensagem = 'Índice extensível com any - muito permissivo';
                sugestao = 'Use: [key: string]: unknown (mais seguro) ou defina union type';
            }
            else if (/Record<[^,]+,\s*any>/.test(lineContext)) {
                mensagem = varNome ? `Record com 'any' em '${varNome}' - sem type safety` : "Record com 'any' - sem type safety";
                sugestao = 'Use Record<string, unknown> ou interface específica';
            }
            else if (/Array<any>/.test(lineContext) || /any\[\]/.test(lineContext)) {
                mensagem = varNome ? `Array de 'any' em '${varNome}' - perde tipagem` : "Array de 'any' - perde tipagem";
                sugestao = 'Especifique tipo do array: string[], number[], CustomType[], etc';
            }
            else {
                mensagem = varNome ? `Tipo 'any' em '${varNome}' desabilita verificação de tipos` : "Tipo 'any' desabilita verificação de tipos";
                sugestao = 'Analise uso da variável e defina tipo específico ou use unknown com type guards';
            }
            let contextoAdicional = '';
            if (fullCaminho?.includes('tipos/')) {
                contextoAdicional = ' | [AVISO] Arquivo de tipos - impacta toda base de codigo';
            }
            else if (fullCaminho?.includes('core/') || fullCaminho?.includes('shared/')) {
                contextoAdicional = ' | [AVISO] Modulo core/shared - usado por muitos componentes';
            }
            const mensagemCompleta = `${mensagem} | [SUGESTAO] ${sugestao}${contextoAdicional} | [REVISAO] Revisao manual obrigatoria`;
            if (shouldSuppressOccurrence('tipo-inseguro-any', relPath)) {
                continue;
            }
            ocorrencias.push({
                tipo: 'tipo-inseguro-any',
                nivel: 'aviso',
                mensagem: mensagemCompleta,
                relPath,
                linha,
                contexto: lineContext
            });
        }
        const asAnyPadrao = /\b(as\s+any)\b/g;
        let asAnyMatch;
        while ((asAnyMatch = asAnyPadrao.exec(src)) !== null) {
            const position = asAnyMatch.index || 0;
            if (isInStringOrComment(src, position)) {
                continue;
            }
            const linha = src.substring(0, position).split('\n').length;
            const lineContext = src.split('\n')[linha - 1]?.trim() || '';
            const after = src.substring(position, Math.min(src.length, position + 50));
            const mensagem = "Type assertion 'as any' desabilita verificação de tipos completamente";
            let sugestao = '';
            if (/\)\s*as\s+any/.test(lineContext)) {
                sugestao = 'Evite cast de retorno de função - tipar função corretamente ou usar unknown com type guard';
            }
            else if (/\.\w+\s+as\s+any/.test(lineContext)) {
                sugestao = 'Evite cast de propriedade - definir tipo correto no objeto pai';
            }
            else if (/\bas\s+any\s*\)/.test(after)) {
                sugestao = 'Type assertion em parâmetro - definir tipo correto na assinatura da função chamada';
            }
            else {
                sugestao = 'Substitua por tipo específico ou use unknown com validação runtime';
            }
            const mensagemCompleta = `${mensagem} | [SUGESTAO] ${sugestao} | [CRITICO] CRITICO: Type safety completamente desabilitado | [REVISAO] Revisao manual obrigatoria`;
            if (shouldSuppressOccurrence('tipo-inseguro-any-assertion', relPath)) {
                continue;
            }
            ocorrencias.push({
                tipo: 'tipo-inseguro-any-assertion',
                nivel: 'erro',
                mensagem: mensagemCompleta,
                relPath,
                linha,
                contexto: lineContext
            });
        }
        const angleBracketPadrao = /<any>/g;
        let angleBracketMatch;
        while ((angleBracketMatch = angleBracketPadrao.exec(src)) !== null) {
            const position = angleBracketMatch.index || 0;
            if (isInStringOrComment(src, position)) {
                continue;
            }
            const linha = src.substring(0, position).split('\n').length;
            const lineContext = src.split('\n')[linha - 1]?.trim() || '';
            const mensagemCompleta = "Type casting '<any>' (sintaxe legada) desabilita type safety | [SUGESTAO] Use sintaxe 'as' moderna e tipo especifico | [CRITICO] CRITICO: Migrar para sintaxe moderna e tipo correto | [REVISAO] Revisao manual obrigatoria";
            if (shouldSuppressOccurrence('tipo-inseguro-any-cast', relPath)) {
                continue;
            }
            ocorrencias.push({
                tipo: 'tipo-inseguro-any-cast',
                nivel: 'erro',
                mensagem: mensagemCompleta,
                relPath,
                linha,
                contexto: lineContext
            });
        }
        const unknownPadrao = /:\s*unknown\b/g;
        let unknownMatch;
        while ((unknownMatch = unknownPadrao.exec(src)) !== null) {
            const position = unknownMatch.index || 0;
            if (isInStringOrComment(src, position)) {
                continue;
            }
            if (isUnknownInGenericContext(src, position)) {
                continue;
            }
            const linha = src.substring(0, position).split('\n').length;
            const lineContext = src.split('\n')[linha - 1]?.trim() || '';
            const categorizacao = categorizarUnknown(src, fullCaminho || relPath, lineContext);
            const varNome = extractVariableName(unknownMatch, src);
            let mensagem = '';
            let nivel = 'info';
            if (categorizacao.categoria === 'legitimo') {
                if (categorizacao.confianca >= 95) {
                    continue;
                }
                mensagem = varNome ? `Tipo 'unknown' em '${varNome}': ${categorizacao.motivo}` : `Tipo 'unknown': ${categorizacao.motivo}`;
                nivel = 'info';
                if (categorizacao.sugestao) {
                    mensagem += ` | 💡 ${categorizacao.sugestao}`;
                }
            }
            else if (categorizacao.categoria === 'melhoravel') {
                nivel = 'aviso';
                mensagem = varNome ? `Tipo 'unknown' em '${varNome}' pode ser melhorado (${categorizacao.confianca}% confiança)` : `Tipo 'unknown' pode ser melhorado (${categorizacao.confianca}% confiança)`;
                mensagem += ` | ${categorizacao.motivo}`;
                if (categorizacao.sugestao) {
                    mensagem += ` | 💡 ${categorizacao.sugestao}`;
                }
                else {
                    mensagem += ` | 💡 Revisar uso para inferir tipo mais específico`;
                }
                mensagem += ` | ⚠️  Revisão manual recomendada`;
            }
            else {
                nivel = 'erro';
                mensagem = varNome ? `Tipo 'unknown' em '${varNome}' deve ser corrigido (${categorizacao.confianca}% confiança)` : `Tipo 'unknown' deve ser corrigido (${categorizacao.confianca}% confiança)`;
                mensagem += ` | ${categorizacao.motivo}`;
                if (categorizacao.sugestao) {
                    mensagem += ` | ✏️  ${categorizacao.sugestao}`;
                }
                mensagem += ` | [REVISAO] Revisao manual obrigatoria`;
            }
            if (shouldSuppressOccurrence('tipo-inseguro-unknown', relPath)) {
                continue;
            }
            ocorrencias.push({
                tipo: 'tipo-inseguro-unknown',
                nivel,
                mensagem,
                relPath,
                linha,
                contexto: lineContext
            });
        }
        return ocorrencias;
    }
};
export default ANALISTA;
//# sourceMappingURL=detector-tipos-inseguros.js.map