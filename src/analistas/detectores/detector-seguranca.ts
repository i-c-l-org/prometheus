// SPDX-License-Identifier: MIT-0
// @prometheus-disable seguranca vulnerabilidade-seguranca
import type { NodePath } from '@babel/traverse';
import type { CallExpression, NewExpression, Node } from '@babel/types';
import { config } from '@core/config/config.js';
import { traverse } from '@core/config/traverse.js';
import { DetectorAgregadosMensagens } from '@core/messages/analistas/detector-agregados-messages.js';
import { detectarContextoProjeto } from '@shared/contexto-projeto.js';
import { filtrarOcorrenciasSuprimidas } from '@shared/helpers/suppressao.js';

import type { Analista,Ocorrencia, ProblemaSeguranca, ReportEvent } from '@';
import { criarOcorrencia } from '@';

const LIMITE_SEGURANCA = config.ANALISE_LIMITES?.SEGURANCA ?? {
  MAX_HARDCODED_SECRETS: 0,
  MAX_EVAL_USAGE: 0,
  MAX_INNERHTML: 0,
  MAX_WEAK_CRYPTO: 0,
  MAX_UNSAFE_REGEX: 0,
  MAX_PATH_TRAVERSAL: 0,
  MAX_SQL_INJECTION: 0,
  MAX_COMMAND_INJECTION: 0,
  MAX_UNHANDLED_ASYNC: 5,
  MAX_IGNORAR_TESTES: true
};

// Funções helper para detecção inteligente de segredos

function isPlaceholderSuspeito(linha: string): boolean {
  const placeholdersComuns = ['<YOUR_', '<FOO>', '<BAR>', 'REPLACE_ME', 'EXAMPLE_', 'PLACEHOLDER', 'your_', 'example', 'sample', 'demo', 'test', 'fake', 'dummy', 'mock'];
  const linhaLower = linha.toLowerCase();
  return placeholdersComuns.some(p => linhaLower.includes(p.toLowerCase()));
}
function isContextoDocumentacao(relPath: string): boolean {
  const arquivosDoc = ['readme', 'doc/', 'docs/', '.md', '.example', '.sample', '.template', 'third-party-notices', 'license', 'changelog'];
  const pathLower = relPath.toLowerCase();
  return arquivosDoc.some(pattern => pathLower.includes(pattern));
}
function calcularEntropia(str: string): number {
  const frequencias = new Map<string, number>();

  // Contar frequência de cada caractere
  for (const char of str) {
    frequencias.set(char, (frequencias.get(char) || 0) + 1);
  }

  // Calcular entropia de Shannon
  let entropia = 0;
  for (const freq of frequencias.values()) {
    const prob = freq / str.length;
    entropia -= prob * Math.log2(prob);
  }
  return entropia;
}
export const analistaSeguranca: Analista = {
  nome: 'seguranca',
  categoria: 'seguranca',
  descricao: 'Detecta vulnerabilidades e práticas inseguras no código',
  limites: LIMITE_SEGURANCA,
  test: (relPath: string): boolean => {
    return /\.(js|jsx|ts|tsx|mjs|cjs)$/.test(relPath);
  },
  aplicar: (src: string, relPath: string, ast: NodePath<Node> | null, _fullPath?: string, contexto?: import('@').ContextoExecucao): Ocorrencia[] => {
    if (!src) return [];
    const contextoArquivo = detectarContextoProjeto({
      arquivo: relPath,
      conteudo: src,
      relPath
    });
    const problemas: ProblemaSeguranca[] = [];
    try {
      // Detectar problemas por padrões de texto (mais confiável que AST para alguns casos)
      detectarPadroesPerigosos(src, relPath, problemas);

      // Detectar problemas via AST quando disponível
      if (ast) {
        detectarProblemasAST(ast, problemas);
      }

      // Converter para ocorrências
      const ocorrencias: Ocorrencia[] = [];

      // Agrupar por severidade
      const porSeveridade = agruparPorSeveridade(problemas);
      for (const [severidade, items] of Object.entries(porSeveridade)) {
        if (items.length > 0) {
          const nivel = mapearSeveridadeParaNivel(severidade as ProblemaSeguranca['severidade']);

          // Ajustar severidade baseado no contexto
          const nivelAjustado = contextoArquivo.isTest && nivel === 'aviso' ? 'info' : nivel;
          const resumo = items.slice(0, 3).map(p => p.tipo).join(', ');
          ocorrencias.push(criarOcorrencia({
            tipo: 'vulnerabilidade-seguranca',
            nivel: nivelAjustado,
            mensagem: DetectorAgregadosMensagens.problemasSegurancaResumo(severidade, resumo, items.length),
            relPath,
            linha: items[0].linha
          }));
        }
      }

      // Aplicar supressões inline antes de retornar
      return filtrarOcorrenciasSuprimidas(ocorrencias, 'seguranca', src);
    } catch (erro) {
      const ev = {
        tipo: 'detector-seguranca-erro',
        nivel: 'aviso' as const,
        mensagem: DetectorAgregadosMensagens.erroAnalisarSeguranca(erro),
        relPath,
        linha: 1
      };
      if (contexto && typeof contexto.report === 'function') {
        try {
          contexto.report(ev as ReportEvent);
          return [];
        } catch {
          return [criarOcorrencia({
            tipo: 'ERRO_ANALISE',
            nivel: 'aviso',
            mensagem: DetectorAgregadosMensagens.erroAnalisarSeguranca(erro),
            relPath,
            linha: 1
          })];
        }
      }
      return [criarOcorrencia({
        tipo: 'ERRO_ANALISE',
        nivel: 'aviso',
        mensagem: DetectorAgregadosMensagens.erroAnalisarSeguranca(erro),
        relPath,
        linha: 1
      })];
    }
  }
};
function detectarSqlInjection(linha: string, numeroLinha: number, problemas: ProblemaSeguranca[]): void {
  const padroesSqlInjection = [
    /`.*\$\{.*\}.*`/,
    /["'].*%s.*["']/,
    /["'].*\{.*\}.*["']/,
    /\+.*\+.*\+.*/,
    /\.query\s*\(\s*['"`]\s*\$\{/,
    /\.execute\s*\(\s*['"`]\s*\$\{/,
    /SELECT.*\$\{|INSERT.*\$\{|UPDATE.*\$\{|DELETE.*\$\{/i,
    /".*".*format.*%s/,
    /f["'].*SELECT.*\{/,
  ];
  const variaveisUser = /req\.|params\.|query\.|body\.|input\.|getParam\.|postParam\./;

  for (const padrao of padroesSqlInjection) {
    if (padrao.test(linha) && variaveisUser.test(linha)) {
      problemas.push({
        tipo: 'sql-injection',
        descricao: 'Possível SQL Injection - concatenação de input do usuário em query SQL',
        severidade: 'critica',
        linha: numeroLinha,
        sugestao: 'Use parameterized queries ou ORM: db.query("SELECT * FROM users WHERE id = ?", [userId])'
      });
      return;
    }
  }
}

function detectarCommandInjection(linha: string, numeroLinha: number, problemas: ProblemaSeguranca[]): void {
  const funcoesPerigosas = [
    /exec\s*\(/,
    /execSync\s*\(/,
    /spawn\s*\(/,
    /spawnSync\s*\(/,
    /execFile\s*\(/,
    /execFileSync\s*\(/,
    /system\s*\(/,
    /popen\s*\(/,
  ];
  const inputUsuario = /\$\{|req\.|params\.|query\.|body\.|process\.argv|input\./;

  for (const fn of funcoesPerigosas) {
    if (fn.test(linha) && inputUsuario.test(linha)) {
      problemas.push({
        tipo: 'command-injection',
        descricao: 'Possível Command Injection - input do usuário passando para shell',
        severidade: 'critica',
        linha: numeroLinha,
        sugestao: 'Valide e sanitize rigorosamente inputs antes de usar em comandos shell. Use lista branca de valores permitidos.'
      });
      return;
    }
  }
}

function detectarXXE(src: string, numeroLinha: number, problemas: ProblemaSeguranca[]): void {
  const padroesXXE = [
    /<!DOCTYPE.*SYSTEM/,
    /<!ENTITY.*SYSTEM/,
    /<!ENTITY.*PUBLIC/,
    /xml.*setFeature.*XMLConstants\.FEATURE_SECURE_PROCESSING/,
    /DocumentBuilderFactory.*disallow-doctype-decl/,
  ];
  const contextoXml = /parseXML|parseString|loadXML|readAsXml|XMLReader/;

  for (const padrao of padroesXXE) {
    if (padrao.test(src) && contextoXml.test(src)) {
      problemas.push({
        tipo: 'xxe',
        descricao: 'Possível vulnerabilidade XXE (XML External Entity) - parser XML não seguro',
        severidade: 'alta',
        linha: numeroLinha,
        sugestao: 'Desabilite processamento DTD e entidades externas no parser XML'
      });
      return;
    }
  }
}

function detectarInsecureDeserialization(linha: string, numeroLinha: number, problemas: ProblemaSeguranca[]): void {
  const metodosInseguros = [
    /ObjectInputStream/,
    /readObject\s*\(/,
    /\.unserialize\s*\(/,
    /pickle\.load\s*\(/,
    /yaml\.load\s*\(/,
    /YAML\.unsafe_load/,
    /JSON\.parse\s*\(.*unsafe/,
  ];

  for (const metodo of metodosInseguros) {
    if (metodo.test(linha)) {
      problemas.push({
        tipo: 'insecure-deserialization',
        descricao: 'Desserialização insegura pode permitir execução de código remoto',
        severidade: 'critica',
        linha: numeroLinha,
        sugestao: 'Use JSON.parse ou bibliotecas de serialização segura. Valide dados antes de deserializar.'
      });
      return;
    }
  }
}

function detectarCatastrophicRegex(linha: string, numeroLinha: number, problemas: ProblemaSeguranca[]): void {
  const padroesPerigosos = [
    /\(\.\*\)\+/,
    /\(\.\+\)\+/,
    /\(\.\*\)\*/,
    /\(\.\+\)\*/,
    /\(\[.*\]\+\)\+/,
    /\(\.\*\)\{.*\}/,
    /\(\.\+\)\{.*\}/,
    /\.\*\*|\.\+\+/,
    /\(\s*\.\*\s*\)\+/,
    /\(\s*\.\+\s*\)\+/,
  ];
  const inputDinamico = /req\.|params\.|query\.|body\.|userInput|dynamic/;

  for (const padrao of padroesPerigosos) {
    if (padrao.test(linha) && inputDinamico.test(linha)) {
      problemas.push({
        tipo: 'catastrophic-regex',
        descricao: 'Regex potencialmente catastrófico (ReDoS) - padrão com backtracking exponencial',
        severidade: 'alta',
        linha: numeroLinha,
        sugestao: 'Use padrões sem backtracking: (a+)+ substitua por a+, use atomic groups, ou refatore para RegExp.prototype.test()'
      });
      return;
    }
  }
}

function detectarWeakRandom(linha: string, numeroLinha: number, problemas: ProblemaSeguranca[]): void {
  const weakRandom = [
    /Math\.random\s*\(\s*\)/,
    /\bMath\.random\s*\(\s*\)/,
    /\brandom\s*\(\s*\)/,
  ];
  const contextoSensivel = /password|token|secret|key|uuid|session|captcha|salt|nonce|otp|auth/;

  for (const random of weakRandom) {
    if (random.test(linha) && contextoSensivel.test(linha)) {
      problemas.push({
        tipo: 'weak-random',
        descricao: 'Math.random() não é criptograficamente seguro',
        severidade: 'alta',
        linha: numeroLinha,
        sugestao: 'Use crypto.randomUUID() ou crypto.getRandomValues() para valores aleatórios seguros'
      });
      return;
    }
  }
}

function detectarInsecureCookie(linha: string, numeroLinha: number, problemas: ProblemaSeguranca[]): void {
  const cookieInseguro = /cookie\s*\(\s*['"]?/i;
  const flagsSeguranca = /secure|sameSite|httponly|path=\/|expires=/i;

  if (cookieInseguro.test(linha) && !flagsSeguranca.test(linha)) {
    problemas.push({
      tipo: 'insecure-cookie',
      descricao: 'Cookie definido sem flags de segurança (secure, HttpOnly, SameSite)',
      severidade: 'media',
      linha: numeroLinha,
      sugestao: 'Adicione flags: Secure, HttpOnly, SameSite=Strict|Lax para proteção XSS e CSRF'
    });
  }
}

function detectarMissingCSRF(linha: string, numeroLinha: number, problemas: ProblemaSeguranca[]): void {
  const endpointsMutacao = [
    /app\.(post|put|patch|delete)\s*\(/,
    /router\.(post|put|patch|delete)\s*\(/,
    /router\.(post|put|patch|delete)\s*\(/,
    /@\.(post|put|patch|delete)\s*\(/,
    /\.route\s*\(\s*['"`](post|put|patch|delete)/i,
  ];
  const csrfProtection = /csrf|csrfToken|csrfProtection|xsrf|verifyCsrfToken|validateCsrfToken/;

  for (const endpoint of endpointsMutacao) {
    if (endpoint.test(linha) && !csrfProtection.test(linha)) {
      problemas.push({
        tipo: 'missing-csrf',
        descricao: 'Endpoint mutativo (POST/PUT/DELETE) sem proteção CSRF explícita',
        severidade: 'media',
        linha: numeroLinha,
        sugestao: 'Implemente proteção CSRF: use token anti-CSRF em formulários e validate no backend'
      });
      return;
    }
  }
}

function detectarHardcodedIP(linha: string, numeroLinha: number, problemas: ProblemaSeguranca[]): void {
  const ipPattern = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/;
  const variavelIP = /\b(ip|server|host|endpoint|address|url)\b/i;

  if (ipPattern.test(linha) && !linha.includes('//') && !linha.includes('*') && !variavelIP.test(linha)) {
    const ip = ipPattern.exec(linha)?.[0];
    if (ip && !ip.startsWith('127.') && !ip.startsWith('0.') && !ip.startsWith('255.')) {
      problemas.push({
        tipo: 'hardcoded-ip',
        descricao: 'Endereço IP hardcoded no código',
        severidade: 'baixa',
        linha: numeroLinha,
        sugestao: 'Use variáveis de ambiente para IPs/hosts: process.env.API_HOST'
      });
    }
  }
}

function detectarJWTWeak(linha: string, numeroLinha: number, problemas: ProblemaSeguranca[]): void {
  const jwtWeak = [
    /jwt\.sign\s*\([^,)]*,\s*['"]secret['"]/i,
    /jwt\.sign\s*\([^,)]*,\s*['"][\w-]{8,20}['"]/i,
    /algorithm\s*:\s*['"]HS256['"]/i,
    /ALGORITHM\s*:\s*['"]HS256['"]/i,
  ];
  const variavelSecreta = /secret|key|password|passphrase/;

  for (const padrao of jwtWeak) {
    if (padrao.test(linha)) {
      problemas.push({
        tipo: 'jwt-weak',
        descricao: 'JWT com algoritmo fraco ou segredo hardcoded',
        severidade: 'alta',
        linha: numeroLinha,
        sugestao: 'Use RS256/ES256 (assimetrico). Armazene segredo em ambiente seguro.'
      });
      return;
    }
  }
}

function detectarTarPit(linha: string, numeroLinha: number, problemas: ProblemaSeguranca[]): void {
  const slowNetworkPatterns = [
    /setTimeout\s*\(\s*[\s\S]{0,50}\s*5000/,
    /sleep\s*\(\s*5000/,
    /delay\s*\(\s*5000/,
    /await\s+new\s+Promise.*5000/,
    /\.timeout\s*\(\s*5000/,
  ];

  for (const pattern of slowNetworkPatterns) {
    if (pattern.test(linha)) {
      problemas.push({
        tipo: 'tar-pit',
        descricao: 'Possível proteção contra força bruta com delay excessivo que pode ser explorado',
        severidade: 'baixa',
        linha: numeroLinha,
        sugestao: 'Considere usar rate limiting com limite adaptativo e CAPTCHA após tentativas falhas'
      });
      return;
    }
  }
}

function detectarBypassSecurity(linha: string, numeroLinha: number, problemas: ProblemaSeguranca[]): void {
  const bypasses = [
    /@ts-ignore\s*[^\n]*security/i,
    /eslint-disable.*security/i,
    /eslint-disable.*no-unsafe/i,
    /nocheck/i,
    /unchecked/i,
    /as\s+any\s*;/,
    /\/\/\s*skip.*security/i,
    /\/\*\s*skip.*security/i,
    /process\.env\.NODE_ENV\s*===\s*['"]development['"]/,
    /if\s*\(\s*process\.env\.NODE_ENV\s*===?\s*['"]development/,
  ];

  for (const bypass of bypasses) {
    if (bypass.test(linha)) {
      problemas.push({
        tipo: 'bypass-security',
        descricao: 'Possível bypass de verificação de segurança ou checagem de ambiente',
        severidade: 'media',
        linha: numeroLinha,
        sugestao: 'Remova bypasses de segurança. Verificações de ambiente devem ser consistentes.'
      });
      return;
    }
  }
}

function detectarPadroesPerigosos(src: string, relPath: string, problemas: ProblemaSeguranca[]): void {
  const linhas = src.split('\n');

  linhas.forEach((linha, index) => {
    const numeroLinha = index + 1;

    detectarSqlInjection(linha, numeroLinha, problemas);
    detectarCommandInjection(linha, numeroLinha, problemas);
    detectarInsecureDeserialization(linha, numeroLinha, problemas);
    detectarCatastrophicRegex(linha, numeroLinha, problemas);
    detectarWeakRandom(linha, numeroLinha, problemas);
    detectarInsecureCookie(linha, numeroLinha, problemas);
    detectarMissingCSRF(linha, numeroLinha, problemas);
    detectarHardcodedIP(linha, numeroLinha, problemas);
    detectarJWTWeak(linha, numeroLinha, problemas);
    detectarTarPit(linha, numeroLinha, problemas);
    detectarBypassSecurity(linha, numeroLinha, problemas);
  });

  detectarXXE(src, 1, problemas);

  function isLikelyHttpHeaderName(value: string): boolean {
    const v = String(value || '').trim();
    if (!v) return false;
    // Header names geralmente são curtos/médios e usam letras/números/hífens.
    if (v.length < 4 || v.length > 80) return false;
    if (!/^[A-Za-z0-9-]+$/.test(v)) return false;
    if (v.startsWith('-') || v.endsWith('-')) return false;
    // Heurística: costuma ter hífen (ex.: Content-Type) e, muitas vezes, prefixo X-
    if (!/-/.test(v) && !/^X[A-Za-z]?/.test(v)) return false;
    return true;
  }
  function isHttpHeadersKeyValueContext(index: number): boolean {
    const start = Math.max(0, index - 12);
    const end = Math.min(linhas.length, index + 6);
    const ctx = linhas.slice(start, end).join('\n');
    const hasHeaders = /\bheaders\b\s*[:=]/i.test(ctx) || /\bheader\b/i.test(ctx);
    const hasValorProp = /\bvalue\b\s*[:=]/i.test(ctx);
    return hasHeaders && hasValorProp;
  }
  linhas.forEach((linha, index) => {
    const numeroLinha = index + 1;

    // Ignorar comentários, strings e regex patterns para reduzir falsos positivos
    const linhaSemComentarios = linha.replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//, '');
    const linhaSemStrings = linhaSemComentarios.replace(/'[^']*'/g, '').replace(/"[^"]*"/g, '').replace(/`[^`]*`/g, '').replace(/\/[^\/]*\//g, '');

    // eval() usage - apenas em código real, não em comentários/strings/regex
    if (/\beval\s*\(/.test(linhaSemStrings)) {
      problemas.push({
        tipo: 'eval-usage',
        descricao: 'Uso de eval() pode executar código malicioso',
        severidade: 'critica',
        linha: numeroLinha,
        sugestao: 'Use JSON.parse() ou funções específicas ao invés de eval()'
      });
    }

    // innerHTML com variáveis
    if (/\.innerHTML\s*=\s*[^"']/.test(linha)) {
      problemas.push({
        tipo: 'dangerous-html',
        descricao: 'innerHTML com variáveis pode causar XSS',
        severidade: 'alta',
        linha: numeroLinha,
        sugestao: 'Use textContent ou sanitize o HTML antes de inserir'
      });
    }

    // Math.random() para criptografia
    if (/Math\.random\(\)/.test(linha) && /crypto|password|token|secret/i.test(linha)) {
      problemas.push({
        tipo: 'weak-crypto',
        descricao: 'Math.random() não é seguro para criptografia',
        severidade: 'alta',
        linha: numeroLinha,
        sugestao: 'Use crypto.randomBytes() ou crypto.getRandomValues()'
      });
    }

    // Algoritmos de hash fracos
    if (/createHash\s*\(\s*['"`](md5|md4|sha1)['"`]\s*\)/.test(linha)) {
      const algoritmo = /createHash\s*\(\s*['"`](md5|md4|sha1)['"`]\s*\)/.exec(linha)?.[1];

      // Verificar se há comentário justificando o uso (ex: fingerprinting, não-criptográfico)
      const linhaAnterior = index > 0 ? linhas[index - 1] : '';
      const linha2Atras = index > 1 ? linhas[index - 2] : '';
      const comentarioContexto = linhaAnterior + linha2Atras;
      const temJustificativa = /fingerprint|cache|baseline|perf|não.*segurança|not.*security|não.*criptograf/i.test(comentarioContexto) || /apenas.*identifica|only.*identif|deduplica/i.test(comentarioContexto);
      if (!temJustificativa) {
        problemas.push({
          tipo: 'weak-crypto',
          descricao: `Algoritmo de hash ${algoritmo?.toUpperCase()} é considerado fraco`,
          severidade: 'alta',
          linha: numeroLinha,
          sugestao: 'Use SHA-256 ou superior: createHash("sha256") - ou adicione comentário se for apenas fingerprinting'
        });
      }
    }

    // RegExp com input do usuário
    if (/new RegExp\s*\([^)]*\)/.test(linha) && /req\.|params\.|query\.|body\./.test(linha)) {
      problemas.push({
        tipo: 'unsafe-regex',
        descricao: 'RegExp com input não validado pode causar ReDoS',
        severidade: 'media',
        linha: numeroLinha,
        sugestao: 'Valide e escape o input antes de usar em RegExp'
      });
    }

    // __proto__ manipulation - evitar falsos positivos em strings/comentários
    if (/__proto__/.test(linhaSemStrings)) {
      problemas.push({
        tipo: 'prototype-pollution',
        descricao: 'Manipulação de __proto__ pode causar prototype pollution',
        severidade: 'alta',
        linha: numeroLinha,
        sugestao: 'Use Object.create(null) ou Object.setPrototypeOf() com cuidado'
      });
    }

    // Path traversal patterns
    if (/\.\.\//g.test(linha) && /req\.|params\.|query\./.test(linha)) {
      problemas.push({
        tipo: 'path-traversal',
        descricao: 'Possível vulnerabilidade de path traversal',
        severidade: 'alta',
        linha: numeroLinha,
        sugestao: 'Sanitize caminhos de arquivo e use path.resolve() com cuidado'
      });
    }

    // Credenciais hardcoded - versão inteligente com whitelist
    // Excluir variáveis comuns que não são secrets (migrationKey, cacheKey, hashKey, etc)
    const isNonSecretChave = /\b(migration|cache|hash|dedupe|lookup|map|index)key\b/i.test(linha);
    if (!isPlaceholderSuspeito(linha) && !isContextoDocumentacao(relPath) && !isNonSecretChave) {
      const padraoSegredo = /\b(password|pwd|pass|secret|key|token|api_key|apikey)\b\s*[:=]\s*['"`]([^'"`\s]{3,})/i;
      const match = linha.match(padraoSegredo);
      if (match) {
        const campo = String(match[1] || '').toLowerCase();
        const valor = match[2];

        // Redução de falsos positivos: headers HTTP em configurações
        // Ex.: headers: [{ key: 'X-Content-Type-Options', value: 'nosniff' }]
        if (campo === 'key' && isLikelyHttpHeaderName(valor) && isHttpHeadersKeyValueContext(index)) {
          return;
        }

        // Excluir template strings com interpolação (não são secrets hardcoded)
        const temInterpolacao = linha.includes('${') || /`[^`]*\$\{[^}]+\}/.test(linha);
        if (temInterpolacao) {
          return; // Template strings dinâmicas não são hardcoded
        }

        // Whitelist de padrões comuns de nomenclatura (não são secrets)
        const padroesNomenclatura = ['_role_', '_config_', '_key_', '_type_', '_name_', '_prefix_', '_suffix_', 'squad_', 'channel_', 'guild_'];
        const isPadraoNomenclatura = padroesNomenclatura.some(p => valor.toLowerCase().includes(p.toLowerCase()));
        if (isPadraoNomenclatura) {
          return; // Padrões de nomenclatura não são secrets
        }

        // Whitelist para placeholders comuns
        const placeholdersSegurs = ['<YOUR_', '<FOO>', '<BAR>', 'REPLACE_ME', 'EXAMPLE_', 'PLACEHOLDER', 'your_', 'example', 'sample', 'demo', 'test', 'fake', 'dummy', 'mock'];
        const isPlaceholder = placeholdersSegurs.some(p => valor.toLowerCase().includes(p.toLowerCase()));

        // Verificar entropia (tokens reais tendem a ter alta entropia)
        const entropia = calcularEntropia(valor);
        const temAltaEntropia = entropia > 3.5; // Threshold empírico

        // Verificar se parece com token/chave real
        const pareceTokReal = valor.length > 20 && (
        // Aumentado de 8 para 20 para reduzir falsos positivos
        temAltaEntropia || /^[A-Za-z0-9+/]{20,}={0,2}$/.test(valor)) &&
        // Base64-like
        !isPlaceholder;
        if (pareceTokReal) {
          problemas.push({
            tipo: 'hardcoded-secrets',
            descricao: 'Credenciais hardcoded no código podem ser expostas',
            severidade: 'critica',
            linha: numeroLinha,
            sugestao: 'Use variáveis de ambiente ou arquivo de configuração seguro'
          });
        }
      }
    }
  });

  // Detectar async/await sem try-catch (melhoria exclusiva)
  detectarAsyncSemTryCatch(src, problemas);
}

/**
 * Detecta uso de async/await sem tratamento adequado de erro
 */
function detectarAsyncSemTryCatch(src: string, problemas: ProblemaSeguranca[]): void {
  const lines = src.split('\n');

  // Contexto global do arquivo para detectar padrões do Next.js
  const isNextJsServerComponent = /^['"](use server|use client)['"]/.test(src.trim()) || /export\s+(default\s+)?async\s+function/.test(src);
  const hasDynamicImport = /next\/dynamic|import\s*\(/.test(src);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Detectar await sem try-catch
    if (/\bawait\s+/.test(line) && !trimmedLine.startsWith('//')) {
      // Verificar contexto expandido para detectar event handlers
      const contextLines = lines.slice(Math.max(0, i - 10), i);
      const context = contextLines.join(' ');

      // Detectar se está dentro de event handler (fire-and-forget por design)
      const isEventHandler = /\.on\s*\(/.test(context) || /\.once\s*\(/.test(context) || /addEventListener\s*\(/.test(context) || /collector\.on\s*\(/.test(context) || /emitter\.on\s*\(/.test(context) || /process\.on\s*\(/.test(context);

      // Verificar se é dynamic import do Next.js (tratamento gerenciado pelo framework)
      const isDynamicImport = hasDynamicImport && (/import\s*\(/.test(line) || /dynamic\s*\(/.test(context));

      // Server Components do Next.js: tratamento gerenciado pelo framework
      if (isNextJsServerComponent || isDynamicImport) {
        continue;
      }

      // Verificar se há try-catch em escopo expandido (100 linhas antes/depois)
      const extendedContext = lines.slice(Math.max(0, i - 100), Math.min(lines.length, i + 100));
      const fullContext = extendedContext.join('\n');

      // Detectar try-catch em escopo pai (bloco que envolve o await)
      const hasErroHandling = /try\s*\{[\s\S]*?\}\s*catch/.test(fullContext) || /\.catch\s*\(/.test(line) || /\.catch\s*\(/.test(lines[i + 1] || '') ||
      // Promise encadeada com .then().catch()
      /\.then\s*\([^)]*\)\s*\.catch/.test(fullContext);
      if (!hasErroHandling) {
        problemas.push({
          tipo: isEventHandler ? 'unhandled-async-event' : 'unhandled-async',
          descricao: isEventHandler ? 'await em event handler sem tratamento de erro (considere adicionar .catch se necessário)' : 'await sem tratamento de erro pode causar crashes não tratados',
          severidade: isEventHandler ? 'baixa' : 'media',
          linha: i + 1,
          sugestao: isEventHandler ? 'Event handlers são fire-and-forget. Adicione .catch() apenas se precisar tratar erros específicos' : 'Envolva em try-catch ou use .catch() na Promise'
        });
      }
    }
  }
}
function detectarProblemasAST(ast: NodePath<Node>, problemas: ProblemaSeguranca[]): void {
  try {
    traverse(ast.node, {
      // Detectar Function constructor
      NewExpression(path: NodePath<NewExpression>) {
        if (path.node.callee.type === 'Identifier' && path.node.callee.name === 'Function') {
          problemas.push({
            tipo: 'eval-usage',
            descricao: 'Function constructor pode executar código dinâmico',
            severidade: 'alta',
            linha: path.node.loc?.start.line || 0,
            sugestao: 'Evite Function constructor, use funções declaradas'
          });
        }
      },
      // Detectar setTimeout/setInterval com strings
      CallExpression(path: NodePath<CallExpression>) {
        if (path.node.callee.type === 'Identifier' && ['setTimeout', 'setInterval'].includes(path.node.callee.name) && path.node.arguments[0]?.type === 'StringLiteral') {
          problemas.push({
            tipo: 'eval-usage',
            descricao: 'setTimeout/setInterval com string executa código dinâmico',
            severidade: 'media',
            linha: path.node.loc?.start.line || 0,
            sugestao: 'Use função ao invés de string'
          });
        }
      }
    });
  } catch {
    // Ignorar erros de traverse para não quebrar a análise
  }
}
function agruparPorSeveridade(problemas: ProblemaSeguranca[]): Record<string, ProblemaSeguranca[]> {
  return problemas.reduce((acc, problema) => {
    if (!acc[problema.severidade]) {
      acc[problema.severidade] = [];
    }
    acc[problema.severidade].push(problema);
    return acc;
  }, {} as Record<string, ProblemaSeguranca[]>);
}
function mapearSeveridadeParaNivel(severidade: ProblemaSeguranca['severidade']): 'info' | 'aviso' | 'erro' {
  switch (severidade) {
    case 'critica':
    case 'alta':
      return 'erro';
    case 'media':
      return 'aviso';
    case 'baixa':
    default:
      return 'info';
  }
}
