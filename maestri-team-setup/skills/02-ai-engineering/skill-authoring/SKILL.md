---
name: skill-authoring
description: Write and review agent skills and system prompts that are concise, discoverable and testable. Use when creating or changing a SKILL.md or an employee system-prompt.md.
---

# Skill: Skill Authoring

## Princípio

O contexto é um bem público: cada token de uma skill compete com o trabalho. Escreva só o que o modelo ainda não sabe.

## Quando usar

Criar ou revisar `skills/*/*/SKILL.md` ou `agents/*/system-prompt.md`.

## Decisões

- **Frontmatter:** `name` em minúsculas e hífens; `description` em terceira pessoa dizendo **o que faz e quando usar**: é por ela que a skill é escolhida.
- **Grau de liberdade:** instrução aberta quando há vários caminhos válidos; passos exatos quando a operação é frágil.
- **Revelação progressiva:** `SKILL.md` curto com as regras; detalhe em arquivo de referência a **um nível** de profundidade.
- **Uma fonte:** não repita o que está no `team.json` ou em outra skill; aponte para ela.
- **Termos consistentes:** um termo por conceito em todo o texto.
- **Neste time, CORE pequeno:** o que é longo vira referência ou `on_demand`.

## Erros comuns

- Explicar o que o modelo já sabe.
- Descrição vaga ("ajuda com documentos").
- Várias opções sem um padrão recomendado.
- Datas e versões que vão envelhecer.
- Referências aninhadas (arquivo que aponta para arquivo que aponta para arquivo).

## Checklist

- [ ] Descrição diz o que e quando
- [ ] Nada que o modelo já saiba
- [ ] Detalhe longo fora do `SKILL.md`
- [ ] Sem duplicar outra skill ou o `team.json`
- [ ] Testado em pelo menos 3 casos reais antes e depois da mudança

## Referências

- Anthropic, "Skill authoring best practices": https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
- REFERENCE: `anthropics/skills` → `skill-creator` (em `references/repositories.json`)
