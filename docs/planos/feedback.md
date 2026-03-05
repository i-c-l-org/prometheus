# Feedback - Relatório de Performance (Prometheus CLI)

## Problemas identificados como FALSOS POSITIVOS

### Server Components marcados incorretamente como "unnecessary-rerender"

Os seguintes arquivos são **Server Components** (funções async) e não possuem estado ou re-renders:

| Arquivo | Linha | Problema Citado | Motivo |
|---------|-------|-----------------|--------|
| `app/blog/page.tsx` | 31 | unnecessary-rerender | Server Component - apenas renderiza props |
| `app/components/Logo.tsx` | 30 | unnecessary-rerender | Server Component - sem useState |
| `app/blog/[slug]/page.tsx` | 9 | unnecessary-rerender | Server Component |
| `app/blog/category/[category]/page.tsx` | 10 | unnecessary-rerender | Server Component |
| `app/blog/tag/[tag]/page.tsx` | 8 | unnecessary-rerender | Server Component |

### Problemas válidos com código correto

| Arquivo | Linha | Problema | Análise |
|---------|-------|----------|---------|
| `app/components/ScrollToTop.tsx` | 32 | potential-memory-leak | **FALSO POSITIVO** - O useEffect faz cleanup correto (linhas 34-39) |
| `app/galeria/_components/GalleryGrid.tsx` | 39 | potential-memory-leak | **FALSO POSITIVO** - Timeout anterior é limpo antes de criar novo (linhas 35-37) |

### "Inefficient-array" em código normal

| Arquivo | Linha | Problema | Análise |
|---------|-------|----------|---------|
| `src/strategies/themes/ThemeRegistry.ts` | 133 | inefficient-array | **FALSO POSITIVO** - `Object.keys().forEach()` é O(n), operação trivial |

### "console-in-production" em comentários

| Arquivo | Linha | Problema | Análise |
|---------|-------|----------|---------|
| `src/services/github/github-stats.ts` | 133 | console-in-production | **FALSO POSITIVO** - `console.log` está em comentário JSDoc, não em código |

### "unnecessary-rerender" em Client Components com comportamento esperado

| Arquivo | Linha | Problema | Análise |
|---------|-------|----------|---------|
| `app/galeria/_components/CategoryNav.tsx` | 46 | unnecessary-rerender | **FALSO POSITIVO** - Re-render é necessário para atualizar UI quando `pathname` muda |
| `app/components/ui/PostCard.tsx` | 55 | unnecessary-rerender | **FALSO POSITIVO** - Known issue com `useRouter` do Next.js |

---

## Recomendações para a CLI

1. **Não marcar Server Components** como having unnecessary-rerender - eles não têm estado nem re-renders
2. **Validar se o código realmente faz cleanup** antes de reportar memory leaks - os exemplos acima fazem cleanup correto
3. **Ignorar console.log em comentários JSDoc** - não são executados em produção
4. **Considerar o contexto do Next.js** - `useRouter` causar re-renders é um comportamento esperado e documentado
5. **Não reportar `Object.keys().forEach()` como ineficiente** - é uma operação O(n) padrão

---

## Problemas VÁLIDOS encontrados no código

Os seguintes problemas foram confirmados como reais e devem ser corrigidos:

1. `app/galeria/github-stats/_components/GitHubStatsPreview.tsx:147` - setTimeout sem cleanup no unmount
2. `app/galeria/visitors/_components/VisitorsBadgeGrid.tsx:61` - setTimeout sem cleanup no unmount
3. `app/api/visitors/[id]/badge.svg/route.ts:140` - console.log em produção (nível baixo)
