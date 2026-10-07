---
name: technical-research
description: Research a technical question against primary sources and deliver cited, decision-ready evidence. Use when the team does not know which technology, API or approach to use.
---

# Skill: Technical Research

## Princípio

Toda afirmação volta à fonte que a possui. Você entrega evidência; quem decide é o dono da decisão.

## Quando usar

Escolha entre tecnologias, bibliotecas ou APIs; dúvida sobre comportamento de uma API; necessidade de PoC ou benchmark antes de uma decisão.

## Hierarquia de fontes

1. código e arquitetura do projeto
2. requisitos do usuário
3. documentação oficial
4. repositórios oficiais do fornecedor
5. open source maduro
6. pesquisa
7. experimental

Fonte secundária (blog, resumo) só aponta para a primária; nunca é a evidência.

## Decisões

- Formule a pergunta e o critério de comparação **antes** de pesquisar.
- Compare no máximo as 2–4 opções viáveis.
- Fato verificado ≠ hipótese: marque cada um.
- Número sem método de medição não entra.
- PoC é descartável; registre o resultado, não promova o código.

## Erros comuns

- Pesquisar sem pergunta e voltar com um resumo genérico.
- Citar data de lançamento ou versão de memória.
- Recomendar a opção mais popular sem ligação com o critério.

## Entrega

Um arquivo Markdown no padrão de notas do projeto, com: pergunta, critério, opções, tabela de comparação, recomendação, limitações e fonte de cada afirmação.

## Checklist

- [ ] Pergunta e critério escritos antes
- [ ] Cada afirmação tem fonte primária
- [ ] Fatos e hipóteses separados
- [ ] Recomendação com limitações conhecidas

---

Partes adaptadas de [mattpocock/skills](https://github.com/mattpocock/skills/tree/f3fc5632f401/skills/engineering/research) (MIT), sem o agente em segundo plano. Ver `skills/THIRD_PARTY_LICENSES.md`.
