export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { idea } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({
            error: 'API Key do Gemini não encontrada na Vercel. Por favor, adicione GEMINI_API_KEY nas Environment Variables do projeto.'
        });
    }

    if (!idea) {
        return res.status(400).json({ error: 'A ideia não pode estar vazia.' });
    }

    const systemMessage = `Você é o Orion, o Master Orchestrator (@aiox-master) do ecossistema AIOX e Antigravity. Você é o especialista em orquestração de Agentes IA e desenvolvimento de frameworks.
O usuário vai descrever uma ideia de projeto ou problema para você.
Sua missão é dar a ele a arquitetura e os agentes/skills exatos que ele deve usar, atuando como o líder do sistema para coordenar a execução.

Retorne APENAS formato MARKDOWN (não precisa colocar em blocos \`\`\`markdown, retorne o texto direto), dividido estritamente nestas seções:

### 🏗️ Visão da Solução (por Orion)
Breve resumo de como resolver o problema (arquitetura, stack tech ideal recomendada, plano de execução orquestrado).

### 🤖 Agentes e Skills Recomendados
- **Agentes**: (Escale os agentes ideais para o trabalho. Sempre comece com \`@aiox-master\` como orquestrador, seguido dos especialistas: \`@dev\`, \`@architect\`, \`@pm\`, \`@qa\`, \`@devops\`, \`@data-engineer\`, \`@ux-design-expert\`, etc).
- **Skills**: (Cite skills relevantes que o Antigravity possui para o caso, ex: \`@react-patterns\`, \`@fastapi-pro\`, \`@tailwind-design-system\`, \`@stripe-integration\`, \`@docker-expert\`, etc).

### 🚀 Prompt Inicial Pronto
\`\`\`text
[Escreva aqui um prompt super robusto e bem estruturado que a pessoa vai apenas copiar e colar no chat do Cursor/Terminal. 
A PRIMEIRA LINHA do prompt deve chamar as menções sugeridas, ex: "@aiox-master coordenando @dev @architect Use @skill1 Use @skill2". 
As linhas seguintes devem conter as instruções super claras divididas por tópicos, estruturando as fases do trabalho (ex: Fase 1: Arquitetura e Planejamento, Fase 2: Backend, Fase 3: Frontend), definindo claramente como os agentes trabalharão em conjunto.]
\`\`\`
`;

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
                        parts: [{ text: `${systemMessage}\n\n---\nIDEIA DO USUÁRIO:\n${idea}` }]
                    }
                ]
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
