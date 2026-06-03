#!/usr/bin/env node
'use strict';

const path     = require('path');
const fs       = require('fs');
const { exec } = require('child_process');

// ── OFFICE/HOOKS são os únicos que saem sem menu (tomam o processo) ──
const directCmd = process.argv[2];

if (directCmd === 'office' || directCmd === 'serve') {
  const { start } = require('../src/server.js');
  start();
  return;
}

if (directCmd === 'hooks') {
  const { installHooks } = require('../src/hooks.js');
  installHooks(process.cwd());
  return;
}

if (directCmd === 'hooks:remove') {
  const { removeHooks } = require('../src/hooks.js');
  removeHooks(process.cwd());
  return;
}

if (directCmd === 'gen' || directCmd === 'generate') {
  // load deps first, then run generator directly
  const figlet   = require('figlet');
  const chalk    = require('chalk');
  const inquirer = require('inquirer');
  const { exec } = require('child_process');
  // reuse same functions — just call main flow with gen preset
  // handled below in main()
}

const figlet   = require('figlet');
const chalk    = require('chalk');
const inquirer = require('inquirer');

const ROOT = path.join(__dirname, '..');

// ── BANNER ────────────────────────────────────────────────────────────────────
function banner() {
  console.clear();
  const s = figlet.textSync('SKILLS', { font: 'ANSI Shadow', horizontalLayout: 'fitted' });
  const a = figlet.textSync('AGENTS', { font: 'ANSI Shadow', horizontalLayout: 'fitted' });
  console.log(chalk.cyanBright(s));
  console.log(chalk.cyanBright(a));
  console.log();
}

function header(subtitle = 'Universal AI Agent Framework') {
  console.log(chalk.yellow(subtitle));
  console.log(chalk.gray('CLI v1.0.0  ·  github.com/matheusj12/skillsagents'));
  console.log(chalk.gray('─'.repeat(62)));
  console.log();
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function ok(msg)   { console.log(chalk.green('  ✔  ') + msg); }
function info(msg) { console.log(chalk.cyan ('  →  ') + msg); }
function dim(msg)  { console.log(chalk.gray ('     ') + msg); }
function br()      { console.log(); }

const BACK = '__back__';
const backChoice = { name: chalk.gray('  ← Voltar'), value: BACK };

async function pause() {
  await inquirer.prompt([{ type: 'input', name: '_', message: chalk.gray('  ← Enter para voltar ao menu...') }]);
}

function loadSkills() {
  const p = path.join(ROOT, 'skills_data.json');
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : [];
}

function getInstalledAgents() {
  const dirs = [
    path.join(ROOT, '.codex', 'agents'),
    path.join(ROOT, '.antigravity', 'rules', 'agents'),
  ].filter(fs.existsSync);
  const found = new Set();
  dirs.forEach(d => fs.readdirSync(d).forEach(f => found.add(f.replace('.md', ''))));
  return [...found];
}

function installAgent(agentId) {
  const src = path.join(ROOT, '.codex', 'agents', `${agentId}.md`);
  if (!fs.existsSync(src)) return false;
  const targets = [
    path.join(process.cwd(), '.codex', 'agents'),
    path.join(process.cwd(), '.antigravity', 'rules', 'agents'),
  ];
  targets.forEach(d => {
    fs.mkdirSync(d, { recursive: true });
    fs.copyFileSync(src, path.join(d, `${agentId}.md`));
  });
  return true;
}

// ── AGENT CATALOGUE ───────────────────────────────────────────────────────────
const BASE_AGENTS = [
  { id:'master',           name:'@master',           role:'Master Orchestrator',  icon:'👑', priority:true },
  { id:'dev',              name:'@dev',               role:'Developer',            icon:'💻' },
  { id:'architect',        name:'@architect',         role:'Software Architect',   icon:'🏗️' },
  { id:'qa',               name:'@qa',                role:'Quality Assurance',    icon:'✅' },
  { id:'devops',           name:'@devops',            role:'DevOps Engineer',      icon:'⚙️' },
  { id:'pm',               name:'@pm',                role:'Product Manager',      icon:'📋' },
  { id:'po',               name:'@po',                role:'Product Owner',        icon:'🎯' },
  { id:'sm',               name:'@sm',                role:'Scrum Master',         icon:'🔄' },
  { id:'data-engineer',    name:'@data-engineer',     role:'Data Engineer',        icon:'📊' },
  { id:'analyst',          name:'@analyst',           role:'Business Analyst',     icon:'🔍' },
  { id:'ux-design-expert', name:'@ux-design-expert',  role:'UX Design Expert',     icon:'🎨' },
  { id:'squad-creator',    name:'@squad-creator',     role:'Squad Creator',        icon:'👥' },
  { id:'aiox-master',      name:'@aiox-master',       role:'AIOX Orchestrator',    icon:'🧠' },
];

const RUFLO_AGENTS = [
  { id:'agent-coder',               name:'@agent-coder',               role:'Code Implementer',      icon:'🔧', cat:'Dev'       },
  { id:'agent-reviewer',            name:'@agent-reviewer',            role:'Code Reviewer',         icon:'🔎', cat:'Dev'       },
  { id:'agent-tester',              name:'@agent-tester',              role:'QA Specialist',         icon:'🧪', cat:'Dev'       },
  { id:'agent-researcher',          name:'@agent-researcher',          role:'Deep Researcher',       icon:'🔬', cat:'Research'  },
  { id:'agent-planner',             name:'@agent-planner',             role:'Strategic Planner',     icon:'🗺️', cat:'Planning'  },
  { id:'agent-sparc-coordinator',   name:'@agent-sparc-coordinator',   role:'SPARC Coordinator',     icon:'⚡', cat:'Orch'      },
  { id:'agent-swarm',               name:'@agent-swarm',               role:'Swarm Deployer',        icon:'🐝', cat:'Swarm'     },
  { id:'agent-queen-coordinator',   name:'@agent-queen-coordinator',   role:'Hive Queen',            icon:'👑', cat:'Swarm'     },
  { id:'hive-mind',                 name:'@hive-mind',                 role:'Hive Mind (BFT)',       icon:'🧩', cat:'Swarm'     },
  { id:'agent-security-manager',    name:'@agent-security-manager',    role:'Security Manager',      icon:'🔒', cat:'Security'  },
  { id:'agent-performance-optimizer',name:'@agent-performance-optimizer',role:'Perf Optimizer',     icon:'🚀', cat:'Perf'      },
  { id:'agent-memory-coordinator',  name:'@agent-memory-coordinator',  role:'Memory Coordinator',    icon:'🧠', cat:'Memory'    },
  { id:'agent-github-pr-manager',   name:'@agent-github-pr-manager',   role:'GitHub PR Manager',     icon:'🐙', cat:'GitHub'    },
  { id:'github-code-review',        name:'@github-code-review',        role:'GitHub Code Reviewer',  icon:'🔍', cat:'GitHub'    },
  { id:'agent-ops-cicd-github',     name:'@agent-ops-cicd-github',     role:'CI/CD Specialist',      icon:'⚙️', cat:'DevOps'    },
  { id:'pair-programming',          name:'@pair-programming',          role:'Pair Programming',      icon:'👥', cat:'Dev'       },
  { id:'agent-workflow-automation', name:'@agent-workflow-automation', role:'Workflow Automation',   icon:'⚡', cat:'Auto'      },
  { id:'security-audit',            name:'@security-audit',            role:'Security Audit',        icon:'🛡️', cat:'Security'  },
];

// ── STACK RECOMMENDATIONS ────────────────────────────────────────────────────
const STACKS = {
  'web':      { label:'🌐  Web App (Next.js / React)',       agents:['master','architect','dev','qa','ux-design-expert'], skills:['react-patterns','nextjs-app-router-patterns','tailwind-design-system','typescript-expert'] },
  'api':      { label:'⚡  API Backend (FastAPI / Node)',     agents:['master','architect','dev','devops','qa'],           skills:['fastapi-pro','api-design-principles','api-security-best-practices','docker-expert'] },
  'mobile':   { label:'📱  App Mobile (React Native)',        agents:['master','architect','dev','qa'],                   skills:['agent-spec-mobile-react-native','react-native-architecture','typescript-expert'] },
  'data':     { label:'📊  Data / ML / IA',                  agents:['master','data-engineer','analyst','architect'],     skills:['ai-ml','rag-engineer','postgresql-optimization','agent-data-ml-model'] },
  'devops':   { label:'⚙️   DevOps / Infra / Cloud',          agents:['master','devops','architect'],                     skills:['docker-expert','kubernetes-architect','github-actions-templates','terraform-specialist'] },
  'security': { label:'🔒  Segurança / Pentest',              agents:['master','qa','devops'],                            skills:['security-auditor','api-security-best-practices','auth-implementation-patterns','secrets-management'] },
  'saas':     { label:'🚀  SaaS / Produto B2B',               agents:['master','pm','po','architect','dev','qa'],          skills:['react-patterns','fastapi-pro','auth-implementation-patterns','postgresql-optimization'] },
};

// ══════════════════════════════════════════════════════════════════════════════
// SCREENS
// ══════════════════════════════════════════════════════════════════════════════

// ── QUICK INSTALL ─────────────────────────────────────────────────────────────
async function screenQuickInstall(args) {
  banner();
  console.log(chalk.bold.white('  ⚡  Início Rápido — Instalação\n'));
  try {
    const { install } = require('../src/install.js');
    install(args || []);
  } catch(e) {
    br();
    console.log(chalk.red('  ✗  Erro inesperado: ' + e.message));
    br();
    dim('Tente: npx --ignore-existing github:matheusj12/skillsagents install');
  }
  br();
  await pause();
}

// ── FOR MY PROJECT (guided) ───────────────────────────────────────────────────
async function screenForMyProject() {
  banner();
  console.log(chalk.bold.white('  🎯  Para meu projeto\n'));

  const { stack } = await inquirer.prompt([{
    type: 'list',
    name: 'stack',
    message: '  Qual é o tipo do seu projeto?',
    choices: [
      backChoice,
      new inquirer.Separator(''),
      ...Object.entries(STACKS).map(([k, v]) => ({ name: '  ' + v.label, value: k })),
    ],
    pageSize: 10,
  }]);

  if (stack === BACK) return;
  const s = STACKS[stack];
  br();
  console.log(chalk.cyanBright('  ── Squad recomendado\n'));
  s.agents.forEach(id => {
    const a = BASE_AGENTS.find(x => x.id === id);
    if (a) console.log(`  ${a.icon}  ${chalk.cyan(a.name.padEnd(22))}  ${chalk.gray(a.role)}`);
  });

  br();
  console.log(chalk.yellow('  ── Skills recomendadas\n'));
  s.skills.forEach(sk => console.log(`  ${chalk.yellow('@' + sk)}`));

  br();
  const prompt = `@master coordenando ${s.agents.slice(1).map(x => '@'+x).join(' ')}\nUse ${s.skills.map(x => '@'+x).join(' ')}\n\nCrie o plano de execução faseado para o projeto.`;
  console.log(chalk.gray('  ── Prompt pronto — copie e cole no seu IDE:\n'));
  console.log(chalk.white('  ' + prompt.replace(/\n/g, '\n  ')));
  br();

  const { go } = await inquirer.prompt([{
    type: 'list',
    name: 'go',
    message: '  O que fazer?',
    choices: [
      { name: '  ✔  Instalar esses agentes', value: true  },
      { name: chalk.gray('  ← Voltar ao menu'),      value: false },
    ],
  }]);

  if (go) {
    br();
    s.agents.forEach(id => {
      if (installAgent(id)) {
        const a = BASE_AGENTS.find(x => x.id === id);
        ok(`${a?.icon || '🤖'}  ${('@'+id).padEnd(22)} ${chalk.gray('instalado')}`);
      }
    });
    br();
    ok(chalk.bold('Agentes instalados! Chame ' + chalk.cyan('@master *help') + ' no seu IDE.'));
  }

  br();
  await pause();
}

// ── AGENTS ────────────────────────────────────────────────────────────────────
async function screenAgents() {
  banner();
  console.log(chalk.bold.white('  👥  Agentes\n'));

  const { scope } = await inquirer.prompt([{
    type: 'list',
    name: 'scope',
    message: '  Qual catálogo?',
    choices: [
      backChoice,
      new inquirer.Separator(''),
      { name: `  🏠  Base (${BASE_AGENTS.length} agentes)     — @master, @dev, @architect, @qa...`, value: 'base' },
      { name: `  🌐  Avançados (${RUFLO_AGENTS.length} agentes)   — swarm, hive-mind, coder, reviewer...`, value: 'ruflo' },
      { name: `  📦  Todos juntos (${BASE_AGENTS.length + RUFLO_AGENTS.length} agentes)`, value: 'all' },
    ],
  }]);

  if (scope === BACK) return;

  const pool = scope === 'base' ? BASE_AGENTS
             : scope === 'ruflo' ? RUFLO_AGENTS
             : [...BASE_AGENTS, ...RUFLO_AGENTS];

  const { selected } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'selected',
    message: '  ESPAÇO para marcar · ENTER para confirmar · ESC para voltar:',
    choices: [
      ...pool.map(a => ({
        name: `${a.icon}  ${(a.name || '@'+a.id).padEnd(32)} ${chalk.gray(a.role || a.cat || '')}`,
        value: a.id,
        checked: !!a.priority,
      })),
      new inquirer.Separator(''),
      { name: chalk.gray('  ← Nenhum — voltar ao menu'), value: BACK },
    ],
    pageSize: 20,
  }]);

  if (!selected.length || selected.includes(BACK)) return;

  br();
  let done = 0;
  selected.forEach(id => {
    if (installAgent(id)) { ok('@' + id); done++; }
    else dim('@' + id + chalk.red('  — arquivo fonte não encontrado'));
  });

  br();
  ok(chalk.bold(`${done} agente(s) instalados.`));
  console.log(chalk.cyan('\n  Ative no seu IDE: ') + chalk.white('@' + selected[0] + ' *help'));
  br();
  await pause();
}

// ── SKILLS ────────────────────────────────────────────────────────────────────
async function screenSkills() {
  banner();
  console.log(chalk.bold.white('  🛠   Skills\n'));

  const skills = loadSkills();
  if (!skills.length) {
    console.log(chalk.red('  ✗  skills_data.json não encontrado.'));
    await pause(); return;
  }

  const cats = [...new Set(skills.map(s => s.cat))].sort();

  const { mode } = await inquirer.prompt([{
    type: 'list',
    name: 'mode',
    message: '  Como quer explorar?',
    choices: [
      backChoice,
      new inquirer.Separator(''),
      { name: `  🔍  Buscar por palavra-chave`, value: 'search' },
      { name: `  📂  Filtrar por categoria (${cats.length} cats)`, value: 'cat' },
    ],
  }]);

  if (mode === BACK) return;

  let filtered = skills;

  if (mode === 'search') {
    const { q } = await inquirer.prompt([{ type: 'input', name: 'q', message: '  Buscar:' }]);
    if (q.trim()) filtered = skills.filter(s =>
      s.name.includes(q.toLowerCase()) || (s.desc || '').toLowerCase().includes(q.toLowerCase())
    );
  } else {
    const { cat } = await inquirer.prompt([{
      type: 'list',
      name: 'cat',
      message: '  Categoria:',
      choices: [
        backChoice,
        new inquirer.Separator(''),
        ...cats.map(c => {
          const cnt = skills.filter(s => s.cat === c).length;
          return { name: `  ${c.padEnd(20)} ${chalk.gray(cnt + ' skills')}`, value: c };
        }),
      ],
      pageSize: 16,
    }]);
    if (cat === BACK) return;
    filtered = skills.filter(s => s.cat === cat);
  }

  const show = filtered.slice(0, 60);
  br();
  info(`${chalk.white(show.length)} skills encontradas ${show.length < filtered.length ? chalk.gray('(mostrando primeiras ' + show.length + ')') : ''}`);
  br();

  const { selected } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'selected',
    message: '  ESPAÇO para marcar · ENTER para confirmar:',
    choices: [
      ...show.map(s => ({
        name: `@${s.name.padEnd(44)} ${chalk.gray('['+s.cat+']')}`,
        value: s.name,
      })),
      new inquirer.Separator(''),
      { name: chalk.gray('  ← Nenhuma — voltar ao menu'), value: BACK },
    ],
    pageSize: 20,
  }]);

  if (!selected.length || selected.includes(BACK)) return;

  br();
  console.log(chalk.yellow('  Skills selecionadas:\n'));
  selected.forEach(s => console.log(chalk.cyan('  @' + s)));
  br();
  console.log(chalk.gray('  Cole no seu IDE:'));
  console.log(chalk.white('  Use ' + selected.map(s => '@' + s).join(' ')));
  br();
  await pause();
}

// ── STATUS ────────────────────────────────────────────────────────────────────
async function screenStatus() {
  banner();
  console.log(chalk.bold.white('  📊  Status da instalação\n'));

  const agents = getInstalledAgents();
  const rufloDir = path.join(ROOT, '.agents', 'skills');
  const rufloCount = fs.existsSync(rufloDir) ? fs.readdirSync(rufloDir).filter(d =>
    fs.statSync(path.join(rufloDir, d)).isDirectory()).length : 0;
  const skills = loadSkills();

  const rows = [
    { label: 'Agentes base instalados', value: agents.length + ' / ' + BASE_AGENTS.length, ok: agents.length > 0 },
    { label: 'Agentes avançados',       value: rufloCount,                                  ok: rufloCount > 0 },
    { label: 'Skills no catálogo',      value: skills.length,                               ok: skills.length > 0 },
    { label: 'Diretório de instalação', value: process.cwd(),                               ok: true },
  ];

  rows.forEach(r => {
    const icon = r.ok ? chalk.green('  ✔') : chalk.gray('  ○');
    console.log(icon + '  ' + r.label.padEnd(28) + chalk.cyan(r.value));
  });

  br();
  if (agents.length > 0) {
    console.log(chalk.gray('  Agentes instalados:'));
    agents.forEach(a => dim('@' + a));
  }
  br();
  await pause();
}

// ── GENERATOR ────────────────────────────────────────────────────────────────
async function screenGenerator() {
  banner();
  console.log(chalk.bold.white('  🤖  Gerador de Prompts com IA\n'));

  const { loadConfig, saveConfig, generate } = require('../src/generator.js');
  let config = loadConfig();

  // ── API KEY SETUP ───────────────────────────────────────────────
  if (!config.apiKey) {
    console.log(chalk.yellow('  Primeira vez! Escolha seu provedor de IA:\n'));

    const { provider } = await inquirer.prompt([{
      type: 'list',
      name: 'provider',
      message: '  Provedor de IA:',
      choices: [
        { name: '  🟡  Gemini (Google) — grátis, 15 req/min', value: 'gemini' },
        { name: '  🟣  Claude (Anthropic) — pago, mais preciso', value: 'anthropic' },
      ],
    }]);

    const keyUrl = provider === 'gemini'
      ? 'https://aistudio.google.com/app/apikey'
      : 'https://console.anthropic.com/';

    br();
    info('Gere sua chave em: ' + chalk.cyan(keyUrl));
    br();

    const { apiKey } = await inquirer.prompt([{
      type: 'password',
      name: 'apiKey',
      message: '  Cole sua API Key:',
      mask: '●',
      validate: v => v.trim().length > 10 || 'Chave inválida',
    }]);

    config = { provider, apiKey: apiKey.trim() };
    saveConfig(config);
    br();
    ok('Chave salva em ' + chalk.cyan('~/.skillsagents/config.json'));
    br();
  }

  // ── PROJECT INPUT ───────────────────────────────────────────────
  console.log(chalk.gray('  ── Descreva seu projeto ───────────────────────────────\n'));
  dim('Exemplos: "SaaS de gestão financeira em Next.js + FastAPI"');
  dim('"App mobile de delivery com painel admin"');
  dim('"Sistema de RAG com documentos PDF e busca semântica"');
  br();

  const { idea } = await inquirer.prompt([{
    type: 'input',
    name: 'idea',
    message: '  Projeto:',
    validate: v => v.trim().length > 5 || 'Descreva um pouco mais',
  }]);

  br();

  // ── GENERATE ─────────────────────────────────────────────────────
  let result;
  try {
    result = await generate({ idea, provider: config.provider, apiKey: config.apiKey });
  } catch(e) {
    br();
    console.log(chalk.red('  ✗  Erro: ' + e.message));
    if (e.message.includes('API') || e.message.includes('key') || e.message.includes('auth')) {
      console.log(chalk.yellow('  Dica: sua chave pode estar inválida ou expirada.'));
      const { reset } = await inquirer.prompt([{
        type: 'confirm', name: 'reset',
        message: '  Trocar a chave de API?', default: true,
      }]);
      if (reset) { saveConfig({}); }
    }
    br();
    await pause();
    return;
  }

  // ── DISPLAY RESULT ────────────────────────────────────────────────
  banner();
  console.log(chalk.bold.cyanBright('  ✦  Resultado da Orquestração\n'));

  if (result.vision) {
    console.log(chalk.bold.white('  📋  Visão da Solução\n'));
    result.vision.split('\n').forEach(l => l && console.log(chalk.gray('  ') + l));
    br();
  }

  if (result.agents) {
    console.log(chalk.bold.white('  👥  Agentes Recomendados\n'));
    result.agents.split('\n').forEach(l => {
      if (!l.trim()) return;
      const match = l.match(/(@\S+)/g);
      if (match) {
        let line = l;
        match.forEach(m => { line = line.replace(m, chalk.cyan(m)); });
        console.log('  ' + line);
      } else {
        console.log(chalk.gray('  ') + l);
      }
    });
    br();
  }

  if (result.skills) {
    console.log(chalk.bold.white('  🛠   Skills Recomendadas\n'));
    result.skills.split('\n').forEach(l => {
      if (!l.trim()) return;
      const match = l.match(/(@\S+)/g);
      if (match) {
        let line = l;
        match.forEach(m => { line = line.replace(m, chalk.yellow(m)); });
        console.log('  ' + line);
      } else {
        console.log(chalk.gray('  ') + l);
      }
    });
    br();
  }

  if (result.prompt) {
    console.log(chalk.bold.white('  🚀  Prompt Pronto\n'));
    console.log(chalk.gray('  ' + '─'.repeat(56)));
    result.prompt.split('\n').forEach(l => console.log('  ' + chalk.white(l)));
    console.log(chalk.gray('  ' + '─'.repeat(56)));
    br();

    // Copy to clipboard
    const { copy } = await inquirer.prompt([{
      type: 'confirm', name: 'copy',
      message: '  Copiar prompt para o clipboard?', default: true,
    }]);

    if (copy) {
      const clipCmd = process.platform === 'win32' ? `echo ${result.prompt} | clip`
                    : process.platform === 'darwin' ? `echo "${result.prompt.replace(/"/g, '\\"')}" | pbcopy`
                    : `echo "${result.prompt.replace(/"/g, '\\"')}" | xclip -selection clipboard 2>/dev/null || xdotool type "${result.prompt.slice(0,20)}"`;
      exec(clipCmd, () => {});
      ok('Prompt copiado! Cole no seu IDE e comece.');
    }
  }

  br();

  // Option to change key
  const { changeKey } = await inquirer.prompt([{
    type: 'list',
    name: 'changeKey',
    message: '  O que fazer agora?',
    choices: [
      { name: '  ← Voltar ao menu', value: 'back' },
      { name: '  🔄  Gerar outro prompt', value: 'again' },
      { name: '  🔑  Trocar chave de API', value: 'key' },
    ],
  }]);

  if (changeKey === 'key') { saveConfig({}); await screenGenerator(); return; }
  if (changeKey === 'again') { await screenGenerator(); return; }
}

// ── PIXEL OFFICE SERVER ───────────────────────────────────────────────────────
const { spawn } = require('child_process');
const http = require('http');

function isServerRunning(cb) {
  const req = http.get('http://localhost:4321/health', res => {
    cb(res.statusCode === 200);
  });
  req.on('error', () => cb(false));
  req.setTimeout(800, () => { req.destroy(); cb(false); });
}

async function startOfficeServer() {
  banner();
  console.log(chalk.bold.white('  🎮  Pixel Office\n'));

  isServerRunning(async (running) => {
    if (running) {
      ok('Servidor já está rodando em ' + chalk.cyan('http://localhost:4321'));
      br();
    } else {
      info('Iniciando servidor em background na porta ' + chalk.cyan('4321') + '...');
      br();

      const child = spawn(process.execPath, [path.join(ROOT, 'src', 'server.js')], {
        detached: true,
        stdio: 'ignore',
        env: { ...process.env },
      });
      child.unref();

      // Aguarda o servidor subir
      await new Promise(r => setTimeout(r, 1000));
      ok('Servidor iniciado (PID ' + child.pid + ')');
    }

    // Abre o browser
    const openCmd = process.platform === 'win32' ? 'start'
                  : process.platform === 'darwin' ? 'open'
                  : 'xdg-open';
    exec(`${openCmd} http://localhost:4321/office.html`);
    ok('Abrindo ' + chalk.cyan('http://localhost:4321/office.html') + ' no browser...');
    br();
    dim('Para parar o servidor: feche o terminal ou rode ' + chalk.yellow('killall node'));
    br();
    await pause();
  });
}

// ── INSTALL HOOKS ─────────────────────────────────────────────────────────────
function installHooksScreen() {
  banner();
  console.log(chalk.bold.white('  🔗  Integração com Claude Code\n'));
  info('Instalando hooks em ' + chalk.cyan('.claude/settings.json') + '...');
  br();
  const { installHooks } = require('../src/hooks.js');
  installHooks(process.cwd());
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN LOOP
// ══════════════════════════════════════════════════════════════════════════════
async function main() {
  banner();

  // Se passou subcomando gen, vai direto ao gerador
  if (directCmd === 'gen' || directCmd === 'generate') {
    await screenGenerator();
    // volta ao menu após gerar
  }

  // Se passou subcomando direto, executa e volta ao menu
  if (directCmd === 'install') {
    const args = process.argv.slice(3);
    header('Instalando agentes...');
    await screenQuickInstall(args);
    // continua para o menu abaixo
  }

  if (directCmd === 'list') {
    const { list } = require('../src/list.js');
    list(process.argv.slice(3));
    return;
  }

  // Language selection
  const { lang } = await inquirer.prompt([{
    type: 'list',
    name: 'lang',
    message: '  Idioma / Language:',
    choices: [
      { name: '  🇧🇷  Português', value: 'pt' },
      { name: '  🇺🇸  English',   value: 'en' },
      { name: '  🇪🇸  Español',   value: 'es' },
    ],
  }]);

  while (true) {
    banner();
    header();

    const { action } = await inquirer.prompt([{
      type: 'list',
      name: 'action',
      message: '  O que você quer fazer?',
      pageSize: 12,
      choices: [
        // ── INSTALAR ──────────────────────────────────────
        new inquirer.Separator(chalk.gray('  ── instalar ──────────────────────────────')),
        { name: `  ⚡  Início Rápido         ${chalk.gray('instala todos os agentes agora')}`,         value: 'quick'   },
        { name: `  🎯  Para meu projeto       ${chalk.gray('squad ideal baseado no seu stack')}`,       value: 'project' },
        // ── EXPLORAR ──────────────────────────────────────
        new inquirer.Separator(chalk.gray('  ── explorar ──────────────────────────────')),
        { name: `  🤖  Gerar Prompt com IA   ${chalk.gray('descreva o projeto, IA monta o squad')}`,   value: 'gen'     },
        { name: `  👥  Agentes               ${chalk.gray('146 agentes disponíveis')}`,                value: 'agents'  },
        { name: `  🛠   Skills                ${chalk.gray('browse + selecione entre 1270+ skills')}`,  value: 'skills'  },
        // ── FERRAMENTAS ───────────────────────────────────
        new inquirer.Separator(chalk.gray('  ── ferramentas ────────────────────────────')),
        { name: `  🎮  Pixel Office           ${chalk.gray('inicia servidor local + abre no browser')}`, value: 'office'  },
        { name: `  🔗  Instalar Hooks         ${chalk.gray('integra com Claude Code em tempo real')}`,   value: 'hooks'   },
        { name: `  📊  Status                 ${chalk.gray('veja o que está instalado')}`,               value: 'status'  },
        new inquirer.Separator(''),
        { name: `  ✕   Sair`,                                                                           value: 'exit'    },
      ],
    }]);

    if (action === 'exit') { console.log(); process.exit(0); }

    if (action === 'gen')     await screenGenerator();
    if (action === 'quick')   await screenQuickInstall();
    if (action === 'project') await screenForMyProject();
    if (action === 'agents')  await screenAgents();
    if (action === 'skills')  await screenSkills();
    if (action === 'office')  startOfficeServer();
    if (action === 'hooks')   installHooksScreen();
    if (action === 'status')  await screenStatus();
  }
}

main().catch(e => {
  console.error(chalk.red('\n  Erro: ' + e.message));
  process.exit(1);
});
