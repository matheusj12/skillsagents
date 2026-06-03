'use strict';

const http    = require('http');
const fs      = require('fs');
const path    = require('path');
const os      = require('os');
const { exec } = require('child_process');

const PORT       = parseInt(process.env.SKILLSAGENTS_PORT || '4321');
const STATIC_DIR = path.join(__dirname, '..');

// ── SSE CLIENTS ──────────────────────────────────────────────────
const clients = new Set();

function broadcast(event) {
  const data = `data: ${JSON.stringify(event)}\n\n`;
  clients.forEach(c => { try { c.write(data); } catch(e) { clients.delete(c); } });
}

// ── MIME TYPES ───────────────────────────────────────────────────
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.json': 'application/json',
};

// ── HTTP SERVER ──────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  const u = new URL(req.url, `http://localhost:${PORT}`);
  const p = u.pathname;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(200); return res.end(); }

  // SSE — browser connects here for real-time events
  if (p === '/events') {
    res.writeHead(200, {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection':    'keep-alive',
    });
    res.write(': connected\n\n');
    res.write(`data: ${JSON.stringify({ type: 'connected', clients: clients.size + 1 })}\n\n`);
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

  // Hook endpoint — Claude Code posts here via hooks
  if (p === '/hook' && req.method === 'POST') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      try {
        const event = JSON.parse(body);
        handleHookEvent(event);
      } catch(e) {}
      res.writeHead(200);
      res.end('ok');
    });
    return;
  }

  // Health check
  if (p === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      ok: true,
      port: PORT,
      clients: clients.size,
      agents: Object.fromEntries(sessionAgents),
      uptime: Math.floor(process.uptime()),
    }));
  }

  // Static files
  let filePath = path.join(STATIC_DIR, p === '/' ? 'index.html' : p);
  if (!filePath.startsWith(STATIC_DIR)) { res.writeHead(403); return res.end('Forbidden'); }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

// ── TOOL → STATE MAPPING ─────────────────────────────────────────
const TOOL_STATE = {
  Bash:        'TYPING',
  Read:        'READING',
  Write:       'TYPING',
  Edit:        'TYPING',
  MultiEdit:   'TYPING',
  WebSearch:   'READING',
  WebFetch:    'READING',
  Agent:       'THINKING',
  TodoWrite:   'TYPING',
  TodoRead:    'READING',
  Glob:        'READING',
  Grep:        'READING',
};

// ── SESSION → AGENT MAPPING ───────────────────────────────────────
const sessionAgents  = new Map(); // sessionId → agentId
const agentSessions  = new Map(); // agentId → sessionId
let agentCounter = 0;
const AGENT_QUEUE = [
  'dev', 'architect', 'qa', 'devops', 'pm',
  'analyst', 'data-engineer', 'sm', 'ux-design-expert',
];

function resolveAgent(sessionId, envAgent) {
  if (sessionAgents.has(sessionId)) return sessionAgents.get(sessionId);
  const agentId = envAgent || AGENT_QUEUE[agentCounter % AGENT_QUEUE.length];
  agentCounter++;
  sessionAgents.set(sessionId, agentId);
  agentSessions.set(agentId, sessionId);
  broadcast({ type: 'agent_online', agentId, sessionId });
  return agentId;
}

// ── HOOK EVENT HANDLER ───────────────────────────────────────────
function handleHookEvent(raw) {
  const sessionId = raw.session_id || raw.sessionId || raw.hook_event_name || 'default';
  const envAgent  = raw.env?.SKILLSAGENTS_AGENT;
  const agentId   = resolveAgent(sessionId, envAgent);

  const hookType = raw.hook_event_name || raw.type || '';
  const toolName = raw.tool_name || raw.tool || (raw.tool_input?.name) || '';

  if (hookType === 'PreToolUse' || raw.type === 'tool_start') {
    const state = TOOL_STATE[toolName] || 'TYPING';
    broadcast({ type: 'tool_start', agentId, tool: toolName, state, sessionId });
  }

  if (hookType === 'PostToolUse' || raw.type === 'tool_end') {
    broadcast({ type: 'tool_end', agentId, tool: toolName, state: 'IDLE', sessionId });
  }

  if (hookType === 'Stop' || hookType === 'SessionEnd') {
    broadcast({ type: 'agent_idle', agentId, sessionId });
  }

  if (hookType === 'PermissionRequest') {
    broadcast({ type: 'permission_request', agentId, tool: toolName, sessionId });
  }
}

// ── JSONL WATCHER (fallback for older Claude Code) ────────────────
function watchJSONL() {
  const claudeDir = path.join(os.homedir(), '.claude', 'projects');
  if (!fs.existsSync(claudeDir)) return;

  const offsets = new Map();

  setInterval(() => {
    try {
      fs.readdirSync(claudeDir, { withFileTypes: true })
        .filter(e => e.isDirectory())
        .forEach(entry => {
          const projDir = path.join(claudeDir, entry.name);
          try {
            fs.readdirSync(projDir)
              .filter(f => f.endsWith('.jsonl'))
              .forEach(file => {
                const fp   = path.join(projDir, file);
                const stat = fs.statSync(fp);
                if (Date.now() - stat.mtimeMs > 30000) return;

                const prevOffset = offsets.get(fp) || 0;
                if (stat.size <= prevOffset) return;

                const fd  = fs.openSync(fp, 'r');
                const buf = Buffer.alloc(stat.size - prevOffset);
                fs.readSync(fd, buf, 0, buf.length, prevOffset);
                fs.closeSync(fd);
                offsets.set(fp, stat.size);

                buf.toString('utf8').split('\n').forEach(line => {
                  if (!line.trim()) return;
                  try { parseJSONLLine(JSON.parse(line), entry.name); } catch(e) {}
                });
              });
          } catch(e) {}
        });
    } catch(e) {}
  }, 500);
}

function parseJSONLLine(json, projectId) {
  const sessionId = json.sessionId || json.session_id || projectId;
  const agentId   = resolveAgent(sessionId);

  if (json.type === 'tool_use' && json.name) {
    const state = TOOL_STATE[json.name] || 'TYPING';
    broadcast({ type: 'tool_start', agentId, tool: json.name, state, sessionId });
  }
  if (json.type === 'tool_result') {
    broadcast({ type: 'tool_end', agentId, state: 'IDLE', sessionId });
  }
  if (json.type === 'assistant') {
    broadcast({ type: 'tool_start', agentId, tool: 'thinking', state: 'THINKING', sessionId });
  }
  if (json.subtype === 'turn_duration' || json.subtype === 'stop') {
    broadcast({ type: 'agent_idle', agentId, sessionId });
  }
}

// ── START ────────────────────────────────────────────────────────
function start(options = {}) {
  watchJSONL();

  server.listen(PORT, '127.0.0.1', () => {
    if (!options.quiet) {
      const chalk = require('chalk');
      console.log(chalk.cyanBright('\n  🎮  SkillsAgents Pixel Office\n'));
      console.log(chalk.white('  →  ') + chalk.cyan(`http://localhost:${PORT}/office.html`));
      console.log(chalk.gray('\n  Monitorando agentes em tempo real...'));
      console.log(chalk.gray('  Integre com Claude Code: ') + chalk.yellow('npx skillsagents hooks'));
      console.log(chalk.gray('\n  Ctrl+C para parar.\n'));
    }

    if (!options.noOpen) {
      const cmd = process.platform === 'win32' ? 'start'
                : process.platform === 'darwin' ? 'open'
                : 'xdg-open';
      setTimeout(() => exec(`${cmd} http://localhost:${PORT}/office.html`), 600);
    }
  });

  server.on('error', err => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n  ✗  Porta ${PORT} já está em uso.`);
      console.error(`  Tente: SKILLSAGENTS_PORT=4322 npx skillsagents office\n`);
      process.exit(1);
    }
  });
}

module.exports = { start, broadcast };
if (require.main === module) start();
