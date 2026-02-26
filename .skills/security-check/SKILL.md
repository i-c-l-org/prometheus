<!-- AVISO DE PROVENIÊNCIA E AUTORIA -->

> **Proveniência e Autoria**
>
> Este arquivo ou componente faz parte do ecosistema Doutor/Prometheus.
> Distribuído sob os termos de licença MIT-0.
> O uso do material neste componente não implica em apropriação ou violação de direitos autorais, morais ou de terceiros.
> Em caso de problemas com nosso uso, entre em contato pelo email: ossmoralus@gmail.com


---
name: Security Check
description: Checklist de segurança para identificar vulnerabilidades comuns em código JavaScript/TypeScript
---

# Security Check

Checklist para encontrar vulnerabilidades comuns antes que cheguem a produção.

## 🔴 Crítico — Bloqueia deploy

### 1. Injection

- [ ] **Command Injection**: Sem `exec()`, `spawn()` com input do usuário não sanitizado
- [ ] **SQL Injection**: Usar queries parametrizadas, nunca concatenar strings
- [ ] **NoSQL Injection**: Validar tipos de input (não aceitar objetos onde espera string)

```typescript
// ❌ Ruim
db.query(`SELECT * FROM users WHERE name = '${req.body.name}'`);

// ✅ Bom
db.query("SELECT * FROM users WHERE name = $1", [req.body.name]);
```

### 2. XSS (Cross-Site Scripting)

- [ ] Sem `innerHTML`, `dangerouslySetInnerHTML`, `document.write`
- [ ] Output é escaped por padrão (React JSX faz isso, template literals NÃO)
- [ ] URLs são validadas antes de renderizar (`javascript:` protocol attack)

### 3. Secrets

- [ ] Sem API keys, tokens ou senhas hardcoded
- [ ] `.env` está no `.gitignore`
- [ ] Secrets vêm de variáveis de ambiente ou vault

### 4. Eval e amigos

- [ ] Sem `eval()`, `new Function()`, `setTimeout/setInterval` com strings
- [ ] Sem `vm.runInThisContext` com input externo
- [ ] Sem `require()` dinâmico com input do usuário

## 🟡 Importante — Revisar antes do merge

### 5. Autenticação e Autorização

- [ ] Tokens têm expiração
- [ ] Refresh tokens são rotacionados
- [ ] Endpoints protegidos verificam permissões (não só autenticação)
- [ ] Rate limiting implementado para rotas de login

### 6. Dados sensíveis

- [ ] Senhas hasheadas com bcrypt/argon2 (nunca MD5/SHA1)
- [ ] Logs não contêm PII (dados pessoais), tokens ou senhas
- [ ] Responses da API não vazam dados internos (stack traces, IDs internos)

### 7. Dependências

- [ ] `npm audit` sem vulnerabilidades critical/high
- [ ] Lock file versionado (`package-lock.json`)
- [ ] Sem dependências abandonadas (último update >2 anos)

```bash
# Verificar vulnerabilidades
npm audit
# Ver dependências desatualizadas
npm outdated
```

### 8. CORS e Headers

- [ ] CORS configurado para domínios específicos (não `*` em produção)
- [ ] Headers de segurança configurados (CSP, HSTS, X-Frame-Options)
- [ ] Cookies com `httpOnly`, `secure`, `sameSite`

## 🟢 Boas práticas

### 9. Validação de Input

- [ ] Validação no servidor (nunca confiar só no client)
- [ ] Schema validation (Zod, Joi, Yup)
- [ ] Limites de tamanho para uploads e payloads

### 10. Error Handling

- [ ] Erros genéricos para o cliente, detalhados no log
- [ ] Sem stack traces em responses de produção
- [ ] Try-catch em operações async críticas

## Ferramentas Recomendadas

| Ferramenta               | Uso                              |
| ------------------------ | -------------------------------- |
| `npm audit`              | Vulnerabilidades em dependências |
| `eslint-plugin-security` | Lint rules de segurança          |
| `snyk`                   | Scan avançado de deps            |
| `helmet`                 | Headers de segurança Express     |
| `zod`                    | Validação de schema/input        |

