<!-- AVISO DE PROVENIÊNCIA E AUTORIA -->

> **Proveniência e Autoria**
>
> Este arquivo ou componente faz parte do ecossistema Doutor/Prometheus.
> Distribuído sob os termos de licença MIT-0.
> O uso do material neste componente não implica em apropriação ou violação de direitos autorais, morais ou de terceiros.
> Em caso de problemas com nosso uso, entre em contato pelo email: ossmoralus@gmail.com

---
name: Project Setup
description: Setup de novo projeto Node/TypeScript
---

# Project Setup

Guia completo para setup de novos projetos Node/TypeScript.

## Implementação

```typescript
import { ProjectSetupSkill, skillRunner } from '@doutor/skills';

const setupSkill = new ProjectSetupSkill({
  packageManager: 'pnpm',
  testing: 'vitest',
  linting: 'eslint',
});

skillRunner.register(setupSkill);

const result = await skillRunner.execute('Project Setup', {
  workingDirectory: '/new-project',
  config: { name: 'my-project', type: 'library' },
});
```

## Setup Inicial

### 1. Inicializar Projeto

```bash
# Com pnpm (recomendado)
pnpm init

# Ou npm
npm init -y

# Ou yarn
yarn init -y
```

### 2. Instalar TypeScript

```bash
pnpm add -D typescript @types/node tsx
```

### 3. Configurar tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@core/*": ["src/core/*"],
      "@shared/*": ["src/shared/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 4. Estrutura de Pastas

```
src/
├── core/           # Framework, interfaces
├── features/       # Features do domínio
├── shared/         # Utilitários, tipos
└── index.ts       # Entry point
```

## Ferramentas Recomendadas

### Testing

```bash
pnpm add -D vitest @testing-library/react jsdom
```

### Linting

```bash
pnpm add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier
```

### Git Hooks

```bash
pnpm add -D husky lint-staged
```

### Conventional Commits

```bash
pnpm add -D commitlint @commitlint/cli @commitlint/config-conventional
```

## Scripts Recomendados

```json
{
  "scripts": {
    "build": "tsc",
    "dev": "tsx watch src/index.ts",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "prepare": "husky install"
  }
}
```

## Arquivos Essenciais

### .gitignore

```
node_modules/
dist/
.env
.env.local
*.log
coverage/
.DS_Store
```

### .nvmrc

```
24.12.0
```

### .editorconfig

```ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
```

## Princípios SOLID Aplicados

- **S** - Cada passo do setup tem responsabilidade única
- **O** - Novas configurações não modificam existentes
- **L** - Todos os passos seguem a mesma interface
- **I** - Interfaces pequenas e focadas
- **D** - Depende de abstrações (ISkill), não concretudes
