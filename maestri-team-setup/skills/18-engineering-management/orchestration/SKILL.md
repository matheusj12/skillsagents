---
name: orchestration
description: How the Orchestrator decomposes work, picks the minimum employees, parallelizes and keeps context small in a Maestri team. Use on every incoming task before delegating.
---

# Skill: Orchestration

## Princípio

Comece pelo arranjo mais simples que resolve. Mais agentes só quando a tarefa realmente exige (Anthropic, "Building effective agents").

## Escolha o padrão

| Situação | Padrão |
|---|---|
| Um funcionário resolve | delegue a ele e pronto |
| Etapas fixas e conhecidas | encadeamento: uma etapa por vez, cada saída alimenta a próxima |
| Tipos de pedido distintos | roteamento: classifique e mande ao especialista |
| Partes independentes | paralelização: `maestri ask --batch` |
| Subtarefas imprevisíveis | orquestrador-trabalhadores: decomponha, delegue, consolide |
| Critério de qualidade claro | avaliador-otimizador: um produz, outro revisa até passar |

## Decisões

- **Quem:** leia `title`, `responsibilities` e `enabled` no `team.json`; escolha o menor conjunto.
- **Dependências:** só paralelize o que não depende de resultado de outro.
- **Contexto:** passe ponteiros (arquivo, spec, ticket), não cópias de conteúdo.
- **Passagens:** troca de dono de trabalho usa `18-engineering-management/handoff`.
- **Fim:** nenhuma entrega sem verificação de aceite contra o pedido.

## Erros comuns

- Acionar o ciclo completo para uma correção pequena.
- Paralelizar tarefas acopladas e depois reconciliar conflitos.
- Repassar a conversa inteira em vez do essencial.
- Deixar um funcionário decidir o que é de outro.

## Checklist

- [ ] Padrão escolhido é o mais simples que resolve
- [ ] Cada funcionário acionado tem motivo explícito
- [ ] Dependências mapeadas antes de paralelizar
- [ ] Contexto passado por ponteiros
- [ ] Aceite antes de responder ao usuário

## Referências

- Anthropic, "Building effective agents": https://www.anthropic.com/engineering/building-effective-agents
