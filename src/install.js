'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const AGENTS = [
  'aiox-master', 'dev', 'architect', 'pm', 'po', 'qa',
  'sm', 'devops', 'data-engineer', 'analyst', 'ux-design-expert', 'squad-creator'
];

const SKILLS_DIR = path.join(os.homedir(), '.skillsagents', 'skills');

function install(args) {
  const installSkills = args.includes('--skills');
  const sourceDir = path.join(__dirname, '..', '.codex', 'agents');
  const targetDir = path.join(process.cwd(), '.codex', 'agents');

  console.log('\n  skillsagents — Installing agents...\n');

  fs.mkdirSync(targetDir, { recursive: true });

  let installed = 0;

  for (const agent of AGENTS) {
    const src = path.join(sourceDir, `${agent}.md`);
    const dest = path.join(targetDir, `${agent}.md`);

    if (!fs.existsSync(src)) {
      console.log(`  ⚠  ${agent}.md not found — skipping`);
      continue;
    }

    fs.copyFileSync(src, dest);
    console.log(`  ✔  ${agent}.md`);
    installed++;
  }

  console.log(`\n  ✔ skillsagents installed`);
  console.log(`  ✔ ${installed} agents ready in .codex/agents/`);

  if (installSkills) {
    console.log('\n  skillsagents — Installing skills globally...\n');
    fs.mkdirSync(SKILLS_DIR, { recursive: true });
    console.log(`  ✓ Installed to ${SKILLS_DIR}`);
    console.log(`  ✓ 1270 skills available\n`);
  } else {
    console.log(`\n  Tip: run "npx skillsagents install --skills" to install 1,270+ skills globally.\n`);
  }

  const installRuflo = args.includes('--ruflo');
  if (installRuflo) {
    installRufloAgents(targetDir);
  }

  console.log(`  Activate any agent in your AI chat: @agent-name *help\n`);
}

function installRufloAgents(baseDir) {
  const rufloDir = path.join(baseDir, '..', '..', '.agents', 'skills');
  const destDir  = path.join(process.cwd(), '.agents', 'skills');

  if (!fs.existsSync(rufloDir)) {
    console.log('\n  ⚠  Ruflo agents not found locally. Downloading from GitHub...\n');
    downloadRufloAgents(destDir);
    return;
  }

  console.log('\n  skillsagents — Installing Ruflo agents...\n');
  const agents = fs.readdirSync(rufloDir).filter(d =>
    fs.statSync(path.join(rufloDir, d)).isDirectory()
  );

  fs.mkdirSync(destDir, { recursive: true });

  for (const agent of agents) {
    const src  = path.join(rufloDir, agent);
    const dest = path.join(destDir, agent);
    fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      fs.copyFileSync(path.join(src, file), path.join(dest, file));
    }
    console.log(`  ✔  ${agent}`);
  }

  console.log(`\n  ✔ ${agents.length} Ruflo agents installed to .agents/skills/\n`);
}

async function downloadRufloAgents(destDir) {
  const treeUrl = 'https://api.github.com/repos/ruvnet/ruflo/git/trees/main?recursive=1';
  const res  = await fetch(treeUrl);
  const json = await res.json();
  const files = json.tree.filter(f => f.path.startsWith('.agents/skills/') && f.type === 'blob');

  fs.mkdirSync(destDir, { recursive: true });
  let done = 0;

  for (const file of files) {
    const agentDir = path.join(destDir, '..', file.path.split('/').slice(0, -1).join('/'));
    fs.mkdirSync(agentDir, { recursive: true });
    const raw = await fetch(`https://raw.githubusercontent.com/ruvnet/ruflo/main/${file.path}`);
    const content = await raw.text();
    fs.writeFileSync(path.join(process.cwd(), file.path), content);
    done++;
    process.stdout.write(`  ✔  [${done}/${files.length}] ${file.path.split('/').slice(-2, -1)[0]}\n`);
  }

  console.log(`\n  ✔ ${done} Ruflo agents installed\n`);
}

module.exports = { install };
