'use strict';

const { Pool } = require('pg');

// ── ENV VALIDATION ───────────────────────────────────────────────
const REQUIRED_ENV = ['SUPABASE_DB_HOST', 'SUPABASE_DB_USER', 'SUPABASE_DB_PASSWORD'];

function validateEnv() {
  const missing = REQUIRED_ENV.filter(k => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(`[db] Variáveis de ambiente obrigatórias não definidas: ${missing.join(', ')}`);
  }
}

// ── SSL CONFIG ───────────────────────────────────────────────────
// Em produção exige certificado válido. Em dev/test aceita self-signed.
function sslConfig() {
  if (process.env.DB_SSL === 'false') return false;
  const isProd = process.env.NODE_ENV === 'production';
  return { rejectUnauthorized: isProd };
}

let pool;

function getPool() {
  if (pool) return pool;
  validateEnv();
  pool = new Pool({
    host:     process.env.SUPABASE_DB_HOST,
    port:     parseInt(process.env.SUPABASE_DB_PORT || '6543'),
    database: process.env.SUPABASE_DB_NAME || 'postgres',
    user:     process.env.SUPABASE_DB_USER,
    password: process.env.SUPABASE_DB_PASSWORD,
    ssl:      sslConfig(),
    max:               5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  pool.on('error', (err) => {
    console.error('[db] Pool error (cliente inativo):', err.message);
  });

  return pool;
}

async function query(sql, params) {
  const client = await getPool().connect();
  try {
    return await client.query(sql, params);
  } finally {
    client.release();
  }
}

async function testConnection() {
  const result = await query('SELECT NOW() as time, current_database() as db');
  return result.rows[0];
}

async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

module.exports = { query, testConnection, closePool, getPool };
