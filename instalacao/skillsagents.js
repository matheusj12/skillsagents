#!/usr/bin/env node
'use strict';

const path   = require('path');
const fs     = require('fs');
const crypto = require('crypto');
const chalk  = require('chalk');
const figlet = require('figlet');

const PKG = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
const VER = PKG.version || '1.0.0';

const SOURCE   = path.join(__dirname, '..', 'maestri-team-setup');
const TARGET   = path.join(process.cwd(), '.skillsagents');
const MANIFEST = path.join(TARGET, '.install-manifest.json');
// Library governance; loading it in every project would waste context.
const EXCLUDE  = new Set(['CLAUDE.md']);

const cmd = process.argv[2];
if (cmd === '--version' || cmd === '-v') { console.log(VER); process.exit(0); }

console.log(chalk.cyanBright(figlet.textSync('SKILLS', { font: 'ANSI Shadow', horizontalLayout: 'fitted' })));
console.log(chalk.cyanBright(figlet.textSync('AGENTS', { font: 'ANSI Shadow', horizontalLayout: 'fitted' })));
console.log();
console.log(chalk.yellow('Universal AI Agent Framework'));
console.log(chalk.gray(`CLI v${VER}  ·  github.com/matheusj12/skillsagents`));
console.log(chalk.gray('─'.repeat(62)));
console.log();

try {
  install();
} catch (error) {
  console.error(chalk.red(`  ✗  Falha na instalação: ${error.message}`));
  process.exit(1);
}

function install() {
  if (!fs.existsSync(SOURCE)) throw new Error(`setup não encontrado no pacote (${SOURCE})`);

  const previous = readManifest();
  const next     = {};
  const preserved = [];

  for (const rel of listFiles(SOURCE)) {
    const src     = path.join(SOURCE, rel);
    const dest    = path.join(TARGET, rel);
    const srcHash = hash(fs.readFileSync(src));

    if (!fs.existsSync(dest)) {
      copy(src, dest);
      next[rel] = srcHash;
      continue;
    }

    const destHash = hash(fs.readFileSync(dest));
    if (destHash === srcHash) {
      next[rel] = srcHash;
    } else if (destHash === previous[rel]) {
      // Untouched since our last install: safe to update.
      copy(src, dest);
      next[rel] = srcHash;
    } else {
      // Modified by the user (or not created by us): keep it.
      if (previous[rel]) next[rel] = previous[rel];
      preserved.push(rel);
    }
  }

  // Git and npm drop empty folders: recreate the skill categories listed in INDEX.md.
  const index = path.join(SOURCE, 'INDEX.md');
  if (fs.existsSync(index)) {
    for (const [, dir] of fs.readFileSync(index, 'utf8').matchAll(/`(skills\/[^`\/]+)\/`/g)) {
      fs.mkdirSync(path.join(TARGET, dir), { recursive: true });
    }
  }

  fs.writeFileSync(MANIFEST, JSON.stringify({ version: VER, files: next }, null, 2) + '\n');

  console.log(chalk.green('  ✔  SkillsAgents instalado em ') + chalk.cyan('.skillsagents/'));
  for (const rel of preserved) console.log(chalk.yellow('  ⚠  ') + `mantido (modificado por você): ${rel}`);
  console.log();
  console.log('  No Maestri, envie ao Ranjel:');
  console.log(chalk.bold('  Leia o .skillsagents/START.md e siga as instruções.'));
  console.log();
}

function listFiles(dir, base = dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel  = path.relative(base, full);
    if (EXCLUDE.has(rel)) continue;
    if (entry.isDirectory()) out.push(...listFiles(full, base));
    else if (entry.isFile()) out.push(rel);
  }
  return out.sort();
}

function readManifest() {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST, 'utf8')).files || {};
  } catch {
    return {};
  }
}

function copy(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function hash(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}
