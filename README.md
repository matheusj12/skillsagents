# SkillsAgents

Instala no seu projeto a configuração da equipe de agentes de IA do
Maestri: funcionários, Skills, referências e o roteiro de inicialização
do Orchestrator (Ranjel).

## Instalação

Na pasta do projeto:

```bash
npx github:matheusj12/skillsagents
```

Requer Node.js 18+. O setup é copiado para `.skillsagents/` no projeto atual.

## Iniciar a equipe

1. Abra o projeto no Maestri.
2. Inicie o Ranjel (Orchestrator).
3. Envie:

   > Leia o `.skillsagents/START.md` e siga as instruções.

O Ranjel lê só o necessário para ficar pronto:

```text
START.md → maestri_ia_terminais/BOOTSTRAP.md → maestri_ia_terminais/team.json → READY
```

Instruções dos funcionários, Skills e referências externas não são lidas
na inicialização. Elas são carregadas sob demanda, quando uma tarefa precisa.

## A equipe

18 funcionários. A fonte oficial é `maestri_ia_terminais/team.json`: nome, cargo, terminal, Skills e hierarquia vêm de lá.

| Funcionário | Cargo | O que faz | Terminal |
|---|---|---|---|
| **Ranjel** | Orchestrator | Recebe o pedido, decompõe, delega ao menor número de pessoas, coordena e consolida a entrega | claude-code |
| **Júlia** | Product Engineer | Responde "o que construir e por quê": requisitos, critérios de aceite, UX e protótipos | antigravity |
| **Marina** | Research Engineer | Pesquisa tecnologias, APIs e bibliotecas, roda PoCs e benchmarks e entrega evidência (não decide) | opencode |
| **Helena** | Software Architect | Transforma ideias, fluxogramas e diagramas em arquitetura: componentes, fronteiras, integrações, riscos | antigravity |
| **Eduardo** | Data & API Architect | Modelo de dados (ER, schema, índices, migrations) e contratos de API (OpenAPI) | claude-code |
| **Rafael** | Tech Lead | Responde "como executar no repositório": direção técnica, padrões e coordenação dos engenheiros | claude-code |
| **Lucas** | Backend Engineer | Implementa APIs, regras de negócio e migrations a partir do OpenAPI | codex |
| **Beatriz** | Frontend Engineer | Interfaces e aplicações web, com acessibilidade e performance medidas | antigravity |
| **Gabriel** | AI Engineer | Sistemas com LLM: agentes, RAG, tool use, structured output, multimodal | codex |
| **Renata** | Prompt Engineer | Desenha, testa e versiona prompts; cuida da qualidade dos prompts e Skills da equipe | opencode |
| **Diego** | Platform Engineer | Infraestrutura, Docker, deploy, observabilidade e o que o pipeline de CI executa | opencode |
| **Camila** | QA / Evaluation Engineer | Testes (unitário, integração, E2E, API), coleção do Postman a partir do OpenAPI e LLM evals | codex |
| **André** | Security Engineer | Threat modeling, OWASP, autenticação/autorização e segurança de agentes | claude-code |
| **Paula** | Code Reviewer | Revisão independente: qualidade, simplicidade, legibilidade, overengineering | codex |
| **Fernanda** | Acceptance Reviewer | Confere se a entrega é realmente o que foi pedido: requisito esquecido, escopo extrapolado | claude-code |
| **Sofia** | Documentation Engineer | Documentação técnica final: arquitetura, APIs, setup, variáveis, deploy | claude-code |
| **Thiago** | Release / Delivery Engineer | Responde "isso pode ser entregue?": build, `.env.example`, migrations, Docker, arquivos esquecidos | claude-code |
| **Marcos** | GitHub Engineer | Único que faz push, abre PR e publica release; branches, proteção e GitHub Actions | codex |

## Fluxo de trabalho

Ciclo: **descobrir → especificar → construir → revisar → entregar**. O Ranjel aciona só quem a tarefa precisa: uma correção pequena não passa por todos.

```text
Você
 ↓
Ranjel (Orchestrator) ─ classifica e delega
 ↓
DESCOBRIR      Júlia: o que e por quê, critérios de aceite
               Marina: pesquisa, se ninguém sabe qual tecnologia usar
 ↓
ESPECIFICAR    Helena: arquitetura geral
               Eduardo: modelo de dados + OpenAPI
               Rafael: plano de execução no repositório
 ↓
CONSTRUIR      Lucas (backend) · Beatriz (frontend) · Gabriel (IA) + Renata (prompts) · Diego (infra)
 ↓
REVISAR        Camila: testes + Postman
               André: segurança
               Paula: código
               Fernanda: aceite contra o pedido original
 ↓
ENTREGAR       Sofia: documentação
               Thiago: veredito PRONTO ou BLOQUEADO
               Marcos: push, PR e release
 ↓
Ranjel consolida e responde a você
```

Regras do fluxo:

- **Equipe genérica:** atua em qualquer tipo de projeto (web, API, IA, dados, CLI, automação...). Helena escolhe o padrão arquitetural adequado (em web/API, MVC por padrão), Rafael define as pastas seguindo a convenção do framework e Paula confere na revisão.
- **Um dono por decisão:** quem define não implementa (Eduardo define o contrato, Lucas implementa).
- **API:** contrato → OpenAPI → implementação → Postman. O OpenAPI é a fonte da verdade.
- **Nada chega a você sem aceite:** a Fernanda compara a entrega com o pedido antes da entrega final.
- **Remoto só pelo Marcos:** os demais fazem commits locais.
- **Contexto mínimo:** cada funcionário carrega só as próprias instruções e as Skills da tarefa.

## O que é instalado

```text
.skillsagents/
├── START.md                  entrada do Ranjel
├── INDEX.md                  mapa de descoberta
├── agents/                   como cada funcionário trabalha
├── skills/                   conhecimento operacional (18 categorias)
├── references/
│   └── repositories.json     catálogo de repositórios externos aprovados
└── maestri_ia_terminais/
    ├── BOOTSTRAP.md          inicialização do Orchestrator
    ├── team.json             equipe: cargos, terminais, Skills, hierarquia
    ├── CONTEXT_POLICY.md     política de contexto e tokens (Caveman)
    └── INSTALL.md            restaurar a equipe numa máquina nova
```

## Rodar de novo

Rodar o `npx` outra vez atualiza o setup sem duplicar nada:

- arquivos que você não alterou são atualizados;
- arquivos que você alterou são mantidos, e o terminal avisa quais;
- arquivos que você apagou são reinstalados.

O controle fica em `.skillsagents/.install-manifest.json`.

## O que o `npx` não faz

- Não cria os terminais no Maestri: isso é manual.
- Não instala o Caveman. Os comandos oficiais de cada runtime estão em
  `maestri_ia_terminais/CONTEXT_POLICY.md`.
- Não armazena nem pede credenciais. API keys e logins ficam em cada terminal.

## Estrutura deste repositório

```text
instalacao/          CLI do npx: copia o setup para .skillsagents/
maestri-team-setup/  o setup da equipe (fonte do que é instalado)
```

Para adicionar Skills, referências ou funcionários, edite
`maestri-team-setup/`, seguindo as regras de `maestri-team-setup/CLAUDE.md`.
