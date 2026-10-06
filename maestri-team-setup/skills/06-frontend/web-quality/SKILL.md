---
name: web-quality
description: Web quality targets - Google Core Web Vitals and WCAG 2.2 accessibility basics. Use when building or reviewing a web interface.
---

# Skill: Qualidade Web

## Core Web Vitals (Google)

Meça no percentil 75 dos usuários reais.

| Métrica | Mede | Bom |
|---|---|---|
| **LCP** (Largest Contentful Paint) | carregamento | ≤ 2,5 s |
| **INP** (Interaction to Next Paint) | responsividade | ≤ 200 ms |
| **CLS** (Cumulative Layout Shift) | estabilidade visual | ≤ 0,1 |

Ações típicas: otimizar e dimensionar imagens, reduzir JavaScript na carga inicial, evitar tarefas longas na thread principal, reservar espaço para conteúdo que carrega depois.

## Acessibilidade (WCAG 2.2, nível AA)

- HTML semântico primeiro (`button`, `nav`, `label`); ARIA só quando não houver elemento nativo.
- Tudo operável por teclado, com foco visível.
- Contraste mínimo 4,5:1 para texto normal.
- Imagens com `alt`; campos de formulário com rótulo; erros explicados em texto.
- Não transmita informação só por cor.

## Checklist de entrega

- [ ] Core Web Vitals medidos (Lighthouse ou dados reais)
- [ ] Navegação completa por teclado
- [ ] Contraste e rótulos verificados
- [ ] Estados de carregamento, vazio e erro tratados

## Fonte

- Google, "Web Vitals": https://web.dev/articles/vitals
- W3C, WCAG 2.2: https://www.w3.org/TR/WCAG22/
