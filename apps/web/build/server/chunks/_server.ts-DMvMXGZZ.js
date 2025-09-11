import { p as pool } from './index-D2j6Gy4i.js';
import 'drizzle-orm/node-postgres';
import 'pg';

const GET = async () => {
  try {
    const client = await pool.connect();
    try {
      await client.query("select 1");
    } finally {
      client.release();
    }
    return new Response(JSON.stringify({ status: "ok" }), { headers: { "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ status: "error", message: e.message }), { status: 500, headers: { "content-type": "application/json" } });
  }
};

export { GET };
//# sourceMappingURL=_server.ts-DMvMXGZZ.js.map
