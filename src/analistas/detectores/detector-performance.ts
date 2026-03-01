// SPDX-License-Identifier: MIT-0
// @prometheus-disable PROBLEMA_PERFORMANCE
// Justificativa: detector de performance que analisa código-fonte - loops são esperados
import type { NodePath } from '@babel/traverse';
import type { CallExpression, ForStatement, Node } from '@babel/types';
import { config } from '@core/config/config.js';
import { traverse } from '@core/config/traverse.js';
import { DetectorAgregadosMensagens } from '@core/messages/analistas/detector-agregados-messages.js';
import { detectarContextoProjeto } from '@shared/contexto-projeto.js';
import { filtrarOcorrenciasSuprimidas } from '@shared/helpers/suppressao.js';

import type { Analista, Ocorrencia, ProblemaPerformance } from '@';
import { criarOcorrencia } from '@';

const LIMITE_PERFORMANCE = config.ANALISE_LIMITES?.PERFORMANCE ?? {
  MAX_LOOPS_ANNIDED: 2,
  MAX_BLOCKING_OPS: 0,
  MAX_MEMORY_LEAKS: 0,
  MAX_N_PLUS_ONE: 0,
  MAX_INEFFICIENT_SPREAD: 0,
  MAX_LARGE_BUNDLE: 0,
  MAX_CONSOLE_LOG: 10,
  MAX_IGNORAR_TESTES: true
};

export const analistaDesempenho: Analista = {
  nome: 'performance',
  categoria: 'performance',
  descricao: 'Detecta problemas de performance e otimizações possíveis',
  limites: LIMITE_PERFORMANCE,
  test: (relPath: string): boolean => {
    return /\.(js|jsx|ts|tsx|mjs|cjs)$/.test(relPath);
  },
  aplicar: (src: string, relPath: string, ast: NodePath<Node> | null): Ocorrencia[] => {
    if (!src) return [];
    const contextoArquivo = detectarContextoProjeto({
      arquivo: relPath,
      conteudo: src,
      relPath
    });
    const problemas: ProblemaPerformance[] = [];
    try {
      // Detectar problemas por padrões de texto
      detectarPadroesPerformance(src, problemas, relPath);

      // Detectar problemas via AST quando disponível
      if (ast) {
        detectarProblemasPerformanceAST(ast, problemas, relPath);
      }

      // Converter para ocorrências
      const ocorrencias: Ocorrencia[] = [];

      // Agrupar por impacto
      const porImpacto = agruparPorImpacto(problemas);
      for (const [impacto, items] of Object.entries(porImpacto)) {
        if (items.length > 0) {
          const nivel = mapearImpactoParaNivel(impacto as ProblemaPerformance['impacto']);

          // Ser menos rigoroso com testes
          const nivelAjustado = contextoArquivo.isTest && nivel === 'aviso' ? 'info' : nivel;
          const resumo = items.slice(0, 3).map(p => p.tipo).join(', ');
          ocorrencias.push(criarOcorrencia({
            tipo: 'PROBLEMA_PERFORMANCE',
            nivel: nivelAjustado,
            mensagem: DetectorAgregadosMensagens.problemasPerformanceResumo(impacto, resumo, items.length),
            relPath,
            linha: items[0].linha
          }));
        }
      }

      // Aplicar supressões inline antes de retornar
      return filtrarOcorrenciasSuprimidas(ocorrencias, 'performance', src);
    } catch (erro) {
      return [criarOcorrencia({
        tipo: 'ERRO_ANALISE',
        nivel: 'aviso',
        mensagem: DetectorAgregadosMensagens.erroAnalisarPerformance(erro),
        relPath,
        linha: 1
      })];
    }
  }
};
function detectarConsoleEmProducao(linha: string, numeroLinha: number, problemas: ProblemaPerformance[]): void {
  const consolePatterns = [
    /console\.(log|debug|info|warn|error)\s*\(/,
  ];
  const ignoreComments = /\/\/\s*prometheus-ignore|\/\*\s*prometheus-ignore/i;

  for (const pattern of consolePatterns) {
    if (pattern.test(linha) && !ignoreComments.test(linha)) {
      problemas.push({
        tipo: 'console-in-production',
        descricao: 'Console.log/info/debug em código pode vazar informações em produção',
        impacto: 'baixo',
        linha: numeroLinha,
        coluna: linha.indexOf('console') + 1,
        sugestao: 'Remova console.log em produção ou use biblioteca de logging condicional'
      });
      return;
    }
  }
}

function detectarMemoryLeakClosure(linha: string, numeroLinha: number, problemas: ProblemaPerformance[]): void {
  const patterns = [
    /addEventListener\s*\(/,
    /setInterval\s*\(/,
    /setTimeout\s*\(/,
  ];

  for (const pattern of patterns) {
    if (pattern.test(linha)) {
      problemas.push({
        tipo: 'potential-memory-leak',
        descricao: 'Timer ou listener sem cleanup pode causar vazamento de memória',
        impacto: 'medio',
        linha: numeroLinha,
        coluna: linha.indexOf(pattern.source.replace(/\\/g, '')) + 1,
        sugestao: 'Certifique-se de remover o listener/timer no unmount do componente'
      });
      return;
    }
  }
}

function detectarDOMManipulation(linha: string, numeroLinha: number, problemas: ProblemaPerformance[]): void {
  const domPatterns = [
    /\.innerHTML\s*=/,
    /\.outerHTML\s*=/,
    /document\.write\s*\(/,
    /createElement\s*\(.*\)\.appendChild/,
  ];

  for (const pattern of domPatterns) {
    if (pattern.test(linha)) {
      const match = linha.match(pattern);
      const matchStr = match ? match[0] : '';
      problemas.push({
        tipo: 'inefficient-dom',
        descricao: 'Manipulação direta de DOM pode causar reflows/repaints desnecessários',
        impacto: 'medio',
        linha: numeroLinha,
        coluna: linha.indexOf(matchStr) + 1,
        sugestao: 'Use fragment ou batch operações DOM para minimizar reflows'
      });
      return;
    }
  }
}

function detectarInefficientArray(linha: string, numeroLinha: number, problemas: ProblemaPerformance[]): void {
  const patterns = [
    { regex: /\.forEach\s*\(/, tipo: 'inefficient-array', descricao: 'forEach é mais lento que for loop tradicional', sugestao: 'Use for...of ou for loop clássico para melhor performance' },
    { regex: /\.filter\s*\([^)]*\)\s*\.\s*map\s*\(/, tipo: 'double-iteration', descricao: 'filter seguido de map faz duas iterações', sugestao: 'Use map com condicional ou reduce para uma única iteração' },
    { regex: /\.sort\s*\(\s*\([^)]*\)\s*=>\s*\w+\.\w+\s*-\s*\w+\.\w+\s*\)/, tipo: 'inefficient-sort', descricao: 'Função de sort sem memoization pode ser lenta em grandes listas', sugestao: 'Considere usar sort fora do render ou com useMemo' },
  ];

  for (const p of patterns) {
    if (p.regex.test(linha)) {
      problemas.push({
        tipo: p.tipo,
        descricao: p.descricao,
        impacto: 'baixo',
        linha: numeroLinha,
        coluna: linha.indexOf(p.regex.source.replace(/\\/g, '').split('(')[0]) + 1,
        sugestao: p.sugestao
      });
      return;
    }
  }
}

function detectarPadroesPerformance(src: string, problemas: ProblemaPerformance[], relPath: string): void {
  const linhas = src.split('\n');
  let dentroLoop = 0;

  linhas.forEach((linha, index) => {
    const numeroLinha = index + 1;

    // Novas detecções de performance
    detectarConsoleEmProducao(linha, numeroLinha, problemas);
    detectarMemoryLeakClosure(linha, numeroLinha, problemas);
    detectarDOMManipulation(linha, numeroLinha, problemas);
    detectarInefficientArray(linha, numeroLinha, problemas);

    // Detectar entrada de loops
    if (/\b(for|while)\s*\(/.test(linha)) {
      dentroLoop++;

      // Se já estamos em um loop e encontramos outro, é loop aninhado
      if (dentroLoop > 1) {
        problemas.push({
          tipo: 'inefficient-loop',
          descricao: 'Loops aninhados podem causar problemas de performance O(n²)',
          impacto: 'alto',
          linha: numeroLinha,
          coluna: linha.indexOf('for') !== -1 ? linha.indexOf('for') + 1 : linha.indexOf('while') + 1,
          sugestao: 'Considere usar Map, Set ou otimizar algoritmo para complexidade linear'
        });
      }
    }

    // Detectar saída de loops (simplificado)
    if (/^\s*}/.test(linha) && dentroLoop > 0) {
      dentroLoop = Math.max(0, dentroLoop - 1);
    }

    // Operações síncronas bloqueantes
    if (/\b(readFileSync|writeFileSync|execSync)\s*\(/.test(linha)) {
      problemas.push({
        tipo: 'blocking-operation',
        descricao: 'Operação síncrona pode bloquear event loop',
        impacto: 'alto',
        linha: numeroLinha,
        coluna: linha.indexOf(/readFileSync|writeFileSync|execSync/.exec(linha)?.[0] || '') + 1,
        sugestao: 'Use versões assíncronas: readFile, writeFile, exec'
      });
    }

    // Event listeners sem cleanup
    if (/addEventListener\s*\(/.test(linha)) {
      // Verificar se há removeEventListener no código (ignorando comentários)
      const srcSemComentarios = src.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
      if (!srcSemComentarios.includes('removeEventListener') && !srcSemComentarios.includes('cleanup') && !srcSemComentarios.includes('destroy')) {
        problemas.push({
          tipo: 'memory-leak',
          descricao: 'Event listener pode causar vazamento de memória',
          impacto: 'medio',
          linha: numeroLinha,
          coluna: linha.indexOf('addEventListener') + 1,
          sugestao: 'Adicione removeEventListener em cleanup/destroy'
        });
      }
    }

    // React: map sem key (detecção melhorada)
    if (/\.map\s*\([^)]*\)/.test(linha) && (/return\s*<|<\w+/.test(linha) || relPath.includes('.tsx') || relPath.includes('.jsx')) && !linha.includes('key=')) {
      problemas.push({
        tipo: 'unnecessary-rerender',
        descricao: 'React map sem key prop pode causar rerenders desnecessários',
        impacto: 'medio',
        linha: numeroLinha,
        coluna: linha.indexOf('.map') + 1,
        sugestao: 'Adicione key prop única para cada elemento da lista'
      });
    }

    // N+1 queries pattern
    if (/\.forEach\s*\(.*\.(find|get|query|select)\s*\(/.test(linha)) {
      problemas.push({
        tipo: 'n-plus-one',
        descricao: 'Possível problema N+1 em consultas',
        impacto: 'alto',
        linha: numeroLinha,
        coluna: linha.indexOf('.forEach') + 1,
        sugestao: 'Use join/include ou agrupe consultas para evitar N+1'
      });
    }

    // Inefficient spread in loops
    if (dentroLoop > 0 && (linha.includes('= [...') || linha.includes('= { ...'))) {
      problemas.push({
        tipo: 'inefficient-spread',
        descricao: 'Spread operator dentro de loop cria novo objeto/array a cada iteração',
        impacto: 'alto',
        linha: numeroLinha,
        coluna: linha.indexOf('...') + 1,
        sugestao: 'Use push() ou mutação controlada para evitar criação excessiva de objetos'
      });
    }

    // Imports de bibliotecas grandes
    if (/import.*from\s+['"]lodash['"]|import.*from\s+['"]moment['"]/.test(linha)) {
      problemas.push({
        tipo: 'large-bundle',
        descricao: 'Import completo de biblioteca grande pode aumentar bundle',
        impacto: 'medio',
        linha: numeroLinha,
        coluna: linha.indexOf('import') + 1,
        sugestao: 'Use imports específicos: import { method } from "lodash/method"'
      });
    }
  });
}
function detectarProblemasPerformanceAST(ast: NodePath<Node>, problemas: ProblemaPerformance[], relPath: string): void {
  try {
    traverse(ast.node, {
      // Detectar loops aninhados via AST (mais preciso)
      ForStatement(path: NodePath<ForStatement>) {
        let parent = path.parent;
        while (parent) {
          if (parent.type === 'ForStatement' || parent.type === 'WhileStatement' || parent.type === 'DoWhileStatement') {
            problemas.push({
              tipo: 'inefficient-loop',
              descricao: 'Loop aninhado detectado via AST - pode causar performance O(n²)',
              impacto: 'alto',
              linha: path.node.loc?.start.line || 0,
              coluna: path.node.loc?.start.column || 0,
              sugestao: 'Considere restruturar algoritmo para evitar complexidade quadrática'
            });
            break;
          }
          parent = (parent as NodePath).parent; // Parent NodePath
        }
      },
      // Detectar função setTimeout/setInterval sem cleanup
      CallExpression(path: NodePath<CallExpression>) {
        if (path.node.callee.type === 'Identifier' && (path.node.callee.name === 'setTimeout' || path.node.callee.name === 'setInterval')) {
          // Verificar se há clearTimeout/clearInterval no escopo
          const binding = path.scope.getBinding(path.node.callee.name);
          if (!binding) return;

          // Heurística simples: se não há clear* na mesma função/arquivo
          const parentFunction = path.getFunctionParent();
          if (parentFunction && !parentFunction.toString().includes('clear') && !relPath.includes('test')) {
            problemas.push({
              tipo: 'memory-leak',
              descricao: `${path.node.callee.name} sem cleanup pode causar vazamento`,
              impacto: 'medio',
              linha: path.node.loc?.start.line || 0,
              coluna: path.node.loc?.start.column || 0,
              sugestao: `Use clear${path.node.callee.name.replace('set', '')} para limpar`
            });
          }
        }
      }
    });
  } catch {
    // Ignorar erros de traverse
  }
}
function agruparPorImpacto(problemas: ProblemaPerformance[]): Record<string, ProblemaPerformance[]> {
  return problemas.reduce((acc, problema) => {
    const impacto = problema.impacto;
    if (impacto) {
      if (!acc[impacto]) {
        acc[impacto] = [];
      }
      acc[impacto].push(problema);
    }
    return acc;
  }, {} as Record<string, ProblemaPerformance[]>);
}
function mapearImpactoParaNivel(impacto: ProblemaPerformance['impacto']): 'info' | 'aviso' | 'erro' {
  switch (impacto) {
    case 'alto':
      return 'aviso';
    case 'medio':
      return 'aviso';
    case 'baixo':
    default:
      return 'info';
  }
}
