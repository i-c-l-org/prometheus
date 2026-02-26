export function isInString(code, position) {
    const normalizedCodigo = code.replace(/\r\n/g, '\n');
    const before = normalizedCodigo.substring(0, position);
    const singleQuotesBefore = (before.match(/(?<!\\)'/g) || []).length;
    const doubleQuotesBefore = (before.match(/(?<!\\)"/g) || []).length;
    const templateQuotesBefore = (before.match(/(?<!\\)`/g) || []).length;
    return singleQuotesBefore % 2 === 1 || doubleQuotesBefore % 2 === 1 || templateQuotesBefore % 2 === 1;
}
export function isInComment(code, position) {
    const normalizedCodigo = code.replace(/\r\n/g, '\n');
    const lines = normalizedCodigo.split('\n');
    let pos = 0;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineInicio = pos;
        const lineFim = pos + line.length;
        if (position >= lineInicio && position <= lineFim) {
            const posInLine = position - lineInicio;
            const commentInicio = line.indexOf('//');
            if (commentInicio !== -1 && posInLine >= commentInicio) {
                return true;
            }
            const blockInicio = normalizedCodigo.lastIndexOf('/*', position);
            const blockFim = normalizedCodigo.indexOf('*/', position);
            if (blockInicio !== -1 && (blockFim === -1 || blockFim > position)) {
                return true;
            }
            return false;
        }
        pos = lineFim + 1;
    }
    return false;
}
export function isInStringOrComment(code, position) {
    return isInString(code, position) || isInComment(code, position);
}
export function isTypeScriptContext(code, position) {
    const context = code.substring(Math.max(0, position - 50), position + 50);
    if (/<[^>]*>\s*\([^)]*\)\s*:\s*(any|unknown)/.test(context)) {
        return true;
    }
    return false;
}
export function isLegacyOrVendorFile(fileCaminho) {
    if (!fileCaminho)
        return false;
    const legacyPadroes = ['/legacy/', '/legado/', '/vendor/', '/node_modules/', '/dist/', '/build/', '.d.ts', '.min.js'];
    return legacyPadroes.some(pattern => fileCaminho.includes(pattern));
}
export function isUnknownInGenericContext(code, position) {
    const context = code.substring(Math.max(0, position - 200), position + 100);
    if (/function\s+\w+<T[^>]*>/.test(context)) {
        return true;
    }
    if (/JSON\.parse|deserialize|decode/.test(context)) {
        return true;
    }
    if (/fetch|axios|request|response\.data/.test(context)) {
        return true;
    }
    if (/salvar|persist|save|store|write.*:\s*\([^)]*dados:\s*unknown/.test(context)) {
        return true;
    }
    if (/Record<\s*string\s*,\s*unknown\s*>/.test(context)) {
        return true;
    }
    if (/Array<\s*unknown\s*>|unknown\s*\[\]/.test(context)) {
        return true;
    }
    if (/\w+\?\s*:\s*unknown/.test(context)) {
        return true;
    }
    if (/function\s+\w+\([^)]*:\s*unknown\)[^:]*:\s*\w+\s+is\s+\w+/.test(context)) {
        return true;
    }
    return false;
}
export function isAnyInGenericFunction(code, position) {
    const context = code.substring(Math.max(0, position - 300), position + 100);
    if (/callback\s*:\s*\([^)]*:\s*any/.test(context)) {
        return true;
    }
    if (/on\w+\s*:\s*\([^)]*:\s*any/.test(context)) {
        return true;
    }
    return false;
}
export function getDomainFromFilePath(fileCaminho) {
    const match = fileCaminho.match(/src\/([\w-]+)\//);
    if (match) {
        return match[1];
    }
    return 'shared';
}
export function toKebabCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase();
}
export function isDefinitionFile(fileCaminho) {
    return fileCaminho.endsWith('.d.ts');
}
export function isTypeScriptFile(fileCaminho) {
    return fileCaminho.endsWith('.ts') || fileCaminho.endsWith('.tsx');
}
export function extractVariableName(match, code) {
    const position = match.index || 0;
    const before = code.substring(Math.max(0, position - 100), position + match[0].length);
    const varMatch = before.match(/(\w+)\s*:\s*(?:any|unknown)\b/);
    if (varMatch) {
        return varMatch[1];
    }
    return null;
}
export function extractLineContext(code, position) {
    const lines = code.split('\n');
    let pos = 0;
    for (const line of lines) {
        const lineInicio = pos;
        const lineFim = pos + line.length;
        if (position >= lineInicio && position <= lineFim) {
            return line;
        }
        pos = lineFim + 1;
    }
    return '';
}
export function categorizarUnknown(code, fileCaminho, lineContext) {
    if (/:\s*unknown\)\s*:\s*\w+\s+is\s+/.test(lineContext)) {
        return {
            categoria: 'legitimo',
            confianca: 100,
            motivo: 'Type guard padrão TypeScript - unknown é a escolha correta'
        };
    }
    if (/catch\s*\(\s*\w+\s*:\s*unknown\s*\)/.test(lineContext)) {
        return {
            categoria: 'legitimo',
            confianca: 100,
            motivo: 'Catch block padrão TypeScript - unknown é recomendado'
        };
    }
    if (/\[\s*\w+\s*:\s*string\s*\]\s*:\s*unknown/.test(lineContext)) {
        return {
            categoria: 'legitimo',
            confianca: 100,
            motivo: 'Índice extensível - permite propriedades adicionais'
        };
    }
    if (/Record<[^,]+,\s*unknown>/.test(lineContext) || /Map<[^,]+,\s*unknown>/.test(lineContext)) {
        return {
            categoria: 'legitimo',
            confianca: 100,
            motivo: 'Objeto genérico - Record/Map com unknown é apropriado'
        };
    }
    if (/Array<unknown>/.test(lineContext) || /unknown\[\]/.test(lineContext)) {
        return {
            categoria: 'legitimo',
            confianca: 100,
            motivo: 'Array genérico - unknown[] é apropriado'
        };
    }
    if (/\w+\?\s*:\s*unknown/.test(lineContext)) {
        return {
            categoria: 'legitimo',
            confianca: 95,
            motivo: 'Parâmetro opcional - unknown é aceitável',
            sugestao: 'Considere usar tipo mais específico se o uso for conhecido'
        };
    }
    if (/guardian\s*:\s*unknown/.test(lineContext) || fileCaminho.includes('guardian')) {
        if (lineContext.includes('detalhes') || lineContext.includes('erros') || lineContext.includes('Error')) {
            return {
                categoria: 'corrigir',
                confianca: 90,
                motivo: 'Guardian error details tem estrutura conhecida',
                sugestao: 'Criar interface GuardianErrorDetails com campos específicos',
                variantes: ['interface GuardianErrorDetails { message: string; code?: string; stack?: string }', 'type GuardianError = Error | { message: string; details?: unknown }', 'Usar tipo Error nativo do TypeScript']
            };
        }
        return {
            categoria: 'melhoravel',
            confianca: 85,
            motivo: 'Guardian retorna dados não estruturados',
            sugestao: 'Criar interface GuardianResult com campos conhecidos',
            variantes: ['interface GuardianResult { status: "ok" | "erro"; baseline?: Baseline; drift?: Drift }', 'type GuardianOutput = SuccessResult | ErrorResult (discriminated union)', 'Usar zod/io-ts para validação runtime + tipos']
        };
    }
    if (/\bast\s*:\s*unknown/.test(lineContext) || /\bnode\s*:\s*unknown/.test(lineContext) || lineContext.includes('NodePath')) {
        return {
            categoria: 'melhoravel',
            confianca: 80,
            motivo: 'AST deveria ser tipado com Node do @babel/types',
            sugestao: 'import type { Node } from "@babel/types"; usar Node | null',
            variantes: ['Node (AST node genérico do Babel)', 'NodePath<Node> (para traverse)', 'File | Program | Statement | Expression (tipos específicos)']
        };
    }
    if (/salvar|persist|save|store|write|serialize|stringify/.test(lineContext) && /dados\s*:\s*unknown|value\s*:\s*unknown/.test(lineContext)) {
        return {
            categoria: 'legitimo',
            confianca: 95,
            motivo: 'Função de serialização - unknown é apropriado para dados genéricos',
            sugestao: 'Se formato for conhecido, use tipo genérico: <T = unknown>(dados: T) => ...'
        };
    }
    if (/validar|validate|check|assert|guard/.test(lineContext) && /\w+\s*:\s*unknown/.test(lineContext)) {
        return {
            categoria: 'legitimo',
            confianca: 95,
            motivo: 'Função de validação - recebe unknown e valida tipo'
        };
    }
    if (/safeGet|tryGet|getProperty/.test(lineContext) && /:\s*unknown/.test(lineContext) && !/:\s*unknown\)/.test(lineContext)) {
        return {
            categoria: 'legitimo',
            confianca: 95,
            motivo: 'Acesso dinâmico protegido - retorno é unknown por segurança',
            sugestao: 'Validar tipo após obter valor: const val = safeGet(...); if (typeof val === ...)'
        };
    }
    if (/replacer|reviver/.test(lineContext) && /\w+\s*:\s*unknown/.test(lineContext)) {
        return {
            categoria: 'legitimo',
            confianca: 95,
            motivo: 'Replacer/reviver do JSON - unknown é esperado'
        };
    }
    if (/wrap|parse|transform/.test(lineContext) && /ast\s*:\s*unknown|rawAst\s*:\s*unknown/.test(lineContext)) {
        return {
            categoria: 'legitimo',
            confianca: 95,
            motivo: 'Wrapper de parser - AST de origem desconhecida'
        };
    }
    if (/error\s*:\s*unknown|err\s*:\s*unknown|e\s*:\s*unknown/.test(lineContext) && (/extrair|extract|format|parse/.test(lineContext) || fileCaminho.includes('validacao'))) {
        return {
            categoria: 'legitimo',
            confianca: 95,
            motivo: 'Error handling - error pode ser de qualquer tipo em catch/callbacks'
        };
    }
    if (/mock|vitest|expect|args\s*:\s*unknown\[\]/.test(lineContext)) {
        return {
            categoria: 'legitimo',
            confianca: 95,
            motivo: 'Test utilities - tipos genéricos de framework de testes'
        };
    }
    if (/opts\s*:\s*unknown|options\s*:\s*unknown/.test(lineContext) && (fileCaminho.includes('cli') || /aplicar|process|handle/.test(lineContext))) {
        return {
            categoria: 'legitimo',
            confianca: 95,
            motivo: 'CLI framework callback - opts validado downstream'
        };
    }
    if (/as\s+unknown\s+as\s+\{[^}]*:\s*unknown/.test(lineContext)) {
        return {
            categoria: 'legitimo',
            confianca: 95,
            motivo: 'Type assertion para acesso dinâmico - padrão de compatibilidade'
        };
    }
    if (/(opts|options|params|args)\s*:\s*unknown/.test(lineContext)) {
        if (fileCaminho.includes('cli') || fileCaminho.includes('comando')) {
            return {
                categoria: 'legitimo',
                confianca: 85,
                motivo: 'Callback CLI - opts será validado downstream',
                sugestao: 'Considere tipar se a interface for conhecida',
                variantes: ['CommandOptions (interface do commander.js)', 'Record<string, string | boolean | number> (CLI flags genéricos)', 'Usar zod schema para validação + inferência de tipos']
            };
        }
        return {
            categoria: 'melhoravel',
            confianca: 70,
            motivo: 'Parâmetro genérico - pode ser mais específico',
            sugestao: 'Definir interface específica para os parâmetros',
            variantes: ['interface FunctionOptions { timeout?: number; verbose?: boolean; ... }', 'Partial<KnownConfig> (se for subset de config)', 'Usar tipo genérico com constraint: <T extends BaseOptions>']
        };
    }
    if (/filter\s*\(/.test(lineContext) || /map\s*\(/.test(lineContext)) {
        return {
            categoria: 'melhoravel',
            confianca: 75,
            motivo: 'Array operation com tipo genérico - pode inferir tipo do array',
            sugestao: 'Tipar o array pai para propagar tipos automaticamente',
            variantes: ['Especificar tipo do array: items: Item[] em vez de items: unknown[]', 'Usar generics: function filter<T>(items: T[], predicate: (item: T) => boolean)', 'Inferir do contexto: const typed = items as KnownType[]']
        };
    }
    if (fileCaminho.includes('relatorio') || fileCaminho.includes('fragmentar') || lineContext.includes('Manifest')) {
        return {
            categoria: 'melhoravel',
            confianca: 70,
            motivo: 'Dados de relatório - estrutura pode ser definida',
            sugestao: 'Criar interfaces específicas para estruturas de dados',
            variantes: ['interface RelatorioCompleto { summary: Summary; detalhes: Detalhe[]; ... }', 'interface ManifestPart { id: string; tipo: string; conteudo: unknown }', 'type RelatorioJson = { version: string; data: Record<string, unknown> }']
        };
    }
    if (fileCaminho.includes('chalk-safe') || /import\s*\(/.test(lineContext)) {
        return {
            categoria: 'legitimo',
            confianca: 95,
            motivo: 'Compatibilidade ESM/CJS - unknown necessário para imports dinâmicos',
            sugestao: 'Pode adicionar type assertion após validação runtime'
        };
    }
    const contextoAmplo = code.substring(Math.max(0, lineContext.length - 300), lineContext.length + 200);
    if (/typeof\s+\w+\s*===/.test(contextoAmplo) || /instanceof/.test(contextoAmplo) || /is\w+\(/.test(contextoAmplo)) {
        return {
            categoria: 'melhoravel',
            confianca: 65,
            motivo: 'Há validação de tipo próxima - pode extrair para type guard dedicado',
            sugestao: 'Criar função type guard: function isTipoX(obj: unknown): obj is TipoX { ... }',
            variantes: ['Extrair validações para type guard reutilizável', 'Usar biblioteca de validação (zod, yup, io-ts) para runtime + types', 'Criar branded types se for validação complexa']
        };
    }
    return {
        categoria: 'melhoravel',
        confianca: 60,
        motivo: 'Tipo unknown genérico - análise contextual limitada',
        sugestao: 'Analisar fluxo de dados para inferir tipo correto',
        variantes: ['Se vem de API externa: definir interface baseada na resposta esperada', 'Se é callback: especificar assinatura da função', 'Se é config/options: criar interface com campos opcionais', 'Se é polimórfico: considerar discriminated union ou generics']
    };
}
//# sourceMappingURL=context-analyzer.js.map