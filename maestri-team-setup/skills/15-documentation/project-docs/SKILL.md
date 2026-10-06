---
name: project-docs
description: Single standard for project documentation - README, setup, environment variables, API, deploy and decisions. Use when writing or reviewing a project's technical docs.
---

# Skill: Documentação de Projeto

Um padrão único para todo projeto. Quem lê deve conseguir rodar o sistema sem perguntar nada.

## README.md (raiz)

1. **O que é:** uma ou duas frases.
2. **Requisitos:** versões de runtime e serviços (ex.: Node 20, PostgreSQL 16).
3. **Setup:** comandos exatos, copiáveis, na ordem.
4. **Variáveis de ambiente:** tabela `nome | obrigatória | descrição | exemplo`, espelhando o `.env.example`.
5. **Executar:** desenvolvimento, testes, produção.
6. **Estrutura:** pastas principais, uma linha cada.
7. **Links:** para os documentos abaixo.

## Documentos de apoio (`docs/`)

| Documento | Conteúdo |
|---|---|
| `architecture.md` | visão geral, componentes, fluxos (diagrama Mermaid) |
| `api.md` ou OpenAPI | endpoints, contratos, erros, autenticação |
| `deploy.md` | como publicar, ambientes, rollback |
| `adr/` | decisões (ver `15-documentation/architecture-decision-records`) |

## Regras

- Documente o que existe e foi verificado, não o planejado.
- Comandos testados; exemplos com placeholders, nunca secrets reais.
- Um assunto em um lugar só: linke em vez de copiar.
- Atualize a documentação na mesma mudança que altera o comportamento.

## Fonte

- Write the Docs, "Documentation Guide": https://www.writethedocs.org/guide/
- Google, "Documentation Best Practices": https://google.github.io/styleguide/docguide/best_practices.html
