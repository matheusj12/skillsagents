#!/usr/bin/env node
'use strict';

const path      = require('path');
const fs        = require('fs');
const os        = require('os');
const http      = require('http');
const { exec, spawn } = require('child_process');

const ROOT = path.join(__dirname, '..');
const PKG  = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const VER  = PKG.version || '1.0.0';

// ── CTRL+C sai limpo ──────────────────────────────────────────
process.on('SIGINT', () => { console.log('\n'); process.exit(0); });

// ── SUBCOMMANDS DIRETOS (sem menu) ────────────────────────────
const cmd = process.argv[2];

if (cmd === '--version' || cmd === '-v') { console.log(VER); process.exit(0); }
if (cmd === '--help'    || cmd === '-h') { printHelp(); process.exit(0); }

if (cmd === 'office' || cmd === 'serve') {
  require('../src/server.js');   // chama start() via require.main check interno
  return;
}
if (cmd === 'hooks') {
  const { installHooks } = require('../src/hooks.js');
  installHooks(process.cwd());
  return;
}
if (cmd === 'hooks:remove') {
  const { removeHooks } = require('../src/hooks.js');
  removeHooks(process.cwd());
  return;
}
if (cmd === 'install') {
  // npx github:matheusj12/skillsagents install — sem menu, instala direto
  const { install } = require('../src/install.js');
  install();
  return;
}
if (cmd === 'status') {
  // npx github:matheusj12/skillsagents status
  launchWithDeps(() => printStatusDirect());
  return;
}

// ── DEPS (carregadas somente para o menu interativo) ──────────
function launchWithDeps(fn) {
  const chalk    = require('chalk');
  const figlet   = require('figlet');
  const inquirer = require('inquirer');
  fn(chalk, figlet, inquirer);
}

launchWithDeps(async (chalk, figlet, inquirer) => {
  await main(chalk, figlet, inquirer);
});

// ── HELP ─────────────────────────────────────────────────────
function printHelp() {
  console.log(`
  skillsagents v${VER}

  COMANDOS DIRETOS (sem menu):
    install          Instala todos os agentes e skills no projeto atual
    office           Inicia o Pixel Office (servidor local + browser)
    hooks            Instala hooks no Claude Code (.claude/settings.json)
    hooks:remove     Remove os hooks instalados
    status           Mostra o que está instalado no projeto atual

  FLAGS:
    --version, -v    Mostra a versão
    --help, -h       Mostra esta ajuda

  SEM ARGUMENTOS:
    Abre o menu interativo completo

  EXEMPLOS:
    npx github:matheusj12/skillsagents                  # menu interativo
    npx github:matheusj12/skillsagents install          # instala tudo agora
    npx github:matheusj12/skillsagents hooks            # integra com Claude Code
    npx github:matheusj12/skillsagents office           # abre Pixel Office
    SKILLSAGENTS_PORT=4322 npx github:matheusj12/skillsagents office
`);
}

// ── STATUS DIRETO ─────────────────────────────────────────────
function printStatusDirect() {
  const cwd      = process.cwd();
  const agentDir = path.join(cwd, '.claude', 'agents');
  const skillDir = path.join(cwd, '.claude', 'skills');
  const agents   = fs.existsSync(agentDir) ? fs.readdirSync(agentDir).filter(f => f.endsWith('.md')) : [];
  const skills   = fs.existsSync(skillDir) ? fs.readdirSync(skillDir).filter(f => f.endsWith('.md')) : [];
  const hooks    = getHooksInstalled(cwd);

  console.log(`\n  skillsagents v${VER} — Status do projeto\n`);
  console.log(`  Projeto: ${cwd}\n`);
  console.log(`  ${ agents.length > 0 ? '✔' : '○' }  Agentes instalados   ${agents.length}`);
  console.log(`  ${ skills.length > 0 ? '✔' : '○' }  Skills instaladas    ${skills.length}`);
  console.log(`  ${ hooks ? '✔' : '○' }  Hooks do Claude Code ${hooks ? 'ativos' : 'não instalados'}\n`);

  if (!agents.length) {
    console.log(`  Para instalar: npx github:matheusj12/skillsagents install\n`);
  }
}

function getHooksInstalled(dir) {
  const p = path.join(dir, '.claude', 'settings.json');
  if (!fs.existsSync(p)) return false;
  try {
    const s = JSON.parse(fs.readFileSync(p, 'utf8'));
    return !!(s.hooks?.PreToolUse?.length);
  } catch { return false; }
}

// ─────────────────────────────────────────────────────────────
// CATÁLOGOS
// ─────────────────────────────────────────────────────────────
const BASE_AGENTS = [
  { id:'master',           name:'@master',           role:'Master Orchestrator', icon:'👑', priority:true },
  { id:'dev',              name:'@dev',               role:'Developer',           icon:'💻' },
  { id:'architect',        name:'@architect',         role:'Software Architect',  icon:'🏗️' },
  { id:'qa',               name:'@qa',                role:'Quality Assurance',   icon:'✅' },
  { id:'devops',           name:'@devops',            role:'DevOps Engineer',     icon:'⚙️' },
  { id:'pm',               name:'@pm',                role:'Product Manager',     icon:'📋' },
  { id:'po',               name:'@po',                role:'Product Owner',       icon:'🎯' },
  { id:'sm',               name:'@sm',                role:'Scrum Master',        icon:'🔄' },
  { id:'data-engineer',    name:'@data-engineer',     role:'Data Engineer',       icon:'📊' },
  { id:'analyst',          name:'@analyst',           role:'Business Analyst',    icon:'🔍' },
  { id:'ux-design-expert', name:'@ux-design-expert',  role:'UX Design Expert',    icon:'🎨' },
  { id:'squad-creator',    name:'@squad-creator',     role:'Squad Creator',       icon:'👥' },
  { id:'aiox-master',      name:'@aiox-master',       role:'AIOX Orchestrator',   icon:'🧠' },
];

const ADVANCED_AGENTS = [
  { id:'agent-coder',                name:'@coder',         role:'Code Implementer',   icon:'🔧', cat:'Dev'      },
  { id:'agent-reviewer',             name:'@reviewer',      role:'Code Reviewer',      icon:'🔎', cat:'Dev'      },
  { id:'agent-tester',               name:'@tester',        role:'QA Specialist',      icon:'🧪', cat:'Dev'      },
  { id:'agent-researcher',           name:'@researcher',    role:'Deep Researcher',    icon:'🔬', cat:'Research' },
  { id:'agent-planner',              name:'@planner',       role:'Strategic Planner',  icon:'🗺️', cat:'Planning' },
  { id:'agent-sparc-coordinator',    name:'@sparc',         role:'SPARC Coordinator',  icon:'⚡', cat:'Orch'     },
  { id:'agent-swarm',                name:'@swarm',         role:'Swarm Deployer',     icon:'🐝', cat:'Swarm'    },
  { id:'hive-mind',                  name:'@hive-mind',     role:'Hive Mind (BFT)',    icon:'🧩', cat:'Swarm'    },
  { id:'agent-security-manager',     name:'@security-mgr',  role:'Security Manager',   icon:'🔒', cat:'Security' },
  { id:'agent-performance-optimizer',name:'@perf-opt',      role:'Perf Optimizer',     icon:'🚀', cat:'Perf'     },
  { id:'agent-memory-coordinator',   name:'@memory',        role:'Memory Coordinator', icon:'🧠', cat:'Memory'   },
  { id:'agent-github-pr-manager',    name:'@pr-manager',    role:'GitHub PR Manager',  icon:'🐙', cat:'GitHub'   },
  { id:'agent-ops-cicd-github',      name:'@cicd',          role:'CI/CD Specialist',   icon:'⚙️', cat:'DevOps'   },
  { id:'pair-programming',           name:'@pair',          role:'Pair Programming',   icon:'👥', cat:'Dev'      },
  { id:'security-audit',             name:'@sec-audit',     role:'Security Audit',     icon:'🛡️', cat:'Security' },
];

const STACKS = {
  web:      { label:'🌐  Web App (Next.js / React)',     agents:['master','architect','dev','qa','ux-design-expert'], skills:['react-patterns','nextjs-app-router-patterns','tailwind-design-system','typescript-expert'] },
  api:      { label:'⚡  API Backend (FastAPI / Node)',   agents:['master','architect','dev','devops','qa'],           skills:['fastapi-pro','api-design-principles','api-security-best-practices','docker-expert'] },
  mobile:   { label:'📱  App Mobile (React Native)',      agents:['master','architect','dev','qa'],                   skills:['react-native-architecture','typescript-expert'] },
  data:     { label:'📊  Data / ML / IA',                agents:['master','data-engineer','analyst','architect'],     skills:['ai-ml','rag-engineer','postgresql-optimization'] },
  devops:   { label:'⚙️  DevOps / Infra / Cloud',        agents:['master','devops','architect'],                     skills:['docker-expert','kubernetes-architect','github-actions-templates'] },
  security: { label:'🔒  Segurança / Pentest',            agents:['master','qa','devops'],                            skills:['security-auditor','api-security-best-practices','auth-implementation-patterns'] },
  saas:     { label:'🚀  SaaS / Produto B2B',             agents:['master','pm','po','architect','dev','qa'],          skills:['react-patterns','fastapi-pro','auth-implementation-patterns','postgresql-optimization'] },
};

const MODELS = [
  { id:'gemini-2.5-flash',         label:'Gemini 2.5 Flash',   icon:'🟡', provider:'google',    desc:'Mais rápido · Grátis 15 req/min',   url:'https://aistudio.google.com/app/apikey',   keyField:'googleKey'    },
  { id:'gemini-2.0-flash',         label:'Gemini 2.0 Flash',   icon:'🟡', provider:'google',    desc:'Multimodal · Grátis',               url:'https://aistudio.google.com/app/apikey',   keyField:'googleKey'    },
  { id:'claude-sonnet-4-6',        label:'Claude Sonnet 4.6',  icon:'🟣', provider:'anthropic', desc:'Ideal para código complexo',        url:'https://console.anthropic.com/',           keyField:'anthropicKey' },
  { id:'claude-haiku-4-5-20251001',label:'Claude Haiku 4.5',   icon:'🟣', provider:'anthropic', desc:'Ultra rápido e barato',             url:'https://console.anthropic.com/',           keyField:'anthropicKey' },
  { id:'claude-opus-4-8',          label:'Claude Opus 4.8',    icon:'🟣', provider:'anthropic', desc:'Máxima inteligência',               url:'https://console.anthropic.com/',           keyField:'anthropicKey' },
  { id:'gpt-4o',                   label:'GPT-4o',             icon:'🟢', provider:'openai',    desc:'Mais capaz da OpenAI',              url:'https://platform.openai.com/api-keys',     keyField:'openaiKey'    },
  { id:'gpt-4o-mini',              label:'GPT-4o Mini',        icon:'🟢', provider:'openai',    desc:'Rápido e barato',                   url:'https://platform.openai.com/api-keys',     keyField:'openaiKey'    },
  { id:'deepseek-chat',            label:'DeepSeek V3',        icon:'🔵', provider:'deepseek',  desc:'Custo ultra baixo ~$0.14/M tokens', url:'https://platform.deepseek.com/api_keys',   keyField:'deepseekKey'  },
  { id:'deepseek-reasoner',        label:'DeepSeek R1',        icon:'🔵', provider:'deepseek',  desc:'Raciocínio passo a passo',          url:'https://platform.deepseek.com/api_keys',   keyField:'deepseekKey'  },
  { id:'mistral-large-latest',     label:'Mistral Large',      icon:'🟠', provider:'mistral',   desc:'Excelente para código e análise',   url:'https://console.mistral.ai/api-keys',      keyField:'mistralKey'   },
  { id:'llama-3.3-70b-versatile',  label:'Llama 3.3 70B',      icon:'⚡', provider:'groq',      desc:'Inferência ultra rápida · Grátis',  url:'https://console.groq.com/keys',            keyField:'groqKey'      },
];

const PROVIDER_LABELS = {
  google:'🟡  Google Gemini', anthropic:'🟣  Anthropic Claude',
  openai:'🟢  OpenAI GPT',    deepseek:'🔵  DeepSeek',
  mistral:'🟠  Mistral AI',   groq:'⚡  Groq (Llama)',
};

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function loadSkills() {
  const p = path.join(ROOT, 'skills_data.json');
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : [];
}

// FIX: instala em .claude/agents (Claude Code) + outros harnesses configurados
function installAgent(agentId) {
  const sources = [
    path.join(ROOT, '.codex', 'agents', `${agentId}.md`),
    path.join(ROOT, '.agents', 'skills', agentId, 'SKILL.md'),
  ];
  const src = sources.find(s => fs.existsSync(s));
  if (!src) return false;

  const cwd = process.cwd();
  const targets = [
    path.join(cwd, '.claude', 'agents'),          // Claude Code ← principal
    path.join(cwd, '.codex', 'agents'),            // Codex
    path.join(cwd, '.cursor', 'agents'),           // Cursor
    path.join(cwd, '.antigravity', 'rules', 'agents'),
  ];

  // Instala apenas nos harnesses que o projeto já usa
  const toInstall = targets.filter((t, i) => {
    if (i === 0) return true; // .claude sempre
    const marker = ['.codex', '.cursor', '.antigravity'].find(m => t.includes(m));
    return marker ? fs.existsSync(path.join(cwd, marker)) : false;
  });

  toInstall.forEach(d => {
    fs.mkdirSync(d, { recursive: true });
    fs.copyFileSync(src, path.join(d, `${agentId}.md`));
  });
  return true;
}

function maskKey(key) {
  const chalk = require('chalk');
  if (!key) return chalk.red('✗ não configurada');
  return chalk.green('✔ ') + key.slice(0,6) + '●●●●●●●●●●●' + key.slice(-4);
}

function checkServerRunning() {
  return new Promise(resolve => {
    const req = http.get('http://localhost:4321/health', res => resolve(res.statusCode === 200));
    req.on('error', () => resolve(false));
    req.setTimeout(800, () => { req.destroy(); resolve(false); });
  });
}

// ─────────────────────────────────────────────────────────────
// UI PRIMITIVES
// ─────────────────────────────────────────────────────────────
function makePrimitives(chalk) {
  const BACK = '__back__';
  return {
    BACK,
    back:  { name: chalk.gray('  ← Voltar'), value: BACK },
    sep:   (t = '') => new (require('inquirer').Separator)(chalk.gray(t)),
    ok:    msg  => console.log(chalk.green('  ✔  ') + msg),
    info:  msg  => console.log(chalk.cyan ('  →  ') + msg),
    warn:  msg  => console.log(chalk.yellow('  ⚠  ') + msg),
    err:   msg  => console.log(chalk.red  ('  ✗  ') + msg),
    dim:   msg  => console.log(chalk.gray ('     ') + msg),
    br:    ()   => console.log(),
    pause: ()   => require('inquirer').prompt([{ type:'input', name:'_', message: chalk.gray('  ← Enter para continuar...') }]),
    banner: (figlet) => {
      console.clear();
      const s = figlet.textSync('SKILLS', { font:'ANSI Shadow', horizontalLayout:'fitted' });
      const a = figlet.textSync('AGENTS', { font:'ANSI Shadow', horizontalLayout:'fitted' });
      console.log(chalk.cyanBright(s));
      console.log(chalk.cyanBright(a));
      console.log();
    },
    header: () => {
      console.log(chalk.yellow('Universal AI Agent Framework'));
      console.log(chalk.gray(`CLI v${VER}  ·  github.com/matheusj12/skillsagents`));
      console.log(chalk.gray('─'.repeat(62)));
      console.log();
    },
  };
}

// ─────────────────────────────────────────────────────────────
// SCREENS
// ─────────────────────────────────────────────────────────────
async function screenQuickInstall(ui, inquirer) {
  console.clear();
  console.log(ui.br());
  ui.info('Instalando todos os agentes e skills...\n');

  const { install } = require('../src/install.js');
  install();

  ui.br();
  console.log(ui.sep('─'.repeat(50)));
  ui.br();
  ui.ok('Próximos passos:');
  ui.dim('1.  Abra o IDE com IA (Claude Code, Cursor, Codex...)');
  ui.dim('2.  Digite @master *help  para ver todos os comandos');
  ui.dim('3.  Use npx github:matheusj12/skillsagents hooks  para monitoramento em tempo real');
  ui.br();
  await ui.pause();
}

async function screenForMyProject(ui, inquirer, figlet, chalk) {
  ui.banner(figlet);
  console.log(chalk.bold.white('  🎯  Para meu projeto\n'));

  const { stack } = await inquirer.prompt([{
    type: 'list', name: 'stack',
    message: '  Tipo do projeto:',
    choices: [
      ui.back, ui.sep(''),
      ...Object.entries(STACKS).map(([k,v]) => ({ name: '  '+v.label, value: k })),
    ],
    pageSize: 10,
  }]);
  if (stack === ui.BACK) return;

  const s = STACKS[stack];
  ui.br();
  console.log(chalk.bold.cyanBright('  Squad recomendado\n'));
  s.agents.forEach(id => {
    const a = BASE_AGENTS.find(x => x.id === id);
    if (a) console.log(`  ${a.icon}  ${chalk.cyan(a.name.padEnd(22))}  ${chalk.gray(a.role)}`);
  });
  ui.br();
  console.log(chalk.bold.yellow('  Skills recomendadas\n'));
  s.skills.forEach(sk => console.log(`  ${chalk.yellow('@'+sk)}`));
  ui.br();

  const prompt = `@master coordenando ${s.agents.slice(1).map(x=>'@'+x).join(' ')}\nUse ${s.skills.map(x=>'@'+x).join(' ')}\n\nCrie o plano de execução faseado para o projeto.`;
  console.log(chalk.gray('  Prompt pronto:\n'));
  console.log(chalk.white('  ' + prompt.replace(/\n/g, '\n  ')));
  ui.br();

  const { action } = await inquirer.prompt([{
    type: 'list', name: 'action',
    message: '  O que fazer?',
    choices: [
      { name: '  ✔  Instalar squad + hooks', value: 'install' },
      { name: '  📋  Só copiar o prompt',     value: 'copy'    },
      { name: chalk.gray('  ← Voltar'),       value: 'back'    },
    ],
  }]);

  if (action === 'back') return;

  if (action === 'install' || action === 'copy') {
    if (action === 'install') {
      ui.br();
      let done = 0;
      s.agents.forEach(id => {
        if (installAgent(id)) {
          const a = BASE_AGENTS.find(x => x.id === id);
          ui.ok(`${a?.icon||'🤖'}  ${('@'+id).padEnd(24)} ${chalk.gray('instalado')}`);
          done++;
        } else {
          ui.dim(`@${id}  ${chalk.red('— não encontrado')}`);
        }
      });
      ui.br();
      ui.ok(chalk.bold(`${done} agentes instalados em .claude/agents/`));
      ui.br();
      ui.dim('Chame @master *help no seu IDE para começar.');
    }
    // Copy to clipboard
    const clipCmd = process.platform === 'win32'
      ? `powershell -command "Set-Clipboard '${prompt.replace(/'/g,"''")}'"`
      : process.platform === 'darwin'
      ? `printf '%s' "${prompt.replace(/"/g,'\\"')}" | pbcopy`
      : `printf '%s' "${prompt.replace(/"/g,'\\"')}" | xclip -selection clipboard 2>/dev/null || true`;
    exec(clipCmd, () => {});
    ui.ok('Prompt copiado para o clipboard.');
  }

  ui.br();
  await ui.pause();
}

async function screenAgents(ui, inquirer, figlet, chalk) {
  ui.banner(figlet);
  console.log(chalk.bold.white('  👥  Agentes\n'));

  const { scope } = await inquirer.prompt([{
    type: 'list', name: 'scope',
    message: '  Catálogo:',
    choices: [
      ui.back, ui.sep(''),
      { name: `  🏠  Base (${BASE_AGENTS.length})       @master, @dev, @architect, @qa...`,               value: 'base'     },
      { name: `  🌐  Avançados (${ADVANCED_AGENTS.length})   swarm, hive-mind, coder, reviewer...`,        value: 'advanced' },
      { name: `  📦  Todos (${BASE_AGENTS.length + ADVANCED_AGENTS.length})`,                              value: 'all'      },
    ],
  }]);
  if (scope === ui.BACK) return;

  const pool = scope === 'base' ? BASE_AGENTS
             : scope === 'advanced' ? ADVANCED_AGENTS
             : [...BASE_AGENTS, ...ADVANCED_AGENTS];

  const { selected } = await inquirer.prompt([{
    type: 'checkbox', name: 'selected',
    message: '  ESPAÇO selecionar · ENTER confirmar:',
    choices: [
      ...pool.map(a => ({
        name:    `${a.icon}  ${(a.name||'@'+a.id).padEnd(30)} ${chalk.gray(a.role||a.cat||'')}`,
        value:   a.id,
        checked: !!a.priority,
      })),
      ui.sep(''),
      { name: chalk.gray('  ← Cancelar'), value: ui.BACK },
    ],
    pageSize: 22,
  }]);

  if (!selected.length || selected.includes(ui.BACK)) return;

  ui.br();
  let done = 0;
  selected.forEach(id => {
    if (installAgent(id)) { ui.ok('@'+id); done++; }
    else ui.dim('@'+id + chalk.red('  — não encontrado'));
  });
  ui.br();
  ui.ok(chalk.bold(`${done} agente(s) instalados em .claude/agents/`));
  console.log(chalk.cyan('\n  Ative: ') + chalk.white('@' + selected[0] + ' *help'));
  ui.br();
  await ui.pause();
}

async function screenSkills(ui, inquirer, figlet, chalk) {
  ui.banner(figlet);
  console.log(chalk.bold.white('  🛠   Skills\n'));

  const skills = loadSkills();
  if (!skills.length) {
    ui.err('skills_data.json não encontrado.');
    await ui.pause(); return;
  }

  const cats = [...new Set(skills.map(s => s.cat))].sort();

  const { mode } = await inquirer.prompt([{
    type: 'list', name: 'mode',
    message: '  Explorar por:',
    choices: [
      ui.back, ui.sep(''),
      { name: `  🔍  Buscar por palavra-chave`,          value: 'search' },
      { name: `  📂  Filtrar por categoria (${cats.length})`, value: 'cat' },
    ],
  }]);
  if (mode === ui.BACK) return;

  let filtered = skills;

  if (mode === 'search') {
    const { q } = await inquirer.prompt([{ type:'input', name:'q', message:'  Buscar:' }]);
    const term = q.trim().toLowerCase();
    if (term) filtered = skills.filter(s =>
      s.name.toLowerCase().includes(term) || (s.desc||'').toLowerCase().includes(term)
    );
  } else {
    const { cat } = await inquirer.prompt([{
      type: 'list', name: 'cat',
      message: '  Categoria:',
      choices: [
        ui.back, ui.sep(''),
        ...cats.map(c => {
          const cnt = skills.filter(s => s.cat === c).length;
          return { name: `  ${c.padEnd(22)} ${chalk.gray(cnt+' skills')}`, value: c };
        }),
      ],
      pageSize: 16,
    }]);
    if (cat === ui.BACK) return;
    filtered = skills.filter(s => s.cat === cat);
  }

  const show = filtered.slice(0, 60);
  ui.br();
  ui.info(`${chalk.white(show.length)} skills ${show.length < filtered.length ? chalk.gray('(mostrando '+show.length+' de '+filtered.length+')') : 'encontradas'}`);
  ui.br();

  const { selected } = await inquirer.prompt([{
    type: 'checkbox', name: 'selected',
    message: '  ESPAÇO selecionar · ENTER confirmar:',
    choices: [
      ...show.map(s => ({
        name:  `@${s.name.padEnd(44)} ${chalk.gray('['+s.cat+']')}`,
        value: s.name,
      })),
      ui.sep(''),
      { name: chalk.gray('  ← Cancelar'), value: ui.BACK },
    ],
    pageSize: 20,
  }]);

  if (!selected.length || selected.includes(ui.BACK)) return;

  ui.br();
  console.log(chalk.bold.yellow('  Skills selecionadas:\n'));
  selected.forEach(s => console.log(chalk.cyan('  @'+s)));
  ui.br();
  console.log(chalk.gray('  Cole no seu IDE:'));
  console.log(chalk.white('  Use '+selected.map(s=>'@'+s).join(' ')));
  ui.br();
  await ui.pause();
}

async function screenStatus(ui, inquirer, figlet, chalk) {
  ui.banner(figlet);
  console.log(chalk.bold.white('  📊  Status do projeto\n'));

  const cwd       = process.cwd();
  const agentDir  = path.join(cwd, '.claude', 'agents');
  const skillDir  = path.join(cwd, '.claude', 'skills');
  const agentsSrc = path.join(ROOT, '.codex', 'agents');
  const advSrc    = path.join(ROOT, '.agents', 'skills');

  const agents      = fs.existsSync(agentDir)  ? fs.readdirSync(agentDir).filter(f=>f.endsWith('.md'))  : [];
  const skills      = fs.existsSync(skillDir)  ? fs.readdirSync(skillDir).filter(f=>f.endsWith('.md'))  : [];
  const srcAgents   = fs.existsSync(agentsSrc) ? fs.readdirSync(agentsSrc).filter(f=>f.endsWith('.md')).length : 0;
  const advAgents   = fs.existsSync(advSrc)    ? fs.readdirSync(advSrc).filter(d=>fs.statSync(path.join(advSrc,d)).isDirectory()).length : 0;
  const hooksActive = getHooksInstalled(cwd);
  const catalog     = loadSkills();
  const isLive      = await checkServerRunning();

  const row = (ok, label, val) =>
    console.log(`  ${ok?chalk.green('✔'):chalk.gray('○')}  ${label.padEnd(28)} ${chalk.cyan(String(val))}`);

  row(agents.length > 0, 'Agentes instalados',    `${agents.length} (de ${srcAgents + advAgents} disponíveis)`);
  row(skills.length > 0, 'Skills instaladas',      `${skills.length} (catálogo: ${catalog.length})`);
  row(hooksActive,        'Hooks Claude Code',      hooksActive ? 'ativos' : 'não instalados');
  row(isLive,             'Pixel Office',           isLive ? 'rodando em :4321' : 'offline');

  ui.br();
  console.log(chalk.gray(`  Projeto: ${cwd}`));

  if (!agents.length) {
    ui.br();
    ui.warn('Nenhum agente instalado neste projeto.');
    ui.dim('Para instalar: npx github:matheusj12/skillsagents install');
  }
  if (!hooksActive) {
    if (!agents.length) ui.br();
    ui.dim('Para monitorar em tempo real: npx github:matheusj12/skillsagents hooks');
  }

  ui.br();
  await ui.pause();
}

async function screenConfig(ui, inquirer, chalk) {
  const { loadConfig, saveConfig } = require('../src/generator.js');

  while (true) {
    console.clear();
    const config      = loadConfig();
    const activeId    = config.activeModel || 'gemini-2.5-flash';
    const activeMeta  = MODELS.find(m => m.id === activeId) || MODELS[0];

    console.log(chalk.bold.cyanBright('\n  🔑  Modelos e Chaves de API\n'));
    console.log(chalk.gray('  Config: ~/.skillsagents/config.json\n'));
    console.log(chalk.bold('  Modelo ativo:'));
    console.log(`  ${activeMeta.icon}  ${chalk.cyan(activeMeta.label)}  ${chalk.gray(activeMeta.desc)}`);
    ui.br();
    console.log(chalk.bold('  Chaves:'));
    [...new Set(MODELS.map(m => m.provider))].forEach(p => {
      const kf  = MODELS.find(m => m.provider === p)?.keyField;
      console.log(`  ${(PROVIDER_LABELS[p]||p).padEnd(26)}  ${maskKey(kf && config[kf])}`);
    });
    console.log(chalk.gray('\n  ' + '─'.repeat(54) + '\n'));

    const { action } = await inquirer.prompt([{
      type: 'list', name: 'action',
      message: '  Ação:',
      pageSize: 7,
      choices: [
        { name: '  🎯  Selecionar modelo ativo',  value: 'model'  },
        { name: '  🔐  Adicionar / trocar chave', value: 'key'    },
        { name: '  🗑   Remover uma chave',        value: 'clear1' },
        { name: '  💣  Limpar tudo',              value: 'clear'  },
        ui.sep(''),
        { name: chalk.gray('  ← Voltar'),         value: 'back'   },
      ],
    }]);
    if (action === 'back') return;

    // ── SELECIONAR MODELO ─────────────────────────────────
    if (action === 'model') {
      const groups = {};
      MODELS.forEach(m => { (groups[m.provider] = groups[m.provider]||[]).push(m); });
      const choices = [];
      Object.entries(groups).forEach(([p, ms]) => {
        choices.push(ui.sep(`  ── ${PROVIDER_LABELS[p]||p}`));
        ms.forEach(m => {
          const hasKey  = !!config[m.keyField];
          const isActive = m.id === activeId;
          choices.push({
            name:  `  ${m.icon}  ${m.label.padEnd(26)} ${hasKey?chalk.green('✔'):chalk.red('✗')} key  ${chalk.gray(m.desc)}${isActive?chalk.cyanBright(' ← ativo'):''}`,
            value: m.id,
          });
        });
      });
      choices.push(ui.sep(''));
      choices.push({ name: chalk.gray('  ← Voltar'), value: ui.BACK });

      const { sel } = await inquirer.prompt([{ type:'list', name:'sel', message:'  Modelo:', choices, pageSize:20 }]);
      if (sel === ui.BACK) continue;

      const meta = MODELS.find(m => m.id === sel);
      const cfg  = loadConfig();
      if (!cfg[meta.keyField]) {
        ui.br();
        ui.warn(`Nenhuma chave para ${PROVIDER_LABELS[meta.provider]}.`);
        ui.info('Gere sua chave em: ' + chalk.cyan(meta.url));
        ui.br();
        const { apiKey } = await inquirer.prompt([{
          type:'password', name:'apiKey', message:'  Cole a chave:', mask:'●',
          validate: v => v.trim().length > 10 || 'Chave muito curta',
        }]);
        cfg[meta.keyField] = apiKey.trim();
      }
      cfg.activeModel = sel;
      saveConfig(cfg);
      ui.br(); ui.ok(`Modelo ativo: ${meta.icon}  ${chalk.cyan(meta.label)}`); ui.br();
      await ui.pause();
    }

    // ── ADD/CHANGE KEY ────────────────────────────────────
    if (action === 'key') {
      const { prov } = await inquirer.prompt([{
        type:'list', name:'prov',
        message:'  Provedor:',
        choices: [
          ...Object.entries(PROVIDER_LABELS).map(([id,label]) => ({ name:'  '+label, value:id })),
          ui.sep(''), { name: chalk.gray('  ← Voltar'), value: ui.BACK },
        ],
      }]);
      if (prov === ui.BACK) continue;
      const meta = MODELS.find(m => m.provider === prov);
      ui.br(); ui.info('Chave em: ' + chalk.cyan(meta.url)); ui.br();
      const { apiKey } = await inquirer.prompt([{
        type:'password', name:'apiKey', message:'  Cole a chave:', mask:'●',
        validate: v => v.trim().length > 6 || 'Chave muito curta',
      }]);
      const cfg = loadConfig();
      cfg[meta.keyField] = apiKey.trim();
      saveConfig(cfg);
      ui.br(); ui.ok(`Chave ${PROVIDER_LABELS[prov]} salva.`); ui.br();
      await ui.pause();
    }

    // ── REMOVE ONE KEY ────────────────────────────────────
    if (action === 'clear1') {
      const { prov } = await inquirer.prompt([{
        type:'list', name:'prov',
        message:'  Remover qual?',
        choices: [
          ...Object.entries(PROVIDER_LABELS).map(([id,label]) => ({ name:'  '+label, value:id })),
          ui.sep(''), { name: chalk.gray('  ← Voltar'), value: ui.BACK },
        ],
      }]);
      if (prov === ui.BACK) continue;
      const cfg = loadConfig();
      const kf  = MODELS.find(m => m.provider === prov)?.keyField;
      if (kf) { delete cfg[kf]; saveConfig(cfg); }
      ui.ok(`Chave ${PROVIDER_LABELS[prov]} removida.`);
      await ui.pause();
    }

    // ── CLEAR ALL ─────────────────────────────────────────
    if (action === 'clear') {
      const { confirm } = await inquirer.prompt([{
        type:'confirm', name:'confirm',
        message:'  Remover TODAS as chaves?', default: false,
      }]);
      if (confirm) { saveConfig({}); ui.ok('Configurações limpas.'); await ui.pause(); }
    }
  }
}

async function screenGenerator(ui, inquirer, figlet, chalk) {
  ui.banner(figlet);
  console.log(chalk.bold.white('  🤖  Gerador de Prompts com IA\n'));

  const { loadConfig, saveConfig, generate } = require('../src/generator.js');
  const config      = loadConfig();
  const activeId    = config.activeModel || 'gemini-2.5-flash';
  const activeMeta  = MODELS.find(m => m.id === activeId) || MODELS[0];
  const activeKey   = config[activeMeta.keyField];

  if (!activeKey) {
    ui.br();
    ui.warn(`Nenhuma chave para ${PROVIDER_LABELS[activeMeta.provider]}.`);
    ui.dim('Configure em: Menu → 🔑 Chaves de API');
    ui.br();
    const { go } = await inquirer.prompt([{
      type:'confirm', name:'go', message:'  Configurar agora?', default:true,
    }]);
    if (go) await screenConfig(ui, inquirer, chalk);
    return;
  }

  ui.info(`Modelo: ${activeMeta.icon}  ${chalk.cyan(activeMeta.label)}`);
  console.log(chalk.gray('\n  ── Descreva seu projeto ──────────────────────────────\n'));
  ui.dim('Ex: "SaaS de finanças em Next.js + FastAPI"');
  ui.dim('Ex: "App mobile de delivery com painel admin"');
  ui.dim('Ex: "Sistema RAG com PDFs e busca semântica"');
  ui.br();

  const { idea } = await inquirer.prompt([{
    type:'input', name:'idea',
    message:'  Projeto:',
    validate: v => v.trim().length > 5 || 'Descreva um pouco mais',
  }]);
  ui.br();

  let result;
  try {
    result = await generate({ idea, model: activeId, provider: activeMeta.provider, apiKey: activeKey });
  } catch(e) {
    ui.br(); ui.err('Erro: ' + e.message);
    if (/api|key|auth/i.test(e.message)) {
      ui.warn('Sua chave pode estar inválida ou expirada.');
      const { reset } = await inquirer.prompt([{ type:'confirm', name:'reset', message:'  Trocar a chave?', default:true }]);
      if (reset) saveConfig({});
    }
    ui.br(); await ui.pause(); return;
  }

  ui.banner(figlet);
  console.log(chalk.bold.cyanBright('  ✦  Orion — Resultado\n'));

  if (result.vision) {
    console.log(chalk.bold.white('  📋  Visão da Solução\n'));
    result.vision.split('\n').forEach(l => l && console.log(chalk.gray('  ') + l));
    ui.br();
  }
  if (result.agents) {
    console.log(chalk.bold.white('  👥  Agentes Recomendados\n'));
    result.agents.split('\n').forEach(l => {
      if (!l.trim()) return;
      let line = l;
      (l.match(/(@\S+)/g)||[]).forEach(m => { line = line.replace(m, chalk.cyan(m)); });
      console.log('  ' + line);
    });
    ui.br();
  }
  if (result.skills) {
    console.log(chalk.bold.white('  🛠   Skills Recomendadas\n'));
    result.skills.split('\n').forEach(l => {
      if (!l.trim()) return;
      let line = l;
      (l.match(/(@\S+)/g)||[]).forEach(m => { line = line.replace(m, chalk.yellow(m)); });
      console.log('  ' + line);
    });
    ui.br();
  }
  if (result.prompt) {
    console.log(chalk.bold.white('  🚀  Prompt Pronto\n'));
    console.log(chalk.gray('  ' + '─'.repeat(58)));
    result.prompt.split('\n').forEach(l => console.log('  ' + chalk.white(l)));
    console.log(chalk.gray('  ' + '─'.repeat(58)));
    ui.br();

    const { copy } = await inquirer.prompt([{
      type:'confirm', name:'copy', message:'  Copiar prompt para o clipboard?', default:true,
    }]);
    if (copy) {
      const p = result.prompt.replace(/"/g,'\\"');
      const clipCmd = process.platform === 'win32'
        ? `powershell -command "Set-Clipboard '${result.prompt.replace(/'/g,"''")}'"`
        : process.platform === 'darwin'
        ? `printf '%s' "${p}" | pbcopy`
        : `printf '%s' "${p}" | xclip -selection clipboard 2>/dev/null || true`;
      exec(clipCmd, () => {});
      ui.ok('Copiado! Cole no seu IDE e comece.');
    }
  }

  ui.br();
  const { next } = await inquirer.prompt([{
    type:'list', name:'next',
    message:'  O que fazer?',
    choices: [
      { name:'  ← Voltar ao menu',   value:'back'  },
      { name:'  🔄  Gerar de novo',  value:'again' },
      { name:'  🔑  Trocar modelo',  value:'key'   },
    ],
  }]);
  if (next === 'key')   { await screenConfig(ui, inquirer, chalk); return; }
  if (next === 'again') { await screenGenerator(ui, inquirer, figlet, chalk); }
}

async function screenOffice(ui, inquirer, chalk) {
  console.clear();
  console.log(chalk.bold.white('\n  🎮  Pixel Office\n'));

  const running = await checkServerRunning();

  if (running) {
    ui.ok('Servidor já rodando em ' + chalk.cyan('http://localhost:4321'));
  } else {
    ui.info('Iniciando servidor na porta ' + chalk.cyan('4321') + '...');
    const child = spawn(process.execPath, [path.join(ROOT, 'src', 'server.js')], {
      detached: true, stdio: 'ignore',
      env: { ...process.env, SKILLSAGENTS_PORT:'4321' },
    });
    child.unref();
    // Aguarda servidor subir
    await new Promise(r => setTimeout(r, 1000));
    const up = await checkServerRunning();
    if (up) {
      ui.ok('Servidor iniciado (PID ' + child.pid + ')');
    } else {
      ui.warn('Servidor pode estar demorando — verifique manualmente.');
    }
  }

  const openCmd = process.platform === 'win32' ? 'start'
                : process.platform === 'darwin' ? 'open'
                : 'xdg-open';
  exec(`${openCmd} http://localhost:4321/office.html`);
  ui.ok('Abrindo ' + chalk.cyan('http://localhost:4321/office.html') + ' no browser');
  ui.br();
  ui.dim('Para parar: feche o terminal ou rode  kill $(lsof -ti:4321)');
  ui.dim('Para instalar hooks e ver agentes reais: npx github:matheusj12/skillsagents hooks');
  ui.br();
  await ui.pause();
}

async function screenHooks(ui, inquirer, chalk) {
  console.clear();
  console.log(chalk.bold.white('\n  🔗  Integração com Claude Code\n'));
  ui.info('Instalando hooks em ' + chalk.cyan('.claude/settings.json') + '...\n');
  const { installHooks } = require('../src/hooks.js');
  installHooks(process.cwd());
  ui.br();
  ui.dim('Próximos passos:');
  ui.dim('1.  Abra uma sessão do Claude Code neste projeto');
  ui.dim('2.  Rode: npx github:matheusj12/skillsagents office  (abre o Pixel Office)');
  ui.dim('3.  Agentes aparecem em tempo real enquanto você trabalha');
  ui.br();
  await ui.pause();
}

// ─────────────────────────────────────────────────────────────
// MAIN LOOP
// ─────────────────────────────────────────────────────────────
async function main(chalk, figlet, inquirer) {
  const ui = makePrimitives(chalk);

  // Subcomando gen direto
  if (cmd === 'gen' || cmd === 'generate') {
    await screenGenerator(ui, inquirer, figlet, chalk);
    process.exit(0);
  }

  ui.banner(figlet);
  ui.header();

  while (true) {
    const { action } = await inquirer.prompt([{
      type: 'list', name: 'action',
      message: '  O que você quer fazer?',
      pageSize: 16,
      choices: [
        ui.sep('  ── instalar ────────────────────────────────────'),
        { name: `  ⚡  Início Rápido         ${chalk.gray('instala todos os agentes agora')}`,           value: 'quick'   },
        { name: `  🎯  Para meu projeto       ${chalk.gray('squad ideal baseado no seu stack')}`,         value: 'project' },
        ui.sep('  ── explorar ────────────────────────────────────'),
        { name: `  🤖  Gerar Prompt com IA   ${chalk.gray('descreva o projeto, IA monta o squad')}`,     value: 'gen'     },
        { name: `  👥  Agentes               ${chalk.gray('146 agentes disponíveis')}`,                  value: 'agents'  },
        { name: `  🛠   Skills               ${chalk.gray('browse + selecione entre 1270+ skills')}`,    value: 'skills'  },
        ui.sep('  ── ferramentas ─────────────────────────────────'),
        { name: `  🎮  Pixel Office           ${chalk.gray('inicia servidor local + abre no browser')}`, value: 'office'  },
        { name: `  🔗  Instalar Hooks         ${chalk.gray('integra com Claude Code em tempo real')}`,   value: 'hooks'   },
        { name: `  🔑  Chaves de API          ${chalk.gray('Gemini · Claude · GPT · DeepSeek...')}`,     value: 'config'  },
        { name: `  📊  Status                 ${chalk.gray('veja o que está instalado')}`,               value: 'status'  },
        ui.sep(''),
        { name: `  ✕   Sair`,                                                                            value: 'exit'    },
      ],
    }]);

    if (action === 'exit') { console.log(); process.exit(0); }

    if (action === 'quick')   await screenQuickInstall(ui, inquirer);
    if (action === 'project') await screenForMyProject(ui, inquirer, figlet, chalk);
    if (action === 'agents')  await screenAgents(ui, inquirer, figlet, chalk);
    if (action === 'skills')  await screenSkills(ui, inquirer, figlet, chalk);
    if (action === 'gen')     await screenGenerator(ui, inquirer, figlet, chalk);
    if (action === 'config')  await screenConfig(ui, inquirer, chalk);
    if (action === 'office')  await screenOffice(ui, inquirer, chalk);
    if (action === 'hooks')   await screenHooks(ui, inquirer, chalk);
    if (action === 'status')  await screenStatus(ui, inquirer, figlet, chalk);

    // Volta ao menu — banner apenas 1x
    console.clear();
    ui.header();
  }
}

main.catch = e => {
  const chalk = require('chalk');
  console.error(chalk.red('\n  Erro fatal: ' + e.message));
  process.exit(1);
};
