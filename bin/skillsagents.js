#!/usr/bin/env node
'use strict';

const path   = require('path');
const fs     = require('fs');
const chalk  = require('chalk');
const figlet = require('figlet');

const PKG = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
const VER = PKG.version || '1.0.0';

const cmd = process.argv[2];
if (cmd === '--version' || cmd === '-v') { console.log(VER); process.exit(0); }

console.clear();
console.log(chalk.cyanBright(figlet.textSync('SKILLS', { font: 'ANSI Shadow', horizontalLayout: 'fitted' })));
console.log(chalk.cyanBright(figlet.textSync('AGENTS', { font: 'ANSI Shadow', horizontalLayout: 'fitted' })));
console.log();
console.log(chalk.yellow('Universal AI Agent Framework'));
console.log(chalk.gray(`CLI v${VER}  ·  github.com/matheusj12/skillsagents`));
console.log(chalk.gray('─'.repeat(62)));
console.log();
