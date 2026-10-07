---
name: tool-calling-and-structured-outputs
description: Design LLM tools and schema-constrained outputs that the model calls correctly and the system can trust. Use when an LLM must call code, use tools or return typed data.
---

# Skill: Tool Calling & Structured Outputs

## Princípio

O modelo não executa nada: ele escolhe uma ferramenta e preenche argumentos. A qualidade vem da **descrição** da ferramenta; a confiança vem de **validar** tudo que volta.

## Quando usar

- **Tool calling:** o modelo precisa agir ou buscar dados (consultar API, banco, executar operação).
- **Structured output:** o modelo precisa devolver dados num formato fixo lido por código.

## Decisões

- **Descrição detalhada** em cada ferramenta: o que faz, quando usar e quando não usar, o que cada parâmetro significa, limitações. É o fator que mais pesa no acerto.
- **Poucas ferramentas, bem definidas:** agrupe operações relacionadas com um parâmetro `action`; prefixe por serviço (`github_list_prs`).
- **Respostas enxutas:** devolva só o que o modelo precisa para o próximo passo, com IDs estáveis.
- **Schema estrito** quando o provedor oferece (`strict: true`): todos os campos obrigatórios, `additionalProperties: false`, opcional como união com `null`.
- **Erros** voltam como resultado da ferramenta com mensagem útil, para o modelo corrigir.

## Erros comuns

- Descrição de uma linha ("Gets the price").
- Uma ferramenta para cada micro-ação.
- Executar ação com efeito colateral sem validar argumentos nem pedir confirmação.
- Confiar em JSON "válido" sem validar contra o schema (Pydantic, Zod).
- Ignorar recusa do modelo ao processar a resposta.

## Checklist

- [ ] Cada ferramenta: o que, quando, parâmetros, limitações
- [ ] Schema estrito onde suportado
- [ ] Argumentos validados antes de executar
- [ ] Ação irreversível exige confirmação
- [ ] Resposta da ferramenta enxuta; erro com mensagem acionável

## Referências

- Anthropic, "Define tools": https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools
- Anthropic, "Writing tools for agents": https://www.anthropic.com/engineering/writing-tools-for-agents
- OpenAI, "Structured Outputs": https://developers.openai.com/api/docs/guides/structured-outputs
