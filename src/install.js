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
  const projectDir    = process.cwd();
  const baseAgentsSrc = path.join(__dirname, '..', '.codex', 'agents');
  const rufloSrc      = path.join(__dirname, '..', '.agents', 'skills');
  const skillsCatalog = path.join(__dirname, '..', 'skills_data.json');
  const agentsDir     = path.join(projectDir, '.claude', 'agents');
  const skillsDir     = path.join(projectDir, '.claude', 'skills');

  if (!fs.existsSync(baseAgentsSrc)) {
    console.log('  ✗  Arquivos não encontrados.');
    console.log('     Tente: npx --ignore-existing github:matheusj12/skillsagents install');
    return;
  }

  // ── 1. AGENTES BASE (13) ─────────────────────────────────────────
  console.log('\n  Agentes base:\n');
  fs.mkdirSync(agentsDir, { recursive: true });
  let baseCount = 0;
  AGENTS.forEach(id => {
    const src = path.join(baseAgentsSrc, `${id}.md`);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(agentsDir, `${id}.md`));
      console.log(`  ✔  @${id}`);
      baseCount++;
    }
  });

  // ── 2. AGENTES AVANÇADOS (134) ───────────────────────────────────
  let rufloCount = 0;
  if (fs.existsSync(rufloSrc)) {
    console.log('\n  Agentes avançados:\n');
    const rufloAgents = fs.readdirSync(rufloSrc).filter(d =>
      fs.statSync(path.join(rufloSrc, d)).isDirectory()
    );
    rufloAgents.forEach(agentDir => {
      const skillFile = path.join(rufloSrc, agentDir, 'SKILL.md');
      if (fs.existsSync(skillFile)) {
        fs.copyFileSync(skillFile, path.join(agentsDir, `${agentDir}.md`));
        console.log(`  ✔  @${agentDir}`);
        rufloCount++;
      }
    });
  }

  // ── 3. SKILLS (1262 arquivos .md) ────────────────────────────────
  let skillCount = 0;
  if (fs.existsSync(skillsCatalog)) {
    console.log('\n  Skills:\n');
    const skills = JSON.parse(fs.readFileSync(skillsCatalog, 'utf8'));
    fs.mkdirSync(skillsDir, { recursive: true });

    skills.forEach(skill => {
      const content = [
        '---',
        `name: ${skill.name}`,
        `description: ${(skill.desc || '').replace(/\n/g, ' ')}`,
        `categories: ${skill.cat}`,
        '---',
        '',
        `# ${skill.name}`,
        '',
        skill.desc || '',
        '',
        `**Categoria:** ${skill.cat}`,
        '',
        '## Como usar',
        '```',
        `Use @${skill.name}`,
        '```',
      ].join('\n');

      fs.writeFileSync(path.join(skillsDir, `${skill.name}.md`), content);
      skillCount++;
    });

    process.stdout.write(`  ✔  ${skillCount} skills instaladas\n`);
  }

  // ── RESULTADO FINAL ───────────────────────────────────────────────
  const totalAgents = baseCount + rufloCount;
  const name = path.basename(projectDir);

  console.log('\n  ' + '─'.repeat(50));
  console.log(`\n  ✔  ${totalAgents} agentes instalados  (${baseCount} base + ${rufloCount} avançados)`);
  console.log(`  ✔  ${skillCount} skills instaladas\n`);
  console.log(`  ${name}/`);
  console.log(`  └── .claude/`);
  console.log(`      ├── agents/   ← ${totalAgents} agentes`);
  console.log(`      └── skills/   ← ${skillCount} skills`);
  console.log('\n  Para ativar: @master *help  (no IDE com IA)\n');
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
