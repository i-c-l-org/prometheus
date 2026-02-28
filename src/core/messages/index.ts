// SPDX-License-Identifier: MIT-0
/**
 * Sistema de Mensagens Centralizado do Prometheus
 *
 * Este módulo redireciona para a pasta pt-BR para manter compatibilidade.
 * O sistema de i18n interno (createI18nMessages) seleciona o idioma automaticamente
 * baseado em config.LANGUAGE.
 *
 * Organizado em subpastas por domínio:
 * - analistas/ - Mensagens de analistas e detectores
 * - cli/       - Mensagens de comandos e handlers CLI
 * - core/      - Mensagens core (correções, diagnóstico, exceções, etc.)
 * - log/       - Sistema de logging
 * - relatorios/- Mensagens de relatórios MD/JSON
 * - ui/        - Ícones, sugestões, filtros
 * - zeladores/ - Mensagens de zeladores
 */

// Reexports de todas as pastas (pt-BR como default)
// Usar export * causa conflitos de nomes, então exportamos explicitamente

// Log exports
export {
  log,
  logAnalistas,
  logAuto,
  logConselheiro,
  LogContextConfiguracao,
  logCore,
  logEngine,
  LogEngineAdaptativo,
  logFiltros,
  logGuardian,
  LogMensagens,
  logMetricas,
  logOcorrencias,
  logProjeto,
  logRelatorio,
  logSistema,
  logVarredor
} from './pt-BR/log/index.js';

// Relatorios exports
export {
  escreverRelatorioMarkdown,
  formatMessage,
  gerarFooterRelatorio,
  gerarHeaderRelatorio,
  gerarSecaoEstatisticas,
  gerarSecaoGuardian,
  gerarSecaoProblemasAgrupados,
  gerarTabelaDuasColunas,
  gerarTabelaOcorrencias,
  gerarTabelaResumoTipos,
  getDescricaoCampo,
  JsonMensagens,
  type MetadadosRelatorioEstendido,
  pluralize,
  RelatorioMensagens,
  separator,
  wrapComMetadados
} from './pt-BR/relatorios/index.js';

// UI exports (sem ICONES_DIAGNOSTICO e ICONES_ZELADOR que vêm de core)
export {
  type AgrupamentoConfig,
  AGRUPAMENTOS_MENSAGEM,
  type ConfigPrioridade,
  contarPorPrioridade,
  findAgrupamento,
  formatarSugestoes,
  gerarSugestoesContextuais,
  getIcone,
  getPrioridade,
  type IconeAcao,
  type IconeArquivo,
  type IconeComando,
  type IconeDiagnostico,
  type IconeFeedback,
  type IconeNivel,
  type IconeRelatorio,
  ICONES_ACAO,
  ICONES_ARQUIVO,
  ICONES,
  ICONES_COMANDO,
  ICONES_FEEDBACK,
  ICONES_NIVEL,
  ICONES_RELATORIO,
  ICONES_STATUS,
  ICONES_TIPOS,
  type IconeStatus,
  type IconeTipo,
  type IconeZelador,
  ordenarPorPrioridade,
  type PrioridadeNivel,
  PRIORIDADES,
  SUGESTOES,
  SUGESTOES_ARQUETIPOS,
  SUGESTOES_AUTOFIX,
  SUGESTOES_COMANDOS,
  SUGESTOES_DIAGNOSTICO,
  SUGESTOES_GUARDIAN,
  SUGESTOES_METRICAS,
  SUGESTOES_PODAR,
  SUGESTOES_REESTRUTURAR,
  SUGESTOES_TIPOS,
  SUGESTOES_ZELADOR,
  suportaCores
} from './pt-BR/ui/index.js';

// Core exports (inclui ICONES_DIAGNOSTICO e ICONES_ZELADOR)
export {
  MENSAGENS_ARQUETIPOS_HANDLER,
  MENSAGENS_AUTOFIX,
  MENSAGENS_CORRECAO_TIPOS,
  MENSAGENS_CORRECOES,
  MENSAGENS_EXECUTOR,
  MENSAGENS_PLUGINS,
  MENSAGENS_RELATORIOS_ANALISE,
  CABECALHOS,
  formatarBlocoSugestoes,
  formatarModoJson,
  formatarResumoStats,
  ICONES_DIAGNOSTICO,
  MENSAGENS_ARQUETIPOS,
  MENSAGENS_AVISO,
  MENSAGENS_CONCLUSAO,
  MENSAGENS_ERRO,
  MENSAGENS_ESTATISTICAS,
  MENSAGENS_FILTROS,
  MENSAGENS_GUARDIAN,
  MENSAGENS_INICIO,
  MENSAGENS_PROGRESSO,
  MODELOS_BLOCO,
  ExcecoesMensagens,
  ACOES_SUGERIDAS,
  CATEGORIAS_TIPOS,
  DEPURACAO,
  DICAS,
  formatarComContexto,
  formatarOcorrencia,
  formatarSugestao,
  formatarTipoInseguro,
  gerarResumoCategoria,
  ICONES_FIX_TYPES,
  MENSAGENS_CLI_CORRECAO_TIPOS,
  MENSAGENS_ERRO as MENSAGENS_ERRO_FIX_TYPES,
  MENSAGENS_INICIO as MENSAGENS_INICIO_FIX_TYPES,
  MENSAGENS_PROGRESSO as MENSAGENS_PROGRESSO_FIX_TYPES,
  MENSAGENS_RESUMO,
  TEMPLATE_RESUMO_FINAL,
  TEXTOS_CATEGORIZACAO_CORRECAO_TIPOS,
  InquisidorMensagens,
  AnalystOrigens,
  AnalystTipos,
  CssMensagens,
  HtmlMensagens,
  PythonMensagens,
  ReactHooksMensagens,
  ReactMensagens,
  SeverityNiveis,
  TailwindMensagens
} from './pt-BR/core/index.js';

// Zeladores exports
export {
  ERROS_IMPORTS,
  formatarComTimestamp,
  formatarDuracao,
  formatarEstatistica,
  formatarListaArquivos,
  gerarResumoImports,
  ICONES_ZELADOR,
  MENSAGENS_ESTRUTURA,
  MENSAGENS_IMPORTS,
  MENSAGENS_TIPOS,
  MENSAGENS_ZELADOR_GERAL,
  MODELOS_SAIDA,
  PROGRESSO_IMPORTS,
  SAIDA_CODIGOS
} from './pt-BR/zeladores/index.js';

// CLI exports
export {
  CliArquetipoHandlerMensagens,
  CliComandoAnalistasMensagens,
  CliComandoAtualizarMensagens,
  CliComandoDiagnosticarMensagens,
  CliComandoFixTypesMensagens,
  CliComandoFormatarMensagens,
  CliComandoGuardianMensagens,
  CliComandoLicensasMensagens,
  CliComandoMetricasMensagens,
  CliComandoNamesMensagens,
  CliComandoOtimizarSvgMensagens,
  CliComandoDesempMensagens,
  CliComandoPodarMensagens,
  CliComandoReestruturarMensagens,
  CliComandoRenameMensagens,
  CliComandoReverterMensagens,
  CliCommonMensagens,
  CliExibirMolduraMensagens,
  CliExportersMensagens,
  CliProcessamentoDiagnosticoMensagens
} from './pt-BR/cli/index.js';

// Analistas exports
export {
  DetectorAgregadosMensagens,
  DetectorAngularMensagens,
  DetectorArquiteturaMensagens,
  DetectorCodigoFragilMensagens,
  DetectorConstrucoesSintaticasMensagens,
  DetectorDependenciasMensagens,
  DetectorEstiloModernoMensagens,
  DetectorEstruturaMensagens,
  DetectorInterfacesInlineMensagens,
  ComandosCliMensagens,
  PadroesUsoMensagens,
  TodoComentariosMensagens
} from './pt-BR/analistas/index.js';
