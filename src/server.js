'use strict';

const http = require('http');
const fs   = require('fs');
const path = require('path');
const os   = require('os');
const { exec } = require('child_process');

const PORT       = parseInt(process.env.SKILLSAGENTS_PORT || '4321');
const STATIC_DIR = path.resolve(__dirname, '..');
const BODY_LIMIT = 64 * 1024; // 64 KB máximo por request

// ── CORS ─────────────────────────────────────────────────────────
// Permite apenas localhost em desenvolvimento; em produção restringe ao origin configurado.
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : [`http://localhost:${PORT}`, 'http://127.0.0.1:' + PORT];

function setCORSHeaders(req, res) {
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin) || process.env.NODE_ENV !== 'production') {
    res.setHeader('Access-Control-Allow-Origin', origin || `http://localhost:${PORT}`);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');
}

// ── SSE CLIENTS ──────────────────────────────────────────────────
const clients = new Set();

function broadcast(event) {
  const data = `data: ${JSON.stringify(event)}\n\n`;
  for (const c of clients) {
    try { c.write(data); } catch (_) { clients.delete(c); }
  }
}

// ── MIME TYPES ───────────────────────────────────────────────────
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.json': 'application/json',
};

// ── READ BODY (com limite) ───────────────────────────────────────
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    let size = 0;
    req.on('data', chunk => {
      size += chunk.length;
      if (size > BODY_LIMIT) {
        req.destroy();
        return reject(new Error('Payload muito grande'));
      }
      body += chunk;
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

// ── HTTP SERVER ──────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, `http://localhost:${PORT}`);
  const p = u.pathname;

  setCORSHeaders(req, res);
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

  // SSE — browser conecta aqui para eventos em tempo real
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

  // Hook endpoint — Claude Code posta aqui via hooks
  if (p === '/hook' && req.method === 'POST') {
    try {
      const raw = await readBody(req);
      const event = JSON.parse(raw);
      handleHookEvent(event);
    } catch (e) {
      // Body inválido ou muito grande — ainda retorna 200 para não bloquear Claude Code
      console.error('[hook] Erro ao processar payload:', e.message);
    }
    res.writeHead(200);
    return res.end('ok');
  }

  // Health check
  if (p === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      ok:      true,
      port:    PORT,
      clients: clients.size,
      agents:  Object.fromEntries(sessionAgents),
      uptime:  Math.floor(process.uptime()),
      env:     process.env.NODE_ENV || 'development',
    }));
  }

  // Static files — protege contra path traversal
  const filePath = path.join(STATIC_DIR, p === '/' ? 'index.html' : p);
  if (!filePath.startsWith(STATIC_DIR + path.sep) && filePath !== path.join(STATIC_DIR, 'index.html')) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

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
  Bash:      'TYPING',
  Read:      'READING',
  Write:     'TYPING',
  Edit:      'TYPING',
  MultiEdit: 'TYPING',
  WebSearch: 'READING',
  WebFetch:  'READING',
  Agent:     'THINKING',
  TodoWrite: 'TYPING',
  TodoRead:  'READING',
  Glob:      'READING',
  Grep:      'READING',
};

// ── SESSION → AGENT MAPPING ───────────────────────────────────────
const sessionAgents = new Map();
const agentSessions = new Map();
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
  const toolName = raw.tool_name || raw.tool || raw.tool_input?.name || '';

  if (hookType === 'PreToolUse' || raw.type === 'tool_start') {
    broadcast({ type: 'tool_start', agentId, tool: toolName, state: TOOL_STATE[toolName] || 'TYPING', sessionId });
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

// ── JSONL WATCHER (fallback para Claude Code mais antigo) ─────────
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
                  try { parseJSONLLine(JSON.parse(line), entry.name); } catch (_) {}
                });
              });
          } catch (_) {}
        });
    } catch (_) {}
  }, 500);
}

function parseJSONLLine(json, projectId) {
  const sessionId = json.sessionId || json.session_id || projectId;
  const agentId   = resolveAgent(sessionId);

  if (json.type === 'tool_use' && json.name) {
    broadcast({ type: 'tool_start', agentId, tool: json.name, state: TOOL_STATE[json.name] || 'TYPING', sessionId });
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

// ── GRACEFUL SHUTDOWN ────────────────────────────────────────────
function shutdown(signal) {
  console.log(`\n[server] ${signal} recebido — encerrando...`);
  server.close(() => {
    console.log('[server] Encerrado.');
    process.exit(0);
  });
  // Força encerramento se demorar mais de 5s
  setTimeout(() => process.exit(1), 5000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

// ── START ────────────────────────────────────────────────────────
function start(options = {}) {
  if (server.listening) return;
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
    } else {
      console.error('[server] Erro:', err.message);
    }
  });
}

module.exports = { start, broadcast };
if (require.main === module) start();
