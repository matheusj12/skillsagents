---
name: mcp-protocol
description: Build or integrate Model Context Protocol servers - roles, primitives, transports and the security rules from the official spec. Use when exposing tools or data to agents via MCP or connecting to an MCP server.
---

# Skill: Model Context Protocol (MCP)

## Princípio

MCP padroniza como uma aplicação de IA (host) conecta fontes de contexto e ferramentas (servers) via clients, com mensagens JSON-RPC 2.0. Uma ferramenta MCP é **execução de código arbitrário**: trate como tal.

## Quando usar

Expor dados ou ações a vários agentes/hosts de forma padronizada, ou consumir um server existente. Para uma única integração interna, uma ferramenta comum (`02-ai-engineering/tool-calling-and-structured-outputs`) pode bastar.

## Decisões

- **Primitiva certa:** `tools` para ações que o modelo executa; `resources` para dados de contexto; `prompts` para modelos de interação do usuário.
- **Transporte:** local via stdio; remoto via HTTP, com autenticação.
- **Projeto das tools:** mesmas regras de tool calling: descrição completa, poucas ferramentas, respostas enxutas, erros úteis.
- **Prefira server oficial ou mantido** antes de escrever um novo.

## Segurança (spec oficial)

- Consentimento explícito do usuário antes de expor dados ou invocar ferramentas.
- Descrições e anotações de tools vindas de server não confiável são **não confiáveis**.
- Menor privilégio: o server só acessa o que precisa; credenciais fora do código.
- Valide toda entrada recebida pelas tools.

## Erros comuns

- Server com acesso amplo ao sistema "por conveniência".
- Confiar no texto de tools de servers de terceiros.
- Expor como tool o que deveria ser só leitura (resource).

## Checklist

- [ ] Primitiva correta para cada capacidade
- [ ] Tools com descrição completa e entrada validada
- [ ] Menor privilégio e credenciais fora do código
- [ ] Consentimento para ações com efeito

## Referências

- MCP Specification: https://modelcontextprotocol.io/specification/latest
- MCP docs: https://modelcontextprotocol.io/docs
- REFERENCE: `mcp-servers` (servers oficiais) e `anthropics/skills` → `mcp-builder` em `references/repositories.json`
