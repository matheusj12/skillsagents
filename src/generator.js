'use strict';

const fs   = require('fs');
const path = require('path');
const os   = require('os');

const CONFIG_DIR  = path.join(os.homedir(), '.skillsagents');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

// ── CONFIG ────────────────────────────────────────────────────────
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  } catch(e) {}
  return {};
}

function saveConfig(config) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

// ── SPINNER ───────────────────────────────────────────────────────
function spinner(msg) {
  const frames = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'];
  let i = 0;
  const t = setInterval(() => {
    process.stdout.write(`\r  ${frames[i++ % frames.length]}  ${msg}`);
  }, 80);
  return () => { clearInterval(t); process.stdout.write('\r' + ' '.repeat(60) + '\r'); };
}

// ── SYSTEM PROMPT ─────────────────────────────────────────────────
const SYSTEM = `Você é o Orion, o Master Orchestrator do ecossistema SkillsAgents.
O usuário vai descrever um projeto ou problema.

Retorne EXATAMENTE neste formato (sem markdown extra, sem blocos de código):

=== VISÃO DA SOLUÇÃO ===
[2-3 linhas descrevendo a arquitetura e abordagem]

=== AGENTES RECOMENDADOS ===
[Lista linha por linha: @agente — motivo]
(Use apenas: @master @dev @architect @pm @po @qa @sm @devops @data-engineer @analyst @ux-design-expert @squad-creator)

=== SKILLS RECOMENDADAS ===
[Lista linha por linha: @skill — motivo]
(Citem skills reais como: @react-patterns @fastapi-pro @docker-expert @typescript-expert @tailwind-design-system @postgresql-optimization @api-security-best-practices @auth-implementation-patterns @stripe-integration etc.)

=== PROMPT PRONTO ===
[Prompt completo para copiar e colar no IDE. Primeira linha: mencione @master e os agentes. Linhas seguintes: instruções claras por fases.]`;

// ── GEMINI CALL ───────────────────────────────────────────────────
async function callGemini(apiKey, idea) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const body = JSON.stringify({
    contents: [{
      role: 'user',
      parts: [{ text: `${SYSTEM}\n\n---\nPROJETO DO USUÁRIO:\n${idea}` }]
    }]
  });

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// ── ANTHROPIC CALL ────────────────────────────────────────────────
async function callAnthropic(apiKey, idea) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `${SYSTEM}\n\n---\nPROJETO DO USUÁRIO:\n${idea}`,
      }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text || '';
}

// ── PARSE RESULT ──────────────────────────────────────────────────
function parseResult(text) {
  const section = (tag) => {
    const re = new RegExp(`===\\s*${tag}\\s*===\\n([\\s\\S]*?)(?====|$)`);
    return (text.match(re)?.[1] || '').trim();
  };
  return {
    vision:  section('VISÃO DA SOLUÇÃO'),
    agents:  section('AGENTES RECOMENDADOS'),
    skills:  section('SKILLS RECOMENDADAS'),
    prompt:  section('PROMPT PRONTO'),
    raw:     text,
  };
}

// ── OPENAI CALL ───────────────────────────────────────────────────
async function callOpenAI(apiKey, idea) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: `${SYSTEM}\n\n---\nPROJETO DO USUÁRIO:\n${idea}` }],
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

// ── MAIN GENERATE ─────────────────────────────────────────────────
async function generate({ idea, provider, apiKey }) {
  const stop = spinner('Gerando com IA...');
  try {
    let text;
    if (provider === 'anthropic') {
      text = await callAnthropic(apiKey, idea);
    } else if (provider === 'openai') {
      text = await callOpenAI(apiKey, idea);
    } else {
      text = await callGemini(apiKey, idea);
    }
    stop();
    return parseResult(text);
  } catch(e) {
    stop();
    throw e;
  }
}

module.exports = { generate, loadConfig, saveConfig };
