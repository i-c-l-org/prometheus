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
        falhaFlags: (erro) => `Falha ao aplicar flags no comando otimizar-svg: ${erro}`,
        falhaOtimizar: (erro) => `Falha ao otimizar SVGs: ${erro}`
    },
    status: {
        titulo: 'OTIMIZAR SVG',
        linhaLogOtimizacao: (rel, original, otimizado, economia) => `${rel} — ${original} → ${otimizado} (−${economia})`,
        linhaLogDry: (rel, original, otimizado, economia) => `[dry] ${rel} — ${original} → ${otimizado} (−${economia})`,
        nenhumSugerido: 'Nenhum SVG acima do limiar de otimização.',
        resumoCandidatos: (candidatos, economia, total) => `Candidatos: ${candidatos} | Economia potencial: ${economia} | Total de SVGs lidos: ${total}`,
        concluidoWrite: (otimizados, candidatos) => `Otimização aplicada em ${otimizados}/${candidatos} arquivos.`,
        avisoDicaWrite: 'Use --write para aplicar as otimizações.'
    }
};
//# sourceMappingURL=cli-comando-otimizar-svg-messages.js.map