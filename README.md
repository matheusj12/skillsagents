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
