---
name: rag-and-vector-search
description: Decide whether retrieval is needed and build retrieval that finds the right chunks - chunking, embeddings, hybrid search, reranking, retrieval evaluation. Use when designing or debugging RAG.
---

# Skill: RAG & Vector Search

## Princípio

RAG é um problema de **busca** antes de ser um problema de LLM. Se a recuperação traz o trecho errado, nenhum prompt conserta.

## Quando usar

Base de conhecimento grande demais para o prompt ou que muda com frequência. Se a base é pequena (ordem de 200 mil tokens), coloque tudo no prompt (com prompt caching) e não construa RAG.

## Decisões

- **Chunking:** respeite a estrutura do documento (seções, parágrafos), com sobreposição pequena e metadados (fonte, seção, data).
- **Contexto no chunk:** prefixe cada chunk com uma frase situando-o no documento antes de indexar (contextual retrieval).
- **Embeddings:** o mesmo modelo para indexar e consultar; trocou de modelo, reindexe tudo.
- **Busca híbrida:** vetorial (significado) + BM25 (termos exatos, códigos, nomes).
- **Reranking:** recupere mais candidatos (ex.: 20) e reordene antes de mandar ao modelo.
- **Avalie a recuperação separada da geração:** o trecho certo está entre os K primeiros (recall@K)?

## Erros comuns

- Construir RAG para uma base que cabe no prompt.
- Chunk que corta a frase ou perde a referência ("a empresa" sem dizer qual).
- Só busca vetorial para consultas com IDs e termos exatos.
- Avaliar só a resposta final e não saber se a falha foi na busca.

## Checklist

- [ ] RAG é necessário (base não cabe no prompt)
- [ ] Chunks com contexto e metadados
- [ ] Busca híbrida + reranking
- [ ] Conjunto de perguntas com trecho esperado e recall@K medido

## Referências

- Anthropic, "Contextual Retrieval": https://www.anthropic.com/news/contextual-retrieval
- OpenAI, "Embeddings": https://developers.openai.com/api/docs/guides/embeddings
- REFERENCE: `pgvector`, `qdrant` em `references/repositories.json`
