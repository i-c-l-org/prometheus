---
Proveniencia e Autoria: Este documento integra o projeto Prometheus (licenca MIT-0).
Nada aqui implica cessao de direitos morais/autorais.
Conteudos de terceiros nao licenciados de forma compativel nao devem ser incluidos.
Referencias a materiais externos devem ser linkadas e reescritas com palavras proprias.
---
# Roadmap e Melhorias Futuras (Baseado em Skills)

Este documento descreve as melhorias planejadas para o Prometheus, fundamentadas nos checklists de qualidade e seguranca definidos em `.skills/`.

## Seguranca (Ref: `security-check`)

- [ ] **Sanitizacao de Caminhos**: Implementar uma classe centralizadora `PathSanitizer` que valide todos os inputs de caminho contra Path Traversal, garantindo que nenhuma operacao de arquivo escape do diretorio base do projeto.
- [ ] **Auditoria de Dependencias**: Integrar `npm audit` ou Snyk diretamente no comando de diagnostico para reportar vulnerabilidades de pacotes como parte do relatorio de saude do projeto.
- [ ] **Execucao Segura**: Mover execucoes de comandos externos (como `eslint`) para um ambiente mais isolado ou garantir escape rigoroso de argumentos.

## Arquitetura e Core (Ref: `prometheus-dev`)

- [ ] **Extensibilidade via Plugins**: Criar um sistema de plugins que permita carregar analistas de terceiros sem modificar o core, seguindo o padrao de IoC (Inversao de Controle).
- [ ] **Observabilidade Granular**: Expandir o `EventEmitter` do Executor para emitir eventos de inicio/fim de cada analista, permitindo que interfaces de usuario mostrem uma barra de progresso detalhada.
- [ ] **Suporte a Mais Parsers**: Integrar parsers nativos rapidos (como `oxc-parser` ou `swc`) para analises simples que nao requerem a arvore completa do Babel, visando performance extrema.

## Qualidade e Revisao (Ref: `code-review`)

- [ ] **Eliminacao de Silent Catches**: Revisar o codebase (especialmente em `processamento-diagnostico.ts`) para substituir blocos `catch {}` vazios por logs de debug ou tratamento adequado.
- [ ] **Tipagem Avancada**: Reduzir o uso de `globalThis as any` para o cache de AST, substituindo por um Singleton tipado ou uma estrutura de State proprietaria.
- [ ] **Deduplicacao de Logica**: Extrair logicas repetidas de formatacao de tabelas e blocos de log para uma biblioteca de UI interna reutilizavel.

## Documentacao (Ref: `project-setup`)

- [X] **CONTRIBUTING.md**: Guia detalhado para contribuidores ja existe.
- [X] **SECURITY.md**: Politica de reporte de vulnerabilidades ja existe.

---

**Nota:** Estas melhorias devem ser priorizadas conforme a necessidade de escala e seguranca do projeto conforme ele se torna uma ferramenta universal.
