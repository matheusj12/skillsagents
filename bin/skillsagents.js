#!/usr/bin/env node
'use strict';

const path     = require('path');
const fs       = require('fs');
const { exec } = require('child_process');
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
async function screenQuickInstall() {
  banner();
  console.log(chalk.bold.white('  ⚡  Início Rápido\n'));
  info('Instalando os 13 agentes base...');
  br();

  let count = 0;
  for (const a of BASE_AGENTS) {
    if (installAgent(a.id)) {
      ok(`${a.icon}  ${a.name.padEnd(24)} ${chalk.gray(a.role)}`);
      count++;
    }
  }

  br();
  ok(chalk.bold(`${count} agentes instalados em `) + chalk.cyan('.codex/agents/'));
  dim('Adicione --skills para instalar as 1270+ skills globalmente.');
  br();

  console.log(chalk.gray('  ─'.repeat(30)));
  br();
  console.log(chalk.bold('  Próximo passo:'));
  console.log(chalk.cyan('  @master *help') + chalk.gray('  — chame no seu IDE para começar'));
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

// ── PIXEL OFFICE ──────────────────────────────────────────────────────────────
async function screenOffice() {
  banner();
  console.log(chalk.bold.white('  🎮  Pixel Office\n'));
  info('Abrindo ' + chalk.cyan('http://localhost:3001/office.html') + ' no browser...');
  br();
  const cmd = process.platform === 'win32' ? 'start'
            : process.platform === 'darwin' ? 'open'
            : 'xdg-open';
  exec(`${cmd} http://localhost:3001/office.html`);
  dim('Se não abrir, acesse manualmente: http://localhost:3001/office.html');
  br();
  await pause();
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN LOOP
// ══════════════════════════════════════════════════════════════════════════════
async function main() {
  banner();

  // Language
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
        { name: `  👥  Agentes               ${chalk.gray('146 agentes disponíveis')}`,                value: 'agents'  },
        { name: `  🛠   Skills                ${chalk.gray('browse + selecione entre 1270+ skills')}`,  value: 'skills'  },
        // ── FERRAMENTAS ───────────────────────────────────
        new inquirer.Separator(chalk.gray('  ── ferramentas ────────────────────────────')),
        { name: `  🎮  Pixel Office           ${chalk.gray('veja seus agentes animados ao vivo')}`,     value: 'office'  },
        { name: `  📊  Status                 ${chalk.gray('veja o que está instalado')}`,              value: 'status'  },
        new inquirer.Separator(''),
        { name: `  ✕   Sair`,                                                                           value: 'exit'    },
      ],
    }]);

    if (action === 'exit') { console.log(); process.exit(0); }

    if (action === 'quick')   await screenQuickInstall();
    if (action === 'project') await screenForMyProject();
    if (action === 'agents')  await screenAgents();
    if (action === 'skills')  await screenSkills();
    if (action === 'office')  await screenOffice();
    if (action === 'status')  await screenStatus();
  }
}

main().catch(e => {
  console.error(chalk.red('\n  Erro: ' + e.message));
  process.exit(1);
});
