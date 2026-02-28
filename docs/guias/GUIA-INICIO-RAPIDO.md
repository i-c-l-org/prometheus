# 🚀 Guia de Início Rápido do Prometheus

> Proveniência e Autoria: Este documento integra o projeto Prometheus (licença MIT-0).
> Última atualização: 25 de fevereiro de 2026

---

## O que é o Prometheus?

O **Prometheus** é uma ferramenta de linha de comando (CLI) para analisar, diagnosticar e manter projetos JavaScript/TypeScript (e com suporte heurístico para outras linguagens). Ele identifica problemas de código, verifica integridade de arquivos e sugere melhorias estruturais.

**Requisitos:** Node.js >=24.12.0

Sugerimos usar um gerenciador de versões (nvm/fnm/volta). Exemplo com nvm:

```bash
nvm install 24
nvm use 24
# Confirme
node --version  # deve ser v24.x
```

---

## Instalação

### Opção 1: Instalação Global (Recomendada)

```bash
# Clone o repositório
git clone https://github.com/i-c-l-org/prometheus.git
cd prometheus

# Instale as dependências e compile
npm install
npm run build

# Link global (permite usar 'prometheus' de qualquer diretório)
npm install -g .
```

### Opção 2: Instalação Local

```bash
# No diretório do seu projeto
npm install --save-dev /caminho/para/prometheus

# Use via npx
npx prometheus diagnosticar
```

### Opção 3: Teste Rápido (sem instalar)

```bash
# Requer Node.js 24+
npx github:i-c-l-org/prometheus diagnosticar --help
```

---

## Primeiro Diagnóstico

Execute o comando básico no diretório do seu projeto:

```bash
prometheus diagnosticar
```

O Prometheus irá:

1. 📁 **Varrer** todos os arquivos do projeto
2. 🔍 **Analisar** código em busca de problemas
3. 📊 **Exibir** um resumo com ocorrências encontradas

### Saída Típica

```
✅ Varredura concluída: 120 arquivos em 15 diretórios

📊 Resumo das 25 ocorrências:

  📋 Principais tipos:
     • problemas-teste: 18
     • tipo-inseguro-any: 4
     • problema-documentacao: 3

  📁 Top arquivos:
     • src/services/api.ts (5)
     • src/utils/helpers.ts (3)
     • tests/unit/api.test.ts (2)

✔ Diagnóstico concluído.
```

---

## Comandos Essenciais

### 1. Diagnóstico do Projeto

```bash
# Diagnóstico básico (modo compacto)
prometheus diagnosticar

# Diagnóstico detalhado
prometheus diagnosticar --full

# Apenas visualizar arquivos (sem análise)
prometheus diagnosticar --scan-only
```

### 2. Exportar Resultados

```bash
# Saída JSON para CI/CD
prometheus diagnosticar --json

# Exportar relatório para arquivo
prometheus diagnosticar --export relatorio.md
```

### 3. Filtrar Análise

```bash
# Analisar com modo rápido
prometheus diagnosticar --fast

# Excluir testes
prometheus diagnosticar --exclude "**/*.test.ts"

# Combinação
prometheus diagnosticar --include "src/**" --exclude "**/*.test.ts"
```

### 4. Correção Automática

```bash
# Correção conservadora (segura)
prometheus diagnosticar --auto-fix --auto-fix-mode conservative

# Preview das correções (sem aplicar)
prometheus diagnosticar --auto-fix --dry-run
```

### 5. Verificação de Integridade (Guardian)

```bash
# Criar baseline de hashes
prometheus guardian

# Verificar alterações
prometheus guardian --diff

# Aceitar alterações atuais
prometheus guardian --accept
```

---

## Internacionalização (i18n)

O Prometheus agora suporta múltiplos idiomas!

### Alterar para Inglês

```bash
# Via variável de ambiente
PROMETHEUS_LANGUAGE=en prometheus diagnosticar

# Ou configurando no prometheus.config.json
# { "LANGUAGE": "en" }
```

---

## Configuração Rápida

### Criar arquivo de configuração

```bash
# Criar prometheus.config.json na raiz do projeto
cat > prometheus.config.json << 'EOF'
{
  "LANGUAGE": "pt-BR",
  "INCLUDE_EXCLUDE_RULES": {
    "globalExcludeGlob": [
      "node_modules/**",
      "dist/**",
      "coverage/**"
    ]
  },
  "coverageGate": {
    "lines": 80,
    "functions": 80,
    "branches": 75,
    "statements": 80
  }
}
EOF
```

### Suprimir falsos positivos

Use comentários inline para suprimir ocorrências específicas:

```typescript
// @prometheus-disable-next-line tipo-inseguro-any
const dados: any = respostaExterna;

// @prometheus-disable hardcoded-secrets
const configKey = "chave_configuracao_publica";
```

---

## Opções de Linha de Comando

### Flags Principais

| Flag          | Descrição                           |
| ------------- | ----------------------------------- |
| `--full`      | Modo detalhado com mais informações |
| `--compact`   | Modo compacto (padrão)              |
| `--json`      | Saída em formato JSON               |
| `--export`    | Exportar relatório para arquivo     |
| `--scan-only` | Apenas varrer arquivos, sem análise |

# Aumente workers (paralelização)

```bash
WORKER_POOL_MAX_WORKERS=4 prometheus diagnosticar
```

---

**Versão:** 0.4.0 | **Licença:** MIT-0
