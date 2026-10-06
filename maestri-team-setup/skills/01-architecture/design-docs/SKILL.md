---
name: design-docs
description: Google-style design doc for system design before implementation. Use when a change is large, cross-cutting, risky or hard to reverse.
---

# Skill: Design Docs (estilo Google)

Design doc é o documento curto e informal que registra **o problema, a solução escolhida e os trade-offs** antes do código. Serve para achar falhas de design quando ainda é barato mudar.

## Quando escrever

- A mudança afeta vários componentes, times ou contratos.
- A decisão é difícil de reverter (ver `18-engineering-management/decision-making`).
- Existem alternativas razoáveis e a escolha não é óbvia.

Não escreva para mudanças pequenas e óbvias: o custo do documento supera o valor.

## Estrutura

1. **Contexto e escopo:** o que existe hoje e o que está sendo construído. Só fatos.
2. **Objetivos e não-objetivos:** o que precisa ser verdade no final; o que explicitamente fica de fora.
3. **Design:** visão geral (diagrama), componentes, APIs e contratos, dados e armazenamento, fluxos principais.
4. **Alternativas consideradas:** cada uma com o motivo da rejeição. É a seção que mais prova que o design foi pensado.
5. **Preocupações transversais:** segurança, privacidade, observabilidade, escalabilidade, custo, migração e rollback.

## Regras

- Foque em trade-offs, não em descrever código.
- Seja proporcional: 1–3 páginas resolvem a maioria dos casos.
- Mantenha o documento como registro: decisões importantes viram ADRs (`15-documentation/architecture-decision-records`).

## Fonte

- Malte Ubl, "Design Docs at Google": https://www.industrialempathy.com/posts/design-docs-at-google/
- Winters, Manshreck, Wright, *Software Engineering at Google* (O'Reilly, 2020).
