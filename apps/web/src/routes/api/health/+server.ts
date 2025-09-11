import type { RequestHandler } from '@sveltejs/kit';
import { pool } from '$lib/server/db';

export const GET: RequestHandler = async () => {
  try {
    const client = await pool.connect();
    try {
      await client.query('select 1');
    } finally {
      client.release();
    }
    return new Response(JSON.stringify({ status: 'ok' }), { headers: { 'content-type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ status: 'error', message: e.message }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
};

