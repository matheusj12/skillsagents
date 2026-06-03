'use strict';

const fs   = require('fs');
const path = require('path');

const PORT     = parseInt(process.env.SKILLSAGENTS_PORT || '4321');
const HOOK_CMD = `curl -sf -X POST http://localhost:${PORT}/hook -H 'Content-Type: application/json' -d @- || true`;

function installHooks(projectDir = process.cwd()) {
  const chalk = require('chalk');
  const settingsDir  = path.join(projectDir, '.claude');
  const settingsPath = path.join(settingsDir, 'settings.json');

  fs.mkdirSync(settingsDir, { recursive: true });

  let settings = {};
  if (fs.existsSync(settingsPath)) {
    try { settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8')); } catch(e) {}
  }

  const hook = { type: 'command', command: HOOK_CMD };
  const matcher = [{ matcher: '.*', hooks: [hook] }];

  settings.hooks = {
    ...(settings.hooks || {}),
    PreToolUse:       matcher,
    PostToolUse:      matcher,
    Stop:             matcher,
    SessionStart:     matcher,
    SessionEnd:       matcher,
    PermissionRequest: matcher,
  };

  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));

  console.log(chalk.green('\n  ✔  Hooks instalados!\n'));
  console.log(chalk.white('  Arquivo: ') + chalk.cyan(settingsPath));
  console.log();
  console.log(chalk.white('  Próximos passos:'));
  console.log(chalk.gray('  1.') + ' Rode ' + chalk.cyan('npx skillsagents office') + chalk.gray(' (inicia o servidor)'));
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
    delete s.hooks;
    fs.writeFileSync(settingsPath, JSON.stringify(s, null, 2));
    console.log(chalk.green('  ✔  Hooks removidos.'));
  } catch(e) {
    console.error(chalk.red('  ✗  Erro: ' + e.message));
  }
}

module.exports = { installHooks, removeHooks };
