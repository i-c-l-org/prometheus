---
Proveniência e Autoria: Este documento integra o projeto Prometheus (licença MIT-0).
Nada aqui implica cessão de direitos morais/autorais.
Conteúdos de terceiros não licenciados de forma compatível não devem ser incluídos.
Referências a materiais externos devem ser linkadas e reescritas com palavras próprias.
---
# 🚀 Roadmap e Melhorias Futuras (Baseado em Skills)

Este documento descreve as melhorias planejadas para o Prometheus, fundamentadas nos checklists de qualidade e segurança definidos em `.skills/`.

## 🛡️ Segurança (Ref: `security-check`)

- [ ] **Sanitização de Caminhos**: Implementar uma classe centralizadora `PathSanitizer` que valide todos os inputs de caminho contra Path Traversal, garantindo que nenhuma operação de arquivo escape do diretório base do projeto.
- [ ] **Auditoria de Dependências**: Integrar `npm audit` ou Snyk diretamente no comando de diagnóstico para reportar vulnerabilidades de pacotes como parte do relatório de saúde do projeto.
- [ ] **Execução Segura**: Mover execuções de comandos externos (como `eslint`) para um ambiente mais isolado ou garantir escape rigoroso de argumentos.

## 🏗️ Arquitetura e Core (Ref: `prometheus-dev`)

- [ ] **Extensibilidade via Plugins**: Criar um sistema de plugins que permita carregar analistas de terceiros sem modificar o core, seguindo o padrão de IoC (Inversão de Controle).
- [ ] **Observabilidade Granular**: Expandir o `EventEmitter` do Executor para emitir eventos de início/fim de cada analista, permitindo que interfaces de usuário mostrem uma barra de progresso detalhada.
- [ ] **Suporte a Mais Parsers**: Integrar parsers nativos rápidos (como `oxc-parser` ou `swc`) para análises simples que não requerem a árvore completa do Babel, visando performance extrema.

## 🧐 Qualidade e Revisão (Ref: `code-review`)

- [ ] **Eliminação de Silent Catches**: Revisar o codebase (especialmente em `processamento-diagnostico.ts`) para substituir blocos `catch {}` vazios por logs de debug ou tratamento adequado.
- [ ] **Tipagem Avançada**: Reduzir o uso de `globalThis as any` para o cache de AST, substituindo por um Singleton tipado ou uma estrutura de State proprietária.
- [ ] **Deduplicação de Lógica**: Extrair lógicas repetidas de formatação de tabelas e blocos de log para uma biblioteca de UI interna reutilizável.

## 📚 Documentação (Ref: `project-setup`)

- [ ] **CONTRIBUTING.md**: Criar um guia detalhado para novos contribuidores, explicando o workflow de desenvolvimento e como testar novos analistas.
- [ ] **SECURITY.md**: Definir a política de reporte de vulnerabilidades.

---

**Nota:** Estas melhorias devem ser priorizadas conforme a necessidade de escala e segurança do projeto conforme ele se torna uma ferramenta universal.
