import { comandoAnalistas, comandoAtualizar, comandoDiagnosticar, comandoFormatar, comandoGuardian, comandoLicencas, comandoMetricas, comandoNames, comandoOtimizarSvg, comandoPodar, comandoReestruturar, comandoRename, criarComandoFixTypes, registrarComandoReverter, } from './commands/index.js';
export function registrarComandos(program, aplicarFlagsGlobais) {
    program.addCommand(comandoDiagnosticar(aplicarFlagsGlobais));
    program.addCommand(comandoGuardian(aplicarFlagsGlobais));
    program.addCommand(comandoFormatar(aplicarFlagsGlobais));
    program.addCommand(comandoOtimizarSvg(aplicarFlagsGlobais));
    program.addCommand(comandoPodar(aplicarFlagsGlobais));
    program.addCommand(comandoReestruturar(aplicarFlagsGlobais));
    program.addCommand(comandoAtualizar(aplicarFlagsGlobais));
    program.addCommand(comandoAnalistas());
    program.addCommand(comandoMetricas());
    program.addCommand(criarComandoFixTypes());
    program.addCommand(comandoLicencas());
    program.addCommand(comandoNames(aplicarFlagsGlobais));
    program.addCommand(comandoRename(aplicarFlagsGlobais));
    registrarComandoReverter(program);
}
//# sourceMappingURL=comandos.js.map