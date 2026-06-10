# SkillsAgents

**Instale agentes e skills de IA no seu projeto em segundos.**

146 agentes especializados · 1262 skills · Claude Code · Cursor · Codex · Gemini

---

## O que é?

SkillsAgents é um CLI que instala agentes e skills de IA diretamente no seu projeto, compatível com qualquer harness de IA (Claude Code, Cursor, Codex, Gemini). Inclui o **Pixel Office** — um painel em tempo real que mostra seus agentes trabalhando enquanto você desenvolve.

---

## Instalação

```bash
npm install -g github:matheusj12/skillsagents
```

Ou use diretamente sem instalar:

```bash
npx github:matheusj12/skillsagents
```

---

## Início rápido

```bash
# 1. Vá para o seu projeto
cd meu-projeto

# 2. Instale todos os agentes e skills
github:matheusj12/skillsagents install

# 3. Integre com o Claude Code (tempo real)
skillsagents hooks

# 4. Abra o Pixel Office
skillsagents office
```

Abra o Claude Code e chame `@master *help` para começar.

---

## Comandos

| Comando | O que faz |
|---------|-----------|
| `skillsagents` | Abre o menu interativo completo |
| `github:matheusj12/skillsagents install` | Instala todos os agentes e skills no projeto |
| `skillsagents hooks` | Integra com Claude Code via hooks em tempo real |
| `skillsagents hooks:remove` | Remove os hooks instalados |
| `skillsagents office` | Inicia o Pixel Office (servidor + abre no browser) |
| `skillsagents status` | Mostra o que está instalado no projeto atual |
| `skillsagents gen` | Abre o gerador de prompts com IA |
| `skillsagents --help` | Lista todos os comandos |
| `skillsagents --version` | Mostra a versão |

### Variáveis de ambiente

```bash
SKILLSAGENTS_PORT=4322 skillsagents office   # porta personalizada
SKILLSAGENTS_AGENT=dev skillsagents office   # define nome do agente nos eventos
```

---

## Menu interativo

Execute `skillsagents` sem argumentos para abrir o menu completo:

```
  ⚡  Início Rápido         instala todos os agentes agora
  🎯  Para meu projeto       squad ideal baseado no seu stack
  🤖  Gerar Prompt com IA   descreva o projeto, IA monta o squad
  👥  Agentes               146 agentes disponíveis
  🛠   Skills               browse + selecione entre 1270+ skills
  🎮  Pixel Office           inicia servidor local + abre no browser
  🔗  Instalar Hooks         integra com Claude Code em tempo real
  🔑  Chaves de API          Gemini · Claude · GPT · DeepSeek...
  📊  Status                 veja o que está instalado
```

---

## Pixel Office

O Pixel Office é um painel visual que mostra seus agentes de IA trabalhando em tempo real enquanto você usa o Claude Code.

**Como funciona:**

1. Rode `skillsagents hooks` — instala hooks no `.claude/settings.json` do projeto
2. Rode `skillsagents office` — sobe um servidor local na porta 4321
3. Abra uma sessão do Claude Code no projeto
4. Toda ferramenta usada pelo Claude (Bash, Read, Edit...) aparece no painel

**Estados da conexão:**

- 🟠 `DEMO MODE` — servidor não encontrado, simulação ativa
- 🟢 `LIVE` — SSE conectado, eventos reais chegando
- 🔴 `RECONECTANDO` — servidor caiu, tentando reconectar

**Atalhos de teclado:**

| Tecla | Ação |
|-------|------|
| `←` `→` | Navegar entre agentes |
| `Space` | Spawn próximo agente |
| `S` | Ciclar velocidade |
| `F` | Toggle follow mode |
| `+` / `-` | Zoom in / out |

---

## Modelos suportados

Configure em `skillsagents` → **Chaves de API** ou via `skillsagents gen`.

| Provedor | Modelos |
|----------|---------|
| 🟡 Google Gemini | Gemini 2.5 Flash, 2.0 Flash |
| 🟣 Anthropic | Claude Sonnet 4.6, Haiku 4.5, Opus 4.8 |
| 🟢 OpenAI | GPT-4o, GPT-4o Mini |
| 🔵 DeepSeek | DeepSeek V3, R1 |
| 🟠 Mistral | Mistral Large |
| ⚡ Groq | Llama 3.3 70B |

---

## Harnesses suportados

SkillsAgents detecta automaticamente quais ferramentas o projeto usa e instala nos locais corretos:

| Harness | Pasta de agentes |
|---------|-----------------|
| Claude Code | `.claude/agents/` |
| Codex | `.codex/agents/` |
| Cursor | `.cursor/agents/` |
| AntiGravity | `.antigravity/rules/agents/` |

---

## Testar localmente

```bash
# Clone o repositório
git clone https://github.com/matheusj12/skillsagents
cd skillsagents
npm install

# Instale globalmente a partir do clone
npm install -g .

# Crie um projeto de teste
mkdir ~/meu-projeto && cd ~/meu-projeto

# Teste os comandos
skillsagents --version
skillsagents status

# Instale agentes no projeto de teste
github:matheusj12/skillsagents install
skillsagents status   # deve mostrar os agentes instalados

# Suba o Pixel Office
skillsagents office

# Em outro terminal, simule um evento
curl -X POST http://localhost:4321/hook \
  -H 'Content-Type: application/json' \
  -d '{"event":"PreToolUse","tool":"Bash","agent":"dev"}'
# → agente aparece no Pixel Office
```

---

## Variáveis de ambiente (banco de dados)

Para usar o gerador com histórico persistente, configure as variáveis do Supabase:

```env
SUPABASE_DB_HOST=...
SUPABASE_DB_USER=...
SUPABASE_DB_PASSWORD=...
SUPABASE_DB_NAME=...
NODE_ENV=production
```

Sem essas variáveis o CLI funciona normalmente — banco é opcional.

---

## Estrutura do projeto

```
skillsagents/
├── bin/
│   └── skillsagents.js     # CLI principal
├── src/
│   ├── server.js           # Servidor local (SSE + hooks)
│   ├── hooks.js            # Instalação de hooks no Claude Code
│   ├── generator.js        # Gerador de prompts com IA
│   └── db.js               # Conexão com banco (opcional)
├── api/
│   └── build.js            # Handler de build (Vercel/edge)
├── .agents/skills/         # 135 agentes avançados
├── .codex/agents/          # 13 agentes base
├── skills_data.json        # Catálogo de 1262 skills
├── office.html             # Pixel Office (canvas pixel art)
├── generator.html          # UI do gerador Orion
└── index.html              # Landing page
```

---

## Licença

MIT
