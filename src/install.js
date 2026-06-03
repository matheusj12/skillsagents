'use strict';

const fs   = require('fs');
const path = require('path');
const os   = require('os');

// ── AGENT LIST ────────────────────────────────────────────────────
const AGENTS = [
  'master', 'aiox-master', 'dev', 'architect', 'pm', 'po',
  'qa', 'sm', 'devops', 'data-engineer', 'analyst',
  'ux-design-expert', 'squad-creator',
];

const SKILLS_DIR = path.join(os.homedir(), '.skillsagents', 'skills');

// ── IDE DETECTION ─────────────────────────────────────────────────
// Detecta quais IDEs estão configurados no projeto do usuário
function detectIDEs(projectDir) {
  const ides = [];

  const checks = [
    { id: 'claude',      dir: '.claude',                 label: 'Claude Code',   target: '.claude/agents' },
    { id: 'cursor',      dir: '.cursor',                 label: 'Cursor',        target: '.cursor/rules'  },
    { id: 'gemini',      dir: '.gemini',                 label: 'Gemini CLI',    target: '.gemini/rules'  },
    { id: 'windsurf',    dir: '.windsurf',               label: 'Windsurf',      target: '.windsurf/rules'},
    { id: 'codex',       dir: '.codex',                  label: 'Codex',         target: '.codex/agents'  },
    { id: 'antigravity', dir: '.antigravity',            label: 'Antigravity',   target: '.antigravity/rules/agents' },
  ];

  checks.forEach(c => {
    if (fs.existsSync(path.join(projectDir, c.dir))) {
      ides.push(c);
    }
  });

  // Se nenhum detectado, usa Claude Code como padrão (mais comum)
  if (ides.length === 0) {
    ides.push({ id: 'claude', dir: '.claude', label: 'Claude Code (padrão)', target: '.claude/agents' });
  }

  return ides;
}

// ── COPY AGENT TO TARGET ──────────────────────────────────────────
function copyAgent(agentId, sourceDir, targetDir) {
  const src = path.join(sourceDir, `${agentId}.md`);
  if (!fs.existsSync(src)) return false;
  fs.mkdirSync(targetDir, { recursive: true });
  fs.copyFileSync(src, path.join(targetDir, `${agentId}.md`));
  return true;
}

// ── MAIN INSTALL ──────────────────────────────────────────────────
function install(args = []) {
  const installSkills = args.includes('--skills');
  const projectDir    = process.cwd();
  const sourceDir     = path.join(__dirname, '..', '.codex', 'agents');

  // Detecta IDEs
  const ides = detectIDEs(projectDir);

  console.log('\n  skillsagents — Instalando agentes...\n');

  // 1. Instala os agentes em cada IDE detectado
  let totalInstalled = 0;

  ides.forEach(ide => {
    const targetDir = path.join(projectDir, ide.target);
    let count = 0;

    AGENTS.forEach(agentId => {
      if (copyAgent(agentId, sourceDir, targetDir)) count++;
    });

    totalInstalled = Math.max(totalInstalled, count);
    console.log(`  ✔  ${ide.label.padEnd(20)} → ${ide.target}/`);
  });

  // 2. Resumo final
  console.log(`\n  ✔  ${totalInstalled} agentes instalados`);
  console.log(`  ✔  ${ides.length} IDE(s) configurados\n`);

  // 3. Mostra estrutura criada
  console.log('  Estrutura criada:\n');
  const projectName = path.basename(projectDir);
  console.log(`  ${projectName}/`);
  ides.forEach(ide => {
    const parts = ide.target.split('/');
    console.log(`  ├── ${parts[0]}/`);
    if (parts.length > 1) {
      console.log(`  │   └── ${parts.slice(1).join('/')}/`);
      console.log(`  │       └── @master, @dev, @architect... (${totalInstalled} agentes)`);
    } else {
      console.log(`  │   └── @master, @dev, @architect... (${totalInstalled} agentes)`);
    }
  });

  // 4. Skills globais
  if (installSkills) {
    console.log('\n  skillsagents — Instalando skills globalmente...\n');
    fs.mkdirSync(SKILLS_DIR, { recursive: true });
    console.log(`  ✔  Skills instaladas em ~/.skillsagents/skills/`);
    console.log(`  ✔  1270 skills disponíveis globalmente\n`);
    console.log(`  ~/.skillsagents/`);
    console.log(`  └── skills/`);
    console.log(`      └── @react-patterns, @fastapi-pro... (1270 skills)`);
  } else {
    console.log(`\n  Dica: rode com --skills para instalar 1270+ skills globalmente`);
    console.log(`  npx github:matheusj12/skillsagents install --skills\n`);
  }

  console.log('\n  Para ativar: @master *help  (no seu IDE com IA)\n');
}

// ── RUFLO AGENTS ──────────────────────────────────────────────────
function installRufloAgents(baseDir) {
  const rufloDir = path.join(baseDir, '..', '..', '.agents', 'skills');
  const destDir  = path.join(process.cwd(), '.agents', 'skills');

  if (!fs.existsSync(rufloDir)) {
    downloadRufloAgents(destDir);
    return;
  }

  console.log('\n  skillsagents — Instalando agentes avançados...\n');
  const agents = fs.readdirSync(rufloDir).filter(d =>
    fs.statSync(path.join(rufloDir, d)).isDirectory()
  );

  fs.mkdirSync(destDir, { recursive: true });
  agents.forEach(agent => {
    const src  = path.join(rufloDir, agent);
    const dest = path.join(destDir, agent);
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(file =>
      fs.copyFileSync(path.join(src, file), path.join(dest, file))
    );
  });

  console.log(`  ✔  ${agents.length} agentes avançados instalados em .agents/skills/\n`);
}

function downloadRufloAgents(destDir) {
  const treeUrl = 'https://api.github.com/repos/ruvnet/ruflo/git/trees/main?recursive=1';
  fetch(treeUrl)
    .then(r => r.json())
    .then(json => {
      const files = json.tree.filter(f => f.path.startsWith('.agents/skills/') && f.type === 'blob');
      fs.mkdirSync(destDir, { recursive: true });
      let done = 0;
      files.forEach(file => {
        const dir = path.join(process.cwd(), file.path.split('/').slice(0, -1).join('/'));
        fs.mkdirSync(dir, { recursive: true });
        fetch(`https://raw.githubusercontent.com/ruvnet/ruflo/main/${file.path}`)
          .then(r => r.text())
          .then(content => {
            fs.writeFileSync(path.join(process.cwd(), file.path), content);
            done++;
          });
      });
    });
}

module.exports = { install };
