#!/usr/bin/env node
'use strict';

/**
 * Gera embeddings para todas as skills e salva no Supabase.
 * Uso: node scripts/embed-skills.js
 * Requer: GEMINI_API_KEY e SUPABASE_DB_* no .env
 */

require('dotenv').config();
const { query } = require('../src/db.js');
const skills = require('../skills_data.json');

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('❌ GEMINI_API_KEY não encontrada no .env');
  process.exit(1);
}

const BATCH_SIZE = 3;       // paralelas por vez (conservador para o free tier)
const DELAY_MS   = 2000;    // 2s entre batches (~90 req/min, abaixo do limite de 100)
const MAX_RETRIES = 4;

async function getEmbedding(text, retries = 0) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'models/gemini-embedding-001',
        content: { parts: [{ text }] }
      })
    }
  );

  if (res.status === 429) {
    const err = await res.json();
    // Extrai o tempo de retry da mensagem de erro
    const retryMatch = err.error?.message?.match(/retry in ([\d.]+)s/);
    const waitSec = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) + 2 : 30;

    if (retries >= MAX_RETRIES) throw new Error(`Rate limit após ${MAX_RETRIES} tentativas`);

    process.stdout.write(`  ⏳ Rate limit — aguardando ${waitSec}s...\n`);
    await sleep(waitSec * 1000);
    return getEmbedding(text, retries + 1);
  }

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
  return data.embedding.values;
}

async function upsertSkill(skill, embedding) {
  await query(
    `INSERT INTO skills (name, description, category, embedding)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (name) DO UPDATE SET
       description = EXCLUDED.description,
       category    = EXCLUDED.category,
       embedding   = EXCLUDED.embedding`,
    [skill.name, skill.desc, skill.cat, JSON.stringify(embedding)]
  );
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log(`\n  SkillsAgents — Gerando embeddings para ${skills.length} skills\n`);

  // Verifica quais skills já têm embedding
  const existing = await query('SELECT name FROM skills WHERE embedding IS NOT NULL');
  const done = new Set(existing.rows.map(r => r.name));
  const pending = skills.filter(s => !done.has(s.name));

  console.log(`  ✔ ${done.size} já indexadas — ${pending.length} faltando\n`);

  if (pending.length === 0) {
    console.log('  Todas as skills já estão indexadas!\n');
    process.exit(0);
  }

  let success = 0;
  let errors  = 0;

  for (let i = 0; i < pending.length; i += BATCH_SIZE) {
    const batch = pending.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (skill) => {
        try {
          const text = `${skill.name}: ${skill.desc} [categoria: ${skill.cat}]`;
          const embedding = await getEmbedding(text);
          await upsertSkill(skill, embedding);
          success++;
          process.stdout.write(`  ✔  [${success + errors}/${pending.length}] ${skill.name}\n`);
        } catch (e) {
          errors++;
          process.stdout.write(`  ✗  ${skill.name}: ${e.message}\n`);
        }
      })
    );

    if (i + BATCH_SIZE < pending.length) {
      await sleep(DELAY_MS);
    }
  }

  console.log(`\n  Concluído: ${success} indexadas, ${errors} erros\n`);
  process.exit(errors > 0 ? 1 : 0);
}

main().catch(e => {
  console.error('Erro fatal:', e.message);
  process.exit(1);
});
