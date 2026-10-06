---
name: code-review
description: Code review standard from Google Engineering Practices - what to look for, how to comment and when to approve. Use when reviewing a change.
---

# Skill: Code Review (Google Engineering Practices)

## Padrão de aprovação

Aprove quando a mudança **melhora a saúde geral do código**, mesmo que não esteja perfeita. Não existe código perfeito, só código melhor. Bloqueie apenas o que piora o sistema.

## O que olhar, em ordem

1. **Design:** a mudança faz sentido aqui? Integra bem com o resto?
2. **Funcionalidade:** faz o que o autor pretende? Bordas, concorrência, erros.
3. **Complexidade:** dá para ser mais simples? Há código para necessidades futuras que ninguém pediu (overengineering)?
4. **Testes:** existem, testam o comportamento certo e falhariam se o código quebrasse?
5. **Nomes:** claros e consistentes.
6. **Comentários:** explicam o porquê, não o quê.
7. **Estilo:** segue o guia do projeto. Preferências pessoais não bloqueiam.
8. **Documentação:** atualizada quando o comportamento muda.

Leia cada linha que foi alterada e o contexto em volta.

## Como comentar

- Seja gentil e explique o motivo.
- Prefixe sugestões não bloqueantes com `Nit:` ou `Opcional:`.
- Separe claramente bloqueadores de sugestões.
- Aponte arquivo e linha.

## Velocidade

Responda rápido: revisões lentas travam o time inteiro. Mudanças pequenas são revisadas melhor e mais rápido; peça para dividir mudanças grandes.

## Fonte

- Google Engineering Practices: https://google.github.io/eng-practices/review/
