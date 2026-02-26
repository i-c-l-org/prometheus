<!-- AVISO DE PROVENIÊNCIA E AUTORIA -->

> **Proveniência e Autoria**
>
> Este arquivo ou componente faz parte do ecosistema Doutor/Prometheus.
> Distribuído sob os termos de licença MIT-0.
> O uso do material neste componente não implica em apropriação ou violação de direitos autorais, morais ou de terceiros.
> Em caso de problemas com nosso uso, entre em contato pelo email: ossmoralus@gmail.com


---
name: Project Setup
description: Setup de novo projeto Node.js/TypeScript com boas práticas, linting, testes e CI
---

# Project Setup

Checklist completo para iniciar um novo projeto Node.js/TypeScript com boas práticas desde o dia zero.

## 1. Inicialização

```bash
mkdir meu-projeto && cd meu-projeto
git init
npm init -y
```

### package.json essencial

```json
{
  "name": "meu-projeto",
  "version": "0.1.0",
  "type": "module",
  "engines": { "node": ">=18.0.0" },
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "typecheck": "tsc --noEmit"
  }
}
```

## 2. TypeScript

```bash
npm install -D typescript tsx @types/node
npx tsc --init
```

### tsconfig.json recomendado

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

## 3. Linting e Formatação

```bash
npm install -D eslint @eslint/js typescript-eslint
```

### eslint.config.js

```javascript
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  { ignores: ["dist/", "node_modules/"] },
);
```

## 4. Testes

```bash
npm install -D vitest @vitest/coverage-v8
```

### vitest.config.ts

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["node_modules/", "dist/"],
    },
  },
});
```

## 5. Estrutura de Pastas

```
projeto/
├── src/
│   ├── index.ts          # Entry point
│   ├── types/            # Interfaces e types compartilhados
│   ├── utils/            # Funções utilitárias
│   └── modules/          # Módulos de negócio
├── tests/
│   └── *.test.ts
├── docs/                 # Documentação
├── .gitignore
├── package.json
├── tsconfig.json
├── eslint.config.js
├── vitest.config.ts
└── README.md
```

## 6. Git

### .gitignore mínimo

```
node_modules/
dist/
coverage/
*.log
.env
.env.local
.DS_Store
```

### Primeiro commit

```bash
git add .
git commit -m "chore: initial project setup"
```

## 7. README Template

```markdown
# Nome do Projeto

Descrição breve.

## Setup

\`\`\`bash
npm install
npm run dev
\`\`\`

## Scripts

| Script  | Descrição                |
| ------- | ------------------------ |
| `dev`   | Rodar em desenvolvimento |
| `build` | Compilar para produção   |
| `test`  | Rodar testes             |
| `lint`  | Checar lint              |

## Licença

MIT
```

## Checklist Final

- [ ] `npm install` roda sem erros
- [ ] `npm run build` compila
- [ ] `npm test` passa
- [ ] `npm run lint` sem warnings
- [ ] `.gitignore` completo
- [ ] README com instruções de setup
- [ ] Primeiro commit feito

