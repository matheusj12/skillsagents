# SkillsAgents

Uma equipe de 19 agentes de IA especializados em engenharia de software,
coordenada por um Orchestrator (Ranjel) no Maestri.
Para cada tarefa, o Ranjel escolhe o menor time necessário, entrega a cada
agente só o contexto que ele precisa e aplica revisão proporcional ao risco.

**Smallest team · Shortest valid path · Minimum sufficient context · Proportional review**

Versão atual: **v1.3.0** ([CHANGELOG](CHANGELOG.md))

## Instalação

Na pasta do projeto (requer Node.js 18+):

```bash
npx github:matheusj12/skillsagents
```

O setup é copiado para `.skillsagents/`. Depois, no Maestri, inicie o Ranjel e envie:

> Leia o `.skillsagents/START.md` e siga as instruções.

O Ranjel lê só `START.md → BOOTSTRAP.md → team.json` e fica pronto. Instruções
dos funcionários, Skills e referências só são carregadas quando uma tarefa precisa.

## Atualização

Rode o mesmo comando de novo:

- arquivos que você não alterou são atualizados;
- arquivos que você alterou são mantidos, e o terminal avisa quais;
- arquivos que você apagou são reinstalados.

Se o `npx` mostrar uma versão antiga, limpe o cache: `npx clear-npx-cache`.

## A equipe

Fonte oficial: `maestri_ia_terminais/team.json`.

| Funcionário | Cargo | O que faz |
|---|---|---|
| **Ranjel** | Orchestrator | Classifica a tarefa, escolhe quem entra, delega e consolida |
| **Júlia** | Product Engineer | O que construir e por quê: requisitos e critérios de aceite |
| **Marina** | Research Engineer | Pesquisa tecnologias e traz evidência; não decide |
| **Helena** | Software Architect | Transforma ideias e diagramas em arquitetura |
| **Eduardo** | Data & API Architect | Modelo de dados e contratos de API novos ou estruturais |
| **Rafael** | Tech Lead | Como executar no repositório: padrões, pastas, tickets |
| **Lucas** | Backend Engineer | APIs, regras de negócio, migrations |
| **Beatriz** | Frontend Engineer | Interfaces web com acessibilidade e performance |
| **Gabriel** | AI Engineer | Sistemas com LLM: tool use, RAG, agentes, evals |
| **Renata** | Prompt Engineer | Prompts e qualidade das Skills da equipe |
| **Diego** | Platform Engineer | Infra, containers, deploy, observabilidade |
| **Camila** | QA / Evaluation Engineer | Testes, Postman e avaliação de IA |
| **André** | Security Engineer | Threat modeling, OWASP, autenticação e autorização |
| **Paula** | Code Reviewer | Revisão independente pelo diff |
| **Fernanda** | Acceptance Reviewer | Confere a entrega contra o pedido, em entregas grandes |
| **Sofia** | Documentation Engineer | Documentação técnica final |
| **Thiago** | Release Engineer | Diz se a entrega pode ser publicada |
| **Marcos** | GitHub Engineer | Único que faz push, PR e release |
| **Daniel** | Methodology Engineer | Melhora o processo do time; entra só quando necessário |

## Como funciona a orquestração

Não existe pipeline fixo. O Ranjel classifica o risco e usa o caminho mais curto que entrega corretamente:

| Risco | Exemplo | Quem participa |
|---|---|---|
| LOW | corrigir um typo, ajustar CSS | só o dono |
| NORMAL | endpoint com padrões existentes, bug localizado | dono + revisor |
| HIGH | mudar um contrato de API, autorização | especialistas necessários + dono + revisor |
| CRITICAL | feature grande, autenticação/2FA, release | arquitetura, segurança, QA e aceite só se o risco exigir |

- Cada agente recebe um **Task Context Packet**: objetivo, arquivos, critério de aceite. Nunca a conversa inteira.
- Especialista que precisa de outro pede ao Ranjel (**escalation**); só o Ranjel aciona funcionários.
- O Ranjel define o quê e o critério; o especialista decide o como.

Regras completas: `skills/18-engineering-management/orchestration`.

## Como economizamos tokens

- **Startup mínimo:** três arquivos pequenos; nada de Skills ou prompts na largada.
- **Skills sob demanda:** cada funcionário tem no máximo 2 Skills CORE; o resto só se a tarefa pedir.
- **Menos agentes por tarefa:** 1 a 2 na maioria dos casos.
- **Leitura direcionada:** busca e trechos, nunca o repositório inteiro; saída de terminal filtrada.
- **Revisão pelo diff,** e re-revisão só do diff da correção.
- **Handoff curto** e memória em arquivos do projeto, não em conversas longas.

Política completa: `maestri_ia_terminais/CONTEXT_POLICY.md`. Ferramentas e regra de instalação: `maestri_ia_terminais/TOOLING.md`.

## Dicas de uso

- Peça a tarefa direto ao Ranjel; não chame especialistas você mesmo.
- Descreva o resultado esperado e o critério de pronto, e o Ranjel monta o time.
- Para algo grande ou ambíguo, diga isso: o Ranjel inclui requisitos e aceite.
- Personalize prompts e Skills em `.skillsagents/`; reinstalar não sobrescreve o que você editou.
- O `npx` não cria terminais no Maestri, não instala ferramentas e não pede credenciais.

## Novidades da v1.3.0

- Roteamento por risco (LOW / NORMAL / HIGH / CRITICAL) no lugar de pipeline fixo.
- Task Context Packet e escalation centralizado no Ranjel.
- Revisão pelo diff e aceite só onde agrega.
- `CONTEXT_POLICY.md` e `TOOLING.md` como fontes únicas de contexto e ferramentas.

Detalhes no [CHANGELOG](CHANGELOG.md).

## Estrutura deste repositório

```text
instalacao/          CLI do npx: copia o setup para .skillsagents/
maestri-team-setup/  o setup da equipe (fonte do que é instalado)
CHANGELOG.md         histórico de versões
```

Para contribuir com Skills, referências ou funcionários, siga `maestri-team-setup/CLAUDE.md`.
