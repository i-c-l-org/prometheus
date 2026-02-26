import { log } from '../../messages/index.js';
export function validateJavaScriptSyntax(code) {
    const result = {
        isValid: true,
        errors: [],
        warnings: []
    };
    try {
        const braceContagem = (code.match(/{/g) || []).length - (code.match(/}/g) || []).length;
        const parenContagem = (code.match(/\(/g) || []).length - (code.match(/\)/g) || []).length;
        const bracketContagem = (code.match(/\[/g) || []).length - (code.match(/\]/g) || []).length;
        if (braceContagem !== 0) {
            result.errors.push(`Chaves desbalanceadas: ${braceContagem > 0 ? 'faltam' : 'sobram'} ${Math.abs(braceContagem)} chave(s)`);
            result.isValid = false;
        }
        if (parenContagem !== 0) {
            result.errors.push(`Parênteses desbalanceados: ${parenContagem > 0 ? 'faltam' : 'sobram'} ${Math.abs(parenContagem)} parêntese(s)`);
            result.isValid = false;
        }
        if (bracketContagem !== 0) {
            result.errors.push(`Colchetes desbalanceados: ${bracketContagem > 0 ? 'faltam' : 'sobram'} ${Math.abs(bracketContagem)} colchete(s)`);
            result.isValid = false;
        }
        const tryBlocks = (code.match(/try\s*{/g) || []).length;
        const catchBlocks = (code.match(/catch\s*\(/g) || []).length;
        if (tryBlocks !== catchBlocks) {
            result.errors.push('Blocos try-catch desbalanceados');
            result.isValid = false;
        }
        const jsdocBlocks = (code.match(/\/\*\*[\s\S]*?\*\//g) || []).length;
        const codeStructures = (code.match(/(?:export\s+)?(?:async\s+)?(?:function|class|interface|type)\s+\w+/g) || []).length;
        if (jsdocBlocks > codeStructures + 5) {
            result.warnings.push(`Possível poluição de JSDoc: ${jsdocBlocks} blocos para ${codeStructures} estruturas`);
        }
        const importLines = code.split('\n').filter(line => line.trim().startsWith('import') || line.trim().startsWith('export'));
        for (const line of importLines) {
            if (!line.trim().endsWith(';') && !line.includes('from') && !line.includes('=')) {
                result.warnings.push(`Possível import/export malformado: ${line.trim().substring(0, 50)}...`);
            }
        }
    }
    catch (error) {
        result.errors.push(`Erro na validação de sintaxe: ${error instanceof Error ? error.message : String(error)}`);
        result.isValid = false;
    }
    return result;
}
export function validateQuickFixResult(originalCode, fixedCodigo, fixId) {
    const result = {
        isValid: true,
        errors: [],
        warnings: []
    };
    try {
        const syntaxValidation = validateJavaScriptSyntax(fixedCodigo);
        result.errors.push(...syntaxValidation.errors);
        result.warnings.push(...syntaxValidation.warnings);
        result.isValid = result.isValid && syntaxValidation.isValid;
        switch (fixId) {
            case 'wrap-async-with-try-catch':
                if (!fixedCodigo.includes('try {') || !fixedCodigo.includes('} catch')) {
                    result.errors.push('Try-catch não foi adicionado corretamente');
                    result.isValid = false;
                }
                const nestedTryContagem = (fixedCodigo.match(/try\s*{[^}]*try\s*{/g) || []).length;
                if (nestedTryContagem > 0) {
                    result.warnings.push('Possível try-catch aninhado desnecessário');
                }
                break;
            case 'remove-console-log':
                if (fixedCodigo.includes('console.log(') && !fixedCodigo.includes('// console.log(')) {
                    result.warnings.push('Console.log pode não ter sido comentado corretamente');
                }
                break;
            case 'fix-dangerous-html':
                if (fixedCodigo.includes('innerHTML') && !fixedCodigo.includes('textContent')) {
                    result.warnings.push('innerHTML pode não ter sido substituído corretamente');
                }
                break;
        }
        const sizeDiff = fixedCodigo.length - originalCode.length;
        if (sizeDiff > originalCode.length * 0.5) {
            result.warnings.push(`Código aumentou significativamente (${sizeDiff} caracteres)`);
        }
    }
    catch (error) {
        result.errors.push(`Erro na validação da correção: ${error instanceof Error ? error.message : String(error)}`);
        result.isValid = false;
    }
    return result;
}
export function isSafeToApplyFix(code, fixId, match) {
    try {
        if (code.length < 100) {
            return false;
        }
        const validation = validateJavaScriptSyntax(code);
        if (validation.errors.length > 3) {
            return false;
        }
        switch (fixId) {
            case 'wrap-async-with-try-catch':
                const lines = code.split('\n');
                const matchLine = match.index ? code.substring(0, match.index).split('\n').length - 1 : 0;
                const contextLines = lines.slice(Math.max(0, matchLine - 5), Math.min(lines.length, matchLine + 5));
                const context = contextLines.join(' ');
                if (context.includes('try') || context.includes('catch') || context.includes('.catch')) {
                    return false;
                }
                if (context.includes('Promise.allSettled')) {
                    return false;
                }
                break;
            case 'remove-console-log':
                const beforeMatch = code.substring(Math.max(0, (match.index || 0) - 200), match.index || 0);
                if (beforeMatch.includes('debug') || beforeMatch.includes('DEV_MODE') || beforeMatch.includes('VERBOSE')) {
                    return false;
                }
                break;
        }
        return true;
    }
    catch (error) {
        log.aviso(`⚠️ Erro ao validar segurança da correção ${fixId}: ${error instanceof Error ? error.message : String(error)}`);
        return false;
    }
}
//# sourceMappingURL=validacao.js.map