<!-- AVISO DE PROVENIÊNCIA E AUTORIA -->

> **Proveniência e Autoria**
>
> Este arquivo ou componente faz parte do ecossistema Doutor/Prometheus.
> Distribuído sob os termos de licença MIT-0.
> O uso do material neste componente não implica em apropriação ou violação de direitos autorais, morais ou de terceiros.
> Em caso de problemas com nosso uso, entre em contato pelo email: ossmoralus@gmail.com

---
name: Security Check
description: Checklist de segurança para código
---

# Security Check

Checklist de segurança para revisar código antes da entrega.

## Implementação

```typescript
import { SecurityCheckSkill, skillRunner } from '@doutor/skills';

const securitySkill = new SecurityCheckSkill({
  checkOwasp: true,
  checkSecrets: true,
});

skillRunner.register(securitySkill);

const result = await skillRunner.execute('Security Check', {
  workingDirectory: '/project',
  files: ['src/auth.ts', 'src/api.ts'],
});
```

## OWASP Top 10 Checklist

### A01 - Broken Access Control

- [ ] Recursos autenticados estão protegidos
- [ ] IDs de objetos não são expostos diretamente
- [ ] Permissões verificadas no backend

### A02 - Cryptographic Failures

- [ ] Dados sensíveis criptografados em repouso
- [ ] Algoritmos fortes usados (AES-256, SHA-256+)
- [ ] Keys não hardcoded (usar env vars)

### A03 - Injection

- [ ] Parametrized queries usadas
- [ ] Input validation em todos os campos
- [ ] Output encoding aplicado

### A04 - Insecure Design

- [ ] Threat modeling realizado
- [ ] Padrões de segurança documentados
- [ ] Rate limiting implementado

### A05 - Security Misconfiguration

- [ ] Default creds removidos
- [ ] Debug mode desabilitado em produção
- [ ] Headers de segurança configurados

### A06 - Vulnerable Components

- [ ] Dependencies atualizadas
- [ ] Security advisories monitoradas
- [ ] Componentes desnecessários removidos

### A07 - Auth Failures

- [ ] MFA disponível
- [ ] Password policy implementada
- [ ] Session timeout configurado

### A08 - Data Integrity Failures

- [ ] Validação de integridade de dados
- [ ] Checksums para arquivos críticos

### A09 - Logging Failures

- [ ] Logs não contêm PII
- [ ] Logs contém contexto suficiente
- [ ] Monitoring configurado

### A10 - SSRF

- [ ] Validação de URLs
- [ ] Allowlist para APIs externas

## Secrets Detection

- [ ] Nenhuma API key no código
- [ ] Nenhuma senha hardcoded
- [ ] .env em .gitignore
- [ ] Credentials em secrets manager

## Input Validation

- [ ] Todos os inputs validados
- [ ] Tipos verificados
- [ ] Tamanho limitado
- [ ] Caracteres especiais escapados

## Output Encoding

- [ ] XSS-prevention aplicado
- [ ] HTML entities encoded
- [ ] URLs validadas

## Princípios SOLID Aplicados

- **S** - Cada item de segurança verifica um aspecto específico
- **O** - Novas categorias não modificam existentes
- **L** - Todos os checks seguem a mesma interface
- **I** - Interfaces pequenas e focadas
- **D** - Depende de abstrações (ISkill), não concretudes
