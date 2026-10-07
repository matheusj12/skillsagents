---
name: guardrails-and-prompt-injection
description: Defend LLM applications and agents against prompt injection and the OWASP Top 10 for LLM risks - trust boundaries, least privilege, output handling, human approval. Use when designing or reviewing anything an LLM reads or acts on.
---

# Skill: Guardrails & Prompt Injection

## Princípio

O modelo não distingue com segurança instrução de dado. Toda entrada que ele lê pode tentar comandá-lo, então a defesa está na **arquitetura**, não no prompt.

## Quando usar

Sistema em que um LLM lê conteúdo externo (usuário, documentos, páginas web, respostas de ferramentas) ou executa ações.

## Riscos principais (OWASP Top 10 for LLM, 2025)

Prompt injection · vazamento de informação sensível · cadeia de suprimentos · envenenamento de dados/modelo · tratamento inadequado da saída · agência excessiva · vazamento de system prompt · fraquezas em vetores/embeddings · desinformação · consumo sem limite.

## Decisões

- **Fronteira de confiança:** instruções do sistema separadas e delimitadas dos dados não confiáveis.
- **Menor privilégio:** o agente só tem as ferramentas e permissões da tarefa (contra agência excessiva).
- **Aprovação humana** para ação irreversível ou de alto impacto.
- **Saída do modelo é entrada não confiável:** escape/valide antes de renderizar, executar ou gravar.
- **Nada sensível no prompt:** secrets e dados de outros usuários nunca entram no contexto; suponha que o system prompt pode vazar.
- **Limites:** tamanho de entrada, custo e número de passos por requisição.

## Erros comuns

- Depender de "ignore instruções do documento" no prompt como única defesa.
- Agente com escrita em produção para uma tarefa de leitura.
- Renderizar HTML/Markdown do modelo sem sanitizar.
- Guardar segredo no system prompt.

## Checklist

- [ ] Dados não confiáveis separados das instruções
- [ ] Ferramentas e permissões mínimas
- [ ] Confirmação humana em ações irreversíveis
- [ ] Saída validada antes de uso
- [ ] Limites de tamanho, custo e passos

## Referências

- OWASP Top 10 for LLM Applications: https://genai.owasp.org/llm-top-10/
- MCP security principles: https://modelcontextprotocol.io/specification/latest
