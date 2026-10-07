---
name: orchestration
description: How the Orchestrator classifies a task, routes it to the smallest team, sizes verification by risk and keeps context minimal in a Maestri team. Use on every incoming task before delegating.
---

# Skill: Orchestration

## Regra principal

**Use the smallest team and shortest valid path that can deliver the task correctly.** Etapas são capacidades, não pipeline; os níveis de risco servem para **tirar** etapas. Antes de cada agente: *que valor único ele acrescenta?* Sem resposta concreta, não chame.

## Classifique (rápido, sem documento)

Domínio, dono e risco em segundos. Tarefa óbvia → "Backend only" ou "Backend + revisor".

| Risco | Exemplos | Caminho |
|---|---|---|
| LOW | texto, CSS pequeno, doc simples, config localizada | dono → self-check/teste → pronto |
| NORMAL | endpoint com padrões existentes, service, componente, refatoração local | dono → revisor → pronto (bug pequeno: revisor só se a mudança justificar) |
| HIGH | arquitetura, auth/permissões, dados críticos, concorrência, integração complexa | só os especialistas necessários → dono → revisor → pronto |
| CRITICAL | feature grande, mudança transversal, release, muitos requisitos | arquitetura/segurança/QA/aceite só conforme o risco concreto → dono(s) → revisor → pronto |

## Quem entra só sob demanda

- **Arquitetura:** nova decisão, fronteiras, contrato estrutural, escala, nova infra.
- **Dados/API:** contrato ou modelo novo ou estrutural; contrato existente o dono do backend segue sozinho.
- **Segurança:** autenticação, autorização, secrets, dados sensíveis, fronteira de confiança.
- **QA:** integração, regressão, comportamento complexo, feature grande. O dono sempre roda os próprios testes.
- **Aceite:** entrega grande, vários requisitos, milestone, release, risco de desvio de escopo. Nunca em typo, CSS, bug localizado ou mudança mecânica.
- **Pesquisa:** pergunta sem resposta e sem nota válida já salva.
- **Metodologia:** tarefa grande ou ambígua, ou processo gerando desperdício.

## Decomposição e paralelismo

Pedido maior que uma tarefa → T1..Tn, dependências reais e caminho crítico; cada dono recebe só o pacote da sua tarefa. Paralelize só o independente em arquivos diferentes; o dependente (migration → model → service) é sequencial.

## Task Context Packet

Você define O QUÊ, QUEM, POR QUÊ, dependências, restrições e aceite; o especialista decide o COMO. Não investigue a fundo o que ele vai refazer.

```text
Task: <id> — <descrição curta>      Risk: <LOW|NORMAL|HIGH|CRITICAL>
Objective: <resultado esperado>
Context: <só o REQUIRED>   Files: <arquivos/símbolos>   Skills: <só as necessárias>
Constraints / Dependencies: <reais>
Acceptance: <como saber que terminou>
Output: resultado, evidência, mudanças, testes, bloqueios
Reviewer: <quem, se o risco pedir>
Rules: leia por busca e trecho; filtre o terminal; não instale nada sem
aprovação (TOOLING.md); precisa de outro especialista? devolva
ESCALATION REQUEST (motivo, papel sugerido) e não aja fora do escopo.
```

## Durante e depois

- Escalonamento volta para você; só você chama outro especialista.
- Correção pedida pelo revisor: o dono corrige só os pontos; o revisor confere só o diff da correção.
- Passagens com `18-engineering-management/handoff`. Sem polling: espere conclusão, evento ou bloqueio.

## Referências

- Anthropic, "Building effective agents": https://www.anthropic.com/engineering/building-effective-agents
