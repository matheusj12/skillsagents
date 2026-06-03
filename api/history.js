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

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const type = req.query.type || null;
    const limit = Math.min(parseInt(req.query.limit || '20'), 100);

    try {
        const sql = type
            ? 'SELECT id, type, input, LEFT(output, 300) as output_preview, created_at FROM generations WHERE type = $1 ORDER BY created_at DESC LIMIT $2'
            : 'SELECT id, type, input, LEFT(output, 300) as output_preview, created_at FROM generations ORDER BY created_at DESC LIMIT $1';

        const params = type ? [type, limit] : [limit];
        const result = await pool.query(sql, params);

        res.status(200).json({ generations: result.rows, total: result.rowCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
