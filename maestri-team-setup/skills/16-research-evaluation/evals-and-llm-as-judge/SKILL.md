---
name: evals-and-llm-as-judge
description: Measure LLM output quality with task-specific eval sets and automated grading, including calibrated LLM-as-judge. Use before optimizing a prompt, model or RAG pipeline and to catch regressions.
---

# Skill: Evals & LLM-as-Judge

## Princípio

Sem medida, "melhorou" é opinião. Defina sucesso antes de mexer no prompt, no modelo ou no pipeline.

## Quando usar

Criar ou mudar prompt, modelo, ferramenta ou RAG; comparar alternativas; proteger contra regressão.

## Decisões

- **Critério de sucesso** específico e mensurável (ex.: "95% das respostas no schema", "recall@5 ≥ 0,9").
- **Conjunto de teste** que espelha o uso real, incluindo bordas: entrada vazia, longa, ambígua, maliciosa.
- **Volume > perfeição:** muitos casos com nota automática superam poucos avaliados à mão.
- **Ordem de avaliação:** primeiro código (match exato, schema, métricas); depois LLM-as-judge para o subjetivo; humano para calibrar.
- **LLM-as-judge:** rubrica detalhada com exemplos, raciocínio antes da nota, modelo diferente do que gerou, e concordância medida contra rótulos humanos.
- **RAG:** avalie recuperação e geração separadamente.

## Erros comuns

- Testar só os casos fáceis.
- Juiz sem rubrica ("está bom?").
- Mudar várias coisas de uma vez e não saber o que causou a diferença.
- Não rodar o conjunto inteiro antes de cada entrega.

## Checklist

- [ ] Critério de sucesso escrito antes
- [ ] Conjunto com casos de borda e maliciosos
- [ ] Nota automática onde possível
- [ ] Juiz com rubrica e calibrado
- [ ] Resultado comparado com a versão anterior

## Referências

- Anthropic, "Define success criteria and build evaluations": https://platform.claude.com/docs/en/test-and-evaluate/develop-tests
- OpenAI, "Evals": https://developers.openai.com/api/docs/guides/evals
