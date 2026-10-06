---
name: threat-modeling
description: Threat modeling with Microsoft STRIDE over a data-flow diagram, with OWASP for mitigations. Use when designing a system, exposing a new surface or reviewing security.
---

# Skill: Threat Modeling (STRIDE)

Faça durante o design, não depois do deploy.

## Processo (4 perguntas)

1. **O que estamos construindo?** Desenhe o fluxo de dados: atores, processos, armazenamentos, fluxos e **fronteiras de confiança** (onde o dado muda de nível de confiança).
2. **O que pode dar errado?** Aplique STRIDE em cada elemento que cruza uma fronteira.
3. **O que vamos fazer?** Uma mitigação por ameaça, ou aceite explícito do risco.
4. **Fizemos um bom trabalho?** Revise quando o design mudar.

## STRIDE

| Ameaça | Viola | Exemplo de mitigação |
|---|---|---|
| **S**poofing | autenticação | autenticação forte, MFA |
| **T**ampering | integridade | assinatura, validação de entrada, TLS |
| **R**epudiation | não-repúdio | logs de auditoria imutáveis |
| **I**nformation disclosure | confidencialidade | criptografia, menor privilégio |
| **D**enial of service | disponibilidade | rate limit, quotas, timeouts |
| **E**levation of privilege | autorização | checagem de autorização em toda ação |

## Agentes de IA

Trate toda entrada que chega ao LLM (usuário, documentos, páginas web, respostas de ferramentas) como não confiável. Ver `09-security/guardrails-and-prompt-injection`.

## Saída

Lista de ameaças com: elemento, categoria STRIDE, severidade, mitigação e dono.

## Fonte

- Microsoft, "Threat Modeling" (SDL): https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats
- Adam Shostack, *Threat Modeling: Designing for Security* (Wiley, 2014).
- OWASP Cheat Sheet Series: https://cheatsheetseries.owasp.org/
