# Skill: LLM Evals & LLM-as-a-Judge

## Metodologia de Avaliação de IA

1. **Dataset de Teste (Ground Truth)**: Conjunto de perguntas, contextos e respostas esperadas.
2. **Métricas de RAG**:
   - *Faithfulness*: A resposta do LLM é totalmente fundamentada no contexto recuperado?
   - *Answer Relevance*: A resposta atende à pergunta do usuário?
   - *Context Precision*: O retriever trouxe contextos realmente relevantes?
3. **LLM-as-a-Judge**: Prompting especializado de um modelo forte (ex: GPT-4o) para atribuir notas (0 a 1) e justificativas para a resposta gerada.
