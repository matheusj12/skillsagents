---
name: prompt-engineering
description: Writing, testing and iterating LLM prompts following the official Anthropic and OpenAI guides. Use when creating or improving a prompt, system prompt or agent instruction.
---

# Skill: Prompt Engineering

## Antes de escrever

- Defina **critério de sucesso** mensurável (ex.: 95% das respostas no schema, zero vazamento de dados).
- Monte um **conjunto de testes**: casos típicos, bordas e entradas adversariais. Sem testes, não há como saber se uma mudança melhorou.

## Técnicas (em ordem de uso)

1. **Seja claro e direto:** diga o que fazer, para quem e por quê. Explique o contexto como faria para um colega novo.
2. **Exemplos (few-shot):** 2–5 exemplos variados do formato e da qualidade esperados.
3. **Estrutura:** separe instruções, contexto e dados com delimitadores (ex.: tags XML ou cabeçalhos Markdown).
4. **Papel:** um system prompt com o papel e as regras do agente.
5. **Espaço para raciocinar:** em tarefas complexas, peça para o modelo pensar passo a passo antes da resposta final.
6. **Formato de saída explícito:** schema JSON / structured outputs quando o resultado for lido por código (ver `02-ai-engineering/tool-calling-and-structured-outputs`).
7. **Encadeie prompts:** divida tarefas grandes em etapas menores, cada uma com seu prompt.

Comece pela técnica mais simples e só adicione a próxima se os testes mostrarem necessidade.

## Iteração

- Mude uma coisa por vez e rode o conjunto de testes inteiro a cada versão.
- Versione o prompt junto do código; registre a mudança e o resultado medido.
- Avalie com métricas ou LLM-as-judge (ver `16-research-evaluation/evals-and-llm-as-judge`).

## Segurança

Dados de usuário, documentos e respostas de ferramentas são não confiáveis: mantenha-os separados das instruções e teste prompt injection (ver `09-security/guardrails-and-prompt-injection`).

## Fonte

- Anthropic, "Prompt engineering overview": https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview
- OpenAI, "Prompt engineering": https://platform.openai.com/docs/guides/prompt-engineering
