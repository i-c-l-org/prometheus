import { CliExibirMolduraMensagens } from '../../core/messages/cli/cli-exibir-moldura-messages.js';
import { log } from '../../core/messages/index.js';
export function exibirMolduraSegura(titulo, linhas, fallbackFn) {
    try {
        const bloco = log.bloco(titulo, linhas);
        console.log(bloco);
        return true;
    }
    catch {
        if (fallbackFn) {
            fallbackFn();
        }
        else {
            linhas.forEach(linha => log.info(CliExibirMolduraMensagens.fallbackLinha(linha)));
        }
        return false;
    }
}
export function exibirMolduraPlano(movimentos, limite = 10) {
    const linhas = [CliExibirMolduraMensagens.planoCabecalhoLinha1, CliExibirMolduraMensagens.planoCabecalhoLinha2];
    const primeiros = movimentos.slice(0, limite);
    for (const m of primeiros) {
        const de = String(m.de).replace(/\\/g, '/').slice(0, 34).padEnd(34, ' ');
        const para = String(m.para).replace(/\\/g, '/').slice(0, 39);
        linhas.push(`${de}  → ${para}`);
    }
    if (movimentos.length > limite) {
        linhas.push(CliExibirMolduraMensagens.planoOverflow(movimentos.length - limite));
    }
    exibirMolduraSegura(CliExibirMolduraMensagens.planoTitulo, linhas, () => {
        primeiros.forEach(m => log.info(CliExibirMolduraMensagens.planoFallbackLinha(m.de, m.para)));
        if (movimentos.length > limite) {
            log.info(CliExibirMolduraMensagens.planoFallbackOverflow(movimentos.length - limite));
        }
    });
}
export function exibirMolduraConflitos(conflitos, limite = 10) {
    const linhas = [CliExibirMolduraMensagens.conflitosCabecalhoLinha1, CliExibirMolduraMensagens.conflitosCabecalhoLinha2];
    const primeiros = conflitos.slice(0, limite);
    for (const c of primeiros) {
        const alvo = String((c && typeof c === 'object' && 'alvo' in c && c.alvo) ?? JSON.stringify(c)).replace(/\\/g, '/').slice(0, 31).padEnd(31, ' ');
        const motivo = String((c && typeof c === 'object' && 'motivo' in c && c.motivo) ?? '-').slice(0, 30);
        linhas.push(`${alvo}   ${motivo}`);
    }
    if (conflitos.length > limite) {
        linhas.push(CliExibirMolduraMensagens.conflitosOverflow(conflitos.length - limite));
    }
    exibirMolduraSegura(CliExibirMolduraMensagens.conflitosTitulo, linhas, () => {
        primeiros.forEach(c => {
            const alvoStr = (c && typeof c === 'object' && 'alvo' in c && c.alvo) ?? 'alvo desconhecido';
            const motivoStr = (c && typeof c === 'object' && 'motivo' in c && c.motivo) ?? '-';
            log.aviso(CliExibirMolduraMensagens.conflitosFallbackLinha(String(alvoStr), String(motivoStr)));
        });
        if (conflitos.length > limite) {
            log.aviso(CliExibirMolduraMensagens.conflitosFallbackOverflow(conflitos.length - limite));
        }
    });
}
//# sourceMappingURL=exibir-moldura.js.map