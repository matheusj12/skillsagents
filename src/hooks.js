'use strict';

const fs   = require('fs');
const path = require('path');

const PORT     = parseInt(process.env.SKILLSAGENTS_PORT || '4321');
const HOOK_CMD = `curl -sf -X POST http://localhost:${PORT}/hook -H 'Content-Type: application/json' -d @- || true`;

// Marca para identificar hooks gerenciados por este pacote
const HOOK_MARKER = '__skillsagents__';

function makeHookEntry() {
  return { type: 'command', command: HOOK_CMD, [HOOK_MARKER]: true };
}

// Remove apenas hooks instalados por skillsagents; preserva os demais
function filterOutOurHooks(hookList) {
  if (!Array.isArray(hookList)) return [];
  return hookList.filter(entry => {
    if (entry[HOOK_MARKER]) return false;
    if (Array.isArray(entry.hooks)) {
      entry.hooks = entry.hooks.filter(h => !h[HOOK_MARKER]);
    }
    return true;
  });
}

function installHooks(projectDir = process.cwd()) {
  const chalk = require('chalk');
  const settingsDir  = path.join(projectDir, '.claude');
  const settingsPath = path.join(settingsDir, 'settings.json');

  fs.mkdirSync(settingsDir, { recursive: true });

  let settings = {};
  if (fs.existsSync(settingsPath)) {
    try {
      settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    } catch (e) {
      console.error(chalk.red('  ✗  settings.json inválido, criando do zero.'));
    }
  }

  const hook    = makeHookEntry();
  const matcher = [{ matcher: '.*', hooks: [hook] }];

  const hookEvents = ['PreToolUse', 'PostToolUse', 'Stop', 'SessionStart', 'SessionEnd', 'PermissionRequest'];

  settings.hooks = settings.hooks || {};
  hookEvents.forEach(event => {
    // Remove instâncias anteriores do nosso hook e adiciona a nova no início
    const existing = filterOutOurHooks(settings.hooks[event] || []);
    settings.hooks[event] = [...matcher, ...existing];
  });

  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));

  console.log(chalk.green('\n  ✔  Hooks instalados!\n'));
  console.log(chalk.white('  Arquivo: ') + chalk.cyan(settingsPath));
  console.log();
  console.log(chalk.white('  Próximos passos:'));
  console.log(chalk.gray('  1.') + ' Rode ' + chalk.cyan('npx github:matheusj12/skillsagents office') + chalk.gray(' (inicia o servidor)'));
  console.log(chalk.gray('  2.') + ' Abra uma sessão do Claude Code neste projeto');
  console.log(chalk.gray('  3.') + ' Os agentes aparecem no Pixel Office em tempo real');
  console.log();
  console.log(chalk.gray('  Dica: defina SKILLSAGENTS_AGENT=dev no env para nomear o agente'));
  console.log();
}

function removeHooks(projectDir = process.cwd()) {
  const chalk = require('chalk');
  const settingsPath = path.join(projectDir, '.claude', 'settings.json');
  if (!fs.existsSync(settingsPath)) {
    console.log(chalk.gray('  Nenhum hook encontrado.'));
    return;
  }
  try {
    const s = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    if (s.hooks) {
      Object.keys(s.hooks).forEach(event => {
        s.hooks[event] = filterOutOurHooks(s.hooks[event]);
        if (s.hooks[event].length === 0) delete s.hooks[event];
      });
      if (Object.keys(s.hooks).length === 0) delete s.hooks;
    }
    fs.writeFileSync(settingsPath, JSON.stringify(s, null, 2));
    console.log(chalk.green('  ✔  Hooks removidos.'));
  } catch (e) {
    console.error(chalk.red('  ✗  Erro: ' + e.message));
  }
}

module.exports = { installHooks, removeHooks };
