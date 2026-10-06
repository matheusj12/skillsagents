---
name: rag-and-vector-search
description: Chunking, embeddings, retrieval, hybrid search and reranking for RAG pipelines. Use when designing or debugging retrieval.
---

# Skill: RAG & Vector Search

## Diretrizes Práticas de RAG (Retrieval-Augmented Generation)

### 1. Chunking Strategies
- **Fixed-size / Character Chunking**: Divisão simples com overlap (ex: 500 caracteres, 50 overlap).
- **Semantic Chunking**: Divisão com base em tópicos, parágrafos ou estrutura do documento (headings/markdown).

### 2. Embeddings & Indexação
- Escolha do modelo de Embedding alinhado com o idioma e domínio (ex: OpenAI text-embedding-3, Cohere, HuggingFace).
- Armazenamento em Banco Vetorial (ChromaDB, PGVector, Qdrant).

### 3. Retrieval & Otimização
- **Top K**: Recuperação dos K documentos mais similares por Cosseno ou Distância Euclidiana.
- **Hybrid Search**: Combinação de busca por palavras-chave (BM25) e busca vetorial densa.
- **Reranking**: Uso de Reranker (ex: Cross-Encoder) para reordenar os trechos antes de injetar no prompt do LLM.
