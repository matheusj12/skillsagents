---
name: testing-strategy
description: Test strategy based on Google test sizes, the test pyramid, regression and flaky-test handling. Use when planning tests for a feature or judging whether coverage is enough.
---

# Skill: Testing Strategy

## Tamanhos de teste (Google)

| Tamanho | Escopo | Restrições |
|---|---|---|
| **Small** | uma unidade, um processo | sem rede, disco ou sleep; milissegundos |
| **Medium** | vários processos em uma máquina | pode usar banco local, sem rede externa |
| **Large** | sistema completo | rede, serviços reais; poucos e críticos |

Distribuição alvo (pirâmide): maioria small, alguns medium, poucos large. Large demais deixa a suíte lenta e instável.

## O que testar

- Comportamento público, não detalhes de implementação: o teste não deve quebrar em uma refatoração que não muda o comportamento.
- Caminho feliz, bordas (vazio, limite, nulo) e erros esperados.
- Todo bug corrigido ganha um teste de regressão que falhava antes da correção.
- Contratos entre serviços (API) com testes de contrato ou de integração.

## Testes flaky

Um teste que às vezes passa e às vezes falha destrói a confiança na suíte. Investigue a causa (tempo, ordem, estado compartilhado, rede), corrija ou coloque em quarentena com dono e prazo. Nunca ignore retentando até passar.

## Critério de pronto

- Testes rodam no CI em cada mudança.
- Novos comportamentos têm testes; bugs corrigidos têm regressão.
- Falha de teste bloqueia o merge.

## Fonte

- Winters, Manshreck, Wright, *Software Engineering at Google*, cap. 11–14 (O'Reilly, 2020).
- Google Testing Blog, "Test Sizes": https://testing.googleblog.com/2010/12/test-sizes.html
