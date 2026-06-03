#!/usr/bin/env node
'use strict';

const path     = require('path');
const fs       = require('fs');
const figlet   = require('figlet');
const chalk    = require('chalk');
const inquirer = require('inquirer');

const ROOT = path.join(__dirname, '..');

// ── i18n ─────────────────────────────────────────────────────────────────────
const LANG = {
  pt: {
    subtitle:     'Universal AI Agent Framework para qualquer domínio',
    installer:    'CLI v1.0.0',
    langPrompt:   'Idioma:',
    modePrompt:   'O que você quer fazer?',
    opt_assisted: 'Modo Assistido  — deixa eu te guiar',
    opt_project:  'Novo Projeto    — configura tudo do zero',
    opt_agents:   'Selecionar Agentes',
    opt_skills:   'Selecionar Skills',
    opt_status:   'Status da instalação',
    opt_exit:     'Sair',
    projName:     'Nome do projeto:',
    projType:     'Tipo de projeto:',
    agentSel:     'Selecione os agentes (ESPAÇO para marcar):',
    skillSel:     'Selecione as skills (ESPAÇO para marcar):',
    skillSearch:  'Filtrar skills (deixe em branco para ver tudo):',
    installing:   'Instalando',
    done:         '✔  Concluído!',
    activate:     'Para ativar no seu IDE: ',
    statusTitle:  'Status da instalação',
    noAgents:     'Nenhum agente instalado.',
    noSkillsDb:   'skills_data.json não encontrado.',
  },
  en: {
    subtitle:     'Universal AI Agent Framework for Any Domain',
    installer:    'CLI v1.0.0',
    langPrompt:   'Language:',
    modePrompt:   'What do you want to do?',
    opt_assisted: 'Assisted Mode  — let me guide you',
    opt_project:  'New Project    — set up everything from scratch',
    opt_agents:   'Select Agents',
    opt_skills:   'Select Skills',
    opt_status:   'Installation Status',
    opt_exit:     'Exit',
    projName:     'Project name:',
    projType:     'Project type:',
    agentSel:     'Select agents (SPACE to toggle):',
    skillSel:     'Select skills (SPACE to toggle):',
    skillSearch:  'Filter skills (leave blank to see all):',
    installing:   'Installing',
    done:         '✔  Done!',
    activate:     'Activate in your IDE: ',
    statusTitle:  'Installation Status',
    noAgents:     'No agents installed.',
    noSkillsDb:   'skills_data.json not found.',
  },
  es: {
    subtitle:     'Framework Universal de Agentes IA para Cualquier Dominio',
    installer:    'CLI v1.0.0',
    langPrompt:   'Idioma:',
    modePrompt:   '¿Qué quieres hacer?',
    opt_assisted: 'Modo Asistido  — déjame guiarte',
    opt_project:  'Nuevo Proyecto  — configura todo desde cero',
    opt_agents:   'Seleccionar Agentes',
    opt_skills:   'Seleccionar Skills',
    opt_status:   'Estado de la instalación',
    opt_exit:     'Salir',
    projName:     'Nombre del proyecto:',
    projType:     'Tipo de proyecto:',
    agentSel:     'Selecciona agentes (ESPACIO para marcar):',
    skillSel:     'Selecciona skills (ESPACIO para marcar):',
    skillSearch:  'Filtrar skills (vacío para ver todo):',
    installing:   'Instalando',
    done:         '✔  Listo!',
    activate:     'Activa en tu IDE: ',
    statusTitle:  'Estado de la instalación',
    noAgents:     'Ningún agente instalado.',
    noSkillsDb:   'skills_data.json no encontrado.',
  },
};

// ── Agent catalogue ───────────────────────────────────────────────────────────
const BASE_AGENTS = [
  { id: 'master',          title: 'Master Orchestrator — controla TUDO', icon: '👑', priority: true },
  { id: 'aiox-master',     title: 'AIOX Master (Orion)',                 icon: '🧠' },
  { id: 'dev',             title: 'Developer',                           icon: '💻' },
  { id: 'architect',       title: 'Software Architect',                  icon: '🏗️' },
  { id: 'pm',              title: 'Product Manager',                     icon: '📋' },
  { id: 'po',              title: 'Product Owner',                       icon: '🎯' },
  { id: 'qa',              title: 'Quality Assurance',                   icon: '✅' },
  { id: 'sm',              title: 'Scrum Master',                        icon: '🔄' },
  { id: 'devops',          title: 'DevOps Engineer',                     icon: '⚙️' },
  { id: 'data-engineer',   title: 'Data Engineer',                       icon: '📊' },
  { id: 'analyst',         title: 'Business Analyst',                    icon: '🔍' },
  { id: 'ux-design-expert',title: 'UX Design Expert',                   icon: '🎨' },
  { id: 'squad-creator',   title: 'Squad Creator',                       icon: '👥' },
];

const RUFLO_AGENTS = [
  { id: 'agent-coder',                    title: 'Code Implementer',              icon: '💻', cat: 'Dev'       },
  { id: 'agent-reviewer',                 title: 'Code Reviewer',                 icon: '🔎', cat: 'Dev'       },
  { id: 'agent-tester',                   title: 'QA / Tester',                   icon: '🧪', cat: 'Dev'       },
  { id: 'agent-researcher',               title: 'Deep Researcher',               icon: '🔬', cat: 'Research'  },
  { id: 'agent-planner',                  title: 'Strategic Planner',             icon: '🗺️', cat: 'Planning'  },
  { id: 'agent-sparc-coordinator',        title: 'SPARC Coordinator',             icon: '⚡', cat: 'Orch'      },
  { id: 'agent-swarm',                    title: 'Swarm Deployer',                icon: '🐝', cat: 'Swarm'     },
  { id: 'agent-queen-coordinator',        title: 'Queen (Hive Leader)',           icon: '👑', cat: 'Swarm'     },
  { id: 'hive-mind',                      title: 'Hive Mind (BFT)',               icon: '🧩', cat: 'Swarm'     },
  { id: 'agent-security-manager',         title: 'Security Manager',              icon: '🔒', cat: 'Security'  },
  { id: 'agent-performance-optimizer',    title: 'Performance Optimizer',         icon: '🚀', cat: 'Perf'      },
  { id: 'agent-memory-coordinator',       title: 'Memory Coordinator',            icon: '🧠', cat: 'Memory'    },
  { id: 'agent-github-pr-manager',        title: 'GitHub PR Manager',             icon: '🐙', cat: 'GitHub'    },
  { id: 'github-code-review',             title: 'GitHub Code Reviewer',          icon: '🔍', cat: 'GitHub'    },
  { id: 'agent-ops-cicd-github',          title: 'CI/CD Specialist',              icon: '⚙️', cat: 'DevOps'    },
  { id: 'agent-consensus-coordinator',    title: 'Consensus (BFT)',               icon: '🤝', cat: 'Dist'      },
  { id: 'agent-data-ml-model',            title: 'ML / Data Model',               icon: '🤖', cat: 'AI/ML'     },
  { id: 'pair-programming',               title: 'Pair Programming Partner',      icon: '👥', cat: 'Dev'       },
  { id: 'agent-workflow-automation',      title: 'Workflow Automation',           icon: '⚡', cat: 'Auto'      },
  { id: 'security-audit',                 title: 'Security Audit',                icon: '🛡️', cat: 'Security'  },
  { id: 'sparc-methodology',              title: 'SPARC Methodology',             icon: '🎯', cat: 'Method'    },
  { id: 'swarm-orchestration',            title: 'Swarm Orchestration',           icon: '🕸️', cat: 'Swarm'     },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function banner() {
  const art = figlet.textSync('SKILLS', { font: 'ANSI Shadow', horizontalLayout: 'fitted' });
  const art2 = figlet.textSync('AGENTS', { font: 'ANSI Shadow', horizontalLayout: 'fitted' });
  console.clear();
  console.log(chalk.cyanBright(art));
  console.log(chalk.cyanBright(art2));
}

function subHeader(t) {
  console.log(chalk.yellow(t.subtitle));
  console.log(chalk.gray(t.installer));
  console.log(chalk.gray('─'.repeat(60)));
  console.log();
}

function loadSkills() {
  const p = path.join(ROOT, 'skills_data.json');
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function getInstalledAgents() {
  const codex = path.join(ROOT, '.codex', 'agents');
  const antg  = path.join(ROOT, '.antigravity', 'rules', 'agents');
  const dirs  = [codex, antg].filter(fs.existsSync);
  const found = new Set();
  dirs.forEach(d => fs.readdirSync(d).forEach(f => found.add(f.replace('.md', ''))));
  return [...found];
}

function installAgent(agentId) {
  const src  = path.join(ROOT, '.codex', 'agents', `${agentId}.md`);
  const dst1 = path.join(process.cwd(), '.codex', 'agents');
  const dst2 = path.join(process.cwd(), '.antigravity', 'rules', 'agents');
  fs.mkdirSync(dst1, { recursive: true });
  fs.mkdirSync(dst2, { recursive: true });
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(dst1, `${agentId}.md`));
    fs.copyFileSync(src, path.join(dst2, `${agentId}.md`));
  }
}

// ── Screens ──────────────────────────────────────────────────────────────────
async function screenAgents(t) {
  const choices = [
    new inquirer.Separator(chalk.cyanBright('── Base Agents')),
    ...BASE_AGENTS.map(a => ({
      name: `${a.icon}  @${a.id.padEnd(22)} ${chalk.gray(a.title)}`,
      value: a.id,
      checked: a.priority,
    })),
    new inquirer.Separator(chalk.cyanBright('── Ruflo Agents')),
    ...RUFLO_AGENTS.map(a => ({
      name: `${a.icon}  @${a.id.padEnd(36)} ${chalk.gray(`[${a.cat}] ${a.title}`)}`,
      value: a.id,
      checked: false,
    })),
  ];

  const { selected } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'selected',
    message: t.agentSel,
    choices,
    pageSize: 20,
  }]);

  if (selected.length === 0) return;

  console.log();
  selected.forEach(id => {
    installAgent(id);
    console.log(chalk.green(`  ✔  @${id}`));
  });
  console.log(chalk.cyanBright(`\n  ${t.done}`));
  console.log(chalk.gray(`  ${t.activate}`) + chalk.cyan(`@${selected[0]} *help`));
  console.log();
  await inquirer.prompt([{ type: 'input', name: '_', message: 'Enter para continuar...' }]);
}

async function screenSkills(t) {
  const skills = loadSkills();
  if (skills.length === 0) {
    console.log(chalk.red(`  ✗  ${t.noSkillsDb}`));
    return;
  }

  const { search } = await inquirer.prompt([{
    type: 'input',
    name: 'search',
    message: t.skillSearch,
  }]);

  const q = search.toLowerCase().trim();
  const filtered = q
    ? skills.filter(s => s.name.includes(q) || (s.desc || '').toLowerCase().includes(q) || s.cat.toLowerCase().includes(q))
    : skills;

  const show = filtered.slice(0, 60);

  const { selected } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'selected',
    message: `${t.skillSel} ${chalk.gray(`(${show.length}/${filtered.length} mostradas)`)}`,
    choices: show.map(s => ({
      name: `@${s.name.padEnd(40)} ${chalk.gray(`[${s.cat}]`)}`,
      value: s.name,
    })),
    pageSize: 20,
  }]);

  if (selected.length === 0) return;

  console.log(chalk.cyanBright('\n  Skills selecionadas:'));
  selected.forEach(s => console.log(chalk.green(`  ✔  @${s}`)));
  console.log(chalk.gray('\n  Copie e use no seu AI chat:'));
  console.log(chalk.cyan(`  Use ${selected.map(s => '@' + s).join(' ')}`));
  console.log();
  await inquirer.prompt([{ type: 'input', name: '_', message: 'Enter para continuar...' }]);
}

async function screenAssisted(t) {
  const projTypes = {
    pt: ['Web App (Next.js / React)', 'API Backend (FastAPI / Node)', 'App Mobile (React Native)', 'Data / ML', 'DevOps / Infra', 'Segurança', 'Produto / SaaS', 'Outro'],
    en: ['Web App (Next.js / React)', 'API Backend (FastAPI / Node)', 'Mobile App (React Native)', 'Data / ML', 'DevOps / Infra', 'Security', 'Product / SaaS', 'Other'],
    es: ['Web App (Next.js / React)', 'API Backend (FastAPI / Node)', 'App Móvil (React Native)', 'Data / ML', 'DevOps / Infra', 'Seguridad', 'Producto / SaaS', 'Otro'],
  };

  const SUGGESTIONS = {
    'Web App (Next.js / React)':    { agents: ['master', 'architect', 'dev', 'qa', 'ux-design-expert'], skills: ['react-patterns', 'nextjs-app-router-patterns', 'tailwind-design-system', 'typescript-expert'] },
    'App Mobile (React Native)':    { agents: ['master', 'architect', 'dev', 'qa'],                     skills: ['agent-spec-mobile-react-native', 'react-native-architecture', 'typescript-expert'] },
    'API Backend (FastAPI / Node)': { agents: ['master', 'architect', 'dev', 'devops', 'qa'],           skills: ['fastapi-pro', 'api-design-principles', 'api-security-best-practices', 'docker-expert'] },
    'Data / ML':                    { agents: ['master', 'data-engineer', 'analyst', 'architect'],       skills: ['ai-ml', 'rag-engineer', 'postgresql-optimization', 'agent-data-ml-model'] },
    'DevOps / Infra':               { agents: ['master', 'devops', 'architect'],                         skills: ['docker-expert', 'kubernetes-architect', 'github-actions-templates', 'terraform-specialist'] },
    'Segurança':                    { agents: ['master', 'qa', 'devops'],                                skills: ['security-auditor', 'api-security-best-practices', 'auth-implementation-patterns', 'secrets-management'] },
    'Produto / SaaS':               { agents: ['master', 'pm', 'po', 'architect', 'dev', 'qa'],          skills: ['react-patterns', 'fastapi-pro', 'stripe-integration', 'auth-implementation-patterns'] },
  };

  const lang = Object.keys(LANG).find(l => LANG[l] === t) || 'pt';
  const types = projTypes[lang] || projTypes.pt;

  const { projType } = await inquirer.prompt([{
    type: 'list',
    name: 'projType',
    message: t.projType,
    choices: types,
  }]);

  const suggestion = SUGGESTIONS[projType] || SUGGESTIONS['API Backend (FastAPI / Node)'];

  console.log(chalk.cyanBright('\n  ── Recomendação do @master\n'));
  console.log(chalk.white('  Agentes:'));
  suggestion.agents.forEach(a => console.log(chalk.green(`    @${a}`)));
  console.log(chalk.white('\n  Skills:'));
  suggestion.skills.forEach(s => console.log(chalk.cyan(`    @${s}`)));

  const prompt = `@master coordenando ${suggestion.agents.slice(1).map(a => '@'+a).join(' ')}\n` +
    `Use ${suggestion.skills.map(s => '@'+s).join(' ')}\n\n` +
    `Contexto: projeto ${projType}. Crie o plano de execução faseado.`;

  console.log(chalk.yellow('\n  ── Prompt pronto para copiar:\n'));
  console.log(chalk.gray('  ' + prompt.replace(/\n/g, '\n  ')));
  console.log();

  const { install } = await inquirer.prompt([{
    type: 'confirm',
    name: 'install',
    message: 'Instalar esses agentes agora?',
    default: true,
  }]);

  if (install) {
    suggestion.agents.forEach(id => { installAgent(id); console.log(chalk.green(`  ✔  @${id}`)); });
    console.log(chalk.cyanBright(`\n  ${t.done}`));
  }

  console.log();
  await inquirer.prompt([{ type: 'input', name: '_', message: 'Enter para continuar...' }]);
}

async function screenStatus(t) {
  const installed = getInstalledAgents();
  const rufloDir = path.join(ROOT, '.agents', 'skills');
  const rufloCount = fs.existsSync(rufloDir) ? fs.readdirSync(rufloDir).length : 0;

  console.log(chalk.cyanBright('\n  ── ' + t.statusTitle + '\n'));
  if (installed.length === 0) {
    console.log(chalk.gray('  ' + t.noAgents));
  } else {
    console.log(chalk.white(`  Base agents: ${chalk.green(installed.length)}`));
    installed.forEach(a => console.log(chalk.gray(`    @${a}`)));
  }
  console.log(chalk.white(`\n  Ruflo agents: ${chalk.green(rufloCount)}`));

  const skills = loadSkills();
  console.log(chalk.white(`  Skills catalog: ${chalk.green(skills.length)}`));
  console.log();
  await inquirer.prompt([{ type: 'input', name: '_', message: 'Enter para continuar...' }]);
}

// ── Main loop ─────────────────────────────────────────────────────────────────
async function main() {
  banner();

  const { langCode } = await inquirer.prompt([{
    type: 'list',
    name: 'langCode',
    message: 'Language / Idioma:',
    choices: [
      { name: 'Português', value: 'pt' },
      { name: 'English',   value: 'en' },
      { name: 'Español',   value: 'es' },
    ],
  }]);

  const t = LANG[langCode];

  while (true) {
    banner();
    subHeader(t);

    const { action } = await inquirer.prompt([{
      type: 'list',
      name: 'action',
      message: t.modePrompt,
      choices: [
        { name: `🤖  ${t.opt_assisted}`, value: 'assisted' },
        { name: `🚀  ${t.opt_project}`,  value: 'project'  },
        { name: `👥  ${t.opt_agents}`,   value: 'agents'   },
        { name: `🛠️   ${t.opt_skills}`,   value: 'skills'   },
        { name: `📊  ${t.opt_status}`,   value: 'status'   },
        { name: `🎮  Pixel Office — visualize os agentes`, value: 'office' },
        new inquirer.Separator(),
        { name: `❌  ${t.opt_exit}`,     value: 'exit'     },
      ],
    }]);

    if (action === 'exit') { console.log(); process.exit(0); }

    banner();
    console.log();

    if (action === 'assisted') await screenAssisted(t);
    if (action === 'project')  await screenAssisted(t);
    if (action === 'agents')   await screenAgents(t);
    if (action === 'skills')   await screenSkills(t);
    if (action === 'status')   await screenStatus(t);
    if (action === 'office') {
      console.log(chalk.cyanBright('\n  🎮 Pixel Office → http://localhost:3001/office.html\n'));
      const { exec } = require('child_process');
      const cmd = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
      exec(`${cmd} http://localhost:3001/office.html`);
      await inquirer.prompt([{ type:'input', name:'_', message:'Enter para continuar...' }]);
    }
  }
}

main().catch(e => { console.error(chalk.red('\n  Error: ' + e.message)); process.exit(1); });
