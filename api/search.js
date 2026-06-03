import { Pool } from 'pg';

const pool = new Pool({
    host: process.env.SUPABASE_DB_HOST,
    port: parseInt(process.env.SUPABASE_DB_PORT || '6543'),
    database: process.env.SUPABASE_DB_NAME || 'postgres',
    user: process.env.SUPABASE_DB_USER,
    password: process.env.SUPABASE_DB_PASSWORD,
    ssl: { rejectUnauthorized: false },
    max: 3,
});

async function getQueryEmbedding(text, apiKey) {
    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'models/gemini-embedding-001',
                content: { parts: [{ text }] }
            })
        }
    );
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || `HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.embedding.values;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { query, category, limit = 12 } = req.body;

    if (!query || typeof query !== 'string' || query.trim().length < 2) {
        return res.status(400).json({ error: 'Query deve ter pelo menos 2 caracteres.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY não configurada.' });
    }

    try {
        const embedding = await getQueryEmbedding(query.trim(), apiKey);
        const embeddingStr = JSON.stringify(embedding);
        const matchCount = Math.min(parseInt(limit) || 12, 50);

        const result = await pool.query(
            'SELECT * FROM search_skills($1::halfvec, $2, $3)',
            [embeddingStr, matchCount, category || null]
        );

        res.status(200).json({
            results: result.rows,
            query,
            total: result.rowCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
