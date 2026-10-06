---
name: architecture-decision-records
description: Record significant architecture decisions as short, immutable ADRs. Use when a decision affects structure, dependencies, interfaces or is costly to change.
---

# Skill: Architecture Decision Records (ADR)

ADR é um registro curto de **uma** decisão arquitetural significativa, com o contexto que levou a ela. Responde no futuro: "por que fizemos assim?".

## Formato (Michael Nygard)

```markdown
# ADR-NNN: <decisão em uma frase>

Status: proposed | accepted | superseded by ADR-XXX
Data: AAAA-MM-DD

## Contexto
Forças em jogo: requisitos, restrições, fatos. Linguagem neutra.

## Decisão
"Vamos ..." em voz ativa.

## Consequências
O que fica mais fácil, o que fica mais difícil, riscos aceitos.
```

## Regras

- Uma decisão por ADR. Numere em sequência.
- ADR aceito não é editado: se a decisão mudar, crie um novo e marque o antigo como `superseded`.
- Registre só decisões significativas: estrutura, dependências, interfaces, tecnologia, padrões de construção.
- Guarde junto do código (ex.: `docs/adr/`), versionado.

## Fonte

- Michael Nygard, "Documenting Architecture Decisions" (2011): https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
