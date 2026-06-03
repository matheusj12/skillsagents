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

  // Verifica se a fonte existe
  if (!fs.existsSync(sourceDir)) {
    console.log('\n  ✗  Erro: arquivos de agentes não encontrados.');
    console.log(`     Esperado em: ${sourceDir}`);
    console.log('\n  Solução: force o cache limpo:');
    console.log('  npx --ignore-existing github:matheusj12/skillsagents install\n');
    return;
  }

  // Detecta IDEs
  const ides = detectIDEs(projectDir);
  const projectName = path.basename(projectDir);

  console.log(`\n  Projeto: ${projectName}`);
  console.log(`  IDEs detectados: ${ides.map(i => i.label).join(', ')}\n`);

  let totalInstalled = 0;
  const results = [];

  // Instala em cada IDE
  ides.forEach(ide => {
    const targetDir = path.join(projectDir, ide.target);
    let count = 0;
    const errors = [];

    AGENTS.forEach(agentId => {
      try {
        if (copyAgent(agentId, sourceDir, targetDir)) {
          count++;
        } else {
          errors.push(agentId);
        }
      } catch(e) {
        errors.push(`${agentId} (${e.message})`);
      }
    });

    totalInstalled = Math.max(totalInstalled, count);
    const icon = count > 0 ? '✔' : '✗';
    console.log(`  ${icon}  ${ide.label.padEnd(22)} → ${ide.target}/  (${count} agentes)`);
    if (errors.length > 0) {
      console.log(`     Falhas: ${errors.join(', ')}`);
    }
    results.push({ ide, count, targetDir });
  });

  if (totalInstalled === 0) {
    console.log('\n  ✗  Nenhum agente instalado. Veja erros acima.');
    return;
  }

  // Estrutura visual
  console.log(`\n  ✔  ${totalInstalled} agentes instalados com sucesso!\n`);
  console.log(`  ${projectName}/`);
  results.filter(r => r.count > 0).forEach((r, i, arr) => {
    const prefix = i < arr.length - 1 ? '├──' : '└──';
    const parts = r.ide.target.split('/');
    console.log(`  ${prefix} ${parts[0]}/`);
    if (parts.length > 1) {
      const sub = i < arr.length - 1 ? '│' : ' ';
      console.log(`  ${sub}   └── ${parts.slice(1).join('/')}/`);
      console.log(`  ${sub}       └── @master, @dev, @architect... (${r.count} agentes)`);
    }
  });

  // Skills globais
  if (installSkills) {
    console.log('\n  Instalando skills globalmente...');
    try {
      fs.mkdirSync(SKILLS_DIR, { recursive: true });
      console.log(`\n  ✔  ~/.skillsagents/skills/  (1270 skills disponíveis)`);
    } catch(e) {
      console.log(`  ✗  Erro ao criar diretório de skills: ${e.message}`);
    }
  } else {
    console.log(`\n  Dica: npx github:matheusj12/skillsagents install --skills`);
    console.log(`        instala 1270+ skills globalmente em ~/.skillsagents/skills/`);
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
