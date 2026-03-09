export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { idea, type } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({
            error: 'API Key do Gemini não encontrada na Vercel. Por favor, adicione GEMINI_API_KEY nas Environment Variables do projeto.'
        });
    }

    if (!idea || !type) {
        return res.status(400).json({ error: 'Ideia e tipo (agent ou skill) são obrigatórios.' });
    }

    let systemPromptBase = `Você é o Orion, o Master Orchestrator (@aiox-master) do ecossistema AIOX e Antigravity. Você é o especialista em orquestração corporativa de Agentes IA e desenvolvimento de frameworks operacionais.`;

    let instructions = '';

    if (type === 'agent') {
        instructions = `
O usuário solicitou a criação de um NOVO AGENTE INTELIGENTE para o framework AIOX baseado na ideia dele.
Retorne APENAS formato MARKDOWN (não dentro num bloco de código, escreva a resposta diretamente) contendo:

1. Uma breve introdução como Orion anunciando o novo agente.
2. O código do Agente (em formato YAML / Markdown misto, padrão AIOX/Cursor).
3. Instruções de instalação no final sob o título "### 💻 Como Instalar e Ativar".

O padrão do arquivo gerado DEVE seguir esta estrutura rigidamente:

# [id-do-agente]

ACTIVATION-NOTICE: Este arquivo contém suas diretrizes de operação. LEIA TUDO.

\`\`\`yaml
activation-instructions:
  - Passo 1: Assuma a persona abaixo.
  - Passo 2: Mostre sua saudação e aguarde ordens.
agent:
  name: [Nome Criativo]
  id: [id-do-agente]
  title: [Título Profissional]
  icon: [Emoji]
  whenToUse: [Quando usar]
  customization: |
    - [Regra de customização 1]
    - [Regra 2]
persona_profile:
  archetype: [Arquétipo]
  communication:
    tone: [Tom, ex: format, direto]
persona:
  role: [Papel]
  identity: [Identidade e objetivo principal do agente]
commands:
  - name: help
    description: 'Mostra todos os comandos disponíveis'
  - name: [comando 1, ex: check-security, format-code, etc]
    description: '[descrição do comando]'
dependencies:
  tasks:
    - [tarefa_ficticia_relevante.md]
\`\`\`

### 💻 Como Instalar e Ativar

Para instalar este novo especialista na sua máquina:
1. Navegue até a pasta de agentes do seu projeto (ex: \`.codex/agents/\` ou a pasta configurada no seu ambiente).
2. Crie um arquivo chamado \`[id-do-agente].md\`.
3. Copie APENAS o bloco de código MD/YAML (do título \`# [id-do-agente]\` até o fim do bloco yaml) e cole lá dentro.
4. Para ativar, chame ele no chat digitando \`@[id-do-agente]\`.
`;
    } else if (type === 'skill') {
        instructions = `
O usuário solicitou a criação de uma NOVA SKILL para ser usada com o framework Antigravity baseado na demanda dele.
Retorne APENAS formato MARKDOWN (não dentro num bloco de código, escreva a resposta diretamente) contendo:

1. Uma breve introdução como Orion anunciando a nova skill.
2. O código da Skill (Frontmatter YAML e corpo Markdown) ensinando regras rigorosas e padrões ao agente que for ler.
3. Instruções de instalação no final sob o título "### 💻 Como Instalar e Ativar".

O padrão do arquivo gerado DEVE seguir esta estrutura rigidamente (fictício mas denso e técnico):

\`\`\`markdown
---
name: [nome-da-skill]
description: [Uma descrição rápida e direta do que ela ensina/faz, no max 200 char]
categories: [Categoria principal do conhecimento]
---

# 🛠️ [NOME DA SKILL]

[Descreva as Regras e Padrões (Principles & Best Practices) que a IA deve adotar ao trabalhar com essa funcionalidade. Diga o que FAZER e NÃO FAZER. Dê exemplos de código ou workflows se necessário. Isso é uma transferência de conhecimento pesada!]
\`\`\`

### 💻 Como Instalar e Ativar

Para instalar esta skill no Antigravity:
1. Navegue até a pasta de skills do seu projeto (geralmente \`.gemini/antigravity/skills/\` na Home).
2. Crie uma nova pasta chamada \`[nome-da-skill]\`.
3. Dentro desta pasta, crie um arquivo chamado \`SKILL.md\`.
4. Copie todo o bloco gerado que contém o frontmatter (---) e o cole dentro deste arquivo.
5. Para ativar durante o trabalho, diga: "Use @[nome-da-skill]" no seu prompt Antigravity.
`;
    }

    const systemMessage = `${systemPromptBase}\n\n${instructions}`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: `${systemMessage}\n\n---\nPEDIDO DO USUÁRIO:\n${idea}` }]
                    }
                ],
                generationConfig: {
                    temperature: 0.5
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(500).json({ error: data.error?.message || 'Erro na API do Gemini' });
        }

        const text = data.candidates[0].content.parts[0].text;
        res.status(200).json({ result: text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
