---
name: sre-reliability
description: Google SRE practices - SLIs, SLOs, error budgets, blameless postmortems and toil reduction. Use when defining reliability targets, alerts, on-call or incident follow-up.
---

# Skill: SRE e Confiabilidade (Google)

## SLI, SLO e error budget

- **SLI:** a métrica que o usuário sente (ex.: % de requisições com sucesso, latência p99).
- **SLO:** a meta para o SLI em uma janela (ex.: 99,9% de sucesso em 30 dias).
- **Error budget:** `1 − SLO`. Com 99,9%, ~43 minutos de falha por mês são aceitáveis.
  - Budget sobrando: o time pode lançar mais rápido.
  - Budget esgotado: prioridade passa a ser confiabilidade até recuperar.

100% não é meta: custa caro demais e o usuário não percebe a diferença.

## Alertas

Alerte sobre sintomas que afetam o usuário (SLO em risco), não sobre causas internas. Todo alerta precisa ser acionável; alerta ignorado deve ser corrigido ou removido.

## Postmortem sem culpa (blameless)

Após incidente relevante, registre: impacto, linha do tempo, causa raiz, o que funcionou, o que falhou e **ações com dono e prazo**. Foque em sistemas e processos, nunca em culpados.

## Toil

Trabalho manual, repetitivo e automatizável é toil. Mantenha abaixo de 50% do tempo de operação e automatize o que se repete.

## Fonte

- Beyer, Jones, Petoff, Murphy, *Site Reliability Engineering* (O'Reilly, 2016): https://sre.google/sre-book/table-of-contents/
- *The Site Reliability Workbook*: https://sre.google/workbook/table-of-contents/
