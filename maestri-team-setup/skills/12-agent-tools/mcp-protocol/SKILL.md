---
name: mcp-protocol
description: Model Context Protocol concepts: servers, clients, tools and resources. Use when building or integrating MCP servers.
---

# Skill: Model Context Protocol (MCP)

## Conceitos e Arquitetura MCP

O **Model Context Protocol (MCP)** padroniza como aplicações fornecem contexto, ferramentas e recursos para LLMs.

### Componentes Principais
1. **MCP Host / Client**: A aplicação ou assistente que consome os serviços (ex: Claude Desktop, Cursor, Agente customizado).
2. **MCP Server**: O servidor que expõe dados e funcionalidades via três primitivas:
   - **Tools**: Funções executáveis que o LLM pode chamar.
   - **Resources**: Dados legíveis (arquivos, documentos, logs).
   - **Prompts**: Modelos de prompt pré-configurados.

### Exemplo de Implementação de MCP Server (TypeScript / Node.js)
```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Configuração básica de servidor MCP
const server = new Server({
  name: "delivery-service-mcp",
  version: "1.0.0"
});
```
