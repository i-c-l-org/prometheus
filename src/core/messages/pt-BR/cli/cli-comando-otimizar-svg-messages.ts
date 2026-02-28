// SPDX-License-Identifier: MIT-0

import { CliCommonMensagens } from './cli-common-messages.js';

export const CliComandoOtimizarSvgMensagens = {
  descricao: 'Otimiza SVGs do projeto usando o otimizador interno (svgo-like).',
  opcoes: {
    dir: CliCommonMensagens.opcoes.dir,
    write: CliCommonMensagens.opcoes.write,
    dry: CliCommonMensagens.opcoes.dryRun,
    include: CliCommonMensagens.opcoes.include,
    exclude: CliCommonMensagens.opcoes.exclude
  },
  erros: {
    falhaFlags: (erro: string) => `Falha ao aplicar flags no comando otimizar-svg: ${erro}`,
    falhaOtimizar: (erro: string) => `Falha ao otimizar SVGs: ${erro}`
  },
  status: {
    titulo: 'OTIMIZAR SVG',
    linhaLogOtimizacao: (rel: string, original: string, otimizado: string, economia: string) =>
      `${rel} — ${original} → ${otimizado} (−${economia})`,
    linhaLogDry: (rel: string, original: string, otimizado: string, economia: string) =>
      `[dry] ${rel} — ${original} → ${otimizado} (−${economia})`,
    nenhumSugerido: 'Nenhum SVG acima do limiar de otimização.',
    resumoCandidatos: (candidatos: number, economia: string, total: number) =>
      `Candidatos: ${candidatos} | Economia potencial: ${economia} | Total de SVGs lidos: ${total}`,
    concluidoWrite: (otimizados: number, candidatos: number) =>
      `Otimização aplicada em ${otimizados}/${candidatos} arquivos.`,
    avisoDicaWrite: 'Use --write para aplicar as otimizações.'
  }
} as const;
