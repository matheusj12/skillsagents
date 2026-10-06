---
name: decision-making
description: How to decide and simplify - Amazon Type 1/Type 2 decisions and Elon Musk's five-step algorithm. Use when planning work, choosing an approach or cutting scope.
---

# Skill: Tomada de Decisão

## Portas de uma via e de duas vias (Amazon)

- **Type 1 (porta de uma via):** irreversível ou muito cara de desfazer (escolha de banco principal, contrato público de API, exclusão de dados). Decida com cuidado, análise e consulta.
- **Type 2 (porta de duas vias):** reversível (biblioteca interna, layout, config). Decida rápido, com poucas pessoas, e corrija se errar.

Erro comum: tratar decisões Type 2 com o peso de Type 1, o que deixa o time lento. Decida com cerca de 70% da informação que gostaria de ter.

## O algoritmo de cinco passos (Elon Musk)

Aplique **nesta ordem**:

1. **Questione cada requisito.** Todo requisito tem um dono, não "o time". Requisitos de pessoas inteligentes também podem estar errados.
2. **Delete a parte ou o processo.** Se não precisar adicionar de volta ao menos 10% do que deletou, deletou pouco.
3. **Simplifique e otimize.** Só depois de deletar: o erro mais comum é otimizar algo que não deveria existir.
4. **Acelere o ciclo.** Só depois de simplificar.
5. **Automatize.** Por último.

## Aplicação no time

- O Orchestrator classifica cada decisão como Type 1 ou Type 2 antes de delegar.
- Type 1 passa pelo Software Architect (design doc ou ADR) antes da implementação.
- Antes de construir, rode os passos 1 e 2: o melhor código é o que não precisou ser escrito.

## Fonte

- Jeff Bezos, Carta aos acionistas da Amazon de 2015 (Type 1/Type 2) e de 2016 (70% da informação).
- Walter Isaacson, *Elon Musk* (Simon & Schuster, 2023), "The Algorithm".
