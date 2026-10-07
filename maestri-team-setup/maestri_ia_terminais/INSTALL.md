# Restaurar a equipe Maestri

Esta pasta não contém cópias dos terminais. Ela contém a configuração
declarativa para reconstruir a equipe no Maestri IA.

```text
maestri_ia_terminais/
├── BOOTSTRAP.md   ← ENTRY POINT do Orchestrator
├── team.json      ← registro de funcionários (RH declarativo)
└── INSTALL.md     ← este arquivo (para humanos)
```

## Onde está cada coisa

```text
team.json     → QUEM existe, cargo, runtime, skills, hierarquia
agents/       → COMO cada funcionário trabalha (arquivo em employees[].instructions)
skills/       → conhecimento operacional
references/   → fontes externas para consulta (repositories.json)
```

Cada informação tem uma única fonte. Este arquivo não repete o conteúdo
de `team.json` nem das instruções dos funcionários.

---

## 1. Installation

Como obter os arquivos numa máquina nova:

1. Instalar os pré-requisitos: Node.js 18+, Maestri e os terminais
   usados em `team.json` (`employees[].runtime.terminal`).
2. Na pasta do projeto, rodar:
   `npx github:matheusj12/skillsagents`
   O setup é copiado para `.skillsagents/` no projeto. Rodar de novo
   atualiza só arquivos que você não alterou; os alterados são mantidos.
3. Configurar credenciais localmente, direto em cada terminal. Nunca no
   repositório.
4. Instalar o Caveman em cada runtime usado, com os comandos oficiais
   da tabela "Caveman install per runtime" de `TOOLING.md`. Opcional: sem
   ele a equipe funciona (fallback).

O `npx` não instala o Caveman nem inicia agentes.

## 2. Agent Bootstrap

Com os arquivos disponíveis, no Maestri:

```text
abrir Maestri
  ↓
iniciar o Orchestrator (Ranjel)
  ↓
enviar: "Leia o `.skillsagents/START.md` e siga as instruções."
  ↓
Ranjel lê START.md → BOOTSTRAP.md
  ↓
Ranjel lê team.json
  ↓
READY (aguarda tarefa)
```

Dê ao Orchestrator só o caminho de `START.md`. Não peça para ele
ler o repositório inteiro: Skills, instruções e referências são
carregadas sob demanda, conforme `BOOTSTRAP.md`.

A criação dos terminais de cada funcionário no Maestri é manual na V1.
Este repositório ainda não usa nenhuma API ou automação do Maestri.

## Validação da equipe

- `team.orchestrator` é o `id` de um funcionário em `employees[]`;
- todos os `id` são únicos;
- cada `reports_to` e cada item de `coordinates` é um `id` existente;
- cada caminho em `skills.core`, `skills.on_demand` e `owns` existe em `skills/`;
- cada `instructions` não nulo aponta para um arquivo existente;
- cada `runtime.terminal` não nulo está instalado e autenticado.

Campos `null` são pendências de configuração. Não invente valores
para passar na validação.

Os caminhos em `team.json` são relativos a esta pasta.
