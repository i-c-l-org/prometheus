// SPDX-License-Identifier: MIT-0
import { criarAnalista, criarOcorrencia } from '@';
import { createLineLookup } from '@shared/helpers/line-lookup.js';

/**
 * Analista de GitHub Actions (CI/CD)
 * Foco: Segurança, Controle de Custos e Boas Práticas.
 */
export const analistaGithubActions = criarAnalista({
  nome: 'analista-github-actions',
  categoria: 'ci-cd',
  descricao: 'Analisa workflows do GitHub Actions para segurança e otimização de custos.',
  global: false,
  test: (relPath: string) =>
    relPath.startsWith('.github/workflows/') && (relPath.endsWith('.yml') || relPath.endsWith('.yaml')),

  aplicar: async (src, relPath) => {
    const ocorrencias = [];
    const lineOf = createLineLookup(src).lineAt;

    // 1. Verificação de Custo: timeout-minutes
    // Sem timeout, um job travado pode consumir todos os minutos da conta.
    if (!src.includes('timeout-minutes:')) {
      ocorrencias.push(criarOcorrencia({
        relPath,
        linha: 1,
        nivel: 'aviso',
        tipo: 'cicd-timeout-ausente',
        mensagem: 'Workflow sem "timeout-minutes" definido. Jobs travados podem consumir créditos excessivos.'
      }));
    }

    // 2. Verificação de Segurança: Permissões excessivas
    if (src.includes('permissions: write-all')) {
      ocorrencias.push(criarOcorrencia({
        relPath,
        linha: src.indexOf('permissions: write-all') !== -1 ? lineOf(src.indexOf('permissions: write-all')) : 1,
        nivel: 'erro',
        tipo: 'cicd-permissao-excessiva',
        mensagem: 'Uso de "permissions: write-all" detectado. Isso viola o princípio do privilégio mínimo.'
      }));
    }

    // 3. Verificação de Segurança: pull_request_target
    // Combinar pull_request_target com checkout de código do PR é um vetor de ataque grave.
    if (src.includes('pull_request_target:') && src.includes('actions/checkout')) {
      ocorrencias.push(criarOcorrencia({
        relPath,
        linha: lineOf(src.indexOf('pull_request_target:')),
        nivel: 'erro',
        tipo: 'cicd-pr-target-perigoso',
        mensagem: 'Uso potencial de "pull_request_target" com checkout de código não confiável.'
      }));
    }

    // 4. Boas Práticas: Concurrency (Prevenção de Race Conditions)
    if (!src.includes('concurrency:')) {
      ocorrencias.push(criarOcorrencia({
        relPath,
        linha: 1,
        nivel: 'info',
        tipo: 'cicd-concurrency-ausente',
        mensagem: 'Workflow sem grupo de "concurrency". Execuções simultâneas podem causar conflitos de deploy.'
      }));
    }

    // 5. Performance: Cache em setup-node
    if (src.includes('actions/setup-node') && !src.includes('cache:')) {
      ocorrencias.push(criarOcorrencia({
        relPath,
        linha: lineOf(src.indexOf('actions/setup-node')),
        nivel: 'info',
        tipo: 'cicd-cache-ausente',
        mensagem: 'setup-node detectado sem configuração de cache.'
      }));
    }

    // 6. Segurança: GITHUB_TOKEN exposto em logs
    if (/\${{\s*secrets\.\w+\s*}}/.test(src) && /\${{\s*github\.token\s*}}/.test(src)) {
      if (src.includes('::set-output') || src.includes('$GITHUB_OUTPUT')) {
        ocorrencias.push(criarOcorrencia({
          relPath,
          linha: lineOf(src.indexOf('::set-output') || src.indexOf('$GITHUB_OUTPUT')),
          nivel: 'aviso',
          tipo: 'cicd-token-exposto',
          mensagem: 'GITHUB_TOKEN pode ser exposto em outputs. Use $GITHUB_OUTPUT com cuidado.'
        }));
      }
    }

    // 7. Segurança: set-output é Deprecated
    if (src.includes('::set-output')) {
      ocorrencias.push(criarOcorrencia({
        relPath,
        linha: lineOf(src.indexOf('::set-output')),
        nivel: 'aviso',
        tipo: 'cicd-set-output-deprecado',
        mensagem: 'Uso de "::set-output" detectado. Este comando está deprecated.'
      }));
    }

    // 8. Custo: Runners caros sem necessidade
    const runnersCaros = ['macos-latest', 'macos-13', 'macos-11', 'windows-latest'];
    for (const runner of runnersCaros) {
      if (src.includes(runner)) {
        ocorrencias.push(criarOcorrencia({
          relPath,
          linha: lineOf(src.indexOf(runner)),
          nivel: 'info',
          tipo: 'cicd-runner-caro',
          mensagem: `Uso de runner "${runner}" detectado. Considere usar ubuntu-latest para reduzir custos.`
        }));
      }
    }

    return ocorrencias.length ? ocorrencias : null;
  }
});

export default analistaGithubActions;
